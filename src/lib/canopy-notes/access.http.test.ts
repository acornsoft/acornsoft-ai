import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Sql } from "@/lib/db";
import type { NoteKind } from "./types";
import { canopyNoteHeaders, responseIsCacheHit } from "./http-headers";

const dbState = vi.hoisted(() => ({
  sql: null as Sql | null,
}));

vi.mock("@/lib/db", () => ({
  getSql: async () => {
    if (!dbState.sql) throw new Error("test database is not ready");
    return dbState.sql;
  },
}));

import { isCanopyAdmin, restore, revoke, upsertNote, allowlistAdd, assign } from "./admin.server";
import { listVisibleNotes, loadNoteForRoute } from "./access.server";
import { CanopyNoteDetail, CanopyNotesBody, CanopyNotFound } from "./view";

const ADMIN = "admin-1";
const A = "account-a";
const B = "account-b";
const TOKEN_ADMIN = "session-token-admin";
const TOKEN_A = "session-token-a";
const TOKEN_B = "session-token-b";
const COOKIE_ADMIN = `canopy_session=${TOKEN_ADMIN}`;
const COOKIE_A = `canopy_session=${TOKEN_A}`;
const COOKIE_B = `canopy_session=${TOKEN_B}`;
const ALLOW = "11111111-1111-4111-8111-111111111111";
const MINE = "22222222-2222-4222-8222-222222222222";
const THEIRS = "33333333-3333-4333-8333-333333333333";
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

function cookieValue(req: IncomingMessage, name: string): string | null {
  const raw = req.headers.cookie ?? "";
  for (const part of raw.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

async function userIdForToken(token: string | null): Promise<string | null> {
  if (!token) return null;
  const rows = await dbState.sql!.query<{ userId: string }>(
    `select "userId" from "session" where "token" = $1 and "expiresAt" > now()`,
    [token],
  );
  return rows[0]?.userId ?? null;
}

function htmlHeaders(): Record<string, string> {
  return {
    "content-type": "text/html; charset=utf-8",
    ...canopyNoteHeaders(),
  };
}

function send(
  res: ServerResponse,
  status: number,
  body: string,
  headers: Record<string, string>,
): void {
  res.writeHead(status, headers);
  res.end(body);
}

async function readJson(req: IncomingMessage): Promise<{ userId?: string }> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const text = Buffer.concat(chunks).toString("utf8");
  if (!text.trim()) return {};
  return JSON.parse(text) as { userId?: string };
}

async function handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = new URL(req.url ?? "/", "http://127.0.0.1");
  const userId = await userIdForToken(cookieValue(req, "canopy_session"));

  if (req.method === "GET" && url.pathname === "/session") {
    send(
      res,
      200,
      JSON.stringify({ userId }),
      {
        "content-type": "application/json; charset=utf-8",
        ...canopyNoteHeaders(),
      },
    );
    return;
  }

  if (req.method === "GET" && url.pathname === "/canopy/notes") {
    const notes = await listVisibleNotes(userId);
    const body = renderToStaticMarkup(
      createElement(CanopyNotesBody, { signedIn: Boolean(userId), notes }),
    );
    send(res, 200, body, htmlHeaders());
    return;
  }

  if (req.method === "GET" && url.pathname.startsWith("/canopy/notes/")) {
    const noteId = decodeURIComponent(url.pathname.slice("/canopy/notes/".length));
    const loaded = await loadNoteForRoute(userId, noteId);
    if (loaded.status === 404) {
      send(res, 404, renderToStaticMarkup(createElement(CanopyNotFound)), htmlHeaders());
      return;
    }
    send(
      res,
      200,
      renderToStaticMarkup(createElement(CanopyNoteDetail, { note: loaded.note })),
      htmlHeaders(),
    );
    return;
  }

  if (
    req.method === "POST" &&
    (url.pathname === "/canopy/notes/admin/revoke" ||
      url.pathname === "/canopy/notes/admin/restore")
  ) {
    if (!userId || !isCanopyAdmin(userId)) {
      send(res, 403, "Forbidden", {
        "content-type": "text/plain; charset=utf-8",
        ...canopyNoteHeaders(),
      });
      return;
    }
    const body = await readJson(req);
    const target = String(body.userId ?? "");
    if (url.pathname.endsWith("/revoke")) await revoke(userId, target);
    else await restore(userId, target);
    send(res, 200, JSON.stringify({ ok: true }), {
      "content-type": "application/json; charset=utf-8",
      ...canopyNoteHeaders(),
    });
    return;
  }

  send(res, 404, "Not found", {
    "content-type": "text/plain; charset=utf-8",
    ...canopyNoteHeaders(),
  });
}

async function seed(id: string, kind: NoteKind, title: string): Promise<void> {
  await upsertNote(ADMIN, { noteId: id, kind, title, bodyMd: `${title} body` });
}

async function seedPair(): Promise<void> {
  await seed(ALLOW, "product", "Allowlisted note");
  await seed(MINE, "other", "Note for A");
  await seed(THEIRS, "other", "Note for B");
  await allowlistAdd(ADMIN, ALLOW);
  await assign(ADMIN, MINE, A);
  await assign(ADMIN, THEIRS, B);
}

describe("canopy notes over HTTP", () => {
  let base = "";
  let closeServer: (() => Promise<void>) | null = null;

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
    const accounts = [
      [ADMIN, "Admin", "admin@example.test", TOKEN_ADMIN],
      [A, "Account A", "a@example.test", TOKEN_A],
      [B, "Account B", "b@example.test", TOKEN_B],
    ];
    for (const [id, name, email, token] of accounts) {
      await dbState.sql.query(
        `insert into "user" ("id", "name", "email", "emailVerified", "createdAt", "updatedAt")
         values ($1, $2, $3, true, now(), now())`,
        [id, name, email],
      );
      await dbState.sql.query(
        `insert into "session" ("id", "expiresAt", "token", "createdAt", "updatedAt", "userId")
         values ($1, now() + interval '2 days', $2, now(), now(), $3)`,
        [`sess-${id}`, token, id],
      );
    }

    const server = createServer((req, res) => {
      handle(req, res).catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "error";
        if (!res.headersSent) {
          res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
        }
        res.end(message);
      });
    });
    await new Promise<void>((resolve) => {
      server.listen(0, "127.0.0.1", resolve);
    });
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("test server has no port");
    base = `http://127.0.0.1:${address.port}`;
    closeServer = () =>
      new Promise((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      });
  });

  afterAll(async () => {
    if (closeServer) await closeServer();
  });

  beforeEach(async () => {
    vi.stubEnv("CANOPY_ADMIN_USER_IDS", ADMIN);
    await dbState.sql!.query(
      `truncate table canopy_audit, canopy_assignments, canopy_public_allowlist,
        canopy_account_status, canopy_notes restart identity`,
    );
  });

  async function hit(path: string, cookie?: string, init?: RequestInit) {
    const headers = new Headers(init?.headers);
    if (cookie) headers.set("cookie", cookie);
    const res = await fetch(`${base}${path}`, { ...init, headers });
    const body = await res.text();
    return { status: res.status, body, headers: res.headers };
  }

  async function sessionCount(userId: string): Promise<number> {
    const rows = await dbState.sql!.query<{ n: number }>(
      `select count(*)::int as n from "session" where "userId" = $1`,
      [userId],
    );
    return Number(rows[0]?.n ?? 0);
  }

  it("signed in as A, the list shows the allowlisted note and A's note only", async () => {
    await seedPair();
    const list = await hit("/canopy/notes", COOKIE_A);
    expect(list.status).toBe(200);
    expect(list.body).toContain("Allowlisted note");
    expect(list.body).toContain("Note for A");
    expect(list.body).not.toContain("Note for B");
    expect(list.body).not.toContain("Log in");
    expect(list.headers.get("cache-control")).toMatch(/private/i);
    expect(list.headers.get("cache-control")).toMatch(/no-store/i);
    expect(responseIsCacheHit(list.headers)).toBe(false);
  });

  it("signed in as A, B's note URL returns the same not-found page as a missing id", async () => {
    await seedPair();
    const foreign = await hit(`/canopy/notes/${THEIRS}`, COOKIE_A);
    const missing = await hit(`/canopy/notes/${MISSING}`, COOKIE_A);
    expect(foreign.status).toBe(404);
    expect(missing.status).toBe(404);
    expect(foreign.body).toBe(missing.body);
    expect(foreign.body).toContain("Not found");
    expect(foreign.body).not.toContain("Note for B");
    expect(responseIsCacheHit(foreign.headers)).toBe(false);
  });

  it("signed in as B, the mirror result holds", async () => {
    await seedPair();
    const list = await hit("/canopy/notes", COOKIE_B);
    expect(list.status).toBe(200);
    expect(list.body).toContain("Allowlisted note");
    expect(list.body).toContain("Note for B");
    expect(list.body).not.toContain("Note for A");
    const foreign = await hit(`/canopy/notes/${MINE}`, COOKIE_B);
    const missing = await hit(`/canopy/notes/${MISSING}`, COOKIE_B);
    expect(foreign.status).toBe(404);
    expect(foreign.body).toBe(missing.body);
    expect(foreign.body).toContain("Not found");
  });

  it("revoke hides assigned notes on the next request and does not end the session", async () => {
    await seedPair();
    const sessionsBefore = await sessionCount(A);
    expect(sessionsBefore).toBe(1);

    const open = await hit(`/canopy/notes/${MINE}`, COOKIE_A);
    expect(open.status).toBe(200);
    expect(open.body).toContain("Note for A");
    expect(responseIsCacheHit(open.headers)).toBe(false);

    const denied = await hit("/canopy/notes/admin/revoke", COOKIE_A, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId: A }),
    });
    expect(denied.status).toBe(403);
    const stillOpen = await hit(`/canopy/notes/${MINE}`, COOKIE_A);
    expect(stillOpen.status).toBe(200);

    const revoked = await hit("/canopy/notes/admin/revoke", COOKIE_ADMIN, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId: A }),
    });
    expect(revoked.status).toBe(200);

    const again = await hit(`/canopy/notes/${MINE}`, COOKIE_A);
    const missing = await hit(`/canopy/notes/${MISSING}`, COOKIE_A);
    expect(again.status).toBe(404);
    expect(again.body).toBe(missing.body);
    expect(again.body).toContain("Not found");
    expect(again.body).not.toContain("Note for A");
    expect(again.headers.get("cache-control")).toMatch(/no-store/i);
    expect(responseIsCacheHit(again.headers)).toBe(false);
    expect(again.headers.get("x-vercel-cache")).toBeNull();
    expect(again.headers.get("set-cookie")).toBeNull();
    expect(again.body).not.toBe(open.body);

    const list = await hit("/canopy/notes", COOKIE_A);
    expect(list.status).toBe(200);
    expect(list.body).toContain("Allowlisted note");
    expect(list.body).not.toContain("Note for A");
    expect(list.body).not.toContain("For this account");
    expect(list.body).not.toContain("Log in");
    expect(list.headers.get("cache-control")).toMatch(/no-store/i);
    expect(responseIsCacheHit(list.headers)).toBe(false);

    const session = await hit("/session", COOKIE_A);
    expect(session.status).toBe(200);
    expect(JSON.parse(session.body)).toEqual({ userId: A });
    expect(await sessionCount(A)).toBe(sessionsBefore);

    const audit = await dbState.sql!.query<{ action: string; actor_user_id: string }>(
      `select action, actor_user_id from canopy_audit
       where action = 'revoke' and target_user_id = $1
       order by id desc limit 1`,
      [A],
    );
    expect(audit[0]).toMatchObject({ action: "revoke", actor_user_id: ADMIN });

    const restored = await hit("/canopy/notes/admin/restore", COOKIE_ADMIN, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId: A }),
    });
    expect(restored.status).toBe(200);
    const back = await hit(`/canopy/notes/${MINE}`, COOKIE_A);
    expect(back.status).toBe(200);
    expect(back.body).toContain("Note for A");
    const shotDir = process.env.CANOPY_SCREENSHOT_DIR;
    if (shotDir) {
      mkdirSync(shotDir, { recursive: true });
      writeFileSync(join(shotDir, "revocation-before.html"), open.body);
      writeFileSync(join(shotDir, "revocation-after-note.html"), again.body);
      writeFileSync(join(shotDir, "revocation-after-list.html"), list.body);
      writeFileSync(join(shotDir, "revocation-restored.html"), back.body);
    }
    expect(responseIsCacheHit(back.headers)).toBe(false);
    const listBack = await hit("/canopy/notes", COOKIE_A);
    expect(listBack.body).toContain("Allowlisted note");
    expect(listBack.body).toContain("Note for A");
    expect(JSON.parse((await hit("/session", COOKIE_A)).body)).toEqual({ userId: A });
  });

  it("note routes send the no-store headers", () => {
    const list = readFileSync(join(process.cwd(), "src/routes/canopy.notes.tsx"), "utf8");
    const detail = readFileSync(
      join(process.cwd(), "src/routes/canopy.notes.$noteId.tsx"),
      "utf8",
    );
    expect(list).toContain("canopyNoteHeaders()");
    expect(list).toContain("staleTime: 0");
    expect(detail).toContain("canopyNoteHeaders()");
    expect(detail).toContain("staleTime: 0");
    expect(canopyNoteHeaders()["Cache-Control"]).toBe("private, no-store");
    expect(responseIsCacheHit(new Headers({ "x-vercel-cache": "HIT" }))).toBe(true);
    expect(responseIsCacheHit(new Headers(canopyNoteHeaders()))).toBe(false);
  });
});
