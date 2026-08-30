import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { authMiddleware } from "@/lib/auth/middleware";
import {
  clientIpFromHeaders,
  evaluateAccess,
  loadAllowlistConfig,
} from "./ip-allowlist";

/** Owner-only diagnostic: what IP we see + whether allowlist would allow it. */
export const getAccessIpStatus = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { assertClimbNotesOwner } = await import(
      "@/lib/climb-notes/owner.server"
    );
    await assertClimbNotesOwner(context.userId);

    const config = loadAllowlistConfig();
    let ip: string | null = null;
    let path = "/";
    try {
      const req = getRequest();
      path = new URL(req.url).pathname;
      ip = clientIpFromHeaders(req.headers, config.trustProxy) || null;
    } catch {
      /* no request context */
    }
    const result = evaluateAccess({ ip, pathname: path, config });
    return {
      ip,
      allowed: result.allowed,
      reason: result.reason,
      allowlistEnabled: config.enabled,
      entryCount: config.entries.length,
      hasEntries: config.entries.length > 0,
    };
  });
