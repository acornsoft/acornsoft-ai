import { i as getSql } from "./db-cbgaf9gY.mjs";
import { assertClimbNotesOwner } from "./owner.server-vwLgDOQH.mjs";
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/store.server-B3qUBS8t.js
/**
* AES-256-GCM helpers for owner private secrets.
* Key material is server-only (never shipped to the client).
*/
var ALGO = "aes-256-gcm";
var KEY_LEN = 32;
var IV_LEN = 12;
function env(key) {
	return process.env[key]?.trim() || void 0;
}
/**
* Derive a stable 32-byte key from the strongest available server secret.
* Prefer OWNER_SECRETS_KEY; fall back to BETTER_AUTH_SECRET / AUTH_SECRET.
*/
function getSecretsMasterKey() {
	return scryptSync(env("OWNER_SECRETS_KEY") || env("BETTER_AUTH_SECRET") || env("AUTH_SECRET") || "acornsoft-dev-owner-secrets-not-for-production", "acornsoft-owner-private-v1", KEY_LEN);
}
function encryptSecret(plaintext) {
	const key = getSecretsMasterKey();
	const iv = randomBytes(IV_LEN);
	const cipher = createCipheriv(ALGO, key, iv);
	const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
	const tag = cipher.getAuthTag();
	return {
		ciphertext: enc.toString("base64"),
		iv: iv.toString("base64"),
		authTag: tag.toString("base64"),
		keyVersion: 1
	};
}
function decryptSecret(blob) {
	const decipher = createDecipheriv(ALGO, getSecretsMasterKey(), Buffer.from(blob.iv, "base64"));
	decipher.setAuthTag(Buffer.from(blob.authTag, "base64"));
	return Buffer.concat([decipher.update(Buffer.from(blob.ciphertext, "base64")), decipher.final()]).toString("utf8");
}
/** Non-reversible fingerprint for UI (last 4 chars only of the secret). */
function secretLast4(plaintext) {
	const t = plaintext.trim();
	if (t.length < 4) return "····";
	return t.slice(-4);
}
var SECRET_X_API_BEARER = "x_api_bearer";
/**
* Owner private secrets store — server only.
* Plaintext never leaves this module except for server-side consumers
* (e.g. Canopy X pull). Client APIs only get status metadata.
*/
function toIso(v) {
	if (!v) return null;
	if (v instanceof Date) return v.toISOString();
	return String(v);
}
/** Status for the signed-in owner. Never returns ciphertext. */
async function getOwnerSecretStatus(userId, kind = SECRET_X_API_BEARER) {
	await assertClimbNotesOwner(userId);
	const row = (await (await getSql())`
    select ciphertext, iv, auth_tag, key_version, last4, updated_at
    from owner_private_secrets
    where user_id = ${userId} and secret_kind = ${kind}
    limit 1
  `)[0];
	if (!row) return {
		kind,
		configured: false,
		last4: null,
		updatedAt: null
	};
	return {
		kind,
		configured: true,
		last4: row.last4 || null,
		updatedAt: toIso(row.updated_at)
	};
}
/**
* Store or replace a secret for the owner.
* Rejects empty values. Overwrites previous ciphertext.
*/
async function setOwnerSecret(userId, kind, plaintext) {
	await assertClimbNotesOwner(userId);
	const value = plaintext.trim();
	if (!value || value.length < 20) throw new Error("Token looks too short — paste the full X App Bearer Token.");
	if (/\s/.test(value) || value.length > 2e3) throw new Error("Invalid token format.");
	const blob = encryptSecret(value);
	const last4 = secretLast4(value);
	await (await getSql())`
    insert into owner_private_secrets (
      user_id, secret_kind, ciphertext, iv, auth_tag, key_version, last4, updated_at
    ) values (
      ${userId},
      ${kind},
      ${blob.ciphertext},
      ${blob.iv},
      ${blob.authTag},
      ${blob.keyVersion},
      ${last4},
      now()
    )
    on conflict (user_id, secret_kind) do update set
      ciphertext = excluded.ciphertext,
      iv = excluded.iv,
      auth_tag = excluded.auth_tag,
      key_version = excluded.key_version,
      last4 = excluded.last4,
      updated_at = now()
  `;
	return getOwnerSecretStatus(userId, kind);
}
async function clearOwnerSecret(userId, kind = SECRET_X_API_BEARER) {
	await assertClimbNotesOwner(userId);
	await (await getSql())`
    delete from owner_private_secrets
    where user_id = ${userId} and secret_kind = ${kind}
  `;
	return {
		kind,
		configured: false,
		last4: null,
		updatedAt: null
	};
}
/**
* Decrypt for server use only (Canopy refresh).
* Returns undefined when not set. Never call from client-facing handlers
* that serialize the return value to the browser.
*/
async function readOwnerSecretPlaintext(userId, kind = SECRET_X_API_BEARER) {
	await assertClimbNotesOwner(userId);
	const row = (await (await getSql())`
    select ciphertext, iv, auth_tag, key_version, last4, updated_at
    from owner_private_secrets
    where user_id = ${userId} and secret_kind = ${kind}
    limit 1
  `)[0];
	if (!row) return void 0;
	const blob = {
		ciphertext: row.ciphertext,
		iv: row.iv,
		authTag: row.auth_tag,
		keyVersion: row.key_version
	};
	try {
		return decryptSecret(blob);
	} catch {
		return;
	}
}
/**
* Resolve an X Bearer for Canopy without a request session:
* 1) process env (ops)
* 2) any climb_notes_owner row that has a stored secret
*
* Used by cron /api/canopy/refresh. Never logs the token.
*/
async function resolveXBearerForCanopy() {
	const envToken = process.env.X_BEARER_TOKEN?.trim() || process.env.TWITTER_BEARER_TOKEN?.trim() || process.env.X_API_BEARER?.trim();
	if (envToken) return {
		token: envToken,
		source: "env"
	};
	const ownerId = (await (await getSql())`
    select s.user_id
    from owner_private_secrets s
    inner join climb_notes_owner o on o.user_id = s.user_id
    where s.secret_kind = ${SECRET_X_API_BEARER}
    order by s.updated_at desc
    limit 1
  `)[0]?.user_id;
	if (!ownerId) return { source: "none" };
	try {
		const token = await readOwnerSecretPlaintext(ownerId, SECRET_X_API_BEARER);
		if (token) return {
			token,
			source: "owner_secret"
		};
	} catch {}
	return { source: "none" };
}
//#endregion
export { clearOwnerSecret, getOwnerSecretStatus, resolveXBearerForCanopy, setOwnerSecret, SECRET_X_API_BEARER as t };
