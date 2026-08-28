/**
 * Production only: HTTPS + www.
 * Apex TLS is issued by Vercel once acornsoft.ai is a project domain.
 * Until then this redirect only helps after a valid handshake.
 */
import { APEX_HOST, CANONICAL_HOST } from "../../src/lib/site-origin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default defineEventHandler((event: any) => {
  if (process.env.VERCEL_ENV !== "production") return;

  const req = event.node?.req;
  const headers: Record<string, string | string[] | undefined> =
    req?.headers ?? {};
  const rawHost = headers.host;
  const host = (Array.isArray(rawHost) ? rawHost[0] : rawHost || "")
    .split(":")[0]
    .toLowerCase();
  if (!host) return;

  const protoHeader = headers["x-forwarded-proto"];
  const proto = (
    Array.isArray(protoHeader) ? protoHeader[0] : protoHeader || "https"
  )
    .split(",")[0]
    .trim();

  const path = String(event.path ?? req?.url ?? "/");
  const needHttps = proto === "http";
  const needWww = host === APEX_HOST;
  if (!needHttps && !needWww) return;

  setResponseStatus(event, 308);
  setResponseHeader(
    event,
    "location",
    `https://${CANONICAL_HOST}${path.startsWith("/") ? path : `/${path}`}`,
  );
  return "Redirecting to https://www.acornsoft.ai";
});
