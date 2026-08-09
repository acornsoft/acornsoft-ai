/**
 * Climb Notes — climbing logs.
 *
 * Source of truth for writing: Markdown in /content/climb-notes (Obsidian-compatible).
 * Publish gate: /content/climb-notes/_publish-registry.json (SharePoint-style).
 * Public site shows only status "published". Studio surfaces every note.
 */

export type ClimbNoteStatus =
  | "draft"
  | "pending"
  | "approved"
  | "published"
  | "archived";

export type ClimbNotePublishHistory = {
  at: string;
  action: string;
  by: string;
  note?: string;
};

export type ClimbNotePublishEntry = {
  status: ClimbNoteStatus;
  version?: number;
  submittedAt?: string | null;
  submittedBy?: string | null;
  approvedAt?: string | null;
  approvedBy?: string | null;
  publishedAt?: string | null;
  unpublishedAt?: string | null;
  approvalNote?: string | null;
  history?: ClimbNotePublishHistory[];
};

export type ClimbNote = {
  id: string;
  number: string;
  title: string;
  date: string;
  problem: string;
  measure: string;
  slice: string;
  lesson: string;
  /** Effective status after registry override */
  status: ClimbNoteStatus;
  /** Frontmatter-only status before registry */
  frontmatterStatus?: ClimbNoteStatus;
  version?: number;
  submittedAt?: string | null;
  submittedBy?: string | null;
  approvedAt?: string | null;
  approvedBy?: string | null;
  publishedAt?: string | null;
  unpublishedAt?: string | null;
  approvalNote?: string | null;
  history?: ClimbNotePublishHistory[];
  xUrl?: string;
  tags?: string[];
  sourceFile?: string;
};

const STATUSES: ClimbNoteStatus[] = [
  "draft",
  "pending",
  "approved",
  "published",
  "archived",
];

export const CLIMB_NOTE_STATUS_LABEL: Record<ClimbNoteStatus, string> = {
  draft: "Unapproved",
  pending: "Pending approval",
  approved: "Approved",
  published: "Published",
  archived: "Archived",
};

export function isPublicClimbNoteStatus(status: ClimbNoteStatus): boolean {
  return status === "published";
}

const noteModules = import.meta.glob("../../../content/climb-notes/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

import registryJson from "../../../content/climb-notes/_publish-registry.json";

type RegistryFile = {
  version?: number;
  notes?: Record<string, ClimbNotePublishEntry>;
};

const publishRegistry = registryJson as RegistryFile;

function asStatus(value: unknown): ClimbNoteStatus | undefined {
  if (typeof value !== "string") return undefined;
  const v = value.trim().toLowerCase() as ClimbNoteStatus;
  return STATUSES.includes(v) ? v : undefined;
}

function parseFrontmatter(raw: string): {
  data: Record<string, string | string[] | undefined>;
  body: string;
} {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw.trim() };
  const data: Record<string, string | string[] | undefined> = {};
  let currentList: string | null = null;
  for (const line of m[1].split(/\r?\n/)) {
    const listItem = line.match(/^\s+-\s+(.+)$/);
    if (listItem && currentList) {
      const arr = Array.isArray(data[currentList])
        ? (data[currentList] as string[])
        : [];
      arr.push(listItem[1].trim().replace(/^["']|["']$/g, ""));
      data[currentList] = arr;
      continue;
    }
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    const rawVal = kv[2].trim();
    if (rawVal === "" || rawVal === "null" || rawVal === "~") {
      data[key] = undefined;
      currentList = key === "tags" ? "tags" : null;
      if (key === "tags") data.tags = [];
      continue;
    }
    currentList = null;
    data[key] = rawVal.replace(/^["']|["']$/g, "");
  }
  return { data, body: m[2].trim() };
}

function section(body: string, heading: string): string {
  const re = new RegExp(
    `##\\s+${heading}\\s*\\r?\\n([\\s\\S]*?)(?=\\r?\\n##\\s+|$)`,
    "i",
  );
  const hit = body.match(re);
  return hit ? hit[1].trim() : "";
}

function resolvePublish(
  id: string,
  frontmatterStatus?: ClimbNoteStatus,
): ClimbNotePublishEntry & { status: ClimbNoteStatus } {
  const entry = publishRegistry.notes?.[id];
  const fromRegistry = asStatus(entry?.status);
  const status = fromRegistry ?? frontmatterStatus ?? "draft";
  return {
    status,
    version: entry?.version,
    submittedAt: entry?.submittedAt,
    submittedBy: entry?.submittedBy,
    approvedAt: entry?.approvedAt,
    approvedBy: entry?.approvedBy,
    publishedAt: entry?.publishedAt,
    unpublishedAt: entry?.unpublishedAt,
    approvalNote: entry?.approvalNote,
    history: entry?.history,
  };
}

function parseNote(path: string, raw: string): ClimbNote | null {
  if (/README\.md$/i.test(path)) return null;
  if (/_publish-registry/i.test(path)) return null;
  const { data, body } = parseFrontmatter(raw);
  const id = String(data.id ?? "").trim();
  if (!id) return null;
  const tags = Array.isArray(data.tags) ? data.tags : undefined;
  const xUrl =
    typeof data.xUrl === "string" && data.xUrl.length > 0
      ? data.xUrl
      : undefined;
  const frontmatterStatus = asStatus(data.status);
  const pub = resolvePublish(id, frontmatterStatus);
  return {
    id,
    number: String(data.number ?? "").replace(/"/g, ""),
    title: String(data.title ?? "Untitled"),
    date: String(data.date ?? ""),
    problem: section(body, "Problem"),
    measure: section(body, "Measure"),
    slice: section(body, "Slice"),
    lesson: section(body, "Lesson"),
    status: pub.status,
    frontmatterStatus,
    version: pub.version,
    submittedAt: pub.submittedAt,
    submittedBy: pub.submittedBy,
    approvedAt: pub.approvedAt,
    approvedBy: pub.approvedBy,
    publishedAt: pub.publishedAt,
    unpublishedAt: pub.unpublishedAt,
    approvalNote: pub.approvalNote,
    history: pub.history,
    xUrl,
    tags: tags?.length ? tags : undefined,
    sourceFile: path.split("/").pop(),
  };
}

export const climbNotes: ClimbNote[] = Object.entries(noteModules)
  .map(([path, raw]) => parseNote(path, raw))
  .filter((n): n is ClimbNote => n !== null)
  .sort((a, b) => b.number.localeCompare(a.number));

/** Notes visible on the public Climb Notes page and safe to cite on X. */
export const publishedClimbNotes: ClimbNote[] = climbNotes.filter((n) =>
  isPublicClimbNoteStatus(n.status),
);

export function countByStatus(
  notes: ClimbNote[] = climbNotes,
): Record<ClimbNoteStatus | "all", number> {
  const counts: Record<ClimbNoteStatus | "all", number> = {
    all: notes.length,
    draft: 0,
    pending: 0,
    approved: 0,
    published: 0,
    archived: 0,
  };
  for (const n of notes) counts[n.status] += 1;
  return counts;
}

export function formatClimbNoteCiteForX(
  note: ClimbNote,
  siteOrigin = "https://acornsoft.ai",
): string {
  const oneLine =
    note.lesson.length > 180 ? `${note.lesson.slice(0, 177)}…` : note.lesson;
  return `Climb Note ${note.number} · ${note.title}

${oneLine}

Full note (stored on site):
${siteOrigin}/climb-notes#${note.id}
`;
}
