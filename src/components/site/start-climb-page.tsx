import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { SiteChrome } from "./site-chrome";
import { submitPublicClimbNoteAction } from "@/lib/climb-notes/actions";
import { CROSSOVER, ZERO_TO_ONE } from "./messaging";

const MOVES = [
  {
    key: "problem" as const,
    n: "1",
    label: "What’s stuck",
    hint: "One sentence. Who feels it.",
    placeholder:
      "People find the shop online, then call or leave. The site does not turn a visit into a booking.",
  },
  {
    key: "measure" as const,
    n: "2",
    label: "How we know it moved",
    hint: "A test you can see, not a feeling.",
    placeholder:
      "In two weeks, at least five bookings start on the site — not on the phone.",
  },
  {
    key: "slice" as const,
    n: "3",
    label: "The next safe pitch",
    hint: "The next rope length — not the summit.",
    placeholder:
      "One page: hours, service, and a single “Book” action. Nothing else this week.",
  },
  {
    key: "lesson" as const,
    n: "4",
    label: "What we carry next",
    hint: "Fine if you don’t know yet. We’ll write it after the pitch runs.",
    placeholder:
      "One obvious next step beats a pretty site with five paths.",
  },
] as const;

type Fields = {
  problem: string;
  measure: string;
  slice: string;
  lesson: string;
  title: string;
  name: string;
  email: string;
  company: string;
};

const EMPTY: Fields = {
  problem: "",
  measure: "",
  slice: "",
  lesson: "",
  title: "",
  name: "",
  email: "",
  company: "",
};

export function StartClimbPage() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

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
          <header className="ac-service-head">
            <span className="ac-service-kicker">0 → 1</span>
            <h1 className="ac-service-title">
              Craft a Climb Note. We build from it.
            </h1>
            <div className="ac-service-lede-box">
              <p className="ac-service-lede">{ZERO_TO_ONE}</p>
              <p className="ac-service-lede ac-service-lede--last">
                {CROSSOVER} You do not need to write code. Fill the four
                moves. Send. That is the brief — Grok Build consumes the
                whole note, Imagine animates it, Voice lends it a voice.
              </p>
            </div>
          </header>

          {sent ? (
            <div className="ac-start-done" role="status">
              <p className="ac-start-done-k">Received</p>
              <h2 className="ac-start-done-title">
                We have your Climb Note.
              </h2>
              <p>
                This is the brief. We build your specific solution from
                these four moves — not from a meeting, not from a slide.
                We’ll reach you at the email you left.
              </p>
              <p>
                <button
                  type="button"
                  className="rn-btn ac-btn-maroon"
                  onClick={() => setSent(false)}
                >
                  <span>Send another</span>
                </button>
                <Link className="rn-btn ac-btn-outline" to="/field-guide">
                  <span>Read the field guide</span>
                </Link>
              </p>
            </div>
          ) : (
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
                  Company
                  <input
                    type="text"
                    name="company"
                    value={fields.company}
                    onChange={(ev) => set("company", ev.target.value)}
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
                  Pending in the studio — not published. We build from this
                  note.{" "}
                  <Link to="/field-guide">Need the recipes first?</Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </SiteChrome>
  );
}
