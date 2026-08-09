import { createFileRoute } from "@tanstack/react-router";
import { fetchLiveFeedFromX, type InterestsConfig } from "@/lib/canopy/x-fetch";
import type { LiveFeedFile } from "@/lib/canopy/types";
import interestsConfig from "@/lib/canopy/interests";

/**
 * Scheduled / manual live feed refresh.
 *
 * POST /api/canopy/refresh
 * Authorization: Bearer <CRON_SECRET>   (required if CRON_SECRET is set)
 *
 * Returns LiveFeedFile JSON. When X_BEARER_TOKEN is set, pulls X recent search.
 * Optional write to disk is only for long-lived hosts (local / VM); Vercel is
 * read-mostly — prefer cron that writes public/canopy/live-feed.json via CI.
 */

const globalCache = globalThis as typeof globalThis & {
  __canopyLiveFeed__?: { at: number; data: LiveFeedFile };
};

const interests = interestsConfig as InterestsConfig;

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return true; // open in dev when no secret configured
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const alt = request.headers.get("x-cron-secret") || "";
  return token === secret || alt === secret;
}

async function handle(request: Request): Promise<Response> {
  if (request.method !== "POST" && request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }
  if (!authorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const force =
    request.method === "POST" ||
    new URL(request.url).searchParams.get("force") === "1";

  const scheduleMs = (interests.scheduleMinutes ?? 60) * 60 * 1000;
  const cached = globalCache.__canopyLiveFeed__;
  if (
    !force &&
    cached &&
    Date.now() - cached.at < scheduleMs &&
    cached.data.entries.length > 0
  ) {
    return Response.json({
      ...cached.data,
      source: "cache" as const,
    });
  }

  const data = await fetchLiveFeedFromX(interests);

  globalCache.__canopyLiveFeed__ = { at: Date.now(), data };

  // Best-effort disk write (local/dev). Ignore failures on read-only hosts.
  try {
    const { writeFile, mkdir } = await import("node:fs/promises");
    const { join } = await import("node:path");
    const out = join(process.cwd(), "public", "canopy", "live-feed.json");
    await mkdir(join(process.cwd(), "public", "canopy"), { recursive: true });
    await writeFile(out, JSON.stringify(data, null, 2) + "\n", "utf8");
  } catch {
    /* ignore */
  }

  return Response.json(data);
}

export const Route = createFileRoute("/api/canopy/refresh")({
  server: {
    handlers: {
      GET: async ({ request }) => handle(request),
      POST: async ({ request }) => handle(request),
    },
  },
});
