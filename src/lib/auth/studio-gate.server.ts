/**
 * Server-only map from the public sign-in token `studio` to the owner route.
 * The route slug stays here so anonymous HTML and login URLs do not carry it.
 */

const STUDIO_PATH = "/gnomah";

export function studioPath(): string {
  return STUDIO_PATH;
}

function isSafeAppPath(value: string): boolean {
  return value.startsWith("/") && !value.startsWith("//") && !value.includes("\\");
}

/** True when a public login `redirect` param names the owner route. */
export function redirectNamesStudio(value: string | undefined): boolean {
  if (!value) return false;
  const path = value.split(/[?#]/, 1)[0] ?? value;
  return path === STUDIO_PATH || path.startsWith(`${STUDIO_PATH}/`);
}

/**
 * Where sign-in should return. `next=studio` and a bare login both return to
 * the owner route. Any other safe in-app path is used as given.
 */
export function destinationForSignIn(input: {
  next?: string;
  redirect?: string;
}): string {
  if (input.next === "studio" || redirectNamesStudio(input.redirect)) {
    return STUDIO_PATH;
  }
  const redirect = input.redirect?.trim();
  if (redirect && isSafeAppPath(redirect)) return redirect;
  if (!redirect && !input.next) return STUDIO_PATH;
  return "/";
}

export type StudioGateReason = "owner" | "anon" | "denied";

/** Fail closed: anonymous and non-owners never receive the owner document. */
export async function decideStudioGate(): Promise<{ reason: StudioGateReason }> {
  const { authConfigured, getSessionUser } = await import("./verify.server");
  const { isClimbNotesOwner } = await import("@/lib/climb-notes/owner.server");

  if (!authConfigured) return { reason: "owner" };

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
