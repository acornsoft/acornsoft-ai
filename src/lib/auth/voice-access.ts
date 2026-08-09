import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";

/**
 * Voice is only offered when the signed-in user has a linked X account.
 * External Voice URL is public, but site CTAs stay gated to that identity.
 */
export const getVoiceAccess = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<{ allowed: boolean; viaX: boolean }> => {
    const { isXProvider } = await import("@/lib/climb-notes/owner.server");
    const { authConfigured, DEV_USER_ID } = await import(
      "@/lib/auth/verify.server"
    );
    const { getSql } = await import("@/lib/db");

    // Local auth-off: allow so owner tooling remains usable in preview without OAuth.
    if (!authConfigured && context.userId === DEV_USER_ID) {
      return { allowed: true, viaX: false };
    }

    const sql = await getSql();
    const accounts = await sql<{ providerId: string }>`
      select "providerId" as "providerId"
      from account
      where "userId" = ${context.userId}
    `;
    const viaX = accounts.some((a) => isXProvider(a.providerId));
    return { allowed: viaX, viaX };
  });
