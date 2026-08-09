import { i as getSql } from "./db-cbgaf9gY.mjs";
import { r as authConfigured } from "./server-ilFhfuWJ.mjs";
import "./verify.server-CkjR2gyT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/owner.server-vwLgDOQH.js
/**
* Climb Notes / Gnomah editor is owner-only.
*
* Enforcement chain (every mutation and editor list):
* 1. Caller must already be signed in (authMiddleware → verified session user id).
* 2. That user must have a linked X account (provider id grok-x / twitter / x).
* 3. The X identity must match OWNER_X_HANDLES (default: acornsoftai), OR the
*    Better Auth user id / X account id must be on an explicit env allowlist.
*
* Sign-in alone is not enough. Google (or any non-X identity) cannot open Gnomah.
* A prior climb_notes_owner row is only a claim log — access is re-checked each time.
*/
/** X handles allowed to edit Climb Notes (no @). Primary gate. */
var OWNER_X_HANDLES = ["acornsoftai"];
var ForbiddenOwnerError = class extends Error {
	status = 403;
	constructor(message = "Only the Acornsoft owner may edit Climb Notes") {
		super(message);
		this.name = "ForbiddenOwnerError";
	}
};
function normalizeHandle(raw) {
	return (raw ?? "").trim().toLowerCase().replace(/^@+/, "").replace(/\s+/g, "");
}
/** True when a string looks like an X handle candidate (not a display name). */
function looksLikeHandle(raw) {
	const n = normalizeHandle(raw);
	return /^[a-z0-9_]{1,15}$/.test(n);
}
function splitEnvList(key) {
	const raw = process.env[key]?.trim();
	if (!raw) return [];
	return raw.split(/[,;\s]+/).map((s) => s.trim()).filter(Boolean);
}
/** Better Auth user ids explicitly allowed (production bootstrap). */
function envOwnerUserIds() {
	return splitEnvList("CLIMB_NOTES_OWNER_USER_IDS");
}
/**
* Numeric X account ids (account.accountId from provider grok-x).
* Use when the broker stores a numeric id and the handle is unreliable.
*/
function envOwnerXAccountIds() {
	return splitEnvList("CLIMB_NOTES_OWNER_X_ACCOUNT_IDS");
}
/** Strict: only X / Twitter federation providers count as "signed in with X". */
function isXProvider(providerId) {
	const p = providerId.toLowerCase().trim();
	if (!p) return false;
	if (p === "twitter" || p === "x" || p === "grok-x") return true;
	if (p.startsWith("grok-x") || p.endsWith("-twitter") || p.startsWith("twitter-")) return true;
	return false;
}
function matchesOwnerHandle(candidate) {
	const n = normalizeHandle(candidate);
	if (!n || !looksLikeHandle(n)) return null;
	for (const h of OWNER_X_HANDLES) if (n === h) return h;
	return null;
}
/**
* Derive handle candidates only from X-linked identity fields.
* Does not accept arbitrary Google display names.
*/
function xHandleCandidates(user, xAccounts) {
	const out = [];
	const push = (v) => {
		if (!v) return;
		const n = normalizeHandle(v);
		if (n && !out.includes(n)) out.push(n);
	};
	push(user.name);
	if (user.email) {
		const local = user.email.split("@")[0];
		push(local);
	}
	for (const a of xAccounts) if (looksLikeHandle(a.accountId)) push(a.accountId);
	return out;
}
async function recordOwnerClaim(userId, handle) {
	await (await getSql())`
    insert into climb_notes_owner (user_id, handle)
    values (${userId}, ${handle})
    on conflict (user_id) do update set handle = excluded.handle
  `;
}
/**
* Verify the signed-in user may use the Gnomah Climb Notes editor.
* Throws ForbiddenOwnerError when not the owner.
*/
async function assertClimbNotesOwner(userId) {
	if (!authConfigured && userId === "dev-user") {
		await recordOwnerClaim(userId, "dev-user");
		return {
			userId,
			handle: "dev-user"
		};
	}
	if (envOwnerUserIds().includes(userId)) {
		await recordOwnerClaim(userId, "env-allowlist");
		return {
			userId,
			handle: "env-allowlist"
		};
	}
	const sql = await getSql();
	const user = (await sql`
    select id, name, email from "user" where id = ${userId} limit 1
  `)[0];
	if (!user) throw new ForbiddenOwnerError("Sign in required");
	const xAccounts = (await sql`
    select "providerId" as "providerId", "accountId" as "accountId"
    from account
    where "userId" = ${userId}
  `).filter((a) => isXProvider(a.providerId));
	if (xAccounts.length === 0) throw new ForbiddenOwnerError("Sign in with X as @acornsoftai to edit Climb Notes. Other providers cannot open Gnomah.");
	const allowedXIds = new Set(envOwnerXAccountIds().map((s) => s.toLowerCase()));
	if (allowedXIds.size > 0) {
		for (const a of xAccounts) if (allowedXIds.has(a.accountId.toLowerCase())) {
			await recordOwnerClaim(userId, "x-account-allowlist");
			return {
				userId,
				handle: "x-account-allowlist"
			};
		}
	}
	const candidates = xHandleCandidates(user, xAccounts);
	let matched = null;
	for (const c of candidates) {
		matched = matchesOwnerHandle(c);
		if (matched) break;
	}
	if (!matched) throw new ForbiddenOwnerError("This X account is not the Acornsoft owner. Sign in with @acornsoftai.");
	await recordOwnerClaim(userId, matched);
	return {
		userId,
		handle: matched
	};
}
//#endregion
export { ForbiddenOwnerError, assertClimbNotesOwner, isXProvider };
