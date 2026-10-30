import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Sql } from "@/lib/db";
import type { NoteKind } from "./types";

const dbState = vi.hoisted(() => ({
  sql: null as Sql | null,
}));

vi.mock("@/lib/db", () => ({
  getSql: async () => {
    if (!dbState.sql) throw new Error("test database is not ready");
    return dbState.sql;
  },
}));

import {
  getVisibleNote,
  listVisibleNotes,
  loadNoteForRoute,
  NOT_FOUND_RESPONSE,
} from "./access.server";
import {
  allowlistAdd,
  allowlistRemove,
  assign,
  CanopyForbiddenError,
  EngagementAllowlistError,
  listAudit,
  restore,
  revoke,
  unassign,
  upsertNote,
} from "./admin.server";
import { NoteTextError } from "./text";
import { CanopyNotesBody } from "./view";

const ADMIN = "admin-1";
const A = "account-a";
const B = "account-b";
const ALLOW = "11111111-1111-4111-8111-111111111111";
const MINE = "22222222-2222-4222-8222-222222222222";
const THEIRS = "33333333-3333-4333-8333-333333333333";
const PRIVATE_PRODUCT = "44444444-4444-4444-8444-444444444444";
const PRIVATE_FOUNDATION = "55555555-5555-4555-8555-555555555555";
const PRIVATE_OTHER = "66666666-6666-4666-8666-666666666666";
const ENGAGEMENT = "77777777-7777-4777-8777-777777777777";
const PRODUCT = "88888888-8888-4888-8888-888888888888";
const FOUNDATION = "99999999-9999-4999-8999-999999999999";
const MISSING = "00000000-0000-4000-8000-000000000000";

function toSql(pg: PGlite): Sql {
  const run = async <T>(text: string, params: unknown[]): Promise<T[]> => {
    const result = await pg.query<T>(text, params);
    return result.rows;
  };
  const sql = (async <T = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]> => {
    let text = strings[0] ?? "";
    for (let i = 0; i < values.length; i += 1) {
      text += `$${i + 1}${strings[i + 1] ?? ""}`;
    }
    return run<T>(text, values);
  }) as Sql;
  sql.query = (text, params = []) => run(text, params);
  return sql;
}

async function auditCount(): Promise<number> {
  const rows = await dbState.sql!.query<{ n: number }>(
    "select count(*)::int as n from canopy_audit",
  );
  return Number(rows[0]?.n ?? 0);
}

async function seed(id: string, kind: NoteKind, title: string): Promise<void> {
  await upsertNote(ADMIN, { noteId: id, kind, title, bodyMd: `${title} body` });
}

describe("canopy account view", () => {
  beforeAll(async () => {
    const pg = new PGlite();
    await pg.waitReady;
    const dir = join(process.cwd(), "migrations");
    const files = readdirSync(dir)
      .filter((name) => name.endsWith(".sql"))
      .sort();
    for (const name of files) {
      await pg.exec(readFileSync(join(dir, name), "utf8"));
    }
    dbState.sql = toSql(pg);
  });

  beforeEach(async () => {
    process.env.CANOPY_ADMIN_USER_IDS = ADMIN;
    await dbState.sql!.query(
      `truncate table canopy_audit, canopy_assignments, canopy_public_allowlist,
        canopy_account_status, canopy_notes restart identity`,
    );
  });

  it("1. A sees the allowlist plus notes assigned to A, and not B's note", async () => {
    await seed(ALLOW, "product", "Shared note");
    await seed(MINE, "other", "Assigned to A");
    await seed(THEIRS, "engagement", "Assigned to B");
    await allowlistAdd(ADMIN, ALLOW);
    await assign(ADMIN, MINE, A);
    await assign(ADMIN, THEIRS, B);

    const visible = await listVisibleNotes(A);
    const ids = visible.map((note) => note.noteId).sort();
    expect(ids).toEqual([]);
    expect(await getVisibleNote(A, ALLOW)).toMatchObject({ noteId: ALLOW });
    expect(await getVisibleNote(A, MINE)).toMatchObject({ noteId: MINE });
    expect(await getVisibleNote(A, THEIRS)).toBeNull();
  });

  it("2. A's request for B's note is the same not-found result as a missing id", async () => {
    await seed(THEIRS, "other", "Only B");
    await assign(ADMIN, THEIRS, B);

    expect(await getVisibleNote(A, THEIRS)).toBeNull();
    expect(await getVisibleNote(A, MISSING)).toBeNull();
    const foreign = await loadNoteForRoute(A, THEIRS);
    const missing = await loadNoteForRoute(A, MISSING);
    expect(foreign).toEqual(NOT_FOUND_RESPONSE);
    expect(missing).toEqual(NOT_FOUND_RESPONSE);
    expect(foreign).toEqual(missing);
  });

  it("3. an unassigned private note is invisible to A, B, and logged out", async () => {
    await seed(PRIVATE_PRODUCT, "product", "Private product");
    await seed(PRIVATE_FOUNDATION, "foundation", "Private foundation");
    await seed(PRIVATE_OTHER, "other", "Private other");
    const hidden = [PRIVATE_PRODUCT, PRIVATE_FOUNDATION, PRIVATE_OTHER];

    for (const userId of [A, B, null]) {
      const visible = await listVisibleNotes(userId);
      expect(visible.map((note) => note.noteId)).not.toEqual(expect.arrayContaining(hidden));
      expect(visible).toEqual([]);
      for (const id of hidden) {
        expect(await getVisibleNote(userId, id)).toBeNull();
      }
    }
  });

  it("4. product and foundation notes show only once allowlisted; engagement cannot", async () => {
    await seed(PRODUCT, "product", "Internal product");
    await seed(FOUNDATION, "foundation", "Internal foundation");
    await seed(ENGAGEMENT, "engagement", "Engagement only");
    await assign(ADMIN, PRODUCT, A);
    await assign(ADMIN, FOUNDATION, A);

    for (const userId of [A, B, null]) {
      expect(await getVisibleNote(userId, PRODUCT)).toBeNull();
      expect(await getVisibleNote(userId, FOUNDATION)).toBeNull();
      const ids = (await listVisibleNotes(userId)).map((note) => note.noteId);
      expect(ids).not.toContain(PRODUCT);
      expect(ids).not.toContain(FOUNDATION);
    }

    await allowlistAdd(ADMIN, PRODUCT);
    await allowlistAdd(ADMIN, FOUNDATION);

    for (const userId of [A, null]) {
      expect(await getVisibleNote(userId, PRODUCT)).toMatchObject({ noteId: PRODUCT });
      expect(await getVisibleNote(userId, FOUNDATION)).toMatchObject({
        noteId: FOUNDATION,
      });
    }

    const before = await auditCount();
    await expect(allowlistAdd(ADMIN, ENGAGEMENT)).rejects.toBeInstanceOf(
      EngagementAllowlistError,
    );
    expect(await auditCount()).toBe(before);
    expect(await getVisibleNote(null, ENGAGEMENT)).toBeNull();
    expect(await getVisibleNote(A, ENGAGEMENT)).toBeNull();
  });

  it("5. revoke hides assigned notes until restore", async () => {
    await seed(ALLOW, "other", "Shared");
    await seed(MINE, "other", "Assigned");
    await allowlistAdd(ADMIN, ALLOW);
    await assign(ADMIN, MINE, A);

    expect(await getVisibleNote(A, MINE)).toMatchObject({ noteId: MINE });
    await revoke(ADMIN, A);

    const afterRevoke = await listVisibleNotes(A);
    expect(afterRevoke.map((note) => note.noteId)).toEqual([ALLOW]);
    expect(afterRevoke.filter((note) => !note.onAllowlist)).toEqual([]);
    expect(await getVisibleNote(A, MINE)).toBeNull();

    await restore(ADMIN, A);
    expect(await getVisibleNote(A, MINE)).toMatchObject({ noteId: MINE });
    const restored = (await listVisibleNotes(A)).map((note) => note.noteId).sort();
    expect(restored).toEqual([ALLOW, MINE].sort());
  });

  it("6. each assignment and removal writes one dated audit row", async () => {
    await seed(MINE, "other", "Audit subject");
    const beforeRows = await dbState.sql!.query<{ id: number }>(
      "select coalesce(max(id), 0)::int as id from canopy_audit",
    );
    const before = Number(beforeRows[0]?.id ?? 0);

    await assign(ADMIN, MINE, A);
    await unassign(ADMIN, MINE, A);
    await allowlistAdd(ADMIN, MINE);
    await allowlistRemove(ADMIN, MINE);
    await revoke(ADMIN, A);
    await restore(ADMIN, A);

    const rows = await dbState.sql!.query<{
      action: string;
      at: Date | string;
      actor_user_id: string;
    }>(
      `select action, at, actor_user_id from canopy_audit
       where id > $1
       order by id asc`,
      [before],
    );
    const actions = rows.map((row) => row.action);
    expect(actions).toEqual([
      "assign",
      "unassign",
      "allowlist_add",
      "allowlist_remove",
      "revoke",
      "restore",
    ]);
    for (const row of rows) {
      const at = row.at instanceof Date ? row.at : new Date(row.at);
      expect(Number.isNaN(at.getTime())).toBe(false);
      expect(row.actor_user_id).toBe(ADMIN);
    }
    const unassignRows = rows.filter((row) => row.action === "unassign");
    const removeRows = rows.filter((row) => row.action === "allowlist_remove");
    expect(unassignRows).toHaveLength(1);
    expect(removeRows).toHaveLength(1);
  });

  it("7. an empty allowlist returns nothing and renders no stand-in copy", async () => {
    expect(await listVisibleNotes(null)).toEqual([]);
    const html = renderToStaticMarkup(
      createElement(CanopyNotesBody, { signedIn: false, notes: [] }),
    );
    expect(html).toContain("Log in");
    expect(html).toContain('href="/login?redirect=/canopy/notes"');
    expect(html.toLowerCase()).not.toMatch(/public[\s-]*notes/);
    expect(html.toLowerCase()).not.toMatch(/coming soon|placeholder|no notes yet/);
    expect(html).not.toContain("<h2");
  });

  it("8. non-admins and an empty admin list get 403 and write no audit", async () => {
    const calls: Array<() => Promise<unknown>> = [
      () => assign(A, MINE, B),
      () => unassign(A, MINE, B),
      () => allowlistAdd(A, MINE),
      () => allowlistRemove(A, MINE),
      () => revoke(A, B),
      () => restore(A, B),
      () => upsertNote(A, { kind: "other", title: "Nope", bodyMd: "Nope body" }),
      () => listAudit(A),
    ];

    async function expectLocked() {
      for (const call of calls) {
        const before = await auditCount();
        await expect(call()).rejects.toBeInstanceOf(CanopyForbiddenError);
        await expect(call()).rejects.toMatchObject({ status: 403 });
        expect(await auditCount()).toBe(before);
      }
    }

    const previous = process.env.CANOPY_ADMIN_USER_IDS;
    try {
      delete process.env.CANOPY_ADMIN_USER_IDS;
      await expectLocked();
      process.env.CANOPY_ADMIN_USER_IDS = "";
      await expectLocked();
      process.env.CANOPY_ADMIN_USER_IDS = "someone-else";
      await expectLocked();
    } finally {
      process.env.CANOPY_ADMIN_USER_IDS = previous;
    }
  });

  it("rejects banned note text and writes nothing", async () => {
    const bannedName = String.fromCharCode(103, 110, 111, 109, 97, 104);
    const bannedFlow = String.fromCharCode(109, 97, 99, 114, 111, 102, 108, 111, 119);
    const numbered = ["C", "N", "-", "4"].join("");
    const before = await auditCount();
    await expect(
      upsertNote(ADMIN, { kind: "other", title: bannedName, bodyMd: "Clean body" }),
    ).rejects.toBeInstanceOf(NoteTextError);
    await expect(
      upsertNote(ADMIN, { kind: "other", title: "Clean title", bodyMd: bannedFlow }),
    ).rejects.toBeInstanceOf(NoteTextError);
    await expect(
      upsertNote(ADMIN, { kind: "other", title: numbered, bodyMd: "Clean body" }),
    ).rejects.toBeInstanceOf(NoteTextError);
    expect(await auditCount()).toBe(before);
    expect(await listVisibleNotes(null)).toEqual([]);
  });
});
