#!/usr/bin/env node
/**
 * Scheduled Canopy live feed pull.
 *
 * Radar subscriptions: user timelines (e.g. @acornsoftai) via X API user timeline.
 * Topic queries: recent search.
 *
 * Cadence: once a week. Do not cron this hourly.
 * Env: X_BEARER_TOKEN (required), CANOPY_OUT optional
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const INTERESTS_PATH = path.join(ROOT, "content", "canopy", "interests.json");
const OUT =
  process.env.CANOPY_OUT ||
  path.join(ROOT, "public", "canopy", "live-feed.json");
const DRY = process.argv.includes("--dry-run");
const FORCE = process.argv.includes("--force");

function log(...m) {
  console.log("[canopy:fetch]", ...m);
}

function loadInterests() {
  return JSON.parse(fs.readFileSync(INTERESTS_PATH, "utf8"));
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return String(iso).slice(0, 10);
  }
}

function titleFromText(text) {
  const clean = text.replace(/\s+/g, " ").trim();
  const first = clean.split(/(?<=[.!?])\s+/)[0] || clean;
  return first.length > 90 ? `${first.slice(0, 87)}…` : first;
}

function bodyFromText(text) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > 320 ? `${clean.slice(0, 317)}…` : clean;
}

function toEntry(tweet, username, actor, kind, standout) {
  return {
    id: `live-x-${tweet.id}`,
    date: formatDate(tweet.created_at),
    sortKey: tweet.created_at || new Date().toISOString(),
    title: titleFromText(tweet.text),
    body: bodyFromText(tweet.text),
    kind: kind || "feednote",
    actor,
    source: `@${username}`,
    href: `https://x.com/${username}/status/${tweet.id}`,
    xId: tweet.id,
    live: true,
    standout: !!standout,
  };
}

async function xGet(bearer, url) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`X API ${res.status}: ${text.slice(0, 300)}`);
  return JSON.parse(text);
}

async function resolveUserId(bearer, username) {
  const url = new URL(
    `https://api.x.com/2/users/by/username/${encodeURIComponent(username)}`,
  );
  const json = await xGet(bearer, url);
  if (!json.data?.id) throw new Error(`User not found: @${username}`);
  return json.data.id;
}

async function userTimeline(bearer, userId, maxResults) {
  const url = new URL(`https://api.x.com/2/users/${userId}/tweets`);
  url.searchParams.set(
    "max_results",
    String(Math.min(Math.max(maxResults || 20, 5), 100)),
  );
  url.searchParams.set("tweet.fields", "created_at,author_id,lang");
  url.searchParams.set("exclude", "retweets,replies");
  return xGet(bearer, url);
}

async function searchRecent(bearer, query, maxResults) {
  const url = new URL("https://api.x.com/2/tweets/search/recent");
  url.searchParams.set("query", `${query} -is:retweet lang:en`);
  url.searchParams.set(
    "max_results",
    String(Math.min(Math.max(maxResults, 10), 100)),
  );
  url.searchParams.set("tweet.fields", "created_at,author_id,lang");
  url.searchParams.set("expansions", "author_id");
  url.searchParams.set("user.fields", "username,name");
  return xGet(bearer, url);
}

async function main() {
  const interests = loadInterests();
  const interval = interests.scheduleMinutes ?? 10080;

  if (!FORCE && fs.existsSync(OUT)) {
    try {
      const prev = JSON.parse(fs.readFileSync(OUT, "utf8"));
      const updated = Date.parse(prev.updatedAt);
      if (Number.isFinite(updated) && Date.now() < updated + interval * 60_000) {
        const next = new Date(updated + interval * 60_000).toISOString();
        log("weekly window closed; next pull", next, "(pass --force to override)");
        return;
      }
    } catch {
      /* pull */
    }
  }

  const bearer =
    process.env.X_BEARER_TOKEN ||
    process.env.TWITTER_BEARER_TOKEN ||
    process.env.X_API_BEARER;

  if (!bearer) {
    log("No X_BEARER_TOKEN — writing empty stub.");
    const stub = {
      updatedAt: new Date().toISOString(),
      source: "empty",
      scheduleMinutes: interests.scheduleMinutes ?? 10080,
      entryCount: 0,
      error:
        "Missing X_BEARER_TOKEN. Set App-only Bearer to pull @acornsoftai Radar + topic queries.",
      entries: [],
      subscriptions: (interests.subscriptions || []).map((s) => s.username),
    };
    if (!DRY) {
      fs.mkdirSync(path.dirname(OUT), { recursive: true });
      fs.writeFileSync(OUT, JSON.stringify(stub, null, 2) + "\n");
    }
    process.exitCode = 1;
    return;
  }

  const byId = new Map();
  const errors = [];
  const pulledSubs = [];

  // 1) Radar subscriptions — user timelines (primary for @acornsoftai)
  for (const sub of interests.subscriptions || []) {
    try {
      const username = String(sub.username || "").replace(/^@/, "");
      log("radar subscription", `@${username}`);
      const userId = await resolveUserId(bearer, username);
      const json = await userTimeline(
        bearer,
        userId,
        sub.maxResults ?? interests.maxResultsPerQuery ?? 25,
      );
      for (const tweet of json.data || []) {
        const entry = toEntry(
          tweet,
          username,
          sub.actor || "acornsoft",
          sub.kind || "feednote",
          sub.standout,
        );
        byId.set(entry.id, entry);
      }
      pulledSubs.push(username);
      await new Promise((r) => setTimeout(r, 350));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      log("error subscription", sub.username, msg);
      errors.push(`sub:${sub.username}: ${msg}`);
    }
  }

  // 2) Topic searches
  for (const q of interests.queries || []) {
    try {
      log("query", q.id);
      const json = await searchRecent(
        bearer,
        q.query,
        interests.maxResultsPerQuery ?? 25,
      );
      const users = new Map(
        (json.includes?.users || []).map((u) => [u.id, u]),
      );
      for (const tweet of json.data || []) {
        const user = users.get(tweet.author_id);
        const username = user?.username || "unknown";
        let actor = q.actor;
        if (username.toLowerCase() === "acornsoftai") actor = "acornsoft";
        const entry = toEntry(
          tweet,
          username,
          actor,
          q.kind || "feednote",
          username.toLowerCase() === "acornsoftai",
        );
        byId.set(entry.id, entry);
      }
      await new Promise((r) => setTimeout(r, 400));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      log("error query", q.id, msg);
      errors.push(`q:${q.id}: ${msg}`);
    }
  }

  const entries = [...byId.values()].sort((a, b) =>
    b.sortKey.localeCompare(a.sortKey),
  );
  const payload = {
    updatedAt: new Date().toISOString(),
    source: errors.length && !entries.length ? "error" : "x-api-v2",
    scheduleMinutes: interests.scheduleMinutes ?? 10080,
    entryCount: entries.length,
    subscriptions: pulledSubs,
    error: errors.length ? errors.join(" | ") : undefined,
    entries,
  };

  log(`entries ${entries.length} (radar: ${pulledSubs.join(", ") || "none"})`);
  if (DRY) {
    log("sample", JSON.stringify(entries.slice(0, 2), null, 2));
    return;
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n");
  log("wrote", OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
