# Handoff: Acornsoft site → local Grok Build

**Purpose:** Bring a fresh/local Grok Build session up to speed on the Acornsoft production marketing + studio app. Paste this whole document as context, then attach or open the repo.

**Last updated:** 2026-07-31  
**Owner:** David Blaszyk / Acornsoft · X **@acornsoftai** · GitHub **acornsoft**  
**Repo:** https://github.com/acornsoft/acornsoft-ai (`acornsoft/acornsoft-ai`)  
**Product name:** Acornsoft — New York–based AI-first organization. “Building Production AI Solutions via Climb Notes™”

---

## 1. What this app is

| Surface | Path | Who |
| --- | --- | --- |
| Marketing home | `/` | Public |
| About, Service, Corporate, policies | `/about`, `/service`, `/corporate`, `/privacy`, `/policies`, `/procedures` | Public |
| Climb Notes journal | `/climb-notes` | Public (published); studio filter when signed in |
| Canopy (Radar) | `/canopy` | Public UI; live X pulls need Bearer |
| Login | `/login` | X-first; Google secondary (does **not** unlock Gnomah) |
| **Gnomah** (Climb Notes studio) | `/gnomah` | **Owner only** — X as **@acornsoftai** |

**Dual site:** org product here; personal work bio at **https://blaszyk.us/** (see §12).

---

## 2. Stack & run contracts

- React 19, TypeScript, Vite 8, TanStack Start, Tailwind v4, Better Auth, PGLite or `DATABASE_URL`, Nitro vercel on build.
- Preview: **`0.0.0.0:8080`**, maintain **`/workspace/startup.sh`**.
- Build: `vite build && node scripts/copy-vercel-runtime-assets.mjs && npm run db:migrate`
- Local prod: `node scripts/serve-prod.mjs 8090`

---

## 3. Standalone deploy fixes

1. PGLite binaries + `content/` packed via `scripts/copy-vercel-runtime-assets.mjs`
2. Climb Notes seeds via `import.meta.glob` + copied content
3. Soft PGLite bootstrap in `db.ts`
4. Auth `baseURL` falls back to `VERCEL_URL`

---

## 4. Auth / Gnomah

- **Not GitHub.** Gnomah requires **Sign in with X as @acornsoftai**.
- Gate: `src/lib/climb-notes/owner.server.ts`
- Google can session but cannot open Gnomah.

---

## 5. Env (deploy)

`DATABASE_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `GROK_AUTH_*`, optional `X_BEARER_TOKEN`, `CLIMB_NOTES_OWNER_*`, `CRON_SECRET`, `VITE_PUBLIC_SITE_URL`.

---

## 6–11. Architecture, workflows, smoke

See repo paths: `src/lib/auth/*`, `src/lib/climb-notes/*`, `src/lib/canopy/*`, `content/climb-notes/`, `scripts/*`.

---

## 12. Dual-site integration: Acornsoft ↔ blaszyk.us

| Site | Role |
| --- | --- |
| **This app** | AI-first org product — Climb Notes, Canopy, Gnomah, services |
| **https://blaszyk.us** | Personal work biography — resume, enterprise delivery, portfolio, contact |

Code: `src/lib/site-links.ts`, `personal-site-bridge.tsx`, About `#founder`, footer link, Corporate identity.

**On blaszyk.us (manual):** CTA back to published Acornsoft URL; link Gnomah/Climb Notes/Canopy when live.

---

## 13. Climb Notes “Sign in required” loop (fixed 2026-07-31)

**Symptom:** Client looks signed in; Gnomah/server fns spam **“Sign in required”**.

**Cause:** Better Auth `session.cookieCache` could return a user id after PGLite restart/wipe while the `user` row was gone. Owner check then threw `ForbiddenOwnerError("Sign in required")` instead of a clean 401.

**Fix:**
- `getSessionUser` always uses `disableCookieCache: true` (DB-backed session).
- Missing user row → `UnauthorizedError("Session expired…")` not owner-forbidden.
- Gnomah clears session and redirects to `/login?redirect=/gnomah` on auth errors.

**Owner path still requires:** Sign in with **X as @acornsoftai** (not Google).

---

## One-line summary

> Acornsoft is a TanStack Start marketing + Climb Notes studio site: Gnomah is X-owner-only (@acornsoftai); dual-site bridge to blaszyk.us; standalone build packs PGLite via copy-vercel-runtime-assets; session resolution is DB-backed to avoid stale “Sign in required” loops.
