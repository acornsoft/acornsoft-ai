#!/usr/bin/env node
/**
 * Climb Notes publish control (SharePoint-style lifecycle).
 *
 * Lifecycle:
 *   draft → submit → pending → approve → approved → publish → published
 *   published → unpublish → draft
 *   any → archive → archived
 *   archived → restore → draft
 *
 * Registry file is the site gate (pull in / pull out without deleting Markdown).
 * Frontmatter status is kept in sync when the note file is found.
 *
 * Usage:
 *   node scripts/climb-notes-publish.mjs list
 *   node scripts/climb-notes-publish.mjs status cn-001
 *   node scripts/climb-notes-publish.mjs submit cn-001 [--by name] [--note "..."]
 *   node scripts/climb-notes-publish.mjs approve cn-001 [--by name] [--note "..."]
 *   node scripts/climb-notes-publish.mjs reject cn-001 [--by name] [--note "..."]
 *   node scripts/climb-notes-publish.mjs publish cn-001 [--by name] [--note "..."]
 *   node scripts/climb-notes-publish.mjs unpublish cn-001 [--by name] [--note "..."]
 *   node scripts/climb-notes-publish.mjs archive cn-001 [--by name] [--note "..."]
 *   node scripts/climb-notes-publish.mjs restore cn-001 [--by name] [--note "..."]
 *   node scripts/climb-notes-publish.mjs set cn-001 published [--by name]
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const NOTES_DIR = path.join(ROOT, "content", "climb-notes");
const REGISTRY_PATH = path.join(NOTES_DIR, "_publish-registry.json");

const STATUSES = ["draft", "pending", "approved", "published", "archived"];
const PUBLIC = new Set(["published"]);

const TRANSITIONS = {
  submit: { from: ["draft", "approved"], to: "pending" },
  approve: { from: ["pending"], to: "approved" },
  reject: { from: ["pending", "approved"], to: "draft" },
  publish: { from: ["approved", "draft", "pending", "published"], to: "published" },
  unpublish: { from: ["published"], to: "draft" },
  archive: { from: ["draft", "pending", "approved", "published"], to: "archived" },
  restore: { from: ["archived"], to: "draft" },
};

function nowIso() {
  return new Date().toISOString();
}

function emptyRegistry() {
  return {
    version: 1,
    description:
      "SharePoint-style publish control for Climb Notes. Registry status wins over frontmatter. Public site shows only published. Studio view shows every note.",
    notes: {},
  };
}

function loadRegistry() {
  if (!fs.existsSync(REGISTRY_PATH)) return emptyRegistry();
  try {
    return JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
  } catch (e) {
    console.error("Invalid _publish-registry.json:", e.message);
    process.exit(1);
  }
}

function saveRegistry(reg) {
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(reg, null, 2) + "\n");
}

function listNoteFiles() {
  if (!fs.existsSync(NOTES_DIR)) return [];
  return fs
    .readdirSync(NOTES_DIR)
    .filter(
      (n) =>
        n.endsWith(".md") &&
        n.toLowerCase() !== "readme.md" &&
        !n.startsWith("_"),
    )
    .map((n) => path.join(NOTES_DIR, n));
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw, hasFm: false, rawFm: "" };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) continue;
    data[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "");
  }
  return { data, body: m[2], hasFm: true, rawFm: m[1] };
}

function setFrontmatterField(rawFm, key, value) {
  const lines = rawFm.split(/\r?\n/);
  let found = false;
  const out = lines.map((line) => {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (kv && kv[1] === key) {
      found = true;
      return `${key}: ${value}`;
    }
    return line;
  });
  if (!found) {
    // insert after date if present, else at end
    let insertAt = out.length;
    for (let i = 0; i < out.length; i++) {
      if (/^date:\s*/.test(out[i])) insertAt = i + 1;
    }
    out.splice(insertAt, 0, `${key}: ${value}`);
  }
  return out.join("\n");
}

function findNoteFileById(id) {
  for (const file of listNoteFiles()) {
    const raw = fs.readFileSync(file, "utf8");
    const { data } = parseFrontmatter(raw);
    if (String(data.id || "").trim() === id) {
      return { file, raw, data };
    }
  }
  return null;
}

function resolveStatus(id, reg, fmStatus) {
  const entry = reg.notes[id];
  if (entry?.status && STATUSES.includes(entry.status)) return entry.status;
  if (fmStatus && STATUSES.includes(fmStatus)) return fmStatus;
  return "draft";
}

function syncFrontmatterStatus(file, raw, status) {
  const { hasFm, rawFm, body } = parseFrontmatter(raw);
  if (!hasFm) {
    const wrapped = `---\nstatus: ${status}\n---\n${raw}`;
    fs.writeFileSync(file, wrapped);
    return;
  }
  const nextFm = setFrontmatterField(rawFm, "status", status);
  fs.writeFileSync(file, `---\n${nextFm}\n---\n${body}`);
}

function ensureEntry(reg, id) {
  if (!reg.notes[id]) {
    reg.notes[id] = {
      status: "draft",
      version: 1,
      submittedAt: null,
      submittedBy: null,
      approvedAt: null,
      approvedBy: null,
      publishedAt: null,
      unpublishedAt: null,
      approvalNote: null,
      history: [],
    };
  }
  return reg.notes[id];
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const flags = {};
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--by" || a === "--note") {
      flags[a.slice(2)] = args[++i] ?? "";
    } else if (a.startsWith("--by=")) {
      flags.by = a.slice(5);
    } else if (a.startsWith("--note=")) {
      flags.note = a.slice(7);
    } else if (a === "--force" || a === "-f") {
      flags.force = true;
    } else {
      positional.push(a);
    }
  }
  return { positional, flags };
}

function cmdList(reg) {
  const rows = [];
  for (const file of listNoteFiles()) {
    const raw = fs.readFileSync(file, "utf8");
    const { data } = parseFrontmatter(raw);
    const id = String(data.id || "").trim();
    if (!id) continue;
    const status = resolveStatus(id, reg, data.status);
    rows.push({
      id,
      number: data.number || "?",
      title: data.title || path.basename(file),
      status,
      public: PUBLIC.has(status) ? "yes" : "no",
      file: path.basename(file),
    });
  }
  // include registry-only ids
  for (const id of Object.keys(reg.notes)) {
    if (!rows.some((r) => r.id === id)) {
      rows.push({
        id,
        number: "?",
        title: "(missing markdown)",
        status: reg.notes[id].status,
        public: PUBLIC.has(reg.notes[id].status) ? "yes" : "no",
        file: "—",
      });
    }
  }
  rows.sort((a, b) => String(b.number).localeCompare(String(a.number)));
  console.log(
    "ID".padEnd(10),
    "NUM".padEnd(6),
    "STATUS".padEnd(12),
    "PUBLIC".padEnd(8),
    "TITLE",
  );
  console.log("-".repeat(72));
  for (const r of rows) {
    console.log(
      r.id.padEnd(10),
      String(r.number).padEnd(6),
      r.status.padEnd(12),
      r.public.padEnd(8),
      r.title,
    );
  }
  const pub = rows.filter((r) => r.public === "yes").length;
  console.log(
    `\n${rows.length} note(s) · ${pub} published (public) · ${rows.length - pub} not public`,
  );
}

function cmdStatus(reg, id) {
  const found = findNoteFileById(id);
  const entry = reg.notes[id];
  const fmStatus = found?.data?.status;
  const status = resolveStatus(id, reg, fmStatus);
  console.log(`id:          ${id}`);
  console.log(`file:        ${found ? path.basename(found.file) : "(not found)"}`);
  console.log(`title:       ${found?.data?.title || "—"}`);
  console.log(`status:      ${status}`);
  console.log(`public:      ${PUBLIC.has(status) ? "yes" : "no"}`);
  console.log(`frontmatter: ${fmStatus || "(none)"}`);
  if (entry) {
    console.log(`version:     ${entry.version ?? 1}`);
    console.log(`submitted:   ${entry.submittedAt || "—"} by ${entry.submittedBy || "—"}`);
    console.log(`approved:    ${entry.approvedAt || "—"} by ${entry.approvedBy || "—"}`);
    console.log(`published:   ${entry.publishedAt || "—"}`);
    console.log(`unpublished: ${entry.unpublishedAt || "—"}`);
    if (entry.approvalNote) console.log(`note:        ${entry.approvalNote}`);
    if (entry.history?.length) {
      console.log("history:");
      for (const h of entry.history) {
        console.log(`  - ${h.at}  ${h.action.padEnd(10)}  ${h.by}${h.note ? `  · ${h.note}` : ""}`);
      }
    }
  } else {
    console.log("(no registry entry yet — defaults to draft until first action)");
  }
}

function applyAction(reg, id, action, flags) {
  const by = flags.by || process.env.CLIMB_NOTES_ACTOR || "acornsoft";
  const note = flags.note || "";
  const found = findNoteFileById(id);
  if (!found && action !== "set") {
    console.error(`No Climb Note markdown with id ${id} under content/climb-notes/`);
    process.exit(1);
  }

  const entry = ensureEntry(reg, id);
  const current = resolveStatus(id, reg, found?.data?.status);
  let next;

  if (action === "set") {
    next = flags.targetStatus;
    if (!STATUSES.includes(next)) {
      console.error(`Unknown status: ${next}. Use: ${STATUSES.join(", ")}`);
      process.exit(1);
    }
  } else {
    const rule = TRANSITIONS[action];
    if (!rule) {
      console.error(`Unknown action: ${action}`);
      process.exit(1);
    }
    if (!flags.force && !rule.from.includes(current)) {
      console.error(
        `Cannot ${action} from status "${current}". Allowed from: ${rule.from.join(", ")}. Use --force to override.`,
      );
      process.exit(1);
    }
    next = rule.to;
  }

  const at = nowIso();
  entry.status = next;
  entry.history = entry.history || [];
  entry.history.push({
    at,
    action: action === "set" ? `set:${next}` : action,
    by,
    note: note || undefined,
  });

  if (action === "submit" || next === "pending") {
    entry.submittedAt = at;
    entry.submittedBy = by;
  }
  if (action === "approve" || next === "approved") {
    entry.approvedAt = at;
    entry.approvedBy = by;
    if (note) entry.approvalNote = note;
  }
  if (action === "reject") {
    entry.approvedAt = null;
    entry.approvedBy = null;
  }
  if (action === "publish" || next === "published") {
    if (!entry.approvedAt) {
      entry.approvedAt = at;
      entry.approvedBy = by;
    }
    entry.publishedAt = at;
    entry.unpublishedAt = null;
    entry.version = (entry.version || 1) + (current === "published" ? 0 : 0);
    if (current !== "published") entry.version = (entry.version || 0) + 1;
  }
  if (action === "unpublish") {
    entry.unpublishedAt = at;
  }

  if (found) {
    syncFrontmatterStatus(found.file, found.raw, next);
  }

  saveRegistry(reg);
  console.log(`[climb-notes:publish] ${id}: ${current} → ${next} (${action}) by ${by}`);
  console.log(
    PUBLIC.has(next)
      ? "  public: YES — visible on /climb-notes"
      : "  public: NO  — studio only until published",
  );
}

function main() {
  const { positional, flags } = parseArgs(process.argv);
  const [cmd, id, maybeStatus] = positional;
  const reg = loadRegistry();

  if (!cmd || cmd === "list" || cmd === "ls") {
    cmdList(reg);
    return;
  }

  if (cmd === "status") {
    if (!id) {
      console.error("Usage: climb-notes-publish status <id>");
      process.exit(1);
    }
    cmdStatus(reg, id);
    return;
  }

  if (cmd === "set") {
    if (!id || !maybeStatus) {
      console.error("Usage: climb-notes-publish set <id> <status>");
      process.exit(1);
    }
    flags.targetStatus = maybeStatus;
    applyAction(reg, id, "set", flags);
    return;
  }

  if (TRANSITIONS[cmd] || cmd === "set") {
    if (!id) {
      console.error(`Usage: climb-notes-publish ${cmd} <id> [--by name] [--note "..."]`);
      process.exit(1);
    }
    applyAction(reg, id, cmd, flags);
    return;
  }

  console.error(`Unknown command: ${cmd}`);
  console.error(
    "Commands: list | status | submit | approve | reject | publish | unpublish | archive | restore | set",
  );
  process.exit(1);
}

main();
