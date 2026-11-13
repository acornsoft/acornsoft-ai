#!/usr/bin/env node
/**
 * Convert a plain-text Grok Bot usage snapshot into public/grok-usage/usage.json.
 *
 * The snapshot format matches the weekly usage pull (shares only, no tokens,
 * dollars, or plan limits). Those private fields, if present in the source, are
 * dropped and never written to the public file.
 *
 * Usage:
 *   node scripts/build-grok-usage.mjs path/to/snapshot.md
 *   node scripts/build-grok-usage.mjs path/to/snapshot.md --out public/grok-usage/usage.json
 *   node scripts/build-grok-usage.mjs path/to/snapshot.md --dry-run
 *
 * Options:
 *   --out <path>   Write JSON here (default: public/grok-usage/usage.json)
 *   --feed <path>  Canopy live-feed.json for the public entry count
 *   --dry-run      Print JSON; do not write
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const DEFAULT_OUT = path.join(ROOT, "public", "grok-usage", "usage.json");
const DEFAULT_FEED = path.join(ROOT, "public", "canopy", "live-feed.json");

/** Under-1% shares are stored as 0.5 and flagged approximate. */
const LT1 = 0.5;

/**
 * Public display names. Work bots keep their names; personal assistant is
 * folded; anything not in this map that looks personal or client-related
 * is folded into Other.
 */
const BOT_DISPLAY = [
  {
    match: /^william\b/i,
    label: "William",
    role: "Dataverse Developer",
  },
  {
    match: /^zorst\b/i,
    label: "Zorst",
    role: "Computer Science Savant",
  },
  {
    match: /^optimus\b/i,
    label: "Optimus",
    role: "Chief of Staff",
  },
  { match: /^bookworm\b/i, label: "Bookworm", role: "" },
  { match: /^sunlight\b/i, label: "Sunlight", role: "" },
  { match: /^ted\b/i, label: "Ted", role: "Enterprise Architect" },
  { match: /^acadence\b/i, label: "Acadence", role: "" },
  {
    match: /^climb notes supervisor\b/i,
    label: "Climb Notes Supervisor",
    role: "",
  },
  { match: /^climb notes\b/i, label: "Climb Notes", role: "" },
  {
    match: /^archie\b/i,
    label: "Archie",
    role: "Azure DevOps Specialist",
  },
  { match: /^kyle\b/i, label: "Kyle", role: "Web Designer" },
];

const PERSONAL_ASSISTANT = /^zubil\b|personal assistant/i;
const OTHER_MATCH = /^other(\s+bots?)?$/i;

/** Never appear in the public file, even if present in a snapshot. */
const FORBIDDEN = /\b(gnomah|macroflow|paars|avanade|accenture|\besl\b|zubil|\bcity\b)\b/i;

const PRIVATE_LINE = /\b(plan\s*:|weekly\s+limit|credits?|\$\s*\d|resets\b)/i;

const MONTHS = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
};

function log(...m) {
  console.log("[grok-usage]", ...m);
}

function die(msg) {
  console.error("[grok-usage]", msg);
  process.exit(1);
}

function parseArgs(argv) {
  const args = { snapshot: null, out: DEFAULT_OUT, feed: DEFAULT_FEED, dryRun: false };
  const rest = argv.slice(2);
  for (let i = 0; i < rest.length; i += 1) {
    const a = rest[i];
    if (a === "--dry-run") args.dryRun = true;
    else if (a === "--out") args.out = path.resolve(ROOT, rest[++i] ?? "");
    else if (a === "--feed") args.feed = path.resolve(ROOT, rest[++i] ?? "");
    else if (a === "--help" || a === "-h") args.help = true;
    else if (a.startsWith("-")) die(`Unknown flag: ${a}`);
    else if (!args.snapshot) args.snapshot = path.resolve(a);
    else die(`Unexpected argument: ${a}`);
  }
  return args;
}

function parseShare(raw) {
  const t = String(raw).trim();
  if (t === "<1" || t === "<1%") return { value: LT1, approximate: true };
  if (t === "-" || t === "" || t === "–" || t === "—") {
    return { value: 0, approximate: false };
  }
  const n = Number.parseFloat(t.replace(/%/g, ""));
  if (!Number.isFinite(n)) return { value: 0, approximate: false };
  return { value: n, approximate: false };
}

function monthNum(token) {
  return MONTHS[token.toLowerCase()] ?? null;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function isoDate(year, month, day) {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

/** Parse "Oct 14" or "Oct14" or "October 14" with a year. */
function parseShortDate(text, year) {
  const m = String(text)
    .trim()
    .match(/^([A-Za-z]+)\s*(\d{1,2})$/);
  if (!m) return null;
  const month = monthNum(m[1]);
  const day = Number.parseInt(m[2], 10);
  if (!month || !day) return null;
  return { year, month, day, iso: isoDate(year, month, day) };
}

function parsePulledAt(text) {
  const m = text.match(
    /pulled\s+(\d{4})-(\d{2})-(\d{2})(?:\s+~?\s*(\d{1,2}):(\d{2})\s*(AM|PM)\s*(ET|E[SD]T)?)?/i,
  );
  if (!m) return null;
  const year = Number.parseInt(m[1], 10);
  const month = Number.parseInt(m[2], 10);
  const day = Number.parseInt(m[3], 10);
  let hour = m[4] ? Number.parseInt(m[4], 10) : 12;
  const minute = m[5] ? Number.parseInt(m[5], 10) : 0;
  const ap = (m[6] || "AM").toUpperCase();
  if (ap === "PM" && hour < 12) hour += 12;
  if (ap === "AM" && hour === 12) hour = 0;
  // America/New_York offset is not computed here; the source is labeled ET.
  // November is EST (UTC-5). Callers can pass an ISO string later if needed.
  const offset = month >= 3 && month <= 10 ? "-04:00" : "-05:00";
  // Rough DST: EDT mid-Mar to early Nov. Nov 13 is EST. Oct 14–Nov first Sunday
  // is messy; the pulled date in this pipeline is typically a weekday in the
  // report header. For Nov (month 11+) and Jan–Feb use -05:00; Mar–Oct -04:00
  // is close enough for a weekly snapshot label.
  const iso = `${isoDate(year, month, day)}T${pad2(hour)}:${pad2(minute)}:00${offset}`;
  return { iso, year, month, day };
}

function parsePeriod(text, pulledYear) {
  const m = text.match(
    /last\s+(\d+)\s+days\s*\(\s*([A-Za-z]+)\s*(\d{1,2})\s*[-–—]\s*([A-Za-z]+)\s*(\d{1,2})(?:\s+UTC)?\s*\)/i,
  );
  if (!m) return null;
  const startMonth = monthNum(m[2]);
  const endMonth = monthNum(m[4]);
  const startDay = Number.parseInt(m[3], 10);
  const endDay = Number.parseInt(m[5], 10);
  if (!startMonth || !endMonth) return null;
  let endYear = pulledYear;
  let startYear = pulledYear;
  if (startMonth > endMonth) startYear = pulledYear - 1;
  const start = isoDate(startYear, startMonth, startDay);
  const end = isoDate(endYear, endMonth, endDay);
  const startLabel = `${m[2].slice(0, 3)} ${startDay}`;
  const endLabel = `${m[4].slice(0, 3)} ${endDay}`;
  return {
    periodLabel: `Last ${m[1]} days (${startLabel} – ${endLabel})`,
    periodStart: start,
    periodEnd: end,
    startYear,
    endYear,
  };
}

function displayBot(rawName, rawRole) {
  const name = (rawName || "").trim();
  const role = (rawRole || "").trim();
  const combined = `${name} ${role}`.trim();
  if (FORBIDDEN.test(combined) || PERSONAL_ASSISTANT.test(combined)) {
    if (PERSONAL_ASSISTANT.test(combined) && !FORBIDDEN.test(name.replace(/zubil/i, ""))) {
      return { label: "Personal assistant", role: "", named: false };
    }
    // Zubil and any forbidden client/project names fold out of the public list.
    if (PERSONAL_ASSISTANT.test(combined)) {
      return { label: "Personal assistant", role: "", named: false };
    }
    return { label: "Other", role: "", named: false };
  }
  if (OTHER_MATCH.test(name)) return { label: "Other", role: "", named: false };
  for (const rule of BOT_DISPLAY) {
    if (rule.match.test(name)) {
      return { label: rule.label, role: rule.role, named: true };
    }
  }
  // Unknown bot: keep a sanitized label only if it is clearly not a client.
  if (!name || FORBIDDEN.test(name)) {
    return { label: "Other", role: "", named: false };
  }
  return { label: name, role, named: true };
}

function parseBotShares(line) {
  const idx = line.toLowerCase().indexOf("share by bot:");
  const body = idx >= 0 ? line.slice(idx + "share by bot:".length) : line;
  const parts = body
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  const merged = new Map();
  for (const part of parts) {
    const cleaned = part.replace(/[.,;]+$/, "").trim();
    const m = cleaned.match(/^(.*?)\s+(<1|\d+(?:\.\d+)?)%?$/);
    if (!m) continue;
    const labelPart = m[1].trim();
    const share = parseShare(m[2]);
    let rawName = labelPart;
    let rawRole = "";
    const dot = labelPart.indexOf("·");
    if (dot >= 0) {
      rawName = labelPart.slice(0, dot).trim();
      rawRole = labelPart.slice(dot + 1).trim();
    }
    const shown = displayBot(rawName, rawRole);
    const prev = merged.get(shown.label);
    if (prev) {
      prev.share += share.value;
      if (share.approximate) prev.approximate = true;
    } else {
      merged.set(shown.label, {
        label: shown.label,
        role: shown.role,
        share: share.value,
        named: shown.named,
        approximate: share.approximate || undefined,
      });
    }
  }
  const list = [...merged.values()];
  list.sort((a, b) => {
    if (b.share !== a.share) return b.share - a.share;
    return a.label.localeCompare(b.label);
  });
  return list;
}

function yearForMonth(month, period) {
  if (!period) return new Date().getUTCFullYear();
  if (period.startYear === period.endYear) return period.endYear;
  // Wrapped period (e.g. Nov–Jan): months >= startMonth belong to startYear.
  return month >= Number.parseInt(period.periodStart.slice(5, 7), 10)
    ? period.startYear
    : period.endYear;
}

function parseDailyLine(text, period) {
  const days = [];
  const re = /([A-Za-z]+)\s*(\d{1,2})\s+(<1|\d+(?:\.\d+)?)\s*(?:\(([^)]*)\))?/g;
  let m;
  while ((m = re.exec(text))) {
    const month = monthNum(m[1]);
    const day = Number.parseInt(m[2], 10);
    if (!month || !day) continue;
    const year = yearForMonth(month, period);
    const totalP = parseShare(m[3]);
    let chats = { value: 0, approximate: false };
    let routines = { value: 0, approximate: false };
    let botToBot = { value: 0, approximate: false };
    let group = { value: 0, approximate: false };
    if (m[4] != null && m[4].trim() !== "") {
      const bits = m[4].split("/").map((s) => s.trim());
      chats = parseShare(bits[0] ?? "0");
      routines = parseShare(bits[1] ?? "0");
      botToBot = parseShare(bits[2] ?? "0");
      group = parseShare(bits[3] ?? "0");
    } else {
      // Total only (no breakdown): attribute the day's share to chats.
      chats = { ...totalP };
    }
    const approximate =
      totalP.approximate ||
      chats.approximate ||
      routines.approximate ||
      botToBot.approximate ||
      group.approximate;
    const entry = {
      date: isoDate(year, month, day),
      total: totalP.value,
      chats: chats.value,
      routines: routines.value,
      botToBot: botToBot.value,
      group: group.value,
    };
    if (approximate) entry.approximate = true;
    days.push(entry);
  }
  days.sort((a, b) => a.date.localeCompare(b.date));
  return days;
}

function activityTotals(daily) {
  const totals = { chats: 0, routines: 0, botToBot: 0, group: 0 };
  let approximate = false;
  for (const d of daily) {
    totals.chats += d.chats;
    totals.routines += d.routines;
    totals.botToBot += d.botToBot;
    totals.group += d.group;
    if (d.approximate) approximate = true;
  }
  const round1 = (n) => Math.round(n * 10) / 10;
  const out = {
    chats: round1(totals.chats),
    routines: round1(totals.routines),
    botToBot: round1(totals.botToBot),
    group: round1(totals.group),
  };
  if (approximate) out.approximate = true;
  return out;
}

function readFeedCount(feedPath) {
  try {
    const raw = fs.readFileSync(feedPath, "utf8");
    const data = JSON.parse(raw);
    const n = data.entryCount ?? data.entries?.length;
    if (typeof n === "number" && Number.isFinite(n)) return n;
  } catch {
    // optional
  }
  return null;
}

function stripPrivate(text) {
  return text
    .split(/\r?\n/)
    .filter((line) => !PRIVATE_LINE.test(line))
    .join("\n");
}

function assertPublicSafe(obj) {
  const blob = JSON.stringify(obj);
  if (FORBIDDEN.test(blob) || PRIVATE_LINE.test(blob) || /\$\d/.test(blob)) {
    die("Refusing to write public file: snapshot produced forbidden or private fields.");
  }
}

export function buildUsage(snapshotText, { feedCount, nowIso } = {}) {
  const text = stripPrivate(snapshotText);
  const pulled = parsePulledAt(text);
  const pulledYear = pulled?.year ?? new Date().getFullYear();
  const period = parsePeriod(text, pulledYear);

  const botLine = text.split(/\r?\n/).find((l) => /share by bot:/i.test(l)) || "";
  const byBotRaw = parseBotShares(botLine);
  const byBot = byBotRaw.map(({ named, approximate, ...rest }) => {
    const row = { ...rest };
    if (approximate) row.approximate = true;
    return row;
  });
  const namedBots = byBotRaw.filter((b) => b.named).length;

  const dailyIdx = text.search(/daily share/i);
  const dailyText = dailyIdx >= 0 ? text.slice(dailyIdx) : text;
  const daily = parseDailyLine(dailyText, period);
  const byActivity = activityTotals(daily);

  const updatedAt = nowIso || pulled?.iso || new Date().toISOString();
  const periodLabel = period?.periodLabel || "Last 30 days";

  const counts = { namedBots };
  if (typeof feedCount === "number") counts.canopyFeedEntries = feedCount;

  const out = {
    updatedAt,
    periodLabel,
    periodStart: period?.periodStart || daily[0]?.date || "",
    periodEnd: period?.periodEnd || daily[daily.length - 1]?.date || "",
    byBot,
    byActivity,
    daily,
    counts,
  };
  assertPublicSafe(out);
  return out;
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log(
      `Usage: node scripts/build-grok-usage.mjs path/to/snapshot.md [--out path] [--feed path] [--dry-run]`,
    );
    process.exit(0);
  }
  if (!args.snapshot) {
    die("Provide a snapshot file.\n  node scripts/build-grok-usage.mjs path/to/snapshot.md");
  }
  if (!fs.existsSync(args.snapshot)) die(`Snapshot not found: ${args.snapshot}`);
  const raw = fs.readFileSync(args.snapshot, "utf8");
  const feedCount = readFeedCount(args.feed);
  const usage = buildUsage(raw, { feedCount });
  const json = `${JSON.stringify(usage, null, 2)}\n`;
  if (args.dryRun) {
    process.stdout.write(json);
    return;
  }
  fs.mkdirSync(path.dirname(args.out), { recursive: true });
  fs.writeFileSync(args.out, json, "utf8");
  log(
    `Wrote ${path.relative(ROOT, args.out)} · ${usage.byBot.length} bots · ${usage.daily.length} days · namedBots ${usage.counts.namedBots}` +
      (usage.counts.canopyFeedEntries != null ? ` · canopy ${usage.counts.canopyFeedEntries}` : ""),
  );
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) main();
