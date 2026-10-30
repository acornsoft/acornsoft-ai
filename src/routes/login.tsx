import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GROK_PROVIDERS, authEnabled, signIn, usesPreviewSignIn } from "@/lib/auth/client";
import { Logo } from "@/components/site/logo";
import { SignInActions } from "@/components/site/sign-in-actions";
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

function LoginPage() {
  const { redirect } = Route.useSearch();
  const safeRedirect =
    redirect && redirect.startsWith("/") && !redirect.startsWith("//")
      ? redirect
      : "/gnomah";
  const forGnomah =
    safeRedirect === "/gnomah" || safeRedirect.startsWith("/gnomah?");
  const forWorks =
    safeRedirect === "/work" || safeRedirect.startsWith("/work?");
  const previewSignIn = usesPreviewSignIn();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
              ) : forWorks ? (
                <>
                  <strong>Works</strong> lists developed solutions. Sign in to
                  view them. Gnomah publishing stays gated to{" "}
                  <span className="ac-login-handle">@acornsoftai</span>.
                </>
              ) : (
                <>
                  Sign in with <strong>X</strong> to unlock signed-in surfaces.
                  Gnomah and Climb Notes publishing stay gated to{" "}
                  <span className="ac-login-handle">@acornsoftai</span>.
                </>
              )}
            </p>
          </div>

          {authEnabled ? (
            <SignInActions
              providers={GROK_PROVIDERS}
              busy={busy}
              previewSignIn={previewSignIn}
              onSignIn={(providerId) => void onSignIn(providerId)}
            >
              <div className="ac-login-gate-box" role="note">
                <p className="ac-login-gate-title">How Gnomah access works</p>
                <ul className="ac-login-gate-list">
                  <li>
                    Choose <strong>Continue with X</strong>. Sign-in stays on X.
                  </li>
                  {previewSignIn ? (
                    <li>
                      In Grok Build a <strong>sign-in window</strong> opens.
                      Allow pop-ups if the browser asks, then finish on X.
                    </li>
                  ) : (
                    <li>
                      On the live site you leave this page, sign in on X, and
                      return here.
                    </li>
                  )}
                  <li>
                    Server checks that the linked X identity is{" "}
                    <strong>@acornsoftai</strong> before any Climb Notes edit.
                  </li>
                  <li>
                    After success you return to the page you asked for.{" "}
                    <strong>Works</strong> appears in the top nav while signed
                    in. Gnomah stays owner-only.
                  </li>
                  <li>
                    Google can create a session for display tools, but it cannot
                    open Gnomah.
                  </li>
                </ul>
              </div>
            </SignInActions>
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
