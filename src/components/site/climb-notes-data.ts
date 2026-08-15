/**
 * Climb Notes — climbing logs.
 *
 * Source of truth for writing: Markdown in /content/climb-notes (Obsidian-compatible).
 * Publish gate: /content/climb-notes/_publish-registry.json (SharePoint-style).
 * Public journal: status "published".
 * Canopy timeline: published + onCanopy true (+ canopyAt not in the future).
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
  /**
   * When true (and status is published), the note appears on the Canopy timeline.
   * Journal visibility is independent — published alone is enough for /climb-notes.
   */
  onCanopy?: boolean;
  /**
   * Optional go-live time for Canopy. If set in the future, the note stays off
   * the timeline until then (still published on the journal if status allows).
   */
  canopyAt?: string | null;
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
  /** Canopy timeline gate (registry overrides frontmatter) */
  onCanopy?: boolean;
  canopyAt?: string | null;
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

/** True when this note should appear on the Canopy / public timeline. */
export function isClimbNoteOnCanopy(
  note: Pick<ClimbNote, "status" | "onCanopy" | "canopyAt">,
  now: Date = new Date(),
): boolean {
  if (!isPublicClimbNoteStatus(note.status)) return false;
  if (note.onCanopy !== true) return false;
  if (note.canopyAt) {
    const t = Date.parse(note.canopyAt);
    if (!Number.isNaN(t) && t > now.getTime()) return false;
  }
  return true;
}

/** Sort / display time for Canopy: scheduled go-live, else publish, else date. */
export function climbNoteCanopySortKey(
  note: Pick<ClimbNote, "canopyAt" | "publishedAt" | "date">,
): string {
  const raw = note.canopyAt || note.publishedAt || note.date || "1970-01-01";
  return String(raw).slice(0, 19);
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
  if (typeof value === "string") {
    const v = value.trim().toLowerCase() as ClimbNoteStatus;
    return STATUSES.includes(v) ? v : undefined;
  }
  return undefined;
}

function asBool(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    if (v === "true" || v === "yes" || v === "1") return true;
    if (v === "false" || v === "no" || v === "0") return false;
  }
  return undefined;
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
  frontmatterStatus: ClimbNoteStatus | undefined,
  frontmatterOnCanopy: boolean | undefined,
  frontmatterCanopyAt: string | undefined,
): ClimbNotePublishEntry & { status: ClimbNoteStatus } {
  const entry = publishRegistry.notes?.[id];
  const fromRegistry = asStatus(entry?.status);
  const status = fromRegistry ?? frontmatterStatus ?? "draft";
  const onCanopy =
    typeof entry?.onCanopy === "boolean"
      ? entry.onCanopy
      : frontmatterOnCanopy === true
        ? true
        : false;
  const canopyAt =
    entry?.canopyAt !== undefined
      ? entry.canopyAt
      : frontmatterCanopyAt ?? null;
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
    onCanopy,
    canopyAt,
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
  const frontmatterOnCanopy = asBool(data.onCanopy);
  const frontmatterCanopyAt =
    typeof data.canopyAt === "string" && data.canopyAt.length > 0
      ? data.canopyAt
      : undefined;
  const pub = resolvePublish(
    id,
    frontmatterStatus,
    frontmatterOnCanopy,
    frontmatterCanopyAt,
  );
  return {
    id,
    number: String(data.number ?? "").replace(/"/g, ""),
    title: String(data.title ?? "Untitled"),
    date: String(data.date ?? ""),
    problem: section(body, "Problem"),
    measure: section(body, "Measure"),
    slice: section(body, "Pitch") || section(body, "Slice"),
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
    onCanopy: pub.onCanopy,
    canopyAt: pub.canopyAt,
    xUrl,
    tags: tags?.length ? tags : undefined,
    sourceFile: path.split("/").pop(),
  };
}

export const climbNotes: ClimbNote[] = Object.entries(noteModules)
  .map(([path, raw]) => parseNote(path, raw))
  .filter((n): n is ClimbNote => n !== null)
  .sort((a, b) => {
    // Sole public SoT first
    if (a.id === "cn-016") return -1;
    if (b.id === "cn-016") return 1;
    const byNum = b.number.localeCompare(a.number);
    if (byNum !== 0) return byNum;
    return a.title.localeCompare(b.title);
  });

/** Notes visible on the public Climb Notes page and safe to cite on X. */
export const publishedClimbNotes: ClimbNote[] = climbNotes.filter((n) =>
  isPublicClimbNoteStatus(n.status),
);

/** Notes that should appear on the Canopy timeline right now. */
export const canopyClimbNotes: ClimbNote[] = climbNotes.filter((n) =>
  isClimbNoteOnCanopy(n),
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
  const detailUrl = climbNoteDetailUrl(note, siteOrigin);
  const oneLine =
    note.lesson.length > 160 ? `${note.lesson.slice(0, 157)}…` : note.lesson;
  return `Climb Note ${note.number} · ${note.title}

${oneLine}

Full Climb Note (detail):
${detailUrl}`;
}

/** Canonical public URL for the long-form Climb Note on the site. */
export function climbNoteDetailUrl(
  note: Pick<ClimbNote, "id">,
  siteOrigin = "https://acornsoft.ai",
): string {
  const base = siteOrigin.replace(/\/$/, "");
  return `${base}/climb-notes#${note.id}`;
}

/**
 * X compose / schedule intent — opens post box with text + direct link
 * to the detailed Climb Note. User can Post now or Schedule (Premium).
 * https://x.com/intent/post
 */
export function buildClimbNoteXComposeUrl(
  note: ClimbNote,
  siteOrigin = "https://acornsoft.ai",
): string {
  const detailUrl = climbNoteDetailUrl(note, siteOrigin);
  // Keep under ~280 with t.co link budget
  const title =
    note.title.length > 90 ? `${note.title.slice(0, 87)}…` : note.title;
  const lessonBit = (note.lesson || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
  const body = [
    `Climb Note ${note.number} · ${title}`,
    "",
    lessonBit ? `${lessonBit}${note.lesson && note.lesson.length > 100 ? "…" : ""}` : null,
    "",
    `Full Climb Note → ${detailUrl}`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const params = new URLSearchParams();
  params.set("text", body);
  return `https://x.com/intent/post?${params.toString()}`;
}

/** Prefer live post URL; otherwise X compose with site deep link. */
export function climbNoteXActionUrl(
  note: ClimbNote,
  siteOrigin = "https://acornsoft.ai",
): { href: string; label: string; kind: "live" | "compose" } {
  if (note.xUrl && /^https?:\/\//i.test(note.xUrl)) {
    return { href: note.xUrl, label: "Open on X", kind: "live" };
  }
  return {
    href: buildClimbNoteXComposeUrl(note, siteOrigin),
    label: "Schedule on X",
    kind: "compose",
  };
}
