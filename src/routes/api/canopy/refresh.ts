import { createFileRoute } from "@tanstack/react-router";
import { fetchLiveFeedFromX, type InterestsConfig } from "@/lib/canopy/x-fetch";
import type { LiveFeedFile } from "@/lib/canopy/types";
import interestsConfig from "@/lib/canopy/interests";
import {
  PULL_INTERVAL_MINUTES,
  nextPullIso,
  pullIsDue,
} from "@/lib/canopy/cadence";

/**
 * Weekly live feed. GET never spends X credits.
 * POST spends credits only when the weekly window is open, or with CRON_SECRET
 * (Grok Bot / scheduled job).
 */

const globalCache = globalThis as typeof globalThis & {
  __canopyLiveFeed__?: { at: number; data: LiveFeedFile };
};

const interests = interestsConfig as InterestsConfig;
const interval = interests.scheduleMinutes || PULL_INTERVAL_MINUTES;

function withCadence(data: LiveFeedFile, source?: LiveFeedFile["source"]): LiveFeedFile {
  return {
    ...data,
    source: source ?? data.source,
    scheduleMinutes: interval,
    nextPullAt: nextPullIso(data.updatedAt, interval),
  };
}

function authorizedCron(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const alt = request.headers.get("x-cron-secret") || "";
  return token === secret || alt === secret;
}

async function readDiskCache(): Promise<LiveFeedFile | null> {
  try {
    const { readFile } = await import("node:fs/promises");
    const { join } = await import("node:path");
    const raw = await readFile(
      join(process.cwd(), "public", "canopy", "live-feed.json"),
      "utf8",
    );
    return JSON.parse(raw) as LiveFeedFile;
  } catch {
    return null;
  }
}

async function lastPull(): Promise<LiveFeedFile | null> {
  return globalCache.__canopyLiveFeed__?.data ?? (await readDiskCache());
}

async function handle(request: Request): Promise<Response> {
  if (request.method !== "POST" && request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const cron = authorizedCron(request);
  const force =
    request.method === "POST" ||
    new URL(request.url).searchParams.get("force") === "1";

  const cached = await lastPull();

  if (!force) {
    if (cached) {
      globalCache.__canopyLiveFeed__ ??= { at: Date.now(), data: cached };
      return Response.json(withCadence(cached, "cache"));
    }
    return Response.json({
      updatedAt: new Date().toISOString(),
      source: "empty",
      scheduleMinutes: interval,
      entryCount: 0,
      entries: [],
      nextPullAt: new Date().toISOString(),
      error: "No cached live feed yet. Weekly pull has not run.",
    } satisfies LiveFeedFile);
  }

  const due = pullIsDue(cached?.updatedAt, interval);
  if (!due && !cron) {
    const held = withCadence(cached ?? {
      updatedAt: new Date().toISOString(),
      source: "cache",
      scheduleMinutes: interval,
      entryCount: 0,
      entries: [],
    }, "cache");
    held.error =
      `Weekly X pull only. Next window ${held.nextPullAt ?? "later"}. Credits not spent.`;
    return Response.json(held, { status: 429 });
  }

  const data = await fetchLiveFeedFromX(interests).catch((e) => {
    const message = e instanceof Error ? e.message : "Refresh failed";
    return {
      updatedAt: new Date().toISOString(),
      source: "error" as const,
      scheduleMinutes: interval,
      entryCount: 0,
      error: message,
      entries: [],
    } satisfies LiveFeedFile;
  });

  const stamped = withCadence(data);
  globalCache.__canopyLiveFeed__ = { at: Date.now(), data: stamped };

  if (stamped.entries.length > 0) {
    try {
      const { writeFile, mkdir } = await import("node:fs/promises");
      const { join } = await import("node:path");
      const out = join(process.cwd(), "public", "canopy", "live-feed.json");
      await mkdir(join(process.cwd(), "public", "canopy"), { recursive: true });
      await writeFile(out, JSON.stringify(stamped, null, 2) + "\n", "utf8");
    } catch {
      /* ignore */
    }
  }

  return Response.json(stamped);
}

export const Route = createFileRoute("/api/canopy/refresh")({
  server: {
    handlers: {
      GET: async ({ request }) => handle(request),
      POST: async ({ request }) => handle(request),
    },
  },
});
