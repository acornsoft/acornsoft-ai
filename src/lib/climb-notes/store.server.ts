/**
 * Climb Notes DB store + markdown seed / write-through (Gnomah editor).
 * Server-only.
 *
 * Seeds are also inlined via `import.meta.glob` so standalone Vercel deploys
 * still seed when `content/` is not present on the function filesystem.
 * Write-through to disk is best-effort (ignored on read-only hosts).
 *
 * IMPORTANT: ensureClimbNotesSeeded only INSERTs missing rows — never
 * overwrites editor status / content changes.
 */
import fs from "node:fs";
import path from "node:path";
import { getSql } from "@/lib/db";
import type {
  ClimbNote,
  ClimbNotePublishHistory,
  ClimbNoteStatus,
} from "@/components/site/climb-notes-data";

const STATUSES: ClimbNoteStatus[] = [
  "draft",
  "pending",
  "approved",
  "published",
  "archived",
];

const NOTES_DIR = path.join(process.cwd(), "content", "climb-notes");
const REGISTRY_PATH = path.join(NOTES_DIR, "_publish-registry.json");

/**
 * Resolve dest under NOTES_DIR. Reject absolute sourceFile and `..` so
 * write/delete cannot escape the vault (path traversal).
 */
function resolvePathUnderNotesDir(sourceFile: string): string | null {
  const raw = sourceFile.trim();
  if (!raw) return null;
  if (path.isAbsolute(raw)) return null;
  if (raw.split(/[/\\]/).includes("..")) return null;
  const dest = path.resolve(NOTES_DIR, raw);
  const notesRoot = path.resolve(NOTES_DIR);
  const prefix = notesRoot.endsWith(path.sep) ? notesRoot : notesRoot + path.sep;
  if (dest !== notesRoot && !dest.startsWith(prefix)) return null;
  return dest;
}

/** Build-time inlined notes for serverless (nested vault folders). */
const BUNDLED_NOTE_MD = import.meta.glob("/content/climb-notes/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;
