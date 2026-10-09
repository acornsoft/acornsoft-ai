/**
 * Same-origin path checks for sign-in return URLs.
 * Plain ESM so `node scripts/check-studio-gate.mjs` runs on Node 20.
 * The retired studio slug stays here (a storage/route identifier), not in
 * visitor HTML or downloaded scripts.
 */

const STUDIO_PATH = "/studio";
const LEGACY_STUDIO_SLUG = "gnomah";
const UNSAFE_PATH_CHAR = /[\u0000-\u001F\u007F\\]/;

export function studioPath() {
  return STUDIO_PATH;
}

/**
 * Same-origin app path only. Control characters and backslashes are rejected
 * before and after decoding, so `/\t/evil.com` and `/%2f%2fevil.com` cannot
 * pass a prefix check and then collapse into a protocol-relative URL.
 */
export function isSafeAppPath(value) {
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

function decodedPath(value) {
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    decoded = value;
  }
  const path = decoded.split(/[?#]/, 1)[0] ?? decoded;
  return path.replace(/\/+$/, "") || "/";
}

/** A return path of /login drops the page the visitor actually wanted. */
export function isLoginReturnPath(value) {
  const path = decodedPath(value).toLowerCase();
  return path === "/login" || path.startsWith("/login/");
}

/** Any case, trailing slash, or extra segment of the retired studio path. */
export function isLegacyStudioPath(value) {
  if (!value) return false;
  const lower = decodedPath(value).toLowerCase();
  const root = `/${LEGACY_STUDIO_SLUG}`;
  return lower === root || lower.startsWith(`${root}/`);
}

/** True when a public login `redirect` param names the retired studio path. */
export function redirectNamesStudio(value) {
  return isLegacyStudioPath(value);
}

/**
 * Where sign-in should return. `next=studio` and a bare login both return to
 * the owner route. A safe in-app path is used as given. `/login` is not a
 * return path — it would replace the page the visitor asked for.
 */
export function destinationForSignIn(input) {
  const next = input?.next;
  const redirect = input?.redirect?.trim();
  if (next === "studio") return STUDIO_PATH;
  if (redirect && isLegacyStudioPath(redirect)) {
    const queryAt = redirect.indexOf("?");
    const search = queryAt >= 0 ? redirect.slice(queryAt).split("#", 1)[0] : "";
    return `${STUDIO_PATH}${search}`;
  }
  if (redirect && isLoginReturnPath(redirect)) return "/";
  if (redirect && isSafeAppPath(redirect)) return redirect;
  if (!redirect && !next) return STUDIO_PATH;
  return "/";
}

/**
 * Anonymous return path for /work. Keeps a same-origin query string.
 * A query that fails the path check is dropped; the path itself stays.
 */
export function workReturnTarget(pathname, search) {
  const path = typeof pathname === "string" ? pathname : "";
  const underWork = path === "/work" || path.startsWith("/work/");
  if (!underWork || path.includes("..") || !isSafeAppPath(path)) return "/work";
  if (typeof search !== "string" || search.length === 0) return path;
  if (!search.startsWith("?") || search.includes("#")) return path;
  const combined = `${path}${search}`;
  if (!isSafeAppPath(combined)) return path;
  return combined;
}

/**
 * Auth-off owner bypass is dev-only. Production builds fail closed even when
 * sign-in is switched off, so a production bundle never treats every visitor
 * as the owner.
 */
export function authOffAllowsOwner() {
  if (process.env.NODE_ENV === "production") return false;
  if (process.env.NODE_ENV === "development") return true;
  try {
    return import.meta.env.DEV === true;
  } catch {
    return false;
  }
}
