/**
 * Nitro / Vercel request gate: IP allowlist.
 * Inactive when IP_ALLOWLIST is empty (public site).
 *
 * Nitro auto-imports defineEventHandler / setResponseHeader / setResponseStatus.
 */
import {
  clientIpFromHeaders,
  evaluateAccess,
  forbiddenHtml,
  loadAllowlistConfig,
} from "../../src/lib/access/ip-allowlist";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default defineEventHandler((event: any) => {
  const config = loadAllowlistConfig();
  if (!config.enabled) return;

  const url = String(event.path ?? event.node?.req?.url ?? "/");
  const pathname = url.split("?")[0] || "/";

  const headers: Record<string, string | string[] | undefined> =
    event.node?.req?.headers ?? {};
  const ip =
    clientIpFromHeaders(headers, config.trustProxy) ||
    event.node?.req?.socket?.remoteAddress ||
    null;

  const result = evaluateAccess({ ip, pathname, config });
  if (result.allowed) return;

  console.warn(
    `[ip-allowlist] denied ip=${ip ?? "?"} path=${pathname} reason=${result.reason}`,
  );

  setResponseStatus(event, 403);
  setResponseHeader(event, "content-type", "text/html; charset=utf-8");
  setResponseHeader(event, "cache-control", "no-store");
  return forbiddenHtml(ip);
});
