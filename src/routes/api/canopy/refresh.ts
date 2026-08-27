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

  const cached = globalCache.__canopyLiveFeed__;

  // GET / no force: serve last pull only — do not spend X credits.
  if (!force) {
    if (cached?.data) {
      return Response.json({ ...cached.data, source: "cache" as const });
    }
    try {
      const { readFile } = await import("node:fs/promises");
      const { join } = await import("node:path");
      const raw = await readFile(
        join(process.cwd(), "public", "canopy", "live-feed.json"),
        "utf8",
      );
      const data = JSON.parse(raw) as LiveFeedFile;
      globalCache.__canopyLiveFeed__ = { at: Date.now(), data };
      return Response.json({ ...data, source: "cache" as const });
    } catch {
      return Response.json({
        updatedAt: new Date().toISOString(),
        source: "empty",
        scheduleMinutes: interests.scheduleMinutes,
        entryCount: 0,
        entries: [],
        error: "No cached live feed yet. Sign in and click Refresh live.",
      } satisfies LiveFeedFile);
    }
  }

  const data = await fetchLiveFeedFromX(interests).catch((e) => {
    const message = e instanceof Error ? e.message : "Refresh failed";
    return {
      updatedAt: new Date().toISOString(),
      source: "error" as const,
      scheduleMinutes: interests.scheduleMinutes,
      entryCount: 0,
      error: message,
      entries: [],
    } satisfies LiveFeedFile;
  });



  globalCache.__canopyLiveFeed__ = { at: Date.now(), data };

  // Best-effort disk write (local/dev). Never clobber a good cache with empty.
  if (data.entries.length > 0) {
    try {
      const { writeFile, mkdir } = await import("node:fs/promises");
      const { join } = await import("node:path");
      const out = join(process.cwd(), "public", "canopy", "live-feed.json");
      await mkdir(join(process.cwd(), "public", "canopy"), { recursive: true });
      await writeFile(out, JSON.stringify(data, null, 2) + "\n", "utf8");
    } catch {
      /* ignore */
    }
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
