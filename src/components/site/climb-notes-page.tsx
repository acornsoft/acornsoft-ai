import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { VoiceWhenSignedIn } from "./voice-access";
import { ClimbNotesMark } from "./climb-notes-mark";
import { SiteHeader } from "./site-chrome";
import {
  climbNotes as staticClimbNotes,
  countByStatus,
  formatClimbNoteCiteForX,
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

function statusClass(status: ClimbNoteStatus): string {
  return `ac-cn-badge ac-cn-badge-${status}`;
}

function NoteCard({
  note,
  studio,
}: {
  note: ClimbNote;
  studio: boolean;
}) {
  const citeText = formatClimbNoteCiteForX(note);
  const isPublic = isPublicClimbNoteStatus(note.status);
  return (
    <article
      className={[
        "ac-cn-entry",
        studio && !isPublic ? "is-not-public" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="ac-cn-entry-meta">
        <span className="ac-cn-num">Climb Note {note.number}</span>
        <time dateTime={note.date}>{note.date}</time>
        {studio ? (
          <span className={statusClass(note.status)}>
            {CLIMB_NOTE_STATUS_LABEL[note.status]}
          </span>
        ) : null}
        {studio && !isPublic ? (
          <span className="ac-cn-badge ac-cn-badge-hidden">Not public</span>
        ) : null}
      </div>
      <h2 className="ac-cn-entry-title">{note.title}</h2>
      <div className="ac-cn-entry-body">
        {note.problem ? (
          <div className="ac-cn-field">
            <h3>Problem</h3>
            <p>{note.problem}</p>
          </div>
        ) : null}
        {note.measure ? (
          <div className="ac-cn-field">
            <h3>Measure</h3>
            <p>{note.measure}</p>
          </div>
        ) : null}
        {note.slice ? (
          <div className="ac-cn-field">
            <h3>Slice</h3>
            <p>{note.slice}</p>
          </div>
        ) : null}
        {note.lesson ? (
          <div className="ac-cn-field">
            <h3>Lesson</h3>
            <p>{note.lesson}</p>
          </div>
        ) : null}
      </div>
      {note.xUrl ? (
        <p className="ac-cn-cite">
          <a href={note.xUrl} target="_blank" rel="noopener noreferrer">
            Source on X
          </a>
        </p>
      ) : citeText ? (
        <p className="ac-cn-cite muted">{citeText}</p>
      ) : null}
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
    if (mode === "public") {
      return notes.filter((n) => isPublicClimbNoteStatus(n.status));
    }
    if (filter === "all") return notes;
    return notes.filter((n) => n.status === filter);
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
                      className={`ac-cn-mode-btn${mode === "public" ? " is-active" : ""}`}
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
                      className={`ac-cn-mode-btn${mode === "studio" ? " is-active" : ""}`}
                      onClick={() => setMode("studio")}
                    >
                      Studio library
                      <span className="ac-cn-mode-count">({studioCount})</span>
                    </button>
                  </div>

                  {/* Open Gnomah only when signed in */}
                  {signedIn ? (
                    <Link
                      className="rn-btn ac-btn-maroon ac-cn-open-gnomah"
                      to="/gnomah"
                    >
                      <span>Open Gnomah</span>
                    </Link>
                  ) : null}
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
                      className={`ac-cn-filter-chip${filter === f.key ? " is-active" : ""}`}
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
                Published Climb Notes — plain-language trails for anyone learning
                the mountaineering approach to AI. Studio library holds drafts
                and non-public statuses.
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
                {signedIn ? (
                  <Link className="rn-btn ac-btn-maroon" to="/gnomah">
                    <span>Open Gnomah</span>
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
