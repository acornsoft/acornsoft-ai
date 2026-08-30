/**
 * Climb Notes / Gnomah editor is owner-only.
 *
 * Enforcement chain (every mutation and editor list):
 * 1. Caller must already be signed in (authMiddleware → verified session user id).
 * 2. That user must have a linked X account (provider id grok-x / twitter / x).
 * 3. The X identity must match OWNER_X_HANDLES (default: acornsoftai), OR the
 *    Better Auth user id / X account id must be on an explicit env allowlist.
 *
 * Display names are not an authorization signal. Sign-in alone is not enough.
 * Google (or any non-X identity) cannot open Gnomah.
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
 * Match canonical X handle only (not display name).
 * Returns the canonical owner handle when matched.
 */
export function matchesOwnerIdentity(candidate: string): string | null {
  return matchesOwnerHandle(candidate);
}

/**
 * Derive identity candidates from X-linked handle-shaped fields.
 * Display names are ignored.
 */
function xIdentityCandidates(
  user: UserRow,
  xAccounts: AccountRow[],
): string[] {
  const out: string[] = [];
  const push = (v: string | null | undefined) => {
    if (!v) return;
    const n = normalizeHandle(v);
    if (n && looksLikeHandle(n) && !out.includes(n)) out.push(n);
  };

  push(user.name);

  if (user.email) {
    const local = user.email.split("@")[0];
    push(local);
  }

  for (const a of xAccounts) {
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
  if (!authConfigured && userId === DEV_USER_ID) {
    await recordOwnerClaim(userId, "dev-user");
    return { userId, handle: "dev-user" };
  }

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
      "This X account is not the Acornsoft owner. Sign in with @acornsoftai.",
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
