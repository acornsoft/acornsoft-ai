import { Link } from "@tanstack/react-router";
import { LogIn, LogOut } from "lucide-react";
import { authEnabled, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

/**
 * Display-name aliases for the owner handle (same person).
 * Keep in sync with OWNER_DISPLAY_ALIASES on the server.
 */
const OWNER_ALIASES: Record<string, string> = {
  blaze: "acornsoftai",
};

function formatAuthLabel(raw: string): string {
  const label = raw.trim() || "Account";
  const key = label.toLowerCase().replace(/^@+/, "").replace(/\s+/g, "");
  const ownerHandle = OWNER_ALIASES[key];
  if (ownerHandle) {
    // Blaze is the profile alias for @acornsoftai — show both, full width.
    return `${label} · @${ownerHandle}`;
  }
  if (!label.includes(" ") && label.length <= 32) {
    return label.startsWith("@") ? label : `@${label}`;
  }
  return label;
}

/**
 * Top-bar auth control — standard Log in / account chip.
 * Sign-in lives on Climb Notes (and login → Gnomah). X is chosen on the login page.
 */
export function SiteAuthSlot({
  loginRedirect = "/gnomah",
  className = "",
}: {
  loginRedirect?: string;
  className?: string;
}) {
  const { user, isPending } = useCurrentUserState();

  if (!authEnabled) return null;

  if (isPending) {
    return (
      <span
        className={`ac-auth-slot ac-auth-slot-pending ${className}`.trim()}
        aria-hidden
      />
    );
  }

  if (!user) {
    return (
      <Link
        to="/login"
        search={{ redirect: loginRedirect }}
        className={`ac-auth-slot ac-auth-signin ${className}`.trim()}
        aria-label="Log in"
      >
        <LogIn className="ac-auth-signin-icon" aria-hidden strokeWidth={2.25} />
        <span className="ac-auth-signin-label">Log in</span>
      </Link>
    );
  }

  const label = (user.displayName ?? "Account").trim() || "Account";
  const pillText = formatAuthLabel(label);

  return (
    <div
      className={`ac-auth-slot ac-auth-user ${className}`.trim()}
      title={pillText}
    >
      {user.profileImageUrl ? (
        <img
          src={user.profileImageUrl}
          alt=""
          className="ac-auth-avatar"
          width={28}
          height={28}
        />
      ) : (
        <span className="ac-auth-avatar ac-auth-avatar-fallback" aria-hidden>
          {label.charAt(0).toUpperCase()}
        </span>
      )}
      <span className="ac-auth-name">{pillText}</span>
      <button
        type="button"
        className="ac-auth-signout"
        onClick={() => void signOut("/")}
        aria-label="Log out"
      >
        <LogOut className="ac-auth-signout-icon" aria-hidden strokeWidth={2.25} />
        <span className="ac-auth-signout-label">Log out</span>
      </button>
    </div>
  );
}
