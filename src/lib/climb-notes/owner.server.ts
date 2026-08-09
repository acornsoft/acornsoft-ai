/**
 * Climb Notes / Gnomah editor is owner-only.
 *
 * Enforcement chain (every mutation and editor list):
 * 1. Caller must already be signed in (authMiddleware → verified session user id).
 * 2. That user must have a linked X account (provider id grok-x / twitter / x).
 * 3. The X identity must match OWNER_X_HANDLES (default: acornsoftai), OR a known
 *    display-name alias of that handle (e.g. Blaze → @acornsoftai), OR the
 *    Better Auth user id / X account id must be on an explicit env allowlist.
 *
 * Sign-in alone is not enough. Google (or any non-X identity) cannot open Gnomah.
 * A prior climb_notes_owner row is only a claim log — access is re-checked each time.
 */
import { getSql } from "@/lib/db";
import {
  authConfigured,
  DEV_USER_ID,
  UnauthorizedError,
} from "@/lib/auth/verify.server";

/** X handles allowed to edit Climb Notes (no @). Primary gate. */
export const OWNER_X_HANDLES = ["acornsoftai"] as const;

/**
 * Display-name aliases for owner handles (same person).
 * X often shows a profile name (Blaze) while the handle is @acornsoftai.
 * When the broker only returns the display name, we still match the owner.
 */
export const OWNER_DISPLAY_ALIASES: Record<string, (typeof OWNER_X_HANDLES)[number]> =
  {
    blaze: "acornsoftai",
  };

export class ForbiddenOwnerError extends Error {
  readonly status = 403;
  constructor(message = "Only the Acornsoft owner may edit Climb Notes") {
    super(message);
    this.name = "ForbiddenOwnerError";
  }
}

function normalizeHandle(raw: string | null | undefined): string {
  return (raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/^@+/, "")
    .replace(/\s+/g, "");
}

/** True when a string looks like an X handle candidate (not a multi-word display name). */
function looksLikeHandle(raw: string): boolean {
  const n = normalizeHandle(raw);
  // X handles: 1–15 chars, alphanumeric + underscore
  return /^[a-z0-9_]{1,15}$/.test(n);
}

function splitEnvList(key: string): string[] {
  const raw = process.env[key]?.trim();
  if (!raw) return [];
  return raw
    .split(/[,;\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Better Auth user ids explicitly allowed (production bootstrap). */
function envOwnerUserIds(): string[] {
  return splitEnvList("CLIMB_NOTES_OWNER_USER_IDS");
}

/**
 * Numeric X account ids (account.accountId from provider grok-x).
 * Use when the broker stores a numeric id and the handle is unreliable.
 */
function envOwnerXAccountIds(): string[] {
  return splitEnvList("CLIMB_NOTES_OWNER_X_ACCOUNT_IDS");
}

type AccountRow = { providerId: string; accountId: string };
type UserRow = { id: string; name: string; email: string };

/** Strict: only X / Twitter federation providers count as "signed in with X". */
export function isXProvider(providerId: string): boolean {
  const p = providerId.toLowerCase().trim();
  if (!p) return false;
  if (p === "twitter" || p === "x" || p === "grok-x") return true;
  // Broker local ids are typically "grok-x"; never match bare "x" inside other names
  if (p.startsWith("grok-x") || p.endsWith("-twitter") || p.startsWith("twitter-")) {
    return true;
  }
  return false;
}

function matchesOwnerHandle(candidate: string): string | null {
  const n = normalizeHandle(candidate);
  if (!n || !looksLikeHandle(n)) return null;
  for (const h of OWNER_X_HANDLES) {
    if (n === h) return h;
  }
  return null;
}

/**
 * Match handle OR known display alias (Blaze → acornsoftai).
 * Returns the canonical owner handle when matched.
 */
export function matchesOwnerIdentity(candidate: string): string | null {
  const byHandle = matchesOwnerHandle(candidate);
  if (byHandle) return byHandle;

  const n = normalizeHandle(candidate);
  if (!n) return null;

  const aliasTarget = OWNER_DISPLAY_ALIASES[n];
  if (aliasTarget) return aliasTarget;

  // Multi-word names: first token only if it is a known alias (e.g. "Blaze AI")
  const first = n.split(/[^a-z0-9_]+/)[0];
  if (first && OWNER_DISPLAY_ALIASES[first]) {
    return OWNER_DISPLAY_ALIASES[first];
  }

  return null;
}

/**
 * Derive identity candidates from X-linked fields + display name.
 * Display name is kept so aliases like Blaze still match when the broker
 * did not send preferred_username.
 */
function xIdentityCandidates(
  user: UserRow,
  xAccounts: AccountRow[],
): string[] {
  const out: string[] = [];
  const push = (v: string | null | undefined) => {
    if (!v) return;
    const n = normalizeHandle(v);
    if (n && !out.includes(n)) out.push(n);
    // Also keep original-ish for alias map (already normalized)
  };

  // Preferred: user.name after mapProfileToUser maps preferred_username
  push(user.name);

  // Synthetic X emails often use handle as local-part (e.g. acornsoftai@…)
  if (user.email) {
    const local = user.email.split("@")[0];
    push(local);
  }

  for (const a of xAccounts) {
    // accountId is numeric for many X flows — only keep handle-shaped ids
    if (looksLikeHandle(a.accountId)) push(a.accountId);
  }

  return out;
}

async function recordOwnerClaim(userId: string, handle: string): Promise<void> {
  const sql = await getSql();
  await sql`
    insert into climb_notes_owner (user_id, handle)
    values (${userId}, ${handle})
    on conflict (user_id) do update set handle = excluded.handle
  `;
}

/**
 * Verify the signed-in user may use the Gnomah Climb Notes editor.
 * Throws ForbiddenOwnerError when not the owner.
 * Throws UnauthorizedError when the session id has no matching user row
 * (stale cookie / wiped preview DB) — client should re-authenticate.
 */
export async function assertClimbNotesOwner(userId: string): Promise<{
  userId: string;
  handle: string;
}> {
  // Auth off + local PGLite: allow the shared dev user so the editor is usable offline.
  if (!authConfigured && userId === DEV_USER_ID) {
    await recordOwnerClaim(userId, "dev-user");
    return { userId, handle: "dev-user" };
  }

  // Explicit Better Auth user id allowlist (ops override; still re-checked each call).
  if (envOwnerUserIds().includes(userId)) {
    await recordOwnerClaim(userId, "env-allowlist");
    return { userId, handle: "env-allowlist" };
  }

  const sql = await getSql();

  const users = await sql<UserRow>`
    select id, name, email from "user" where id = ${userId} limit 1
  `;
  const user = users[0];
  if (!user) {
    // Session token resolved to an id that is not in the DB (preview restart,
    // rotated secret, or cookie-cache ghost). Force re-login — not "forbidden owner".
    throw new UnauthorizedError(
      "Session expired. Sign in again with X as @acornsoftai.",
    );
  }

  const accounts = await sql<AccountRow>`
    select "providerId" as "providerId", "accountId" as "accountId"
    from account
    where "userId" = ${userId}
  `;

  const xAccounts = accounts.filter((a) => isXProvider(a.providerId));
  if (xAccounts.length === 0) {
    throw new ForbiddenOwnerError(
      "Sign in with X as @acornsoftai to edit Climb Notes. Other providers cannot open Gnomah.",
    );
  }

  // Numeric X account id allowlist (when handle is not available from the broker).
  const allowedXIds = new Set(envOwnerXAccountIds().map((s) => s.toLowerCase()));
  if (allowedXIds.size > 0) {
    for (const a of xAccounts) {
      if (allowedXIds.has(a.accountId.toLowerCase())) {
        await recordOwnerClaim(userId, "x-account-allowlist");
        return { userId, handle: "x-account-allowlist" };
      }
    }
  }

  const candidates = xIdentityCandidates(user, xAccounts);
  let matched: string | null = null;
  for (const c of candidates) {
    matched = matchesOwnerIdentity(c);
    if (matched) break;
  }

  if (!matched) {
    throw new ForbiddenOwnerError(
      "This X account is not the Acornsoft owner. Sign in with @acornsoftai (profile name Blaze is fine when that account is linked).",
    );
  }

  await recordOwnerClaim(userId, matched);
  return { userId, handle: matched };
}

/** Soft check for UI (does not throw). */
export async function isClimbNotesOwner(
  userId: string | null | undefined,
): Promise<boolean> {
  if (!userId) return false;
  try {
    await assertClimbNotesOwner(userId);
    return true;
  } catch {
    return false;
  }
}
