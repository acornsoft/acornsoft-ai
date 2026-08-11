import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { VoiceWhenSignedIn } from "./voice-access";
import { ClimbNotesMark } from "./climb-notes-mark";
import { SiteHeader } from "./site-chrome";
import {
  climbNotes as staticClimbNotes,
  countByStatus,
  formatClimbNoteCiteForX,
  climbNoteXActionUrl,
  isPublicClimbNoteStatus,
  CLIMB_NOTE_STATUS_LABEL,
  type ClimbNote,
  type ClimbNoteStatus,
} from "./climb-notes-data";
import {
  listAllClimbNotesPublic,
  listPublishedClimbNotes,
} from "@/lib/climb-notes/actions";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { authEnabled } from "@/lib/auth/client";

type StudioFilter = "all" | ClimbNoteStatus;
type PageMode = "public" | "studio";

const STUDIO_FILTERS: { key: StudioFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "pending", label: "Pending approval" },
  { key: "approved", label: "Approved" },
  { key: "draft", label: "Unapproved" },
  { key: "archived", label: "Archived" },
];

const CLIMB_STEPS: {
  key: "problem" | "measure" | "slice" | "lesson";
  n: 1 | 2 | 3 | 4;
  label: string;
  plain: string;
  stage: string;
}[] = [
  { key: "problem", n: 1, label: "Problem", plain: "What's stuck", stage: "Basecamp" },
  { key: "measure", n: 2, label: "Measure", plain: "How we know it moved", stage: "Brief" },
  { key: "slice", n: 3, label: "Slice", plain: "The small step", stage: "Route" },
  { key: "lesson", n: 4, label: "Lesson", plain: "What we carry next", stage: "Ascent" },
];

function formatMetaDate(value?: string | null | unknown): string {
  if (value == null || value === "") return "—";
  const raw =
    typeof value === "string"
      ? value
      : value instanceof Date
        ? value.toISOString()
        : String(value);
  const day = raw.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(day)) return day;
  return raw;
}

function cnPinLabel(number: string): string {
  const n = String(number).replace(/^cn-/i, "").trim();
  return `CN-${n}`;
}

function NoteCard({
  note,
  studio,
  signedIn,
}: {
  note: ClimbNote;
  studio: boolean;
  signedIn: boolean;
}) {
  const citeText = formatClimbNoteCiteForX(note);
  const isPublic = isPublicClimbNoteStatus(note.status);
  const tags = note.tags?.filter(Boolean) ?? [];
  const visibility = isPublic ? "Public" : "Not public";
  const xAction = climbNoteXActionUrl(note);
  const cnPin = cnPinLabel(note.number);
  const statusLabel = CLIMB_NOTE_STATUS_LABEL[note.status];

  return (
    <article
      id={note.id}
      className={[
        "ac-cn-entry",
        "ac-cn-entry--trail",
        studio && !isPublic ? "is-not-public" : "",
        `is-${note.status}`,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <header className="ac-cn-entry-head">
        <div className="ac-cn-title-row">
          <h2 className="ac-cn-entry-title">{note.title}</h2>
          <div className="ac-cn-trail-gear" aria-label="Share actions">
            <span
              className={[
                "ac-cn-pill",
                "ac-cn-pill--status",
                "ac-cn-status-select",
                `is-${note.status}`,
                signedIn ? "is-editable" : "is-locked",
              ].join(" ")}
              title={
                signedIn
                  ? `Status: ${statusLabel}`
                  : "Sign in to change status"
              }
              aria-disabled={!signedIn}
            >
              {statusLabel}
            </span>
            <a
              className="ac-cn-gear-link ac-cn-gear-link--primary"
              href={xAction.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {xAction.kind === "live" ? "Open on X" : "Schedule on X"}
            </a>
            {xAction.kind === "compose" && citeText ? (
              <details className="ac-cn-cite-details ac-cn-cite-details--gear">
                <summary className="ac-cn-gear-link">View post text</summary>
                <pre className="ac-cn-x-pre" tabIndex={0}>
                  {citeText}
                </pre>
              </details>
            ) : null}
          </div>
        </div>
      </header>

      <section className="ac-cn-climb" aria-labelledby={`${note.id}-climb`}>
        <h3 className="ac-cn-section-kicker" id={`${note.id}-climb`}>
          The climb
        </h3>
        <ol className="ac-cn-timeline" aria-label="Climb timeline">
          {CLIMB_STEPS.map((step) => {
            const body = note[step.key];
            if (!body) return null;
            const isFirst = step.n === 1;
            return (
              <li
                key={step.key}
                className={`ac-cn-tl-step ac-cn-tl-step--${step.key}${
                  isFirst ? " is-trailhead" : ""
                }`}
              >
                <div className="ac-cn-tl-rail" aria-hidden>
                  {isFirst ? (
                    <>
                      <span className="ac-cn-tl-pin" title={`Trail head ${cnPin}`}>
                        {cnPin}
                      </span>
                      <span className="ac-cn-tl-stem ac-cn-tl-stem--short" />
                    </>
                  ) : null}
                  <span className="ac-cn-tl-n">{step.n}</span>
                  {step.n < 4 ? <span className="ac-cn-tl-stem" /> : null}
                </div>
                <div className="ac-cn-tl-main">
                  <div className="ac-cn-move-top">
                    <div className="ac-cn-move-top-left">
                      <h4 className="ac-cn-move-name">{step.label}</h4>
                      <span className="ac-cn-pill ac-cn-pill--stage">
                        {step.stage}
                      </span>
                    </div>
                    <span className="ac-cn-pill ac-cn-pill--plain">
                      {step.plain}
                    </span>
                  </div>
                  <p className="ac-cn-move-body">{body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <footer className="ac-cn-meta-foot">
        <p className="ac-cn-section-kicker ac-cn-meta-kicker">Metadata</p>
        <ul className="ac-cn-fact-pills" aria-label="Climb Note metadata">
          {note.date ? (
            <li>
              <span className="ac-cn-fact-k">Date</span>
              <span className="ac-cn-pill ac-cn-pill--fact">
                {formatMetaDate(note.date)}
              </span>
            </li>
          ) : null}
          {note.version != null ? (
            <li>
              <span className="ac-cn-fact-k">Version</span>
              <span className="ac-cn-pill ac-cn-pill--fact">
                v{note.version}
              </span>
            </li>
          ) : null}
          {note.publishedAt ? (
            <li>
              <span className="ac-cn-fact-k">Published</span>
              <span className="ac-cn-pill ac-cn-pill--fact">
                {formatMetaDate(note.publishedAt)}
              </span>
            </li>
          ) : null}
          <li>
            <span className="ac-cn-fact-k">Who can see it</span>
            <span className="ac-cn-pill ac-cn-pill--fact">{visibility}</span>
          </li>
          {tags.length > 0 ? (
            <li className="ac-cn-fact-tags">
              <span className="ac-cn-fact-k">Tags</span>
              <span className="ac-cn-meta-tags">
                {tags.map((t) => (
                  <span key={t} className="ac-cn-pill ac-cn-pill--tag">
                    {t}
                  </span>
                ))}
              </span>
            </li>
          ) : null}
        </ul>
      </footer>
    </article>
  );
}

export function ClimbNotesPage() {
  const { user, isPending } = useCurrentUserState();
  const signedIn = !authEnabled || (!isPending && !!user);
  const [mode, setMode] = useState<PageMode>("public");
  const [filter, setFilter] = useState<StudioFilter>("all");
  const [notes, setNotes] = useState<ClimbNote[]>(staticClimbNotes);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const list =
          mode === "public"
            ? await listPublishedClimbNotes()
            : await listAllClimbNotesPublic();
        if (!cancelled) {
          if (list.length > 0) setNotes(list);
          else if (staticClimbNotes.length > 0) setNotes(staticClimbNotes);
        }
      } catch {
        if (!cancelled && staticClimbNotes.length > 0) {
          setNotes(staticClimbNotes);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode]);

  const counts = useMemo(() => countByStatus(notes), [notes]);

  const visible = useMemo(() => {
    let list: ClimbNote[];
    if (mode === "public") {
      list = notes.filter((n) => isPublicClimbNoteStatus(n.status));
    } else if (filter === "all") {
      list = notes;
    } else {
      list = notes.filter((n) => n.status === filter);
    }
    return [...list].sort((a, b) => {
      if (a.id === "cn-016") return -1;
      if (b.id === "cn-016") return 1;
      const byNum = b.number.localeCompare(a.number);
      if (byNum !== 0) return byNum;
      return a.title.localeCompare(b.title);
    });
  }, [notes, mode, filter]);

  const publishedCount = counts.published;
  const studioCount = counts.all;

  return (
    <div className="template-color-1 spybody ac-inbio ac-climb-notes ac-hero-stage">
      <SiteHeader loginRedirect="/gnomah" />

      <main className="main-page-wrapper cn-page ac-page-hero-main">
        <section className="cn-hero rn-section-gap ac-page-top">
          <div className="container">
            <div className="row">
              <div className="col-lg-10">
                <div className="section-title text-left">
                  <span className="subtitle">Studio energy</span>
                  <h1 className="title cn-page-title">
                    <ClimbNotesMark large />
                  </h1>
                  <p className="description" style={{ maxWidth: "40em" }}>
                    Each Climb Note is one climb: four steps in order — what we
                    write and how the climb runs.
                  </p>
                </div>
              </div>
            </div>

            <div className="row mt--30">
              <div className="col-lg-12">
                <div className="ac-cn-toolbar">
                  <div
                    className="ac-cn-mode-bar ac-cn-mode-bar--compact-right"
                    role="tablist"
                    aria-label="Climb Notes view"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={mode === "public"}
                      className={`ac-cn-mode-btn${
                        mode === "public" ? " is-active" : ""
                      }`}
                      onClick={() => setMode("public")}
                    >
                      Public journal
                      <span className="ac-cn-mode-count">
                        ({publishedCount})
                      </span>
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={mode === "studio"}
                      className={`ac-cn-mode-btn${
                        mode === "studio" ? " is-active" : ""
                      }`}
                      onClick={() => setMode("studio")}
                    >
                      Studio library
                      <span className="ac-cn-mode-count">({studioCount})</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rn-section-gap" id="notes">
          <div className="container">
            {mode === "studio" ? (
              <div className="ac-cn-filter-row" aria-label="Filter by status">
                {STUDIO_FILTERS.map((f) => {
                  const n =
                    f.key === "all"
                      ? counts.all
                      : counts[f.key as ClimbNoteStatus];
                  return (
                    <button
                      key={f.key}
                      type="button"
                      className={`ac-cn-filter-pill${
                        filter === f.key ? " is-active" : ""
                      }`}
                      onClick={() => setFilter(f.key)}
                    >
                      {f.label}
                      <span>({n})</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="ac-cn-public-banner">
                Published Climb Notes — trails anyone can follow.
              </p>
            )}

            {loading ? (
              <p className="ac-cn-empty">Loading Climb Notes…</p>
            ) : visible.length === 0 ? (
              <p className="ac-cn-empty">
                {mode === "public"
                  ? "No published Climb Notes yet."
                  : "No Climb Notes match this filter."}
              </p>
            ) : (
              <div className="ac-cn-list">
                {visible.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    studio={mode === "studio"}
                    signedIn={signedIn}
                  />
                ))}
              </div>
            )}

            <div className="ac-cn-footer-links">
              <p>
                Climb Notes™ hold the journal on this site. Canopy shows the
                public journal on the live radar.
              </p>
              <div className="ac-hero-cta" style={{ marginTop: 24 }}>
                <VoiceWhenSignedIn>
                  <Link className="rn-btn ac-btn-maroon" to="/voice">
                    <span>Talk to Luna</span>
                  </Link>
                </VoiceWhenSignedIn>
                <Link className="rn-btn" to="/canopy">
                  <span>Open Canopy</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
