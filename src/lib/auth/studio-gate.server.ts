/**
 * Server-only map from the public sign-in token `studio` to the owner route.
 * Path checks live in studio-path.mjs so the Node 20 check script and this
 * module share one implementation. The retired slug stays in that module.
 */
import {
  authOffAllowsOwner,
  isLegacyStudioPath,
  studioPath,
} from "./studio-path.mjs";

export {
  authOffAllowsOwner,
  destinationForSignIn,
  isLegacyStudioPath,
  isLoginReturnPath,
  isSafeAppPath,
  redirectNamesStudio,
  studioPath,
} from "./studio-path.mjs";

const STUDIO_PATH = studioPath();

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
