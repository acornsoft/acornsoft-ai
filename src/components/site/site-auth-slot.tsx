import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { LogIn, LogOut } from "lucide-react";
import { authEnabled, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { SettingsMenuButton, SettingsSheet } from "./owner-settings";

const OWNER_ALIASES: Record<string, string> = {
  blaze: "acornsoftai",
};

function formatAuthLabel(raw: string): string {
  const label = raw.trim() || "Account";
  const key = label.toLowerCase().replace(/^@+/, "").replace(/\s+/g, "");
  const ownerHandle = OWNER_ALIASES[key];
  if (ownerHandle) return `@${ownerHandle}`;
  if (!label.includes(" ") && label.length <= 24) {
    return label.startsWith("@") ? label : `@${label}`;
  }
  return label;
}

export function SiteAuthSlot({
  loginRedirect = "/gnomah",
  className = "",
}: {
  loginRedirect?: string;
  className?: string;
}) {
  const { user, isPending } = useCurrentUserState();
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (wrapRef.current?.contains(t)) return;
      if (t.closest?.(".ac-settings-modal")) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!authEnabled) return null;

  // Same pending slot on the server and the first client paint so hydration
  // matches. After mount, session memory / useSession can show the real chip.
  if (!mounted || (isPending && !user)) {
    return (
      <span
        className={`ac-auth-slot ac-auth-slot-pending ${className}`.trim()}
        aria-hidden
      />
    );
  }

  if (user) {
    const label = (user.displayName ?? "Account").trim() || "Account";
    const pillText = formatAuthLabel(label);

    return (
      <div
        className={`ac-auth-menu ${className}`.trim()}
        ref={wrapRef}
      >
        <button
          type="button"
          className="ac-auth-slot ac-auth-user"
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((v) => !v)}
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
        </button>
        {open ? (
          <ul className="ac-auth-dropdown" role="menu">
            <li role="none">
              <Link
                role="menuitem"
                to="/gnomah"
                onClick={() => setOpen(false)}
              >
                Gnomah
              </Link>
            </li>
            <li role="none">
              <Link
                role="menuitem"
                to="/method"
                onClick={() => setOpen(false)}
              >
                Method
              </Link>
            </li>
            <li role="none" className="ac-auth-dropdown-settings">
              <SettingsMenuButton
                onClick={() => {
                  setOpen(false);
                  setSettingsOpen(true);
                }}
              />
            </li>
            <li role="none">
              <button
                type="button"
                role="menuitem"
                className="ac-auth-dropdown-out"
                onClick={() => void signOut("/")}
              >
                <LogOut aria-hidden strokeWidth={2.25} size={14} />
                Log out
              </button>
            </li>
          </ul>
        ) : null}
        <SettingsSheet
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />
      </div>
    );
  }

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
