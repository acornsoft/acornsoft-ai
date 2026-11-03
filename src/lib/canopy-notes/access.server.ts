import { getSql } from "@/lib/db";
import { isNoteKind, type CanopyNote, type NoteKind } from "./types";

/**
 * Visibility lives only here. The predicate is `isNoteVisible` in ./visibility.ts.
 * The SQL below is that predicate. Tests fail if the two disagree.
 *
 * A note is visible when it is on the public allowlist, or when it is assigned
 * to the signed-in account and that account is not revoked.
 * Product and foundation notes are the exception: they stay hidden until they
 * are allowlisted, even if an assignment row exists. That follows the gated
 * note (internal product and foundation notes do not show unless allowlisted).
 * Engagement notes are never allowlisted; assignment is their only path.
 * There is no cache. Each call reads the database.
 */

type NoteRow = {
  note_id: string;
  kind: string;
  title: string;
  body_md: string;
  created_at: Date | string;
  updated_at: Date | string;
  on_allowlist: boolean | string | number;
};

function asIso(value: Date | string): string {
  if (value instanceof Date) return value.toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toISOString();
}

function asBool(value: boolean | string | number): boolean {
  return value === true || value === "t" || value === "true" || value === 1;
}

function toNote(row: NoteRow): CanopyNote {
  if (!isNoteKind(row.kind)) {
    throw new Error("Stored note kind is invalid");
  }
  const kind: NoteKind = row.kind;
  return {
    noteId: row.note_id,
    kind,
    title: row.title,
    bodyMd: row.body_md,
    createdAt: asIso(row.created_at),
    updatedAt: asIso(row.updated_at),
    onAllowlist: asBool(row.on_allowlist),
  };
}

async function selectVisible(
  userId: string | null,
  noteId: string | null,
): Promise<CanopyNote[]> {
  const sql = await getSql();
  const account = userId && userId.trim() ? userId.trim() : null;
  const rows = await sql<NoteRow>`
    select
      n.note_id,
      n.kind,
      n.title,
      n.body_md,
      n.created_at,
      n.updated_at,
      exists (
        select 1 from canopy_public_allowlist a where a.note_id = n.note_id
      ) as on_allowlist
    from canopy_notes n
    where (
      exists (
        select 1 from canopy_public_allowlist a where a.note_id = n.note_id
      )
      or (
        ${account}::text is not null
        and not exists (
          select 1
          from canopy_account_status s
          where s.user_id = ${account}::text
            and s.revoked_at is not null
        )
        and exists (
          select 1
          from canopy_assignments g
          where g.note_id = n.note_id
            and g.user_id = ${account}::text
        )
        and n.kind not in ('product', 'foundation')
      )
    )
    and (${noteId}::text is null or n.note_id = ${noteId}::text)
    order by n.updated_at desc, n.note_id asc
  `;
  return rows.map(toNote);
}

/** Allowlist, plus assignments for this account when it is not revoked. */
export async function listVisibleNotes(userId: string | null): Promise<CanopyNote[]> {
  return selectVisible(userId, null);
}

/** Same predicate as the list. Null when the caller is not entitled. */
export async function getVisibleNote(
  userId: string | null,
  noteId: string,
): Promise<CanopyNote | null> {
  const rows = await selectVisible(userId, noteId);
  return rows[0] ?? null;
}

export const NOT_FOUND_RESPONSE = {
  status: 404 as const,
  body: "Not found" as const,
};

/**
 * Route contract: a missing note and a note the caller cannot see are the
 * same response. Callers throw the router not-found error when status is 404.
 */
export async function loadNoteForRoute(
  userId: string | null,
  noteId: string,
): Promise<typeof NOT_FOUND_RESPONSE | { status: 200; note: CanopyNote }> {
  const note = await getVisibleNote(userId, noteId);
  if (!note) return NOT_FOUND_RESPONSE;
  return { status: 200, note };
}
