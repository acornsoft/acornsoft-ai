/**
 * Climb Notes — climbing logs.
 *
 * Source of truth: Markdown in /content/climb-notes (Obsidian-compatible).
 * Write in Obsidian → sync files here → site loads them.
 * X is optional short citation only.
 */

export type ClimbNote = {
  id: string;
  number: string;
  title: string;
  date: string;
  problem: string;
  measure: string;
  slice: string;
  lesson: string;
  xUrl?: string;
  tags?: string[];
  sourceFile?: string;
};

const noteModules = import.meta.glob("../../../content/climb-notes/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

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

function parseNote(path: string, raw: string): ClimbNote | null {
  if (/README\.md$/i.test(path)) return null;
  const { data, body } = parseFrontmatter(raw);
  const id = String(data.id ?? "").trim();
  if (!id) return null;
  const tags = Array.isArray(data.tags) ? data.tags : undefined;
  const xUrl =
    typeof data.xUrl === "string" && data.xUrl.length > 0
      ? data.xUrl
      : undefined;
  return {
    id,
    number: String(data.number ?? "").replace(/"/g, ""),
    title: String(data.title ?? "Untitled"),
    date: String(data.date ?? ""),
    problem: section(body, "Problem"),
    measure: section(body, "Measure"),
    slice: section(body, "Slice"),
    lesson: section(body, "Lesson"),
    xUrl,
    tags: tags?.length ? tags : undefined,
    sourceFile: path.split("/").pop(),
  };
}

export const climbNotes: ClimbNote[] = Object.entries(noteModules)
  .map(([path, raw]) => parseNote(path, raw))
  .filter((n): n is ClimbNote => n !== null)
  .sort((a, b) => b.number.localeCompare(a.number));

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
