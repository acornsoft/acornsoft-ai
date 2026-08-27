import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { VoiceWhenSignedIn } from "./voice-access";
import { ClimbNotesMark } from "./climb-notes-mark";
import { SiteChrome } from "./site-chrome";
import {

  climbNotes as staticClimbNotes,
  publishedClimbNotes as staticPublishedClimbNotes,
  formatClimbNoteCiteForX,
  climbNoteXActionUrl,
  isPublicClimbNoteStatus,
  CLIMB_NOTE_STATUS_LABEL,
  type ClimbNote,
} from "./climb-notes-data";
import { listPublishedClimbNotes } from "@/lib/climb-notes/actions";



const CLIMB_STEPS: {
  key: "problem" | "measure" | "slice" | "lesson";
  n: 1 | 2 | 3 | 4;
  label: string;
  plain: string;
  stage: string;
}[] = [
  { key: "problem", n: 1, label: "Problem", plain: "What's stuck", stage: "Basecamp" },
  { key: "measure", n: 2, label: "Measure", plain: "How we know it moved", stage: "Brief" },
  { key: "slice", n: 3, label: "Pitch", plain: "The next safe pitch", stage: "Route" },
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

function sortPublished(list: ClimbNote[]): ClimbNote[] {
  return [...list]
    .filter((n) => isPublicClimbNoteStatus(n.status))
    .sort((a, b) => {
      if (a.id === "cn-016" || a.number === "000" || a.number === "016")
        return -1;
      if (b.id === "cn-016" || b.number === "000" || b.number === "016")
        return 1;
      const byNum = b.number.localeCompare(a.number);
      if (byNum !== 0) return byNum;
      return a.title.localeCompare(b.title);
    });
}

function NoteCard({ note }: { note: ClimbNote }) {
  const citeText = formatClimbNoteCiteForX(note);
  const isPublic = isPublicClimbNoteStatus(note.status);
  if (!isPublic) return null;

  const tags = note.tags?.filter(Boolean) ?? [];
  const xAction = climbNoteXActionUrl(note);
  const cnPin = cnPinLabel(note.number);
  const statusLabel = CLIMB_NOTE_STATUS_LABEL[note.status];

  return (
    <article
      id={note.id}
      className="ac-cn-entry ac-cn-entry--trail is-published"
    >
      <header className="ac-cn-entry-head">
        <div className="ac-cn-title-row">
          <h2 className="ac-cn-entry-title">{note.title}</h2>
          <div className="ac-cn-trail-gear" aria-label="Share actions">
            <span
              className="ac-cn-pill ac-cn-pill--status ac-cn-pill--published"
              title="Published"
            >
              {statusLabel}
            </span>

            <a
              className="ac-cn-pill ac-cn-pill--x ac-cn-pill--action"
              href={xAction.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {xAction.kind === "live" ? "Open on X" : "Schedule on X"}
            </a>
            {xAction.kind === "compose" && citeText ? (
              <details className="ac-cn-cite-details">
                <summary className="ac-cn-pill ac-cn-pill--ghost ac-cn-pill--action">
                  View post text
                </summary>
                <pre className="ac-cn-cite-panel">{citeText}</pre>
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
        <ul className="ac-cn-fact-pills">
          <li>
            <span className="ac-cn-fact-k">Number</span>
            <span className="ac-cn-pill ac-cn-pill--fact">{cnPin}</span>
          </li>
          <li>
            <span className="ac-cn-fact-k">Date</span>
            <span className="ac-cn-pill ac-cn-pill--fact">
              {formatMetaDate(note.date)}
            </span>
          </li>
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
            <span className="ac-cn-pill ac-cn-pill--fact">Public</span>
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

/**
 * Public Climb Notes journal — **published only**.
 * Draft / pending / approved / archived live in Gnomah (owner), never here.
 */
export function ClimbNotesPage() {
  const [notes, setNotes] = useState<ClimbNote[]>(() =>
    sortPublished(staticPublishedClimbNotes),
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const list = await listPublishedClimbNotes();
        if (cancelled) return;
        const published = sortPublished(
          list.length > 0
            ? list
            : staticPublishedClimbNotes.length > 0
              ? staticPublishedClimbNotes
              : staticClimbNotes,
        );
        setNotes(published);
      } catch {
        if (!cancelled) {
          setNotes(
            sortPublished(
              staticPublishedClimbNotes.length > 0
                ? staticPublishedClimbNotes
                : staticClimbNotes,
            ),
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(() => sortPublished(notes), [notes]);

  return (
    <SiteChrome loginRedirect="/gnomah" mainClassName="ac-climb-notes">
      <div className="ac-service-page ac-climb-notes ac-page-top" id="notes">
        <div className="ac-service-stack">
          <header className="ac-service-head">
            <span className="ac-service-kicker">Journal</span>
            <h1 className="ac-service-title">
              <ClimbNotesMark large />
            </h1>
            <div className="ac-service-lede-box">
              <p className="ac-service-lede">
                Each Climb Note is one climb: four steps in order — what we
                write and how the climb runs.
              </p>
              <p className="ac-service-lede ac-service-lede--last">
                Published trails anyone can follow. Drafts stay in the studio.
              </p>
            </div>
          </header>

          {loading ? (
            <p className="ac-cn-empty">Loading Climb Notes…</p>
          ) : visible.length === 0 ? (
            <p className="ac-cn-empty">No published Climb Notes yet.</p>
          ) : (
            <div className="ac-cn-list">
              {visible.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}

          <div className="ac-cn-footer-links">
            <p>
              Climb Notes™ hold the journal on this site. Canopy shows the
              public journal on the live radar.
            </p>
            <div className="ac-hero-cta ac-cn-footer-actions">
              <Link className="rn-btn" to="/canopy">
                <span>Open Canopy</span>
              </Link>
              <VoiceWhenSignedIn>
                <Link className="rn-btn ac-btn-maroon" to="/voice">
                  <span>Talk to Luna</span>
                </Link>
                <Link className="rn-btn ac-btn-outline" to="/gnomah">
                  <span>Open Gnomah</span>
                </Link>
              </VoiceWhenSignedIn>
            </div>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}

