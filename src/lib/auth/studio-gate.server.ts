/**
 * Server-only map from the public sign-in token `studio` to the owner route.
 * The retired path stays in this file so anonymous HTML, headers, and
 * downloaded scripts do not carry it.
 */

const STUDIO_PATH = "/studio";
const LEGACY_STUDIO_SLUG = "gnomah";

export function studioPath(): string {
  return STUDIO_PATH;
}

const UNSAFE_PATH_CHAR = /[\u0000-\u001F\u007F\\]/;

/**
 * Same-origin app path only. Control characters and backslashes are rejected
 * before and after decoding, so `/\t/evil.com` and `/%2f%2fevil.com` cannot
 * pass a prefix check and then collapse into a protocol-relative URL.
 */
export function isSafeAppPath(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed.startsWith("/")) return false;
  if (UNSAFE_PATH_CHAR.test(trimmed)) return false;
  let decoded = trimmed;
  try {
    decoded = decodeURIComponent(trimmed);
  } catch {
    return false;
  }
  if (UNSAFE_PATH_CHAR.test(decoded)) return false;
  return decoded.startsWith("/") && !decoded.startsWith("//");
}

/** Any case, trailing slash, or extra segment of the retired studio path. */
export function isLegacyStudioPath(value: string | undefined): boolean {
  if (!value) return false;
  let path = value.split(/[?#]/, 1)[0] ?? value;
  try {
    path = decodeURIComponent(path);
  } catch {
    // Keep the raw path when it is not valid encoding.
  }
  const trimmed = path.replace(/\/+$/, "") || "/";
  const lower = trimmed.toLowerCase();
  const root = `/${LEGACY_STUDIO_SLUG}`;
  return lower === root || lower.startsWith(`${root}/`);
}

/** True when a public login `redirect` param names the retired studio path. */
export function redirectNamesStudio(value: string | undefined): boolean {
  return isLegacyStudioPath(value);
}

/**
 * Where sign-in should return. `next=studio` and a bare login both return to
 * the owner route. Any other safe in-app path is used as given.
 */
export function destinationForSignIn(input: {
  next?: string;
  redirect?: string;
}): string {
  if (input.next === "studio") return STUDIO_PATH;
  const redirect = input.redirect?.trim();
  if (redirect && isLegacyStudioPath(redirect)) {
    const queryAt = redirect.indexOf("?");
    const search = queryAt >= 0 ? redirect.slice(queryAt).split("#", 1)[0] : "";
    return `${STUDIO_PATH}${search}`;
  }
  if (redirect && isSafeAppPath(redirect)) return redirect;
  if (!redirect && !input.next) return STUDIO_PATH;
  return "/";
}

/**
 * First-hop destination for a retired studio URL.
 * Anonymous visitors go straight to the public login token.
 * Owners keep their query string on the live studio route.
 */
export async function legacyStudioDestination(
  pathname: string,
  requestUrl: string,
): Promise<string | null> {
  if (!isLegacyStudioPath(pathname)) return null;
  const gate = await decideStudioGate();
  switch (gate.reason) {
    case "owner": {
      let search = "";
      try {
        search = new URL(requestUrl).search;
      } catch {
        search = "";
      }
      return `${STUDIO_PATH}${search}`;
    }
    case "denied":
      return "/";
    case "anon":
      return "/login?next=studio";
    default: {
      const _exhaustive: never = gate.reason;
      return _exhaustive;
    }
  }
}

export type StudioGateReason = "owner" | "anon" | "denied";

/**
 * Auth-off owner bypass is dev-only. Production builds fail closed even when
 * sign-in is switched off, so a production bundle never treats every visitor
 * as the owner.
 */
export function authOffAllowsOwner(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  if (process.env.NODE_ENV === "development") return true;
  try {
    return import.meta.env.DEV === true;
  } catch {
    return false;
  }
}

/** Fail closed: anonymous and non-owners never receive the owner document. */
export async function decideStudioGate(): Promise<{ reason: StudioGateReason }> {
  const { authConfigured, getSessionUser } = await import("./verify.server");
  const { isClimbNotesOwner } = await import("@/lib/climb-notes/owner.server");

  if (!authConfigured) {
    return { reason: authOffAllowsOwner() ? "owner" : "denied" };
  }

  let user: { id: string } | null = null;
  try {
    user = await getSessionUser();
  } catch {
    return { reason: "anon" };
  }
  if (!user) return { reason: "anon" };

  try {
    const owner = await isClimbNotesOwner(user.id);
    return owner ? { reason: "owner" } : { reason: "denied" };
  } catch {
    return { reason: "denied" };
  }
}
