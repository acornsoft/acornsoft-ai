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

import { CANONICAL_ORIGIN } from "./site-origin";

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
    const origin = window.location.origin.replace(/\/$/, "");
    if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
      return origin;
    }
    if (origin.includes("acornsoft.ai")) return CANONICAL_ORIGIN;
    return origin;
  }
  if (typeof process !== "undefined" && process.env?.VERCEL_ENV === "production") {
    return CANONICAL_ORIGIN;
  }
  return undefined;
}

export const dualSiteNote =
  "Acornsoft is HQ. Luna Foundry Multiagent is the kit. The work record — resume, customers, contact — lives on blaszyk.us.";
