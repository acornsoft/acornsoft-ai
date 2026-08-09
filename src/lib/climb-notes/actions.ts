import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import type { ClimbNote, ClimbNoteStatus } from "@/components/site/climb-notes-data";

export type ClimbNotesAccess = {
  signedIn: boolean;
  isOwner: boolean;
  handle: string | null;
  displayName: string | null;
};

export const getClimbNotesAccess = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<ClimbNotesAccess> => {
    const { assertClimbNotesOwner, ForbiddenOwnerError } = await import(
      "./owner.server"
    );
    const { getSessionUser, UnauthorizedError } = await import(
      "@/lib/auth/verify.server"
    );
    try {
      const owner = await assertClimbNotesOwner(context.userId);
      const session = await getSessionUser();
      return {
        signedIn: true,
        isOwner: true,
        handle: owner.handle,
        displayName: session?.email ?? owner.handle,
      };
    } catch (err) {
      if (err instanceof UnauthorizedError) throw err;
      if (err instanceof ForbiddenOwnerError) {
        return {
          signedIn: true,
          isOwner: false,
          handle: null,
          displayName: null,
        };
      }
      throw err;
    }
  });

/** Public: published notes only (no auth). */
export const listPublishedClimbNotes = createServerFn({ method: "GET" }).handler(
  async (): Promise<ClimbNote[]> => {
    const { listClimbNotesFromDb } = await import("./store.server");
    return listClimbNotesFromDb({ publishedOnly: true });
  },
);

/** Public-ish: all notes for studio view on the journal page (read). */
export const listAllClimbNotesPublic = createServerFn({
  method: "GET",
}).handler(async (): Promise<ClimbNote[]> => {
  const { listClimbNotesFromDb } = await import("./store.server");
  return listClimbNotesFromDb({ publishedOnly: false });
});

/** Owner: full library for Gnomah editor. */
export const listClimbNotesForEditor = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<ClimbNote[]> => {
    const { assertClimbNotesOwner } = await import("./owner.server");
    await assertClimbNotesOwner(context.userId);
    const { listClimbNotesFromDb } = await import("./store.server");
    return listClimbNotesFromDb({ publishedOnly: false });
  });

export type SaveNotePayload = {
  id?: string;
  number: string;
  title: string;
  date: string;
  status?: ClimbNoteStatus;
  problem: string;
  measure: string;
  slice: string;
  lesson: string;
  tags?: string[];
  xUrl?: string | null;
};

export const saveClimbNoteAction = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: SaveNotePayload) => data)
  .handler(async ({ context, data }): Promise<ClimbNote> => {
    const { assertClimbNotesOwner } = await import("./owner.server");
    const owner = await assertClimbNotesOwner(context.userId);
    const { saveClimbNote } = await import("./store.server");
    return saveClimbNote(data, context.userId, owner.handle);
  });

export type TransitionPayload = {
  id: string;
  action: string;
  note?: string;
};

export const transitionClimbNoteAction = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: TransitionPayload) => data)
  .handler(async ({ context, data }): Promise<ClimbNote> => {
    const { assertClimbNotesOwner } = await import("./owner.server");
    const owner = await assertClimbNotesOwner(context.userId);
    const { transitionClimbNote } = await import("./store.server");
    return transitionClimbNote(data.id, data.action, owner.handle, data.note);
  });

export const deleteClimbNoteAction = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string }) => data)
  .handler(async ({ context, data }): Promise<{ ok: true }> => {
    const { assertClimbNotesOwner } = await import("./owner.server");
    await assertClimbNotesOwner(context.userId);
    const { deleteClimbNote } = await import("./store.server");
    await deleteClimbNote(data.id);
    return { ok: true };
  });

/** Owner: re-scan local vault + optional GitHub Gnomah pull (async). */
export const refreshClimbNotesLibrary = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { assertClimbNotesOwner } = await import("./owner.server");
    await assertClimbNotesOwner(context.userId);
    const { syncClimbNotesLibrary } = await import("./store.server");
    return syncClimbNotesLibrary();
  });
