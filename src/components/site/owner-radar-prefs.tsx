import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, KeyRound, ShieldCheck, Trash2 } from "lucide-react";
import {
  clearXApiBearerSecret,
  getXApiBearerStatus,
  setXApiBearerSecret,
} from "@/lib/owner-secrets/actions";
import type { OwnerSecretStatus } from "@/lib/owner-secrets/types";

/**
 * Owner-only private preference: X API Bearer for Canopy Radar.
 * Token is sent once over HTTPS to a server fn that encrypts it;
 * the UI never receives it back (only configured + last4).
 */
export function OwnerRadarPrefs() {
  const [status, setStatus] = useState<OwnerSecretStatus | null>(null);
  const [token, setToken] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [denied, setDenied] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const s = await getXApiBearerStatus();
      setStatus(s);
      setDenied(false);
    } catch {
      setDenied(true);
      setStatus(null);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (!loaded) {
    return (
      <section className="ac-owner-prefs" aria-busy>
        <p className="ac-owner-prefs-muted">Loading private preferences…</p>
      </section>
    );
  }

  if (denied) return null;

  const onSave = async () => {
    if (!token.trim()) {
      toast.error("Paste your X App Bearer Token first.");
      return;
    }
    setBusy(true);
    try {
      const s = await setXApiBearerSecret({ data: { token } });
      setStatus(s);
      setToken("");
      setShow(false);
      toast.success("Bearer saved privately. Only you can manage it.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save token");
    } finally {
      setBusy(false);
    }
  };

  const onClear = async () => {
    if (!status?.configured) return;
    if (
      !window.confirm(
        "Remove your private X API Bearer from this profile? Canopy live Radar will stop until you add it again (or set host env).",
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      const s = await clearXApiBearerSecret();
      setStatus(s);
      toast.success("Private Bearer removed.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not clear token");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="ac-owner-prefs" aria-labelledby="ac-owner-prefs-title">
      <div className="ac-owner-prefs-head">
        <KeyRound className="ac-owner-prefs-icon" aria-hidden strokeWidth={2} />
        <div>
          <h2 id="ac-owner-prefs-title">Private preferences</h2>
          <p>
            X API Bearer for Canopy Radar. Encrypted at rest, never shown again
            after save, and never exposed to other visitors.
          </p>
        </div>
      </div>

      <div className="ac-owner-prefs-status" role="status">
        {status?.configured ? (
          <>
            <ShieldCheck
              className="ac-owner-prefs-ok"
              aria-hidden
              strokeWidth={2}
            />
            <span>
              Configured · ends in <strong>…{status.last4}</strong>
              {status.updatedAt
                ? ` · updated ${new Date(status.updatedAt).toLocaleString()}`
                : ""}
            </span>
          </>
        ) : (
          <span className="ac-owner-prefs-muted">
            Not set — paste an App-only Bearer from the X Developer portal.
          </span>
        )}
      </div>

      <label className="ac-owner-prefs-label" htmlFor="ac-x-bearer">
        X App Bearer Token
      </label>
      <div className="ac-owner-prefs-input-row">
        <input
          id="ac-x-bearer"
          className="ac-owner-prefs-input"
          type={show ? "text" : "password"}
          name="x-api-bearer"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder={
            status?.configured
              ? "Paste a new token to replace (current stays hidden)"
              : "AAAA… paste Bearer Token"
          }
          value={token}
          onChange={(e) => setToken(e.target.value)}
          disabled={busy}
        />
        <button
          type="button"
          className="ac-owner-prefs-icon-btn"
          aria-label={show ? "Hide token" : "Show token while typing"}
          onClick={() => setShow((v) => !v)}
        >
          {show ? (
            <EyeOff aria-hidden strokeWidth={2} size={16} />
          ) : (
            <Eye aria-hidden strokeWidth={2} size={16} />
          )}
        </button>
      </div>

      <div className="ac-owner-prefs-actions">
        <button
          type="button"
          className="rn-btn"
          disabled={busy || !token.trim()}
          onClick={() => void onSave()}
        >
          {busy ? "Saving…" : status?.configured ? "Replace token" : "Save privately"}
        </button>
        {status?.configured ? (
          <button
            type="button"
            className="rn-btn ac-btn-outline ac-owner-prefs-clear"
            disabled={busy}
            onClick={() => void onClear()}
          >
            <Trash2 size={14} aria-hidden />
            Remove
          </button>
        ) : null}
      </div>

      <ul className="ac-owner-prefs-notes">
        <li>Only @acornsoftai (owner, signed in with X) can set or clear this.</li>
        <li>Stored encrypted with a server key — not readable from the browser or public APIs.</li>
        <li>Used only server-side to run Canopy Radar queries.</li>
        <li>
          Host env <code>X_BEARER_TOKEN</code> still wins if set (ops override).
        </li>
      </ul>
    </section>
  );
}
