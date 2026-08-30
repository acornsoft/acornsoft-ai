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

const BUNDLED_REGISTRY = import.meta.glob(
  "/content/climb-notes/_publish-registry.json",
  {
    query: "?raw",
    import: "default",
    eager: true,
  },
) as Record<string, string>;

type NoteRow = {
  id: string;
  number: string;
  title: string;
  note_date: string;
  status: string;
  problem: string;
  measure: string;
  slice: string;
  lesson: string;
  tags: string | null;
  x_url: string | null;
  version: number | null;
  submitted_at: string | null;
  submitted_by: string | null;
  approved_at: string | null;
  approved_by: string | null;
  published_at: string | null;
  unpublished_at: string | null;
  approval_note: string | null;
  history: string | null;
  source_file: string | null;
  owner_user_id: string | null;
};

type RegistryNote = {
  status?: string;
  version?: number;
  submittedAt?: string | null;
  submittedBy?: string | null;
  approvedAt?: string | null;
  approvedBy?: string | null;
  publishedAt?: string | null;
  unpublishedAt?: string | null;
  approvalNote?: string | null;
  history?: ClimbNotePublishHistory[];
  onCanopy?: boolean;
  canopyAt?: string | null;
};
