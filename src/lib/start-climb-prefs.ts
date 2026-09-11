const LS_KEY = "ac-start-climb-identity";

export type StartClimbIdentity = {
  name: string;
  email: string;
};

function isIdentity(value: unknown): value is StartClimbIdentity {
  if (!value || typeof value !== "object") return false;
  const rec = value as Record<string, unknown>;
  return typeof rec.name === "string" && typeof rec.email === "string";
}

export function hasMeaningful(value: string): boolean {
  return value.trim().length > 0;
}

export function loadStartClimbIdentity(): StartClimbIdentity | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isIdentity(parsed)) return null;
    const name = parsed.name.trim();
    const email = parsed.email.trim();
    if (!name && !email) return null;
    return { name, email };
  } catch {
    return null;
  }
}

export function saveStartClimbIdentity(identity: StartClimbIdentity): void {
  if (typeof window === "undefined") return;
  const name = identity.name.trim();
  const email = identity.email.trim();
  if (!name && !email) return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify({ name, email }));
  } catch {
    /* quota / private mode */
  }
}

export function clearStartClimbIdentity(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LS_KEY);
  } catch {
    /* private mode */
  }
}

export function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
