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

function asStatus(v: string | null | undefined): ClimbNoteStatus {
  const s = (v ?? "draft").toLowerCase();
  return (STATUSES as string[]).includes(s) ? (s as ClimbNoteStatus) : "draft";
}

function parseJsonArray<T>(raw: string | null | undefined, fallback: T[]): T[] {
  if (!raw) return fallback;
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? (v as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function rowToNote(row: NoteRow): ClimbNote {
  return {
    id: row.id,
    number: row.number,
    title: row.title,
    date: row.note_date,
    problem: row.problem,
    measure: row.measure,
    slice: row.slice,
    lesson: row.lesson,
    status: asStatus(row.status),
    version: row.version ?? undefined,
    submittedAt: row.submitted_at,
    submittedBy: row.submitted_by,
    approvedAt: row.approved_at,
    approvedBy: row.approved_by,
    publishedAt: row.published_at,
    unpublishedAt: row.unpublished_at,
    approvalNote: row.approval_note,
    history: parseJsonArray<ClimbNotePublishHistory>(row.history, []),
    xUrl: row.x_url || undefined,
    tags: parseJsonArray<string>(row.tags, []),
    sourceFile: row.source_file || undefined,
  };
}

/** Overlay publish + Canopy fields from the registry (SoT for public gates). */
function withRegistryFields(
  note: ClimbNote,
  registry: Record<string, RegistryNote> = loadRegistry(),
): ClimbNote {
  const reg = registry[note.id];
  if (!reg) {
    return {
      ...note,
      onCanopy: note.onCanopy === true,
      canopyAt: note.canopyAt ?? null,
    };
  }
  const status = asStatus(reg.status ?? note.status);
  return {
    ...note,
    status,
    version: reg.version ?? note.version,
    submittedAt: reg.submittedAt ?? note.submittedAt ?? null,
    submittedBy: reg.submittedBy ?? note.submittedBy ?? null,
    approvedAt: reg.approvedAt ?? note.approvedAt ?? null,
    approvedBy: reg.approvedBy ?? note.approvedBy ?? null,
    publishedAt: reg.publishedAt ?? note.publishedAt ?? null,
    unpublishedAt: reg.unpublishedAt ?? note.unpublishedAt ?? null,
    approvalNote: reg.approvalNote ?? note.approvalNote ?? null,
    history: reg.history ?? note.history ?? [],
    onCanopy:
      typeof reg.onCanopy === "boolean"
        ? reg.onCanopy
        : note.onCanopy === true,
    canopyAt:
      reg.canopyAt !== undefined ? reg.canopyAt : (note.canopyAt ?? null),
  };
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

function loadRegistry(): Record<string, RegistryNote> {
  try {
    if (fs.existsSync(REGISTRY_PATH)) {
      return (
        (JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8")).notes ??
          {}) as Record<string, RegistryNote>
      );
    }
  } catch {
    /* fall through */
  }
  const bundled = Object.values(BUNDLED_REGISTRY)[0];
  if (bundled) {
    try {
      return (JSON.parse(bundled).notes ?? {}) as Record<string, RegistryNote>;
    } catch {
      return {};
    }
  }
  return {};
}

function asBool(v: unknown): boolean | undefined {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "true" || s === "yes" || s === "1") return true;
    if (s === "false" || s === "no" || s === "0") return false;
  }
  return undefined;
}

function noteFromMarkdown(
  file: string,
  raw: string,
  registry: Record<string, RegistryNote>,
): ClimbNote | null {
  const { data, body } = parseFrontmatter(raw);
  const id = String(data.id ?? "").trim();
  if (!id) return null;
  const reg = registry[id];
  const fmStatus = asStatus(String(data.status ?? "draft"));
  const status = asStatus(reg?.status ?? fmStatus);
  const tags = Array.isArray(data.tags) ? (data.tags as string[]) : [];
  const fmOnCanopy = asBool(data.onCanopy);
  const onCanopy =
    typeof reg?.onCanopy === "boolean"
      ? reg.onCanopy
      : fmOnCanopy === true
        ? true
        : false;
  const fmCanopyAt =
    typeof data.canopyAt === "string" && data.canopyAt.length > 0
      ? data.canopyAt
      : null;
  const canopyAt =
    reg?.canopyAt !== undefined ? reg.canopyAt : fmCanopyAt;
  return {
    id,
    number: String(data.number ?? "").replace(/"/g, ""),
    title: String(data.title ?? "Untitled"),
    date: String(data.date ?? ""),
    problem: section(body, "Problem"),
    measure: section(body, "Measure"),
    slice: section(body, "Pitch") || section(body, "Slice"),
    lesson: section(body, "Lesson"),
    status,
    version: reg?.version ?? 1,
    submittedAt: reg?.submittedAt ?? null,
    submittedBy: reg?.submittedBy ?? null,
    approvedAt: reg?.approvedAt ?? null,
    approvedBy: reg?.approvedBy ?? null,
    publishedAt: reg?.publishedAt ?? null,
    unpublishedAt: reg?.unpublishedAt ?? null,
    approvalNote: reg?.approvalNote ?? null,
    history: reg?.history ?? [],
    onCanopy,
    canopyAt,
    xUrl:
      typeof data.xUrl === "string" && data.xUrl.length > 0
        ? data.xUrl
        : undefined,
    tags,
    sourceFile: file,
  };
}

function readMarkdownSeeds(): ClimbNote[] {
  const registry = loadRegistry();
  const notes: ClimbNote[] = [];
  const seen = new Set<string>();

  const collectFile = (file: string, raw: string) => {
    const base = file.split(/[/\\]/).pop() ?? file;
    if (
      !base.endsWith(".md") ||
      base.toLowerCase() === "readme.md" ||
      base.startsWith("_") ||
      /templates[/\\]/i.test(file)
    ) {
      return;
    }
    const note = noteFromMarkdown(base, raw, registry);
    if (note && !seen.has(note.id)) {
      notes.push(note);
      seen.add(note.id);
    }
  };

  if (fs.existsSync(NOTES_DIR)) {
    try {
      const walk = (dir: string) => {
        for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, ent.name);
          if (ent.isDirectory()) {
            if (ent.name === "templates" || ent.name.startsWith(".")) continue;
            walk(full);
          } else if (ent.isFile() && ent.name.endsWith(".md")) {
            collectFile(full, fs.readFileSync(full, "utf8"));
          }
        }
      };
      walk(NOTES_DIR);
    } catch {
      /* bundled fallback */
    }
  }

  for (const [globPath, raw] of Object.entries(BUNDLED_NOTE_MD)) {
    collectFile(globPath, raw);
  }

  return notes.sort((a, b) => a.number.localeCompare(b.number));
}

async function upsertNoteRow(note: ClimbNote, ownerUserId?: string | null) {
  const sql = await getSql();
  await sql`
    insert into climb_notes (
      id, number, title, note_date, status,
      problem, measure, slice, lesson,
      tags, x_url, version,
      submitted_at, submitted_by, approved_at, approved_by,
      published_at, unpublished_at, approval_note, history,
      source_file, owner_user_id, updated_at
    ) values (
      ${note.id},
      ${note.number},
      ${note.title},
      ${note.date},
      ${note.status},
      ${note.problem},
      ${note.measure},
      ${note.slice},
      ${note.lesson},
      ${JSON.stringify(note.tags ?? [])},
      ${note.xUrl ?? null},
      ${note.version ?? 1},
      ${note.submittedAt ?? null},
      ${note.submittedBy ?? null},
      ${note.approvedAt ?? null},
      ${note.approvedBy ?? null},
      ${note.publishedAt ?? null},
      ${note.unpublishedAt ?? null},
      ${note.approvalNote ?? null},
      ${JSON.stringify(note.history ?? [])},
      ${note.sourceFile ?? null},
      ${ownerUserId ?? null},
      now()
    )
    on conflict (id) do update set
      number = excluded.number,
      title = excluded.title,
      note_date = excluded.note_date,
      status = excluded.status,
      problem = excluded.problem,
      measure = excluded.measure,
      slice = excluded.slice,
      lesson = excluded.lesson,
      tags = excluded.tags,
      x_url = excluded.x_url,
      version = excluded.version,
      submitted_at = excluded.submitted_at,
      submitted_by = excluded.submitted_by,
      approved_at = excluded.approved_at,
      approved_by = excluded.approved_by,
      published_at = excluded.published_at,
      unpublished_at = excluded.unpublished_at,
      approval_note = excluded.approval_note,
      history = excluded.history,
      source_file = excluded.source_file,
      owner_user_id = coalesce(excluded.owner_user_id, climb_notes.owner_user_id),
      updated_at = now()
  `;
}

/** Insert seed only if missing — never clobber editor state. */
async function insertNoteRowIfMissing(note: ClimbNote) {
  const sql = await getSql();
  await sql`
    insert into climb_notes (
      id, number, title, note_date, status,
      problem, measure, slice, lesson,
      tags, x_url, version,
      submitted_at, submitted_by, approved_at, approved_by,
      published_at, unpublished_at, approval_note, history,
      source_file, owner_user_id, updated_at
    ) values (
      ${note.id},
      ${note.number},
      ${note.title},
      ${note.date},
      ${note.status},
      ${note.problem},
      ${note.measure},
      ${note.slice},
      ${note.lesson},
      ${JSON.stringify(note.tags ?? [])},
      ${note.xUrl ?? null},
      ${note.version ?? 1},
      ${note.submittedAt ?? null},
      ${note.submittedBy ?? null},
      ${note.approvedAt ?? null},
      ${note.approvedBy ?? null},
      ${note.publishedAt ?? null},
      ${note.unpublishedAt ?? null},
      ${note.approvalNote ?? null},
      ${JSON.stringify(note.history ?? [])},
      ${note.sourceFile ?? null},
      ${null},
      now()
    )
    on conflict (id) do nothing
  `;
}

export async function ensureClimbNotesSeeded(): Promise<void> {
  const seeds = readMarkdownSeeds();
  if (seeds.length === 0) {
    console.warn(
      "[climb-notes] no markdown seeds found under content/climb-notes",
    );
    return;
  }
  for (const note of seeds) {
    try {
      await insertNoteRowIfMissing(note);
    } catch (err) {
      console.warn(`[climb-notes] seed insert failed for ${note.id}`, err);
    }
  }
  // Refresh listed notes' body fields from vault (000 origin / cn-016; 017 draft example)
  await refreshDraftSeedBodies(seeds, ["cn-016", "cn-017"]).catch(() => {});
}

/** Update body fields for listed IDs from current markdown seeds (content sync). */
async function refreshDraftSeedBodies(
  seeds: ClimbNote[],
  ids: string[],
): Promise<void> {
  const sql = await getSql();
  const want = new Set(ids);
  for (const note of seeds) {
    if (!want.has(note.id)) continue;
    // Always pull number + title + four moves from vault for these SoT / example notes
    await sql`
      update climb_notes set
        number = ${note.number},
        title = ${note.title},
        note_date = ${note.date},
        problem = ${note.problem},
        measure = ${note.measure},
        slice = ${note.slice},
        lesson = ${note.lesson},
        tags = ${JSON.stringify(note.tags ?? [])},
        source_file = ${note.sourceFile ?? null},
        updated_at = now()
      where id = ${note.id}
    `;
  }
}


export type LibrarySyncResult = {
  localSeeded: number;
  githubFetched: number;
  githubInserted: number;
  total: number;
  source: string;
  message: string;
};

/**
 * Async library refresh:
 * 1) re-scan local vault (content/climb-notes) — insert missing only
 * 2) optional GitHub Gnomah pull — insert missing only (never overwrite edits)
 */
export async function syncClimbNotesLibrary(): Promise<LibrarySyncResult> {
  await ensureClimbNotesSeeded();
  const local = readMarkdownSeeds();
  let githubFetched = 0;
  let githubInserted = 0;
  let source = "local vault";
  let message = `Local vault: ${local.length} seed files`;

  try {
    const { fetchClimbNotesFromGithub } = await import("./github-sync.server");
    const { notes, meta } = await fetchClimbNotesFromGithub();
    githubFetched = notes.length;
    if (meta.ok && notes.length) {
      source = `local + ${meta.repo}`;
      for (const note of notes) {
        try {
          await insertNoteRowIfMissing(note);
          githubInserted += 1; // counts attempts; conflict no-ops
        } catch {
          /* skip */
        }
      }
      // recount inserted roughly: not exact on conflict; message uses fetched
      message = `${meta.message}; local seeds ${local.length}`;
    } else if (!meta.ok) {
      message = `${message}. GitHub: ${meta.message}`;
    }
  } catch (err) {
    message = `${message}. GitHub skip: ${err instanceof Error ? err.message : "error"}`;
  }

  const all = await listClimbNotesFromDb();
  return {
    localSeeded: local.length,
    githubFetched,
    githubInserted,
    total: all.length,
    source,
    message,
  };
}

export async function listClimbNotesFromDb(opts?: {
  publishedOnly?: boolean;
}): Promise<ClimbNote[]> {
  await ensureClimbNotesSeeded();
  const sortNotes = (list: ClimbNote[]) =>
    [...list].sort((a, b) => {
      // Only public SoT first when present
      if (a.id === "cn-016") return -1;
      if (b.id === "cn-016") return 1;
      const byNum = b.number.localeCompare(a.number);
      if (byNum !== 0) return byNum;
      return a.title.localeCompare(b.title);
    });

  try {
    const sql = await getSql();
    // Load all rows; registry status is SoT for public gate (DB can lag after unpublish)
    const rows = await sql<NoteRow>`
      select * from climb_notes
      order by number desc
    `;
    if (rows.length > 0) {
      const registry = loadRegistry();
      let list = rows.map((r) => withRegistryFields(rowToNote(r), registry));
      // Best-effort: push registry status into DB so next SQL stays consistent
      await syncDbStatusFromRegistry(list, registry).catch(() => {});
      if (opts?.publishedOnly) {
        list = list.filter((n) => n.status === "published");
      }
      return sortNotes(list);
    }
  } catch (err) {
    console.warn("[climb-notes] DB list failed, falling back to markdown", err);
  }
  const seeds = readMarkdownSeeds();
  if (opts?.publishedOnly) {
    return sortNotes(seeds.filter((n) => n.status === "published"));
  }
  return sortNotes(seeds);
}

/** Align DB status/publish columns with registry when they diverge. */
async function syncDbStatusFromRegistry(
  _notes: ClimbNote[],
  registry: Record<string, RegistryNote>,
): Promise<void> {
  const sql = await getSql();
  for (const [id, reg] of Object.entries(registry)) {
    if (!reg?.status) continue;
    const want = asStatus(reg.status);
    await sql`
      update climb_notes set
        status = ${want},
        published_at = ${reg.publishedAt ?? null},
        unpublished_at = ${reg.unpublishedAt ?? null},
        updated_at = now()
      where id = ${id}
        and status is distinct from ${want}
    `;
  }
}

async function getClimbNoteFromDb(id: string): Promise<ClimbNote | null> {
  await ensureClimbNotesSeeded();
  const sql = await getSql();
  const rows = await sql<NoteRow>`
    select * from climb_notes where id = ${id} limit 1
  `;
  return rows[0] ? withRegistryFields(rowToNote(rows[0])) : null;
}

function toMarkdown(note: ClimbNote): string {
  const tags = (note.tags ?? []).map((t) => `  - ${t}`).join("\n");
  const safeTitle = note.title.includes(":")
    ? JSON.stringify(note.title)
    : note.title;
  const canopyAtLine =
    note.canopyAt && String(note.canopyAt).length > 0
      ? `canopyAt: ${note.canopyAt}\n`
      : "";
  return `---
id: ${note.id}
number: "${note.number}"
title: ${safeTitle}
date: ${note.date}
status: ${note.status}
onCanopy: ${note.onCanopy === true}
${canopyAtLine}tags:
${tags || "  - climb-note"}
xUrl: ${note.xUrl ?? ""}
---

## Problem

${note.problem}

## Measure

${note.measure}

## Pitch

${note.slice}

## Lesson

${note.lesson}
`;
}

function writeMarkdownMirror(note: ClimbNote): string | null {
  try {
    fs.mkdirSync(NOTES_DIR, { recursive: true });
    const safeTitle = note.title
      .replace(/[^\w\s-]+/g, "")
      .trim()
      .replace(/\s+/g, " ");
    const fileName =
      note.sourceFile ||
      `${note.number} ${safeTitle || "Climb Note"}.md`;
    const dest = path.isAbsolute(fileName)
      ? fileName
      : path.join(NOTES_DIR, fileName);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(
      dest,
      toMarkdown({
        ...note,
        sourceFile: fileName,
      }),
    );
    return fileName;
  } catch {
    return note.sourceFile ?? null;
  }
}

function writeRegistryFromDbNotes(notes: ClimbNote[]) {
  try {
    const prev = loadRegistry();
    const notesMap: Record<string, RegistryNote> = {};
    for (const n of notes) {
      const prior = prev[n.id];
      notesMap[n.id] = {
        status: n.status,
        version: n.version ?? 1,
        submittedAt: n.submittedAt ?? null,
        submittedBy: n.submittedBy ?? null,
        approvedAt: n.approvedAt ?? null,
        approvedBy: n.approvedBy ?? null,
        publishedAt: n.publishedAt ?? null,
        unpublishedAt: n.unpublishedAt ?? null,
        approvalNote: n.approvalNote ?? null,
        history: n.history ?? [],
        onCanopy:
          typeof n.onCanopy === "boolean"
            ? n.onCanopy
            : (prior?.onCanopy ?? false),
        canopyAt:
          n.canopyAt !== undefined
            ? n.canopyAt
            : (prior?.canopyAt ?? null),
      };
    }
    const payload = {
      version: 1,
      description:
        "SharePoint-style publish control for Climb Notes. status=journal; onCanopy+canopyAt=Canopy timeline. Managed by Gnomah editor and CLI.",
      notes: notesMap,
    };
    fs.mkdirSync(NOTES_DIR, { recursive: true });
    fs.writeFileSync(REGISTRY_PATH, JSON.stringify(payload, null, 2) + "\n");
  } catch {
    /* read-only host */
  }
}

export type SaveClimbNoteInput = {
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

export async function saveClimbNote(
  input: SaveClimbNoteInput,
  ownerUserId: string,
  actorHandle: string,
): Promise<ClimbNote> {
  await ensureClimbNotesSeeded();
  const id = (
    input.id?.trim() ||
    `cn-${String(input.number).replace(/\D/g, "").padStart(3, "0")}`
  ).toLowerCase();
  const existing = await getClimbNoteFromDb(id);
  const prevStatus = existing?.status ?? "draft";
  const status = asStatus(input.status ?? prevStatus);
  let version = existing?.version ?? 1;
  const at = new Date().toISOString();
  const sourceFile =
    existing?.sourceFile ||
    `${String(input.number).replace(/\D/g, "").padStart(3, "0")} ${input.title.trim() || "Climb Note"}.md`;

  let submittedAt = existing?.submittedAt ?? null;
  let submittedBy = existing?.submittedBy ?? null;
  let approvedAt = existing?.approvedAt ?? null;
  let approvedBy = existing?.approvedBy ?? null;
  let publishedAt = existing?.publishedAt ?? null;
  let unpublishedAt = existing?.unpublishedAt ?? null;
  let approvalNote = existing?.approvalNote ?? null;

  // Direct state jumps
  if (status === "pending" && prevStatus !== "pending") {
    submittedAt = at;
    submittedBy = actorHandle;
  }
  if (status === "approved" || status === "published") {
    if (!approvedAt || prevStatus === "draft" || prevStatus === "pending") {
      approvedAt = at;
      approvedBy = actorHandle;
    }
  }
  if (status === "published") {
    if (prevStatus !== "published") {
      publishedAt = at;
      unpublishedAt = null;
      version = version + 1;
      if (!approvedAt) {
        approvedAt = at;
        approvedBy = actorHandle;
      }
    }
  }
  // Unapproved / unpublish / leave published
  if (status === "draft" && prevStatus !== "draft") {
    unpublishedAt = prevStatus === "published" ? at : unpublishedAt;
    if (prevStatus === "approved" || prevStatus === "published") {
      // keep audit timestamps; status alone marks unapproved
    }
  }
  if (status === "archived" && prevStatus === "published") {
    unpublishedAt = unpublishedAt ?? at;
  }

  const history: ClimbNotePublishHistory[] = [
    ...(existing?.history ?? []),
    {
      at,
      action:
        prevStatus !== status
          ? `set:${status}`
          : existing
            ? "save"
            : "create",
      by: actorHandle,
      note:
        prevStatus !== status
          ? `State → ${status} (was ${prevStatus})`
          : undefined,
    },
  ];

  const onCanopy =
    typeof input.onCanopy === "boolean"
      ? input.onCanopy
      : existing?.onCanopy === true;
  let canopyAt: string | null =
    input.canopyAt !== undefined
      ? input.canopyAt
      : (existing?.canopyAt ?? null);
  // Opting into Canopy with no schedule → go live now
  if (onCanopy && !canopyAt) {
    canopyAt = at;
  }
  // Opting out clears schedule
  if (!onCanopy) {
    canopyAt = null;
  }

  const note: ClimbNote = {
    id,
    number:
      String(input.number).replace(/\D/g, "").padStart(3, "0") || "000",
    title: input.title.trim() || "Untitled",
    date: input.date || new Date().toISOString().slice(0, 10),
    problem: input.problem ?? "",
    measure: input.measure ?? "",
    slice: input.slice ?? "",
    lesson: input.lesson ?? "",
    status,
    version,
    submittedAt,
    submittedBy,
    approvedAt,
    approvedBy,
    publishedAt,
    unpublishedAt,
    approvalNote,
    history,
    onCanopy,
    canopyAt,
    xUrl: input.xUrl || undefined,
    tags: input.tags?.length
      ? input.tags
      : existing?.tags ?? ["climb-note"],
    sourceFile,
  };
  await upsertNoteRow(note, ownerUserId || null);
  const fileName = writeMarkdownMirror(note);
  if (fileName) {
    note.sourceFile = fileName;
    const sql = await getSql();
    await sql`
      update climb_notes set source_file = ${fileName} where id = ${note.id}
    `;
  }
  // Prefer this note's canopy fields when rewriting the registry
  const all = (await listClimbNotesFromDb()).map((n) =>
    n.id === note.id
      ? { ...n, onCanopy: note.onCanopy, canopyAt: note.canopyAt }
      : n,
  );
  writeRegistryFromDbNotes(all);
  return (await getClimbNoteFromDb(note.id)) ?? note;
}

export async function setClimbNoteStatus(
  id: string,
  status: ClimbNoteStatus,
  actorHandle: string,
): Promise<ClimbNote> {
  const existing = await getClimbNoteFromDb(id);
  if (!existing) throw new Error(`Climb Note ${id} not found`);
  return saveClimbNote(
    {
      id: existing.id,
      number: existing.number,
      title: existing.title,
      date: existing.date,
      status,
      problem: existing.problem,
      measure: existing.measure,
      slice: existing.slice,
      lesson: existing.lesson,
      tags: existing.tags,
      xUrl: existing.xUrl ?? null,
      onCanopy: existing.onCanopy === true,
      canopyAt: existing.canopyAt ?? null,
    },
    "",
    actorHandle,
  );
}

const TRANSITION_TARGET: Record<string, ClimbNoteStatus> = {
  submit: "pending",
  approve: "approved",
  reject: "draft",
  publish: "published",
  unpublish: "draft",
  archive: "archived",
  restore: "draft",
};

export async function transitionClimbNote(
  id: string,
  action: string,
  actorHandle: string,
  _noteText?: string,
): Promise<ClimbNote> {
  await ensureClimbNotesSeeded();
  const next = TRANSITION_TARGET[action];
  if (!next) throw new Error(`Unknown action: ${action}`);
  return setClimbNoteStatus(id, next, actorHandle);
}

export async function deleteClimbNote(id: string): Promise<void> {
  const sql = await getSql();
  const existing = await getClimbNoteFromDb(id);
  await sql`delete from climb_notes where id = ${id}`;
  if (existing?.sourceFile) {
    try {
      const p = path.join(NOTES_DIR, existing.sourceFile);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    } catch {
      /* ignore */
    }
  }
  writeRegistryFromDbNotes(await listClimbNotesFromDb());
}
