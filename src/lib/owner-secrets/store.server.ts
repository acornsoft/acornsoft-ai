/**
 * Owner private secrets store — server only.
 * Plaintext never leaves this module except for server-side consumers
 * (e.g. Canopy X pull). Client APIs only get status metadata.
 */
import { getSql } from "@/lib/db";
import { assertClimbNotesOwner } from "@/lib/climb-notes/owner.server";
import {
  decryptSecret,
  encryptSecret,
  secretLast4,
  type EncryptedBlob,
} from "./crypto.server";

import {
  SECRET_X_API_BEARER,
  type OwnerSecretKind,
  type OwnerSecretStatus,
} from "./types";

export { SECRET_X_API_BEARER, type OwnerSecretKind, type OwnerSecretStatus };

type SecretRow = {
  ciphertext: string;
  iv: string;
  auth_tag: string;
  key_version: number;
  last4: string;
  updated_at: string | Date;
};

function toIso(v: string | Date | null | undefined): string | null {
  if (!v) return null;
  if (v instanceof Date) return v.toISOString();
  return String(v);
}

/** Status for the signed-in owner. Never returns ciphertext. */
export async function getOwnerSecretStatus(
  userId: string,
  kind: OwnerSecretKind = SECRET_X_API_BEARER,
): Promise<OwnerSecretStatus> {
  await assertClimbNotesOwner(userId);
  const sql = await getSql();
  const rows = await sql<SecretRow>`
    select ciphertext, iv, auth_tag, key_version, last4, updated_at
    from owner_private_secrets
    where user_id = ${userId} and secret_kind = ${kind}
    limit 1
  `;
  const row = rows[0];
  if (!row) {
    return { kind, configured: false, last4: null, updatedAt: null };
  }
  return {
    kind,
    configured: true,
    last4: row.last4 || null,
    updatedAt: toIso(row.updated_at),
  };
}

/**
 * Store or replace a secret for the owner.
 * Rejects empty values. Overwrites previous ciphertext.
 */
export async function setOwnerSecret(
  userId: string,
  kind: OwnerSecretKind,
  plaintext: string,
): Promise<OwnerSecretStatus> {
  await assertClimbNotesOwner(userId);
  const value = plaintext.trim();
  if (!value || value.length < 20) {
    throw new Error("Token looks too short — paste the full X App Bearer Token.");
  }
  if (/^xai[-_]/i.test(value)) {
    throw new Error(
      "That is an xAI / Grok key (console.x.ai). Canopy needs an X App Bearer Token from developer.x.com → App → Keys and tokens.",
    );
  }
  if (/\s/.test(value) || value.length > 2000) {
    throw new Error("Invalid token format.");
  }


  const blob = encryptSecret(value);
  const last4 = secretLast4(value);
  const sql = await getSql();
  await sql`
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

export async function clearOwnerSecret(
  userId: string,
  kind: OwnerSecretKind = SECRET_X_API_BEARER,
): Promise<OwnerSecretStatus> {
  await assertClimbNotesOwner(userId);
  const sql = await getSql();
  await sql`
    delete from owner_private_secrets
    where user_id = ${userId} and secret_kind = ${kind}
  `;
  return { kind, configured: false, last4: null, updatedAt: null };
}

/**
 * Decrypt for server use only (Canopy refresh).
 * Returns undefined when not set. Never call from client-facing handlers
 * that serialize the return value to the browser.
 */
export async function readOwnerSecretPlaintext(
  userId: string,
  kind: OwnerSecretKind = SECRET_X_API_BEARER,
): Promise<string | undefined> {
  await assertClimbNotesOwner(userId);
  const sql = await getSql();
  const rows = await sql<SecretRow>`
    select ciphertext, iv, auth_tag, key_version, last4, updated_at
    from owner_private_secrets
    where user_id = ${userId} and secret_kind = ${kind}
    limit 1
  `;
  const row = rows[0];
  if (!row) return undefined;
  const blob: EncryptedBlob = {
    ciphertext: row.ciphertext,
    iv: row.iv,
    authTag: row.auth_tag,
    keyVersion: row.key_version,
  };
  try {
    return decryptSecret(blob);
  } catch {
    return undefined;
  }
}

/**
 * Resolve an X Bearer for Canopy without a request session:
 * 1) process env (ops)
 * 2) any climb_notes_owner row that has a stored secret
 *
 * Used by cron /api/canopy/refresh. Never logs the token.
 */
export async function resolveXBearerForCanopy(): Promise<{
  token?: string;
  source: "env" | "owner_secret" | "none";
}> {
  const envToken =
    process.env.X_BEARER_TOKEN?.trim() ||
    process.env.TWITTER_BEARER_TOKEN?.trim() ||
    process.env.X_API_BEARER?.trim();
  if (envToken) return { token: envToken, source: "env" };

  const sql = await getSql();
  const rows = await sql<{
    user_id: string;
    ciphertext: string;
    iv: string;
    auth_tag: string;
    key_version: number;
  }>`
    select s.user_id, s.ciphertext, s.iv, s.auth_tag, s.key_version
    from owner_private_secrets s
    left join climb_notes_owner o on o.user_id = s.user_id
    where s.secret_kind = ${SECRET_X_API_BEARER}
    order by (o.user_id is not null) desc, s.updated_at desc
    limit 1
  `;
  const row = rows[0];
  if (!row) return { source: "none" };
  try {
    const token = decryptSecret({
      ciphertext: row.ciphertext,
      iv: row.iv,
      authTag: row.auth_tag,
      keyVersion: row.key_version,
    });
    if (token?.trim()) return { token: token.trim(), source: "owner_secret" };
  } catch {
    /* decrypt failed */
  }
  return { source: "none" };
}

