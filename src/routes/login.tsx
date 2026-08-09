import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Logo } from "@/components/site/logo";
import { SiteHeader } from "@/components/site/site-chrome";

type LoginSearch = { redirect?: string };

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): LoginSearch => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Sign in — Acornsoft" },
      {
        name: "description",
        content:
          "Sign in to Acornsoft with X. Gnomah Climb Notes editing is reserved for the owner.",
      },
    ],
  }),
});

/** Official X mark (white on dark button). */
function XMarkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  );
}

function LoginPage() {
  const { redirect } = Route.useSearch();
  const safeRedirect =
    redirect && redirect.startsWith("/") && !redirect.startsWith("//")
      ? redirect
      : "/gnomah";
  const forGnomah =
    safeRedirect === "/gnomah" || safeRedirect.startsWith("/gnomah?");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const xProvider = GROK_PROVIDERS.find((p) => p.providerId === "grok-x");
  // Site login is X-first. Google remains available only as a secondary path
  // for general identity — it never unlocks Gnomah (server enforces X owner).
  const googleProvider = GROK_PROVIDERS.find(
    (p) => p.providerId === "grok-google",
  );

  async function onSignIn(providerId: string) {
    setError(null);
    setBusy(providerId);
    try {
      await signIn(providerId, {
        callbackURL: safeRedirect,
        errorCallbackURL: `/login?redirect=${encodeURIComponent(safeRedirect)}`,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed");
      setBusy(null);
    }
  }

  return (
    <div className="template-color-1 spybody ac-inbio ac-login-page ac-hero-stage">
      <SiteHeader loginRedirect={safeRedirect} />
      <div className="ac-login-backdrop" aria-hidden />
      <main className="ac-login-main">
        <div className="ac-login-card">
          <div className="ac-login-card-top">
            <Link to="/" className="ac-login-logo" aria-label="Acornsoft home">
              <Logo className="acornsoft-logo" />
            </Link>
            <p className="ac-login-kicker">Acornsoft account</p>
            <h1 className="ac-login-title">Sign in</h1>
            <p className="ac-login-lead">
              {forGnomah ? (
                <>
                  <strong>Gnomah</strong> is the private Climb Notes studio
                  (draft → approve → publish). Access is via{" "}
                  <strong>X credentials</strong> only for owner{" "}
                  <span className="ac-login-handle">@acornsoftai</span>.
                </>
              ) : (
                <>
                  Sign in with <strong>X</strong> to unlock owner tools. Gnomah
                  and Climb Notes publishing stay gated to{" "}
                  <span className="ac-login-handle">@acornsoftai</span>.
                </>
              )}
            </p>
          </div>

          {authEnabled ? (
            <div className="ac-login-actions">
              {xProvider ? (
                <button
                  type="button"
                  className="ac-login-btn ac-login-btn-x"
                  disabled={busy !== null}
                  onClick={() => void onSignIn(xProvider.providerId)}
                >
                  <span className="ac-login-btn-icon">
                    <XMarkIcon />
                  </span>
                  <span className="ac-login-btn-label">
                    {busy === xProvider.providerId
                      ? "Connecting to X…"
                      : "Continue with X"}
                  </span>
                </button>
              ) : (
                <p className="ac-login-muted">
                  X sign-in is not configured on this instance.
                </p>
              )}

              <div className="ac-login-gate-box" role="note">
                <p className="ac-login-gate-title">How Gnomah access works</p>
                <ul className="ac-login-gate-list">
                  <li>
                    Choose <strong>Continue with X</strong> — OAuth only; we never
                    store your X password.
                  </li>
                  <li>
                    Server checks that the linked X identity is{" "}
                    <strong>@acornsoftai</strong> before any Climb Notes edit.
                  </li>
                  <li>
                    After success you land in <strong>Gnomah</strong> (or return to
                    Climb Notes). Gnomah appears in the top nav while signed in.
                  </li>
                  <li>
                    Google can create a session for display tools, but it cannot
                    open Gnomah.
                  </li>
                </ul>
              </div>

              {googleProvider ? (
                <div className="ac-login-alt">
                  <p className="ac-login-alt-label">Other sign-in</p>
                  <button
                    type="button"
                    className="ac-login-btn ac-login-btn-secondary"
                    disabled={busy !== null}
                    onClick={() => void onSignIn(googleProvider.providerId)}
                  >
                    {busy === googleProvider.providerId
                      ? "Connecting…"
                      : "Continue with Google"}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="ac-login-muted">
              Sign-in is disabled on this instance. Local development uses a
              shared dev identity.
            </p>
          )}

          {error ? (
            <p className="ac-login-error" role="alert">
              {error}
            </p>
          ) : null}

          <nav className="ac-login-foot" aria-label="Related pages">
            <Link to="/climb-notes">Climb Notes</Link>
            <span className="ac-login-foot-sep" aria-hidden>
              ·
            </span>
            <Link to="/">Home</Link>
          </nav>
        </div>
      </main>
    </div>
  );
}
