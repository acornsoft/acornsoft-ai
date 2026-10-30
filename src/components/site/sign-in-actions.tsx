import type { ReactNode } from "react";
import type { GrokProvider } from "@/lib/auth/providers";

/** Official X mark (white on the dark button). */
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

function buttonLabel(
  provider: GrokProvider,
  busy: string | null,
  previewSignIn: boolean,
): string {
  if (busy !== provider.providerId) return `Continue with ${provider.label}`;
  if (provider.providerId === "grok-x") {
    return previewSignIn ? "Waiting on the sign-in window…" : "Connecting to X…";
  }
  return "Connecting…";
}

/**
 * Sign-in buttons in provider-array order. The first entry is the primary
 * button. `children` render between the primary button and the rest.
 */
export function SignInActions({
  providers,
  busy,
  previewSignIn,
  onSignIn,
  children,
}: {
  providers: readonly GrokProvider[];
  busy: string | null;
  previewSignIn: boolean;
  onSignIn: (providerId: string) => void;
  children?: ReactNode;
}) {
  const [primary, ...rest] = providers;
  return (
    <div className="ac-login-actions">
      {primary ? (
        <button
          type="button"
          className="ac-login-btn ac-login-btn-x"
          data-provider-id={primary.providerId}
          data-signin-order="0"
          disabled={busy !== null}
          onClick={() => onSignIn(primary.providerId)}
        >
          {primary.providerId === "grok-x" ? (
            <span className="ac-login-btn-icon">
              <XMarkIcon />
            </span>
          ) : null}
          <span className="ac-login-btn-label">
            {buttonLabel(primary, busy, previewSignIn)}
          </span>
        </button>
      ) : (
        <p className="ac-login-muted">Sign-in is not configured on this instance.</p>
      )}
      {children}
      {rest.length > 0 ? (
        <div className="ac-login-alt">
          <p className="ac-login-alt-label">Other sign-in</p>
          {rest.map((provider, index) => (
            <button
              key={provider.providerId}
              type="button"
              className="ac-login-btn ac-login-btn-secondary"
              data-provider-id={provider.providerId}
              data-signin-order={String(index + 1)}
              disabled={busy !== null}
              onClick={() => onSignIn(provider.providerId)}
            >
              {buttonLabel(provider, busy, previewSignIn)}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
