import { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import {
  ACADENCE_BUCKETS,
  ACADENCE_HEALTH,
  ACADENCE_SPEAK_LIMIT,
  acadenceCount,
  acadenceHealthReadout,
  acadenceQueue,
  formatPercent9010,
  type AcadenceBucket,
} from "@/lib/acadence-desk";

type SpeakState = "idle" | "speaking";

function stopSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function AcadenceDesk() {
  const [bucket, setBucket] = useState<AcadenceBucket>("ready");
  const [state, setState] = useState<SpeakState>("idle");
  const [caption, setCaption] = useState(acadenceHealthReadout());
  const rows = acadenceQueue(bucket);
  const count = acadenceCount(bucket);

  useEffect(() => () => stopSpeech(), []);

  const speak = useCallback((text: string) => {
    setCaption(text);
    setState("speaking");
    try {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 1;
        u.pitch = 1;
        u.onend = () => setState("idle");
        u.onerror = () => setState("idle");
        window.speechSynthesis.speak(u);
        return;
      }
    } catch {
      /* speech optional */
    }
    window.setTimeout(() => setState("idle"), 1800);
  }, []);

  const stop = useCallback(() => {
    stopSpeech();
    setState("idle");
  }, []);

  const speakHealth = () => speak(acadenceHealthReadout());

  const speakBucket = () => {
    if (rows.length === 0) {
      speak(`${bucket} is empty.`);
      return;
    }
    const lines = rows.map((r) => r.spoken).slice(0, ACADENCE_SPEAK_LIMIT);
    speak(
      `${bucket}. ${lines.length} of ${count}. ${lines.join(". ")}.`,
    );
  };

  return (
    <section className="ac-desk" aria-labelledby="ac-desk-title">
      <header className="ac-desk-head">
        <p className="ac-desk-kicker">Spoken desk · Mike, Mark, Tony</p>
        <h2 id="ac-desk-title" className="ac-desk-title">
          Acadence 90/10 queue
        </h2>
        <p className="ac-desk-lede">
          Nine spoken lines. Captions stay on. This desk does not send.
        </p>
      </header>

      <dl className="ac-desk-health" aria-label="Desk health">
        <div>
          <dt>Store</dt>
          <dd>{ACADENCE_HEALTH.store}</dd>
        </div>
        <div>
          <dt>Ready</dt>
          <dd>{ACADENCE_HEALTH.ready}</dd>
        </div>
        <div>
          <dt>Mail</dt>
          <dd>{ACADENCE_HEALTH.mail}</dd>
        </div>
        <div>
          <dt>Sent</dt>
          <dd>{ACADENCE_HEALTH.sent}</dd>
        </div>
        <div>
          <dt>Hold</dt>
          <dd>{ACADENCE_HEALTH.hold}</dd>
        </div>
        <div>
          <dt>As of</dt>
          <dd>{ACADENCE_HEALTH.asOf}</dd>
        </div>
      </dl>

      <div className="ac-desk-actions">
        <button
          type="button"
          className="rn-btn ac-btn-maroon"
          onClick={state === "speaking" ? stop : speakHealth}
        >
          {state === "speaking" ? (
            <>
              <VolumeX size={18} strokeWidth={2} aria-hidden />
              <span>Stop</span>
            </>
          ) : (
            <>
              <Volume2 size={18} strokeWidth={2} aria-hidden />
              <span>Speak the desk</span>
            </>
          )}
        </button>
        <button
          type="button"
          className="rn-btn ac-btn-outline"
          onClick={speakBucket}
          disabled={state === "speaking"}
        >
          <span>Speak {bucket}</span>
        </button>
      </div>

      <div
        className="ac-desk-captions"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="ac-desk-captions-who">
          {state === "speaking" ? "Speaking" : "Last readout"}
        </span>
        <p>{caption}</p>
      </div>

      <div
        className="ac-desk-buckets"
        role="tablist"
        aria-label="Queue buckets"
      >
        {ACADENCE_BUCKETS.map((b) => {
          const n = acadenceCount(b);
          const on = b === bucket;
          return (
            <button
              key={b}
              type="button"
              role="tab"
              aria-selected={on}
              className={on ? "ac-desk-bucket is-on" : "ac-desk-bucket"}
              onClick={() => setBucket(b)}
            >
              <span className="ac-desk-bucket-name">{b}</span>
              <span className="ac-desk-bucket-n">{n}</span>
            </button>
          );
        })}
      </div>

      {rows.length === 0 ? (
        <p className="ac-desk-empty">Nothing in {bucket}.</p>
      ) : (
        <ol className="ac-desk-list">
          {rows.map((row, i) => (
            <li key={row.spoken}>
              <button
                type="button"
                className="ac-desk-row"
                onClick={() => speak(row.spoken)}
              >
                <span className="ac-desk-row-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="ac-desk-row-body">
                  <span className="ac-desk-row-school">{row.schoolName}</span>
                  <span className="ac-desk-row-spoken">{row.spoken}</span>
                </span>
                <span className="ac-desk-row-pct">
                  {formatPercent9010(row.percent9010)}
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}

      <p className="ac-desk-note">
        Snapshot of the live store, {ACADENCE_HEALTH.asOf}. Showing at most{" "}
        {ACADENCE_SPEAK_LIMIT} lines. Mike sends. We research, score, and speak.
      </p>
    </section>
  );
}
