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

/** Published notes only — safe for anonymous visitors. */
export const listPublishedClimbNotes = createServerFn({ method: "GET" }).handler(
  async (): Promise<ClimbNote[]> => {
    const { listClimbNotesFromDb } = await import("./store.server");
    return listClimbNotesFromDb({ publishedOnly: true });
  },
);

/**
 * Full library (draft / pending / approved / archived).
 * Owner-only. Prefer listClimbNotesForEditor for Gnomah.
 * Not used by the public Climb Notes journal (published only).
 */
export const listAllClimbNotesPublic = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<ClimbNote[]> => {
    const { assertClimbNotesOwner } = await import("./owner.server");
    await assertClimbNotesOwner(context.userId);
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
  onCanopy?: boolean;
  canopyAt?: string | null;
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

export type IntakePayload = {
  title?: string;
  problem: string;
  measure: string;
  slice: string;
  lesson: string;
  name: string;
  email: string;
  /** Honeypot — must stay empty. Do not name this company (browsers autofill it). */
  hp_fax?: string;
};

export type IntakeResult =
  | { ok: true; id: string; number: string }
  | { ok: false; error: string };

function clean(s: unknown, max: number): string {
  return String(s ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export const submitPublicClimbNoteAction = createServerFn({ method: "POST" })
  .validator((data: IntakePayload) => data)
  .handler(async ({ data }): Promise<IntakeResult> => {
    if (clean(data.hp_fax, 80)) {
      return { ok: true, id: "", number: "" };
    }
    const problem = clean(data.problem, 2000);
    const measure = clean(data.measure, 2000);
    const slice = clean(data.slice, 2000);
    const lesson = clean(data.lesson, 2000);
    const name = clean(data.name, 80);
    const email = clean(data.email, 120).toLowerCase();
    const title = clean(data.title, 120);
    if (problem.length < 8 || measure.length < 8 || slice.length < 8) {
      return {
        ok: false,
        error:
          "Name Base Camp, Route, and Waypoint — a few sentences each.",
      };
    }
    if (name.length < 2) {
      return { ok: false, error: "Tell us who to build this for." };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false, error: "We need a real email so we can reach you." };
    }
    try {
      const { saveClimbNote, nextClimbNoteNumber } = await import(
        "./store.server"
      );
      const number = await nextClimbNoteNumber();
      const id = `cn-${number}`;
      const from = `${name} <${email}>`;
      const safeTitle = (title || problem.slice(0, 72))
        .replace(/[^\w\s-]+/g, "")
        .trim()
        .replace(/\s+/g, " ");
      await saveClimbNote(
        {
          id,
          number,
          title: title || problem.slice(0, 72),
          date: new Date().toISOString().slice(0, 10),
          status: "draft",
          problem: `${problem}\n\nFrom ${from}.`,
          measure,
          slice,
          lesson: lesson || "",
          tags: ["climb-note", "intake"],
          onCanopy: false,
          sourceFile: `inbox/${number} ${safeTitle || "Climb Note"}.md`,
        },
        "",
        from,
      );
      try {
        const { notifyClimbNotesGate } = await import(
          "./notify-gate.server"
        );
        await notifyClimbNotesGate({
          id,
          number,
          title: title || problem.slice(0, 72),
          problem,
          measure,
          slice,
          lesson: lesson || "",
          name,
          email,
        });
      } catch (err) {
        console.error(
          "[climb-notes/gate] notify skipped",
          err instanceof Error ? err.message : err,
        );
      }
      return { ok: true, id, number };
    } catch {
      return {
        ok: false,
        error: "Could not file the note. Try again, or email hello@acornsoft.ai.",
      };
    }
  });
