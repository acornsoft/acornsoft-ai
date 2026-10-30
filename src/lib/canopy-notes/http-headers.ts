/**
 * Notes pages must not be cached. Revocation is visible on the next request,
 * and a shared cache must not replay the previous body.
 */
export function canopyNoteHeaders(): Record<string, string> {
  return {
    "Cache-Control": "private, no-store",
    "CDN-Cache-Control": "no-store",
    "Vercel-CDN-Cache-Control": "no-store",
  };
}

type HeaderReader = { get(name: string): string | null };

/** True when a CDN or shared cache says it served a stored response. */
export function responseIsCacheHit(headers: HeaderReader): boolean {
  const exactHit = (name: string) =>
    (headers.get(name) ?? "").trim().toUpperCase() === "HIT";
  if (exactHit("x-vercel-cache") || exactHit("cf-cache-status")) return true;
  if (/hit/i.test(headers.get("x-cache") ?? "")) return true;
  const age = headers.get("age");
  if (age && Number(age) > 0) return true;
  return false;
}
