import { useEffect, useState } from "react";
import { Settings, X } from "lucide-react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { OwnerRadarPrefs } from "./owner-radar-prefs";

/** Gear in the header when signed in — private prefs live here, not on Gnomah. */
export function OwnerSettings() {
  const { user } = useCurrentUserState();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;

  return (
    <>
      <button
        type="button"
        className="ac-settings-btn"
        aria-label="Settings and preferences"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Settings aria-hidden strokeWidth={2} size={18} />
      </button>

      {open ? (
        <div className="ac-settings-modal" role="presentation">
          <button
            type="button"
            className="ac-settings-backdrop"
            aria-label="Close settings"
            onClick={() => setOpen(false)}
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
              <button
                type="button"
                className="ac-settings-close"
                onClick={() => setOpen(false)}
              >
                <X aria-hidden strokeWidth={2} size={16} />
                <span>Close</span>
              </button>
            </header>
            <OwnerRadarPrefs />
          </section>
        </div>
      ) : null}
    </>
  );
}
