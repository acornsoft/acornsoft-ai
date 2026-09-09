import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { SiteChrome } from "./site-chrome";
import { submitPublicClimbNoteAction } from "@/lib/climb-notes/actions";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useOwnerAccess } from "@/lib/auth/use-owner-access";

const SENDER_FIELDS = [
  {
    key: "problem" as const,
    n: "1",
    label: "Base Camp",
    hint: "Where are you starting, and what has to stay true?",
    placeholder: "We are here. This is what cannot change.",
  },
  {
    key: "measure" as const,
    n: "2",
    label: "Route",
    hint: "What is the one job, and what is not part of it?",
    placeholder: "The one job. Then what we are not doing.",
  },
  {
    key: "slice" as const,
    n: "3",
    label: "Waypoint",
    hint: "Are we going, or holding? Say why in a sentence.",
    placeholder: "Going, or holding, and why.",
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
  const { user } = useCurrentUserState();
  const { isOwner } = useOwnerAccess();
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
      const result = await submitPublicClimbNoteAction({
        data: { ...fields, lesson: "" },
      });
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
              <h1 className="ac-start-received-title">We have your note.</h1>
              <p className="ac-start-received-lede">
                {user && sentNote?.number
                  ? `It’s in Gnomah as CN-${sentNote.number}. Summit is still blank.`
                  : sentNote?.number
                    ? `It’s in as CN-${sentNote.number}. Summit is still blank.`
                    : "We’ll reach you at the email you left. Summit is still blank."}
              </p>
              <ol className="ac-start-received-next">
                <li>
                  <span>1</span>
                  We read Base Camp, Route, and Waypoint
                </li>
                <li>
                  <span>2</span>
                  We may ask a follow-up
                </li>
                <li>
                  <span>3</span>
                  Summit is filled in after that
                </li>
              </ol>
              <div className="ac-start-received-actions">
                {isOwner ? (
                  <Link
                    className="rn-btn ac-btn-maroon"
                    to="/gnomah"
                    search={sentNote?.id ? { note: sentNote.id } : undefined}
                  >
                    <span>
                      {sentNote?.number
                        ? `Open CN-${sentNote.number}`
                        : "Open Gnomah"}
                    </span>
                  </Link>
                ) : (
                  <Link className="rn-btn ac-btn-maroon" to="/climb-notes">
                    <span>See Climb Notes</span>
                  </Link>
                )}
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
                <span className="ac-service-kicker">Send a Note</span>
                <h1 className="ac-service-title">
                  Tell us where you are, the one job, and whether to go.
                </h1>
                <div className="ac-service-lede-box">
                  <p className="ac-service-lede ac-service-lede--last">
                    Three answers. No code. Summit stays blank until we look
                    at it.
                  </p>
                </div>
              </header>

              <form className="ac-start-form" onSubmit={onSubmit} noValidate>
                <ol className="ac-start-moves">
                  {SENDER_FIELDS.map((move) => (
                    <li key={move.key} className="ac-start-move">
                      <label htmlFor={`ac-start-${move.key}`}>
                        <span className="ac-start-n">{move.n}</span>
                        <span className="ac-start-move-copy">
                          <span className="ac-start-move-label">{move.label}</span>
                          <span className="ac-start-move-hint">{move.hint}</span>
                        </span>
                      </label>
                      <textarea
                        id={`ac-start-${move.key}`}
                        name={move.key}
                        rows={4}
                        value={fields[move.key]}
                        placeholder={move.placeholder}
                        onChange={(ev) => set(move.key, ev.target.value)}
                        required
                      />
                    </li>
                  ))}
                  <li className="ac-start-move" aria-disabled="true">
                    <label htmlFor="ac-start-lesson">
                      <span className="ac-start-n">4</span>
                      <span className="ac-start-move-copy">
                        <span className="ac-start-move-label">Summit</span>
                        <span className="ac-start-move-hint">
                          Left blank. We fill this in after we look at the climb.
                          We may ask a follow-up first.
                        </span>
                      </span>
                    </label>
                    <textarea
                      id="ac-start-lesson"
                      name="lesson"
                      rows={3}
                      value=""
                      disabled
                      readOnly
                      placeholder="Filled in after we evaluate."
                      style={{
                        opacity: 0.55,
                        cursor: "not-allowed",
                        background: "#eceae6",
                      }}
                    />
                  </li>
                </ol>

                <div className="ac-start-meta">
                  <label>
                    <span>Give this climb a name</span>
                    <input
                      type="text"
                      name="title"
                      value={fields.title}
                      onChange={(ev) => set("title", ev.target.value)}
                      placeholder="Optional"
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
                    <span>{busy ? "Sending…" : "Send a Note"}</span>
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
