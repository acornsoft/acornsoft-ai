import { createServerFn } from "@tanstack/react-start";

/** Public login token. The owner route slug is resolved only on the server. */
export const STUDIO_NEXT = "studio" as const;

export type StudioGateReason = "owner" | "anon" | "denied";

export const gateStudioRoute = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ reason: StudioGateReason }> => {
    // Server-only session check. Importing it here keeps the route slug off the client.
    const { decideStudioGate } = await import("./studio-gate.server");
    return decideStudioGate();
  },
);

export const resolveSignInDestination = createServerFn({ method: "POST" })
  .validator((data: { next?: string; redirect?: string } | undefined) => ({
    next: typeof data?.next === "string" ? data.next : undefined,
    redirect: typeof data?.redirect === "string" ? data.redirect : undefined,
  }))
  .handler(async ({ data }) => {
    const { destinationForSignIn } = await import("./studio-gate.server");
    return { path: destinationForSignIn(data) };
  });

/**
 * Login link search. The owner route is requested as `?next=studio`, never as
 * a path in the query string.
 */
export function loginSearchFor(
  loginRedirect: string,
): { next: typeof STUDIO_NEXT } | { redirect: string } {
  if (loginRedirect === STUDIO_NEXT) return { next: STUDIO_NEXT };
  return { redirect: loginRedirect };
}

export const loginQueryLeaksStudio = createServerFn({ method: "POST" })
  .validator((data: { redirect?: string } | undefined) => ({
    redirect: typeof data?.redirect === "string" ? data.redirect : undefined,
  }))
  .handler(async ({ data }) => {
    const { redirectNamesStudio } = await import("./studio-gate.server");
    return { leak: redirectNamesStudio(data.redirect) };
  });
