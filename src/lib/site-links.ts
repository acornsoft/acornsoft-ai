/**
 * Dual-site bridge: Acornsoft (this app) ↔ personal work bio (blaszyk.us).
 *
 * Acornsoft = New York AI-first organization product surface
 *   (Climb Notes, Canopy, Gnomah, services, corporate notices)
 * blaszyk.us = personal development / work biography
 *   (resume, enterprise delivery, client portfolio, contact)
 *
 * Keep URLs here so About, footer, and corporate stay in sync.
 * Override the published org origin with VITE_PUBLIC_SITE_URL when known.
 */

export const PERSONAL_SITE = {
  origin: "https://blaszyk.us",
  /** Primary work biography entry (SPA often lands on HomeConsulting). */
  workBio: "https://blaszyk.us/",
  label: "blaszyk.us",
  ownerName: "David Blaszyk",
  ownerTitle: "Founder",
  email: "david@blaszyk.us",
} as const;

/** This product site’s public origin when published (optional). */
export function publicSiteOrigin(): string | undefined {
  const fromEnv =
    typeof import.meta !== "undefined"
      ? (import.meta.env?.VITE_PUBLIC_SITE_URL as string | undefined)
      : undefined;
  if (fromEnv?.trim()) return fromEnv.replace(/\/$/, "");
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return undefined;
}

export const dualSiteNote =
  "Acornsoft is the organization product surface. Personal work history, resume, and enterprise portfolio live on blaszyk.us.";
