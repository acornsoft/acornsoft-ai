#!/usr/bin/env node
/**
 * Re-sync Climb Note titles and bodies from content/climb-notes markdown.
 *
 * The seed insert is ON CONFLICT DO NOTHING, so a database that was filled
 * before the public-copy cleanup keeps the old sentences (for example
 * "Capture the climb in Gnomah" and the CN-011 title
 * "Abstract Gnomah → ADO work-item projection").
 *
 * This script updates title, problem, measure, slice, and lesson from the
 * current markdown ONLY when that row still contains "Gnomah" and the text
 * differs from source. It does not write status, publish timestamps,
 * approval fields, history, tags, or source_file. Running it twice updates
 * zero rows the second time.
 *
 * It is intentionally NOT a file under migrations/. Those apply on every
 * deploy. David runs this by hand against the database he means to update.
 *
 * How David runs it
 * -----------------
 * Local preview file (PGLite), from the repo root:
 *   node scripts/resync-climb-note-copy.mjs --pglite data/pglite
 *   npm run climb-notes:resync-copy -- --pglite data/pglite
 *
 * A Postgres URL he chooses (prints the host, never the password):
 *   node scripts/resync-climb-note-copy.mjs --postgres "$DATABASE_URL"
 *
 * Throwaway proof (does not touch data/pglite or any DATABASE_URL):
 *   node scripts/resync-climb-note-copy.mjs --self-test
 *
 * Refuses to run with no target, so a shell that happens to have
 * DATABASE_URL set cannot write that database by accident.
 */
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const notesDir = join(root, "content", "climb-notes");
const STALE = /gnomah/i;
const OLD_WAYPOINT = "Capture the climb in Gnomah";
const OLD_CN011_TITLE = "Abstract Gnomah → ADO work-item projection";

function section(body, heading) {
  const re = new RegExp(
    `##\\s+${heading}\\s*\\r?\\n([\\s\\S]*?)(?=\\r?\\n##\\s+|$)`,
    "i",
  );
  const hit = body.match(re);
  return hit ? hit[1].trim() : "";
}

function unquote(value) {
  const v = value.trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    return v.slice(1, -1);
  }
  return v;
}

function parseNote(file, raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return null;
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) continue;
    data[kv[1]] = unquote(kv[2]);
  }
  const id = (data.id ?? "").trim();
  if (!id) return null;
  const body = m[2];
  return {
    file,
    id,
    title: data.title || "Untitled",
    problem: section(body, "Base Camp") || section(body, "Problem"),
    measure: section(body, "Route") || section(body, "Measure"),
    slice:
      section(body, "Waypoint") ||
      section(body, "Pitch") ||
      section(body, "Slice"),
    lesson: section(body, "Summit") || section(body, "Lesson"),
  };
}

function isNested(file) {
  return /(?:^|[/\\])(product|foundation|engagement)[/\\]/.test(file);
}

async function walk(dir) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "templates") continue;
      out.push(...(await walk(path)));
      continue;
    }
    if (!entry.name.endsWith(".md")) continue;
    const base = entry.name.toLowerCase();
    if (base === "readme.md" || base.startsWith("_")) continue;
    out.push(path);
  }
  return out;
}

export async function loadSourceNotes() {
  const byId = new Map();
  for (const file of await walk(notesDir)) {
    const raw = await readFile(file, "utf8");
    const note = parseNote(file, raw);
    if (!note) continue;
    const existing = byId.get(note.id);
    if (!existing || (isNested(file) && !isNested(existing.file))) {
      byId.set(note.id, note);
    }
  }
  return byId;
}

function rowStale(row) {
  return [row.title, row.problem, row.measure, row.slice, row.lesson].some(
    (value) => STALE.test(String(value ?? "")),
  );
}

function rowDiffers(row, source) {
  return (
    row.title !== source.title ||
    row.problem !== source.problem ||
    row.measure !== source.measure ||
    row.slice !== source.slice ||
    row.lesson !== source.lesson
  );
}

/**
 * @param {(text: string, params?: unknown[]) => Promise<Record<string, unknown>[]>} query
 */
export async function resyncCopy(query, source) {
  const rows = await query(
    `select id, title, problem, measure, slice, lesson, status, history
     from climb_notes`,
  );
  let updated = 0;
  let skippedNoSource = 0;
  for (const row of rows) {
    if (!rowStale(row)) continue;
    const note = source.get(String(row.id));
    if (!note) {
      skippedNoSource += 1;
      continue;
    }
    if (!rowDiffers(row, note)) continue;
    await query(
      `update climb_notes
       set title = $2,
           problem = $3,
           measure = $4,
           slice = $5,
           lesson = $6,
           updated_at = now()
       where id = $1`,
      [row.id, note.title, note.problem, note.measure, note.slice, note.lesson],
    );
    updated += 1;
  }
  return { scanned: rows.length, updated, skippedNoSource };
}

async function countWhere(query, sql) {
  const rows = await query(sql);
  const n = rows[0]?.n ?? rows[0]?.count ?? 0;
  return Number(n);
}

const COUNT_GNOMAH = `
  select count(*)::int as n from climb_notes
  where title ~* 'gnomah'
     or problem ~* 'gnomah'
     or measure ~* 'gnomah'
     or slice ~* 'gnomah'
     or lesson ~* 'gnomah'
`;

async function snapshotFixed(query) {
  const gnomahRows = await countWhere(query, COUNT_GNOMAH);
  const waypointRows = await query(
    `select count(*)::int as n from climb_notes where slice ilike $1`,
    [`%${OLD_WAYPOINT}%`],
  );
  const titleRows = await query(
    `select count(*)::int as n from climb_notes where title = $1`,
    [OLD_CN011_TITLE],
  );
  const cn = await query(
    `select title, status, history from climb_notes where id = 'cn-011'`,
  );
  const control = await query(
    `select title, status, history from climb_notes where id = 'cn-016'`,
  );
  const parseHistory = (value) => {
    if (value == null) return [];
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? parsed : [];
  };
  return {
    gnomahRows,
    oldWaypoint: Number(waypointRows[0]?.n ?? 0),
    oldCn011Title: Number(titleRows[0]?.n ?? 0),
    cn011: cn[0]
      ? {
          status: String(cn[0].status),
          history: parseHistory(cn[0].history),
          titleHasGnomah: STALE.test(String(cn[0].title)),
        }
      : null,
    control: control[0]
      ? {
          title: String(control[0].title),
          status: String(control[0].status),
          history: parseHistory(control[0].history),
        }
      : null,
  };
}

function printSnapshot(label, snap) {
  console.log(
    `[resync-copy] ${label} gnomah_rows=${snap.gnomahRows} old_waypoint=${snap.oldWaypoint} old_cn011_title=${snap.oldCn011Title}`,
  );
  if (snap.cn011) {
    console.log(
      `[resync-copy] ${label} cn-011 status=${snap.cn011.status} history_len=${snap.cn011.history.length} title_has_gnomah=${snap.cn011.titleHasGnomah}`,
    );
  }
  if (snap.control) {
    console.log(
      `[resync-copy] ${label} cn-016 status=${snap.control.status} history_len=${snap.control.history.length} title=${JSON.stringify(snap.control.title)}`,
    );
  }
}

const CLIMB_NOTES_DDL = `
create table if not exists climb_notes (
  id text primary key,
  number text not null,
  title text not null,
  note_date text not null default '',
  status text not null default 'draft',
  problem text not null default '',
  measure text not null default '',
  slice text not null default '',
  lesson text not null default '',
  tags text not null default '[]',
  x_url text,
  version integer not null default 1,
  submitted_at timestamptz,
  submitted_by text,
  approved_at timestamptz,
  approved_by text,
  published_at timestamptz,
  unpublished_at timestamptz,
  approval_note text,
  history text not null default '[]',
  source_file text,
  owner_user_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
)`;

async function selfTest() {
  const { PGlite } = await import("@electric-sql/pglite");
  const dir = await mkdtemp(join(tmpdir(), "climb-resync-"));
  const db = new PGlite(dir);
  await db.waitReady;
  const query = async (text, params = []) => {
    const result = await db.query(text, params);
    return result.rows;
  };
  try {
    await db.exec(CLIMB_NOTES_DDL);
    const source = await loadSourceNotes();
    const studioNotes = [...source.values()].filter((note) =>
      note.slice.includes("Capture the climb in the studio"),
    );
    const cn011 = studioNotes.find((note) => note.id === "cn-011");
    if (!cn011) {
      throw new Error("cn-011 missing from the studio-waypoint source set");
    }
    const seeded = [cn011];
    for (const note of studioNotes) {
      if (seeded.length >= 33) break;
      if (note.id === "cn-011") continue;
      seeded.push(note);
    }
    if (seeded.length !== 33) {
      throw new Error(
        `expected 33 source notes with the studio waypoint, found ${studioNotes.length}`,
      );
    }
    const history = JSON.stringify([
      { at: "2026-01-01T00:00:00.000Z", action: "publish", by: "owner-test" },
    ]);
    for (const note of seeded) {
      const title =
        note.id === "cn-011" ? OLD_CN011_TITLE : note.title;
      const status = note.id === "cn-011" ? "published" : "draft";
      await query(
        `insert into climb_notes
          (id, number, title, status, problem, measure, slice, lesson, history, published_at)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, case when $4 = 'published' then now() else null end)`,
        [
          note.id,
          note.id.replace(/^cn-/, ""),
          title,
          status,
          note.problem,
          note.measure,
          `${OLD_WAYPOINT}. Promote through draft to published only when the public journal should show it.`,
          note.lesson,
          note.id === "cn-011" ? history : "[]",
        ],
      );
    }
    await query(
      `insert into climb_notes
        (id, number, title, status, problem, measure, slice, lesson, history, published_at)
       values ('cn-016', '016', 'KEEP THIS TITLE', 'published', 'custom problem', 'custom route', 'custom waypoint', 'custom summit', $1, now())`,
      [history],
    );

    const before = await snapshotFixed(query);
    printSnapshot("before", before);
    const first = await resyncCopy(query, source);
    console.log(
      `[resync-copy] first updated=${first.updated} skipped_no_source=${first.skippedNoSource}`,
    );
    const after = await snapshotFixed(query);
    printSnapshot("after", after);
    const second = await resyncCopy(query, source);
    console.log(`[resync-copy] second updated=${second.updated}`);

    const failures = [];
    if (before.gnomahRows !== 33) failures.push(`before gnomah_rows ${before.gnomahRows}`);
    if (before.oldWaypoint !== 33) failures.push(`before old_waypoint ${before.oldWaypoint}`);
    if (before.oldCn011Title !== 1) failures.push(`before old title ${before.oldCn011Title}`);
    if (before.cn011?.status !== "published" || before.cn011.history.length !== 1) {
      failures.push("before cn-011 publish/history");
    }
    if (first.updated !== 33) failures.push(`first updated ${first.updated}`);
    if (after.gnomahRows !== 0 || after.oldWaypoint !== 0 || after.oldCn011Title !== 0) {
      failures.push(
        `after counts gnomah=${after.gnomahRows} waypoint=${after.oldWaypoint} title=${after.oldCn011Title}`,
      );
    }
    if (after.cn011?.status !== "published" || after.cn011.history.length !== 1) {
      failures.push("cn-011 publish state or history changed");
    }
    if (after.cn011?.titleHasGnomah) failures.push("cn-011 title still has Gnomah");
    if (
      after.control?.title !== "KEEP THIS TITLE" ||
      after.control.status !== "published" ||
      after.control.history.length !== 1
    ) {
      failures.push("control note was touched");
    }
    if (second.updated !== 0) failures.push(`second updated ${second.updated}`);
    if (failures.length) {
      throw new Error(failures.join("; "));
    }
    console.log("[resync-copy] self-test ok");
  } finally {
    await db.close();
    await rm(dir, { recursive: true, force: true });
  }
}

function postgresHost(url) {
  try {
    const parsed = new URL(url);
    return parsed.host;
  } catch {
    return "(unparsed)";
  }
}

async function withPglite(dir, fn) {
  const { PGlite } = await import("@electric-sql/pglite");
  const db = new PGlite(dir);
  await db.waitReady;
  const query = async (text, params = []) => (await db.query(text, params)).rows;
  try {
    await fn(query);
  } finally {
    await db.close();
  }
}

async function withPostgres(connectionString, fn) {
  const pg = (await import("pg")).default;
  const pool = new pg.Pool({ connectionString, max: 1 });
  const query = async (text, params = []) => (await pool.query(text, params)).rows;
  try {
    await fn(query);
  } finally {
    await pool.end();
  }
}

function argValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  const value = process.argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${flag} needs a value`);
  }
  return value;
}

async function main() {
  if (process.argv.includes("--self-test")) {
    await selfTest();
    return;
  }
  const pgliteDir = argValue("--pglite");
  const postgresUrl = argValue("--postgres");
  if (pgliteDir && postgresUrl) {
    throw new Error("Pass either --pglite or --postgres, not both.");
  }
  if (!pgliteDir && !postgresUrl) {
    console.error(
      "[resync-copy] Refusing to run without a target.\n" +
        "  node scripts/resync-climb-note-copy.mjs --pglite data/pglite\n" +
        "  node scripts/resync-climb-note-copy.mjs --postgres \"$DATABASE_URL\"\n" +
        "  node scripts/resync-climb-note-copy.mjs --self-test",
    );
    process.exit(1);
  }
  const source = await loadSourceNotes();
  const run = async (query) => {
    const before = await snapshotFixed(query);
    printSnapshot("before", before);
    const result = await resyncCopy(query, source);
    console.log(
      `[resync-copy] updated=${result.updated} skipped_no_source=${result.skippedNoSource} scanned=${result.scanned}`,
    );
    const after = await snapshotFixed(query);
    printSnapshot("after", after);
  };
  if (pgliteDir) {
    console.log(`[resync-copy] pglite ${pgliteDir}`);
    await withPglite(pgliteDir, run);
    return;
  }
  console.log(`[resync-copy] postgres host ${postgresHost(postgresUrl)}`);
  await withPostgres(postgresUrl, run);
}

const isDirect = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirect) {
  main().catch((err) => {
    console.error("[resync-copy] failed:", err?.message || err);
    process.exit(1);
  });
}
