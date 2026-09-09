import { useEffect, useState } from "react";
import { Settings, X } from "lucide-react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { OwnerRadarPrefs } from "./owner-radar-prefs";

export function SettingsMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="ac-settings-row"
      role="menuitem"
      aria-haspopup="dialog"
      onClick={onClick}
    >
      <Settings aria-hidden strokeWidth={2.25} size={14} />
      Settings
    </button>
  );
}

/** Account sheet — stays mounted outside the dropdown so Close/Escape work. */
export function SettingsSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user } = useCurrentUserState();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !user) return null;

  const label = (user.displayName ?? "Account").trim() || "Account";
  const meta = user.primaryEmail?.trim() || "Signed in on this device";

  return (
    <div className="ac-settings-modal" role="presentation">
      <button
        type="button"
        className="ac-settings-backdrop"
        aria-label="Close settings"
        onClick={onClose}
      />
      <section
        className="ac-settings-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ac-settings-title"
      >
        <header className="ac-settings-head">
          <div>
            <p className="ac-settings-kicker">Account</p>
            <h2 id="ac-settings-title">Settings</h2>
          </div>
          <button type="button" className="ac-settings-close" onClick={onClose}>
            <X aria-hidden strokeWidth={2} size={16} />
            <span>Close</span>
          </button>
        </header>

        <div className="ac-settings-account">
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt=""
              className="ac-settings-account-avatar"
              width={48}
              height={48}
            />
          ) : (
            <span className="ac-settings-account-avatar ac-settings-account-fallback">
              {label.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="ac-settings-account-copy">
            <p className="ac-settings-account-name">{label}</p>
            <p className="ac-settings-account-meta">{meta}</p>
            <p className="ac-settings-account-note">
              Gnomah stays on the account menu while you are signed in.
              Climb Notes publishing is reserved for @acornsoftai on X.
            </p>
          </div>
        </div>

        <OwnerRadarPrefs />
      </section>
    </div>
  );
}

/** Gear/menu control + sheet for callers that do not own dropdown state. */
export function OwnerSettings() {
  const { user } = useCurrentUserState();
  const [open, setOpen] = useState(false);
  if (!user) return null;
  return (
    <>
      <SettingsMenuButton onClick={() => setOpen(true)} />
      <SettingsSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}
