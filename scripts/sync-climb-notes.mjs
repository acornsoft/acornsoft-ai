#!/usr/bin/env node
/**
 * Automate Markdown sync for Climb Notes (Obsidian → site).
 *
 * Source of truth for authoring: Obsidian vault folder (or any Markdown dir).
 * Site folder: /workspace/content/climb-notes
 *
 * Usage:
 *   node scripts/sync-climb-notes.mjs              # one-shot copy
 *   node scripts/sync-climb-notes.mjs --watch       # copy + watch
 *   node scripts/sync-climb-notes.mjs --dry-run
 *
 * Config (first found wins):
 *   1. env CLIMB_NOTES_VAULT=/path/to/Obsidian/Climb Notes
 *   2. file /workspace/.climb-notes-sync.json  { "vault": "..." }
 *   3. default: /workspace/content/climb-notes  (no-op identity; validates only)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DEST = path.join(ROOT, "content", "climb-notes");
const CONFIG_PATH = path.join(ROOT, ".climb-notes-sync.json");
const STATE_PATH = path.join(ROOT, ".climb-notes-sync-state.json");

const args = new Set(process.argv.slice(2));
const WATCH = args.has("--watch") || args.has("-w");
const DRY = args.has("--dry-run");
const VERBOSE = args.has("--verbose") || args.has("-v");

function log(...m) {
  console.log("[climb-notes:sync]", ...m);
}

function readConfig() {
  if (process.env.CLIMB_NOTES_VAULT?.trim()) {
    return { vault: process.env.CLIMB_NOTES_VAULT.trim() };
  }
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
    } catch (e) {
      console.error("Invalid .climb-notes-sync.json", e.message);
      process.exit(1);
    }
  }
  return { vault: DEST };
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function isNoteFile(name) {
  if (!name.endsWith(".md")) return false;
  if (name.toLowerCase() === "readme.md") return false;
  return true;
}

function listMarkdown(dir, base = dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith(".")) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "templates" || ent.name === ".obsidian") {
        // copy templates too (one level)
        if (ent.name === "templates") listMarkdown(full, base, out);
        continue;
      }
      listMarkdown(full, base, out);
    } else if (ent.isFile() && isNoteFile(ent.name)) {
      out.push({
        abs: full,
        rel: path.relative(base, full),
      });
    } else if (
      ent.isFile() &&
      ent.name.endsWith(".md") &&
      path.basename(path.dirname(full)) === "templates"
    ) {
      out.push({ abs: full, rel: path.relative(base, full) });
    }
  }
  return out;
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  if (DRY) {
    log("dry-run copy", src, "→", dest);
    return;
  }
  fs.copyFileSync(src, dest);
  if (VERBOSE) log("copied", path.relative(ROOT, dest));
}

function syncOnce(vault) {
  const vaultAbs = path.resolve(vault);
  if (!fs.existsSync(vaultAbs)) {
    console.error(`Vault path does not exist: ${vaultAbs}`);
    console.error(
      "Set CLIMB_NOTES_VAULT or create .climb-notes-sync.json with { \"vault\": \"/path\" }",
    );
    process.exit(1);
  }

  ensureDir(DEST);
  ensureDir(path.join(DEST, "templates"));

  // Identity vault (site folder itself): validate only
  if (path.resolve(vaultAbs) === path.resolve(DEST)) {
    const notes = listMarkdown(DEST);
    log(
      `vault is site folder (${notes.length} note file(s)). Nothing to copy. Point vault at Obsidian to enable sync.`,
    );
    writeState({ vault: vaultAbs, lastSync: new Date().toISOString(), files: notes.length });
    return { copied: 0, notes: notes.length };
  }

  const files = listMarkdown(vaultAbs);
  let copied = 0;
  for (const f of files) {
    // flatten top-level notes into DEST; keep templates/
    const rel = f.rel.replace(/\\/g, "/");
    let destRel = rel;
    // if vault has Climb Notes/ subfolder structure, strip common prefixes
    destRel = destRel.replace(/^Climb Notes\//i, "");
    const dest = path.join(DEST, destRel);
    // never wipe README from site docs unless vault has one at root named README
    copyFile(f.abs, dest);
    copied += 1;
  }

  // Always preserve site README if vault has no README
  log(`synced ${copied} file(s) from ${vaultAbs} → ${DEST}`);
  writeState({
    vault: vaultAbs,
    lastSync: new Date().toISOString(),
    files: copied,
  });
  return { copied, notes: files.length };
}

function writeState(state) {
  if (DRY) return;
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + "\n");
}

function debounce(fn, ms) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
}

function watchVault(vault) {
  const vaultAbs = path.resolve(vault);
  log(`watching ${vaultAbs}`);
  const run = debounce(() => {
    try {
      syncOnce(vaultAbs);
    } catch (e) {
      console.error(e);
    }
  }, 300);

  // Node recursive watch (Linux/macOS)
  try {
    fs.watch(vaultAbs, { recursive: true }, (_event, filename) => {
      if (filename && filename.startsWith(".")) return;
      if (VERBOSE && filename) log("change", filename);
      run();
    });
  } catch (e) {
    console.error("fs.watch failed, falling back to interval poll", e.message);
    setInterval(() => run(), 2000);
  }
}

function main() {
  const { vault } = readConfig();
  log(DRY ? "dry-run mode" : "live mode");
  log("vault:", path.resolve(vault));
  log("dest: ", DEST);
  syncOnce(vault);
  if (WATCH) {
    watchVault(vault);
    log("watch active — Ctrl+C to stop");
  }
}

main();
