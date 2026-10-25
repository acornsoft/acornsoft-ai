import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import type { AuditRow, CanopyNote, NoteKind } from "./types";
import { isNoteKind } from "./types";

type NotFoundBody = { status: 404; body: "Not found" };
type NoteHit = { status: 200; note: CanopyNote };

function accountId(value: unknown): string {
  const id = String(value ?? "").trim();
  if (!id || id.length > 200) throw new Error("Invalid account");
  return id;
}

function noteId(value: unknown): string {
  const id = String(value ?? "").trim().toLowerCase();
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
      id,
    )
  ) {
    throw new Error("Invalid note id");
  }
  return id;
}

function kindOf(value: unknown): NoteKind {
  const kind = String(value ?? "");
  if (!isNoteKind(kind)) throw new Error("Invalid kind");
  return kind;
}

async function guardAdmin(userId: string): Promise<void> {
  const { isCanopyAdmin, CanopyForbiddenError } = await import("./admin.server");
  if (!isCanopyAdmin(userId)) throw new CanopyForbiddenError();
}

export type CanopyNotesList = { signedIn: boolean; notes: CanopyNote[] };

/** Optional session. Logged out returns the allowlist only. */
export const listCanopyNotes = createServerFn({ method: "GET" }).handler(
  async (): Promise<CanopyNotesList> => {
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const { listVisibleNotes } = await import("./access.server");
    const user = await getSessionUser();
    const notes = await listVisibleNotes(user?.id ?? null);
    return { signedIn: Boolean(user), notes };
  },
);

/** Missing and not-entitled are the same not-found result. */
export const getCanopyNote = createServerFn({ method: "GET" })
  .validator((data: { noteId: string }) => ({
    noteId: String(data?.noteId ?? "").trim(),
  }))
  .handler(async ({ data }): Promise<NotFoundBody | NoteHit> => {
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const { loadNoteForRoute } = await import("./access.server");
    const user = await getSessionUser();
    return loadNoteForRoute(user?.id ?? null, data.noteId);
  });

export const getCanopyAdminPage = createServerFn({ method: "GET" }).handler(
  async (): Promise<NotFoundBody | { status: 200; audit: AuditRow[] }> => {
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const { isCanopyAdmin, listAudit } = await import("./admin.server");
    const user = await getSessionUser();
    if (!user || !isCanopyAdmin(user.id)) {
      return { status: 404, body: "Not found" };
    }
    const audit = await listAudit(user.id);
    return { status: 200, audit };
  },
);

export const upsertCanopyNote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (data: { noteId?: string; kind: string; title: string; bodyMd: string }) => ({
      noteId: data?.noteId ? noteId(data.noteId) : undefined,
      kind: kindOf(data?.kind),
      title: String(data?.title ?? ""),
      bodyMd: String(data?.bodyMd ?? ""),
    }),
  )
  .handler(async ({ context, data }) => {
    await guardAdmin(context.userId);
    const { upsertNote } = await import("./admin.server");
    return upsertNote(context.userId, data);
  });

export const assignCanopyNote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { noteId: string; userId: string }) => ({
    noteId: noteId(data?.noteId),
    userId: accountId(data?.userId),
  }))
  .handler(async ({ context, data }) => {
    await guardAdmin(context.userId);
    const { assign } = await import("./admin.server");
    await assign(context.userId, data.noteId, data.userId);
    return { ok: true as const };
  });

export const unassignCanopyNote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { noteId: string; userId: string }) => ({
    noteId: noteId(data?.noteId),
    userId: accountId(data?.userId),
  }))
  .handler(async ({ context, data }) => {
    await guardAdmin(context.userId);
    const { unassign } = await import("./admin.server");
    await unassign(context.userId, data.noteId, data.userId);
    return { ok: true as const };
  });

export const allowlistAddCanopyNote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { noteId: string }) => ({ noteId: noteId(data?.noteId) }))
  .handler(async ({ context, data }) => {
    await guardAdmin(context.userId);
    const { allowlistAdd } = await import("./admin.server");
    await allowlistAdd(context.userId, data.noteId);
    return { ok: true as const };
  });

export const allowlistRemoveCanopyNote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { noteId: string }) => ({ noteId: noteId(data?.noteId) }))
  .handler(async ({ context, data }) => {
    await guardAdmin(context.userId);
    const { allowlistRemove } = await import("./admin.server");
    await allowlistRemove(context.userId, data.noteId);
    return { ok: true as const };
  });

export const revokeCanopyAccount = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { userId: string }) => ({ userId: accountId(data?.userId) }))
  .handler(async ({ context, data }) => {
    await guardAdmin(context.userId);
    const { revoke } = await import("./admin.server");
    await revoke(context.userId, data.userId);
    return { ok: true as const };
  });

export const restoreCanopyAccount = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { userId: string }) => ({ userId: accountId(data?.userId) }))
  .handler(async ({ context, data }) => {
    await guardAdmin(context.userId);
    const { restore } = await import("./admin.server");
    await restore(context.userId, data.userId);
    return { ok: true as const };
  });
