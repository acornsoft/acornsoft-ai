/**
 * Shared LIVE-PREVIEW OAuth client (server-only — NEVER import from the client).
 *
 * The sandbox serves each live preview on a dynamic `https://*.grok-sandbox.com`
 * URL, which can't be pre-registered per app. The broker exposes ONE shared
 * "preview" client that accepts any
 * `https://*.grok-sandbox.com/api/auth/oauth2/callback/*`.
 *
 * Client secret MUST come from the environment (`GROK_AUTH_CLIENT_SECRET`, or
 * `GROK_PREVIEW_CLIENT_SECRET` as an alias). Never bake a secret into git.
 * When deployed, set a per-app `GROK_AUTH_*` on Vercel (see `server.ts`).
 * Federated sign-in is disabled if the secret is missing (fail closed).
 *
 * `PREVIEW_CLIENT_ID` is an identifier, not a secret. Override with
 * `GROK_AUTH_CLIENT_ID` when the deployer injects a per-app client.
 */
export const PREVIEW_CLIENT_ID = "grok_preview";

/** The shared auth broker issuer (OIDC discovery lives under it). */
export const GROK_ISSUER_DEFAULT = "https://auth.grok.me";

/**
 * Host patterns whose callbacks the preview client accepts. Better Auth derives
 * the live preview's real origin from the request host and validates it against
 * this list (wildcard-matched), so the OAuth `redirect_uri` becomes the concrete
 * `https://<host>/api/auth/oauth2/callback/...` the broker allows.
 */
export const PREVIEW_ALLOWED_HOSTS = ["*.grok-sandbox.com"] as const;
