/**
 * AES-256-GCM helpers for owner private secrets.
 * Key material is server-only (never shipped to the client).
 */
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  scryptSync,
} from "node:crypto";

const ALGO = "aes-256-gcm";
const KEY_LEN = 32;
const IV_LEN = 12;

function env(key: string): string | undefined {
  const v = process.env[key]?.trim();
  return v || undefined;
}

function isProductionLike(): boolean {
  const vercel = (env("VERCEL_ENV") ?? "").toLowerCase();
  if (vercel === "production" || vercel === "preview") return true;
  return Boolean(env("DATABASE_URL"));
}

/**
 * Derive a stable 32-byte key from the strongest available server secret.
 * Prefer OWNER_SECRETS_KEY; fall back to BETTER_AUTH_SECRET / AUTH_SECRET.
 * Production and any DATABASE_URL deploy fail closed if none are set.
 */
export function getSecretsMasterKey(): Buffer {
  const material =
    env("OWNER_SECRETS_KEY") ||
    env("BETTER_AUTH_SECRET") ||
    env("AUTH_SECRET");
  if (!material) {
    if (isProductionLike()) {
      throw new Error(
        "OWNER_SECRETS_KEY (or BETTER_AUTH_SECRET) is required to encrypt owner secrets.",
      );
    }
    throw new Error(
      "Set OWNER_SECRETS_KEY (or BETTER_AUTH_SECRET) before storing owner secrets.",
    );
  }
  return scryptSync(material, "acornsoft-owner-private-v1", KEY_LEN);
}

export type EncryptedBlob = {
  ciphertext: string; // base64
  iv: string; // base64
  authTag: string; // base64
  keyVersion: number;
};

export function encryptSecret(plaintext: string): EncryptedBlob {
  const key = getSecretsMasterKey();
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return {
    ciphertext: enc.toString("base64"),
    iv: iv.toString("base64"),
    authTag: tag.toString("base64"),
    keyVersion: 1,
  };
}

export function decryptSecret(blob: EncryptedBlob): string {
  const key = getSecretsMasterKey();
  const decipher = createDecipheriv(
    ALGO,
    key,
    Buffer.from(blob.iv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(blob.authTag, "base64"));
  const dec = Buffer.concat([
    decipher.update(Buffer.from(blob.ciphertext, "base64")),
    decipher.final(),
  ]);
  return dec.toString("utf8");
}

/** Non-reversible fingerprint for UI (last 4 chars only of the secret). */
export function secretLast4(plaintext: string): string {
  const t = plaintext.trim();
  if (t.length < 4) return "····";
  return t.slice(-4);
}

/** Hash for audit logs — never log plaintext. */
export function secretFingerprint(plaintext: string): string {
  return createHash("sha256").update(plaintext).digest("hex").slice(0, 12);
}
