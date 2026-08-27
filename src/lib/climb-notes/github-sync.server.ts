/**
 * Optional async pull of Climb Notes from the Gnomah GitHub vault.
 * Requires GITHUB_TOKEN / GH_TOKEN / GNOMAH_GITHUB_TOKEN for private repos
 * and higher rate limits. Public trees may work unauthenticated.
 *
 * Server-only.
 */
import type { ClimbNote } from "@/components/site/climb-notes-data";

const DEFAULT_REPO =
  process.env.GNOMAH_GITHUB_REPO?.trim() || "acornsoft/gnomah";
const DEFAULT_PATH =
  process.env.GNOMAH_CLIMB_NOTES_PATH?.trim() || "Climb-Notes";

export type GithubSyncResult = {
  ok: boolean;
  source: "github" | "local-only" | "skipped";
  repo: string;
  path: string;
  fetched: number;
  upserted: number;
  message: string;
};

function githubToken(): string | undefined {
  return (
    process.env.GNOMAH_GITHUB_TOKEN?.trim() ||
    process.env.GITHUB_TOKEN?.trim() ||
    process.env.GH_TOKEN?.trim() ||
    undefined
  );
}

function apiHeaders(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "acornsoft-gnomah-sync",
  };
  const token = githubToken();
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

type GhTreeItem = { path: string; type: string; sha: string; url: string };

function parseMdNote(
  filePath: string,
  raw: string,
): ClimbNote | null {
  // Lazy import-style parse inline (mirror store.server frontmatter)
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return null;
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
  const body = m[2].trim();
  const section = (heading: string) => {
    const re = new RegExp(
      `##\\s+${heading}\\s*\\r?\\n([\\s\\S]*?)(?=\\r?\\n##\\s+|$)`,
      "i",
    );
    const hit = body.match(re);
    return hit ? hit[1].trim() : "";
  };
  const id = String(data.id ?? "").trim();
  if (!id) return null;
  const base = filePath.split("/").pop() ?? filePath;
  const statusRaw = String(data.status ?? "draft").toLowerCase();
  const status = (
    ["draft", "pending", "approved", "published", "archived"] as const
  ).includes(statusRaw as "draft")
    ? (statusRaw as ClimbNote["status"])
    : "draft";
  return {
    id,
    number: String(data.number ?? "").replace(/"/g, ""),
    title: String(data.title ?? "Untitled"),
    date: String(data.date ?? ""),
    problem: section("Problem"),
    measure: section("Measure"),
    slice: section("Pitch") || section("Slice"),
    lesson: section("Lesson"),
    status,
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    xUrl:
      typeof data.xUrl === "string" && data.xUrl.length > 0
        ? data.xUrl
        : undefined,
    sourceFile: base,
  };
}

/**
 * Pull Climb Notes markdown from GitHub and return parsed notes.
 * Does not write DB — caller inserts.
 */
export async function fetchClimbNotesFromGithub(): Promise<{
  notes: ClimbNote[];
  meta: Omit<GithubSyncResult, "upserted" | "ok"> & { ok: boolean };
}> {
  const repo = DEFAULT_REPO;
  const rootPath = DEFAULT_PATH.replace(/^\/+|\/+$/g, "");
  const token = githubToken();

  try {
    // Resolve default branch tree via contents → recursive tree is heavier;
    // use git trees from repo default branch.
    const repoRes = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: apiHeaders(),
    });
    if (!repoRes.ok) {
      const msg = await repoRes.text();
      return {
        notes: [],
        meta: {
          ok: false,
          source: token ? "github" : "local-only",
          repo,
          path: rootPath,
          fetched: 0,
          message: `GitHub repo ${repoRes.status}: ${msg.slice(0, 160)}`,
        },
      };
    }
    const repoJson = (await repoRes.json()) as { default_branch?: string };
    const branch = repoJson.default_branch || "main";

    const treeRes = await fetch(
      `https://api.github.com/repos/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
      { headers: apiHeaders() },
    );
    if (!treeRes.ok) {
      const msg = await treeRes.text();
      return {
        notes: [],
        meta: {
          ok: false,
          source: "github",
          repo,
          path: rootPath,
          fetched: 0,
          message: `GitHub tree ${treeRes.status}: ${msg.slice(0, 160)}`,
        },
      };
    }
    const treeJson = (await treeRes.json()) as { tree?: GhTreeItem[] };
    const files = (treeJson.tree ?? []).filter(
      (t) =>
        t.type === "blob" &&
        t.path.startsWith(rootPath + "/") &&
        t.path.endsWith(".md") &&
        !t.path.includes("/templates/") &&
        !/\/README\.md$/i.test(t.path) &&
        !t.path.split("/").pop()?.startsWith("_"),
    );

    // Cap concurrent fetches
    const notes: ClimbNote[] = [];
    const batchSize = 8;
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const parts = await Promise.all(
        batch.map(async (f) => {
          const rawUrl = `https://raw.githubusercontent.com/${repo}/${branch}/${f.path}`;
          const r = await fetch(rawUrl, {
            headers: token
              ? { Authorization: `Bearer ${token}`, "User-Agent": "acornsoft" }
              : { "User-Agent": "acornsoft" },
          });
          if (!r.ok) return null;
          const text = await r.text();
          return parseMdNote(f.path, text);
        }),
      );
      for (const n of parts) if (n) notes.push(n);
    }

    return {
      notes,
      meta: {
        ok: true,
        source: "github",
        repo,
        path: rootPath,
        fetched: notes.length,
        message: `Pulled ${notes.length} Climb Notes from ${repo}/${rootPath}`,
      },
    };
  } catch (err) {
    return {
      notes: [],
      meta: {
        ok: false,
        source: token ? "github" : "local-only",
        repo,
        path: rootPath,
        fetched: 0,
        message: err instanceof Error ? err.message : "GitHub sync failed",
      },
    };
  }
}
