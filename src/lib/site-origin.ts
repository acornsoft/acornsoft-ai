/** Canonical public host. Apex has no matching TLS name until Vercel issues a dual SAN cert. */
export const CANONICAL_HOST = "www.acornsoft.ai";
export const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}`;
export const APEX_HOST = "acornsoft.ai";

export const PRODUCTION_ORIGINS = [
  CANONICAL_ORIGIN,
  `https://${APEX_HOST}`,
] as const;

export function isProductionHost(host: string | undefined): boolean {
  const h = (host ?? "").split(":")[0]?.toLowerCase();
  return h === CANONICAL_HOST || h === APEX_HOST;
}
