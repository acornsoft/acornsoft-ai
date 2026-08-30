/**
 * In-memory per-IP rate limit for public click counters.
 * Caps Postgres writes; fail closed (skip increment) instead of 500.
 * Per-instance only on serverless — still bounds a single flood.
 */
import { getRequest } from "@tanstack/react-start/server";
import { clientIpFromHeaders } from "./ip-allowlist";

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function prune(now: number): void {
  if (buckets.size < 2_000) return;
  for (const [key, bucket] of buckets) {
    if (now >= bucket.resetAt) buckets.delete(key);
  }
}

function takeSlot(key: string): boolean {
  const now = Date.now();
  prune(now);
  const bucket = buckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (bucket.count >= MAX_PER_WINDOW) return false;
  bucket.count += 1;
  return true;
}

/** True when this request may increment a public click counter. */
export function allowPublicClick(): boolean {
  try {
    const req = getRequest();
    const ip = clientIpFromHeaders(req.headers, true) ?? "unknown";
    return takeSlot(ip);
  } catch {
    return takeSlot("unknown");
  }
}
