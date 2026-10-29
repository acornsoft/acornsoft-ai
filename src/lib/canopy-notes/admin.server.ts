import { randomUUID } from "node:crypto";
import { getSql } from "@/lib/db";
import { assertCleanNoteText, NoteTextError } from "./text";
import { isNoteKind, type AuditAction, type AuditRow, type NoteKind } from "./types";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class CanopyForbiddenError extends Error {
  readonly status = 403;
  constructor() {
    super("Forbidden");
    this.name = "CanopyForbiddenError";
  }
}

export class EngagementAllowlistError extends Error {
  constructor() {
    super("Engagement notes cannot be added to the public allowlist");
    this.name = "EngagementAllowlistError";
  }
}

/** Comma-separated Better Auth user ids. Empty or unset means nobody. */
export function isCanopyAdmin(userId: string): boolean {
  const raw = process.env.CANOPY_ADMIN_USER_IDS ?? "";
  const ids = raw
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
  if (ids.length === 0) return false;
  return ids.includes(userId);
}

function assertAdmin(userId: string): void {
  if (!isCanopyAdmin(userId)) throw new CanopyForbiddenError();
}

export type UpsertNoteInput = {
  noteId?: string;
  kind: NoteKind;
  title: string;
  bodyMd: string;
};

function requireUuid(noteId: string): string {
  const id = noteId.trim().toLowerCase();
  if (!UUID_RE.test(id)) throw new Error("Invalid note id");
  return id;
}

function requireAccount(userId: string): string {
  const id = userId.trim();
  if (!id || id.length > 200) throw new Error("Invalid account");
  return id;
}

export async function upsertNote(
  actorUserId: string,
  input: UpsertNoteInput,
): Promise<{ noteId: string }> {
  assertAdmin(actorUserId);
  if (!isNoteKind(input.kind)) throw new Error("Invalid kind");
  const title = input.title.trim();
  const bodyMd = input.bodyMd;
  if (!title || title.length > 200) throw new Error("Invalid title");
  if (bodyMd.trim().length === 0 || bodyMd.length > 20000) throw new Error("Invalid body");
  assertCleanNoteText(title, bodyMd);
  const noteId = input.noteId ? requireUuid(input.noteId) : randomUUID();
  const sql = await getSql();
  if (input.kind === "engagement") {
    const listed = await sql<{ note_id: string }>`
      select note_id from canopy_public_allowlist where note_id = ${noteId}
    `;
    if (listed.length > 0) throw new EngagementAllowlistError();
  }
  await sql`
    with up as (
      insert into canopy_notes (note_id, kind, title, body_md, created_at, updated_at)
      values (${noteId}, ${input.kind}, ${title}, ${bodyMd}, now(), now())
      on conflict (note_id) do update set
        kind = excluded.kind,
        title = excluded.title,
        body_md = excluded.body_md,
        updated_at = now()
      returning note_id
    )
    insert into canopy_audit (actor_user_id, action, note_id, target_user_id)
    select ${actorUserId}, 'note_upsert', note_id, null from up
  `;
  return { noteId };
}

export async function assign(
  actorUserId: string,
  noteId: string,
  targetUserId: string,
): Promise<void> {
  assertAdmin(actorUserId);
  const note = requireUuid(noteId);
  const target = requireAccount(targetUserId);
  const sql = await getSql();
  await sql`
    with up as (
      insert into canopy_assignments (note_id, user_id, assigned_at, assigned_by)
      values (${note}, ${target}, now(), ${actorUserId})
      on conflict (note_id, user_id) do update
        set assigned_by = excluded.assigned_by
      returning note_id, user_id
    )
    insert into canopy_audit (actor_user_id, action, note_id, target_user_id)
    select ${actorUserId}, 'assign', note_id, user_id from up
  `;
}

export async function unassign(
  actorUserId: string,
  noteId: string,
  targetUserId: string,
): Promise<void> {
  assertAdmin(actorUserId);
  const note = requireUuid(noteId);
  const target = requireAccount(targetUserId);
  const sql = await getSql();
  await sql`
    with del as (
      delete from canopy_assignments
      where note_id = ${note} and user_id = ${target}
      returning note_id, user_id
    )
    insert into canopy_audit (actor_user_id, action, note_id, target_user_id)
    select ${actorUserId}, 'unassign', note_id, user_id from del
  `;
}

export async function allowlistAdd(actorUserId: string, noteId: string): Promise<void> {
  assertAdmin(actorUserId);
  const note = requireUuid(noteId);
  const sql = await getSql();
  const inserted = await sql<{ note_id: string }>`
    with note as (
      select note_id
      from canopy_notes
      where note_id = ${note}
        and kind <> 'engagement'
    ),
    ins as (
      insert into canopy_public_allowlist (note_id, added_at, added_by)
      select note_id, now(), ${actorUserId}
      from note
      on conflict (note_id) do update
        set added_by = excluded.added_by
      returning note_id
    )
    insert into canopy_audit (actor_user_id, action, note_id, target_user_id)
    select ${actorUserId}, 'allowlist_add', note_id, null from ins
    returning note_id
  `;
  if (inserted.length === 1) return;
  const found = await sql<{ kind: string }>`
    select kind from canopy_notes where note_id = ${note}
  `;
  if (found[0]?.kind === "engagement") throw new EngagementAllowlistError();
  throw new Error("Not found");
}

export async function allowlistRemove(actorUserId: string, noteId: string): Promise<void> {
  assertAdmin(actorUserId);
  const note = requireUuid(noteId);
  const sql = await getSql();
  await sql`
    with del as (
      delete from canopy_public_allowlist
      where note_id = ${note}
      returning note_id
    )
    insert into canopy_audit (actor_user_id, action, note_id, target_user_id)
    select ${actorUserId}, 'allowlist_remove', note_id, null from del
  `;
}

export async function revoke(actorUserId: string, targetUserId: string): Promise<void> {
  assertAdmin(actorUserId);
  const target = requireAccount(targetUserId);
  const sql = await getSql();
  await sql`
    with up as (
      insert into canopy_account_status (user_id, revoked_at)
      values (${target}, now())
      on conflict (user_id) do update set revoked_at = now()
      returning user_id
    )
    insert into canopy_audit (actor_user_id, action, note_id, target_user_id)
    select ${actorUserId}, 'revoke', null, user_id from up
  `;
}

export async function restore(actorUserId: string, targetUserId: string): Promise<void> {
  assertAdmin(actorUserId);
  const target = requireAccount(targetUserId);
  const sql = await getSql();
  await sql`
    with up as (
      insert into canopy_account_status (user_id, revoked_at)
      values (${target}, null)
      on conflict (user_id) do update set revoked_at = null
      returning user_id
    )
    insert into canopy_audit (actor_user_id, action, note_id, target_user_id)
    select ${actorUserId}, 'restore', null, user_id from up
  `;
}

type AuditSqlRow = {
  id: number | string;
  at: Date | string;
  actor_user_id: string;
  action: string;
  note_id: string | null;
  target_user_id: string | null;
};

function asIso(value: Date | string): string {
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
}

export async function listAudit(actorUserId: string): Promise<AuditRow[]> {
  assertAdmin(actorUserId);
  const sql = await getSql();
  const rows = await sql<AuditSqlRow>`
    select id, at, actor_user_id, action, note_id, target_user_id
    from canopy_audit
    order by id desc
    limit 200
  `;
  return rows.map((row) => ({
    id: Number(row.id),
    at: asIso(row.at),
    actorUserId: row.actor_user_id,
    action: row.action as AuditAction,
    noteId: row.note_id,
    targetUserId: row.target_user_id,
  }));
}

export { NoteTextError };
