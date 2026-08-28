/** One Radar pull per week. Protects X API credits and stays inside rate limits. */
export const PULL_INTERVAL_MINUTES = 7 * 24 * 60; // 10080

export function nextPullIso(
  updatedAt: string | undefined,
  minutes: number = PULL_INTERVAL_MINUTES,
): string | undefined {
  if (!updatedAt) return undefined;
  const t = Date.parse(updatedAt);
  if (Number.isNaN(t)) return undefined;
  return new Date(t + minutes * 60_000).toISOString();
}

export function pullIsDue(
  updatedAt: string | undefined,
  minutes: number = PULL_INTERVAL_MINUTES,
): boolean {
  if (!updatedAt) return true;
  const next = nextPullIso(updatedAt, minutes);
  if (!next) return true;
  return Date.now() >= Date.parse(next);
}

export function formatNextPull(iso: string | undefined): string {
  if (!iso) return "when due";
  try {
    return new Date(iso).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
