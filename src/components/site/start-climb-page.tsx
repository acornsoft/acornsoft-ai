import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { SiteChrome } from "./site-chrome";
import { submitPublicClimbNoteAction } from "@/lib/climb-notes/actions";
import { ZERO_TO_ONE_PLAIN, CLIMB_BEATS } from "./messaging";

const PLACEHOLDERS: Record<(typeof CLIMB_BEATS)[number]["key"], string> = {
  problem:
    "You are the person at tax time. Papers live in email, a drawer, and the camera roll. Weather: dread and a late start. Rule: one place to look. Fit to leave when you can say that out loud.",
  measure:
    "One summit: by March 1 you open one place and in ten minutes know what’s in, what’s missing, and what you likely owe or get back. Success: those three answers. Not today: filing the return for you.",
  slice:
    "Check the map. The pile is still scattered. Recover if last year ran late. Hold or go: go — write this down and hand it to an agent.",
  lesson:
    "The rope team builds one page you can open. Proof: you confirm what’s in, what’s missing, and the number.",
};

const MOVES = CLIMB_BEATS.map((beat) => ({
  key: beat.key,
  n: String(beat.n),
  label: beat.label,
  hint: `${beat.plain} — ${beat.hint}`,
  placeholder: PLACEHOLDERS[beat.key],
}));

type Fields = {
  problem: string;
  measure: string;
  slice: string;
  lesson: string;
  title: string;
  name: string;
  email: string;
  hp_fax: string;
};

const EMPTY: Fields = {
  problem: "",
  measure: "",
  slice: "",
  lesson: "",
  title: "",
  name: "",
  email: "",
  hp_fax: "",
};

export function StartClimbPage() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [sentNote, setSentNote] = useState<{ id: string; number: string } | null>(
    null,
  );

  function set<K extends keyof Fields>(key: K, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await submitPublicClimbNoteAction({ data: fields });
      if (result.ok) {
        setSentNote(
          result.id && result.number
            ? { id: result.id, number: result.number }
            : null,
        );
        setSent(true);
        setFields(EMPTY);
      } else {
        setError(result.error);
      }
    } catch {
      setError("Could not send. Try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SiteChrome loginRedirect="/start">
      <div className="ac-service-page ac-start-climb ac-page-top">
        <div className="ac-service-stack">
          {sent ? (
            <section className="ac-start-received" role="status">
              <span className="ac-start-received-k">Received</span>
              <h1 className="ac-start-received-title">
                We have your write-up.
              </h1>
              <p className="ac-start-received-lede">
                {sentNote?.number
                  ? `It’s in Gnomah as CN-${sentNote.number} (draft).`
                  : "We’ll reach you at the email you left."}
              </p>
              <ol className="ac-start-received-next">
                <li>
                  <span>1</span>
                  It’s on the Climb Notes list
                </li>
                <li>
                  <span>2</span>
                  We put agents on it
                </li>
                <li>
                  <span>3</span>
                  You get a note back
                </li>
              </ol>
              <div className="ac-start-received-actions">
                <Link
                  className="rn-btn ac-btn-maroon"
                  to="/gnomah"
                  search={
                    sentNote?.id ? { note: sentNote.id } : undefined
                  }
                >
                  <span>
                    {sentNote?.number
                      ? `Open CN-${sentNote.number}`
                      : "Open Gnomah"}
                  </span>
                </Link>
                <button
                  type="button"
                  className="rn-btn ac-btn-outline"
                  onClick={() => {
                    setSent(false);
                    setSentNote(null);
                  }}
                >
                  <span>Send another</span>
                </button>
              </div>
            </section>
          ) : (
            <>
          <header className="ac-service-head">
            <span className="ac-service-kicker">First step</span>
            <h1 className="ac-service-title">
              Tell us what’s stuck. We’ll build from that.
            </h1>
            <div className="ac-service-lede-box">
              <p className="ac-service-lede ac-service-lede--last">
                Four answers. No code. We turn it into something you can
                use.
              </p>
            </div>
          </header>

            <form className="ac-start-form" onSubmit={onSubmit} noValidate>
              <ol className="ac-start-moves">
                {MOVES.map((move) => (
                  <li key={move.key} className="ac-start-move">
                    <label htmlFor={`ac-start-${move.key}`}>
                      <span className="ac-start-n">{move.n}</span>
                      <span className="ac-start-move-copy">
                        <span className="ac-start-move-label">
                          {move.label}
                        </span>
                        <span className="ac-start-move-hint">{move.hint}</span>
                      </span>
                    </label>
                    <textarea
                      id={`ac-start-${move.key}`}
                      name={move.key}
                      rows={move.key === "lesson" ? 3 : 4}
                      value={fields[move.key]}
                      placeholder={move.placeholder}
                      onChange={(ev) => set(move.key, ev.target.value)}
                      required={move.key !== "lesson"}
                    />
                  </li>
                ))}
              </ol>

              <div className="ac-start-meta">
                <label>
                  <span>Give this climb a name</span>
                  <input
                    type="text"
                    name="title"
                    value={fields.title}
                    onChange={(ev) => set("title", ev.target.value)}
                    placeholder="Optional — we’ll use the problem if you skip this"
                  />
                </label>
                <label>
                  <span>Your name</span>
                  <input
                    type="text"
                    name="name"
                    value={fields.name}
                    onChange={(ev) => set("name", ev.target.value)}
                    required
                    autoComplete="name"
                  />
                </label>
                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    value={fields.email}
                    onChange={(ev) => set("email", ev.target.value)}
                    required
                    autoComplete="email"
                  />
                </label>
                <label className="ac-start-hp" aria-hidden="true">
                  Fax
                  <input
                    type="text"
                    name="hp_fax"
                    value={fields.hp_fax}
                    onChange={(ev) => set("hp_fax", ev.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </label>
              </div>

              {error ? (
                <p className="ac-start-error" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="ac-start-actions">
                <button
                  type="submit"
                  className="rn-btn ac-btn-maroon"
                  disabled={busy}
                >
                  <span>{busy ? "Sending…" : "Send to Acornsoft"}</span>
                </button>
                <p className="ac-start-fine">
                  We keep this private until you say otherwise.{" "}
                  <Link to="/field-guide">Want the how-tos first?</Link>
                </p>
              </div>
            </form>
            </>
          )}
        </div>
      </div>
    </SiteChrome>
  );
}
