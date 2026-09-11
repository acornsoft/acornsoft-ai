import { useEffect, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { SiteChrome } from "./site-chrome";
import { StartClimbTrail } from "./start-climb-trail";
import {
  allStationStatuses,
  climbReadyToSend,
  nextOpenStation,
  stationFieldId,
  type ClimbStationId,
} from "./start-climb-model";
import { submitPublicClimbNoteAction } from "@/lib/climb-notes/actions";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useOwnerAccess } from "@/lib/auth/use-owner-access";
import {
  clearStartClimbIdentity,
  hasMeaningful,
  loadStartClimbIdentity,
  saveStartClimbIdentity,
} from "@/lib/start-climb-prefs";

const SENDER_FIELDS = [
  {
    key: "problem" as const,
    station: "basecamp" as const,
    n: "1",
    label: "Base Camp",
    sub: "what has to stay true",
    hint: "Current situation in plain terms. Constraints that cannot move (compliance, customers, cash, downtime).",
    placeholder:
      "e.g. We’re taking bookings by phone; nothing can go down on weekends.",
    unlocksAfter: null,
  },
  {
    key: "measure" as const,
    station: "route" as const,
    n: "2",
    label: "Route",
    sub: "the one job",
    hint: "Name the single outcome for this climb. List what’s out of scope so we don’t wander.",
    placeholder:
      "e.g. Online booking for existing clients. Not: new marketing site.",
    unlocksAfter: "Base Camp",
  },
  {
    key: "slice" as const,
    station: "waypoint" as const,
    n: "3",
    label: "Waypoint",
    sub: "go or hold",
    hint: "Go = start now. Hold = park it with a reason (budget, season, dependency).",
    placeholder:
      "e.g. Go — need this before holiday season. / Hold — waiting on vendor contract.",
    unlocksAfter: "Route",
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

function focusStation(id: ClimbStationId) {
  const fieldId = stationFieldId(id);
  if (!fieldId) return;
  document.getElementById(fieldId)?.focus();
  document.getElementById(fieldId)?.scrollIntoView({
    block: "center",
    behavior: "smooth",
  });
}

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
  const [welcomeBack, setWelcomeBack] = useState(false);
  const [activeOverride, setActiveOverride] = useState<ClimbStationId | null>(
    null,
  );

  const beats = {
    name: fields.name,
    email: fields.email,
    problem: fields.problem,
    measure: fields.measure,
    slice: fields.slice,
  };
  const statuses = allStationStatuses(beats);
  const suggested = nextOpenStation(beats);
  const active =
    activeOverride && statuses[activeOverride] !== "locked"
      ? activeOverride
      : suggested;
  const canSend = climbReadyToSend(beats) && !busy;

  useEffect(() => {
    const stored = loadStartClimbIdentity();
    if (!stored) return;
    setFields((prev) => ({
      ...prev,
      name: stored.name || prev.name,
      email: stored.email || prev.email,
    }));
    if (stored.name && stored.email) setWelcomeBack(true);
  }, []);

  useEffect(() => {
    saveStartClimbIdentity({ name: fields.name, email: fields.email });
  }, [fields.name, fields.email]);

  function patch<K extends keyof Fields>(key: K, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function clearIdentity() {
    clearStartClimbIdentity();
    setWelcomeBack(false);
    setFields((prev) => ({ ...prev, name: "", email: "" }));
    setActiveOverride("start");
  }

  function onTrailSelect(id: ClimbStationId) {
    if (statuses[id] === "locked" || statuses[id] === "narrative") return;
    setActiveOverride(id);
    focusStation(id);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!climbReadyToSend(beats)) return;
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
        setFields((prev) => ({
          ...EMPTY,
          name: prev.name,
          email: prev.email,
        }));
        setActiveOverride(null);
      } else {
        setError(result.error);
      }
    } catch {
      setError("Could not send. Try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  const routeLocked = statuses.route === "locked";
  const waypointLocked = statuses.waypoint === "locked";

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
                  ? `It’s in Gnomah as CN-${sentNote.number}. We’ll read Base Camp, Route, and Waypoint. Summit stays blank.`
                  : sentNote?.number
                    ? `It’s in as CN-${sentNote.number}. We’ll read Base Camp, Route, and Waypoint. Summit stays blank.`
                    : "We’ll reach you at the email you left. We’ll read Base Camp, Route, and Waypoint. Summit stays blank."}
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
                  Summit stays blank until we review
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
                  One problem. One climb. Ready to start.
                </h1>
                <div className="ac-service-lede-box">
                  <p className="ac-service-lede ac-service-lede--last">
                    Send a Note is how a busy owner hands Acornsoft one real
                    problem and gets a clear climb: where you stand, the one
                    job, and whether to go — then we turn it into work.
                  </p>
                </div>
              </header>

              <div className="ac-start-board">
                <form className="ac-start-form" onSubmit={onSubmit} noValidate>
                  <ol className="ac-start-moves ac-start-moves--climb">
                    <li
                      className={`ac-start-move ac-start-move--summit ac-start-move--talk${
                        active === "summit" ? " is-current" : ""
                      }`}
                      aria-disabled="true"
                    >
                      <div className="ac-start-move-head">
                        <span className="ac-start-n">4</span>
                        <span className="ac-start-move-copy">
                          <span className="ac-start-move-label">Summit</span>
                          <span className="ac-start-move-hint">
                            Acornsoft fills this after review. We may ask a
                            follow-up first.
                          </span>
                        </span>
                      </div>
                    </li>
                    <li
                      className={`ac-start-move ac-start-move--descent ac-start-move--talk${
                        active === "descent" ? " is-current" : ""
                      }`}
                      aria-disabled="true"
                    >
                      <div className="ac-start-move-head">
                        <span className="ac-start-n ac-start-n--quiet">D</span>
                        <span className="ac-start-move-copy">
                          <span className="ac-start-move-label">Descent</span>
                          <span className="ac-start-move-hint">
                            Knowledge gained for the next climb.
                          </span>
                        </span>
                      </div>
                    </li>
                    {[...SENDER_FIELDS].reverse().map((move) => {
                      const locked =
                        (move.station === "route" && routeLocked) ||
                        (move.station === "waypoint" && waypointLocked);
                      const current = active === move.station;
                      const done = hasMeaningful(fields[move.key]);
                      return (
                        <li
                          key={move.key}
                          className={[
                            "ac-start-move",
                            locked ? "ac-start-move--locked" : "",
                            current ? "is-current" : "",
                            done && !locked ? "is-done" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          <label
                            htmlFor={`ac-start-${move.key}`}
                            className="ac-start-move-head"
                          >
                            <span className="ac-start-n">{move.n}</span>
                            <span className="ac-start-move-copy">
                              <span className="ac-start-move-label">
                                {move.label}
                                <span className="ac-start-move-sub">
                                  {" "}
                                  — {move.sub}
                                </span>
                              </span>
                              <span className="ac-start-move-hint">
                                {move.hint}
                              </span>
                              {locked && move.unlocksAfter ? (
                                <span className="ac-start-unlock">
                                  <Lock size={13} strokeWidth={2.25} />
                                  Unlocks after {move.unlocksAfter}
                                </span>
                              ) : null}
                            </span>
                          </label>
                          <textarea
                            id={`ac-start-${move.key}`}
                            name={move.key}
                            rows={4}
                            value={fields[move.key]}
                            placeholder={
                              locked ? undefined : move.placeholder
                            }
                            onChange={(ev) => {
                              if (locked) return;
                              patch(move.key, ev.target.value);
                              setActiveOverride(move.station);
                            }}
                            onFocus={() => {
                              if (!locked) setActiveOverride(move.station);
                            }}
                            disabled={locked}
                            readOnly={locked}
                            required={!locked}
                            aria-disabled={locked}
                          />
                        </li>
                      );
                    })}
                    <li
                      className={[
                        "ac-start-move ac-start-move--start",
                        active === "start" ? "is-current" : "",
                        statuses.start === "done" ? "is-done" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <div className="ac-start-move-head">
                        <span className="ac-start-n ac-start-n--start">S</span>
                        <span className="ac-start-move-copy">
                          <span className="ac-start-start-badge">Start here</span>
                          <span className="ac-start-move-label">
                            Name and email
                          </span>
                        </span>
                      </div>
                      {welcomeBack ? (
                        <p className="ac-start-remembered" role="status">
                          <span>Welcome back — we remembered you</span>
                          <button
                            type="button"
                            className="ac-start-not-you"
                            onClick={clearIdentity}
                          >
                            Not you
                          </button>
                        </p>
                      ) : null}
                      <div className="ac-start-meta ac-start-meta--identity">
                        <label htmlFor="ac-start-name">
                          <span>Your name</span>
                          <input
                            id="ac-start-name"
                            type="text"
                            name="name"
                            value={fields.name}
                            onChange={(ev) => {
                              patch("name", ev.target.value);
                              setActiveOverride("start");
                            }}
                            onFocus={() => setActiveOverride("start")}
                            required
                            autoComplete="name"
                          />
                        </label>
                        <label htmlFor="ac-start-email">
                          <span>Email</span>
                          <input
                            id="ac-start-email"
                            type="email"
                            name="email"
                            value={fields.email}
                            onChange={(ev) => {
                              patch("email", ev.target.value);
                              setActiveOverride("start");
                            }}
                            onFocus={() => setActiveOverride("start")}
                            required
                            autoComplete="email"
                          />
                        </label>
                        <label htmlFor="ac-start-title">
                          <span>Give this climb a name</span>
                          <input
                            id="ac-start-title"
                            type="text"
                            name="title"
                            value={fields.title}
                            onChange={(ev) => patch("title", ev.target.value)}
                            placeholder="Optional"
                          />
                        </label>
                        <label className="ac-start-hp" aria-hidden="true">
                          Fax
                          <input
                            type="text"
                            name="hp_fax"
                            value={fields.hp_fax}
                            onChange={(ev) => patch("hp_fax", ev.target.value)}
                            tabIndex={-1}
                            autoComplete="off"
                          />
                        </label>
                      </div>
                    </li>
                  </ol>

                  <input type="hidden" name="lesson" value="" />

                  {error ? (
                    <p className="ac-start-error" role="alert">
                      {error}
                    </p>
                  ) : null}

                  <div className="ac-start-actions">
                    <button
                      type="submit"
                      className="rn-btn ac-btn-maroon"
                      disabled={!canSend}
                      title={
                        canSend
                          ? undefined
                          : "Name yourself, then Base Camp, Route, and Waypoint."
                      }
                    >
                      <span>{busy ? "Sending…" : "Send a Note"}</span>
                    </button>
                    <p className="ac-start-fine">
                      We keep this private until you say otherwise.{" "}
                      <Link to="/field-guide">Want the how-tos first?</Link>
                    </p>
                    <p className="ac-start-energy">
                      With firm requirements, success criteria, and constraints,
                      we can climb anything.
                    </p>
                  </div>
                </form>

                <StartClimbTrail
                  statuses={statuses}
                  active={active}
                  onSelect={onTrailSelect}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </SiteChrome>
  );
}
