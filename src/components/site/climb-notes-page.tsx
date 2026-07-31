import { Link } from "@tanstack/react-router";
import { Logo } from "./logo";
import { ClimbNotesMark } from "./climb-notes-mark";
import {
  climbNotes,
  formatClimbNoteCiteForX,
  type ClimbNote,
} from "./climb-notes-data";

const VOICE_URL = "https://grok.x.ai/";
const X_ACORNSOFT = "https://x.com/acornsoftai";

function NoteCard({ note }: { note: ClimbNote }) {
  const citeText = formatClimbNoteCiteForX(note);
  return (
    <article
      className={`ac-cn-entry${note.xUrl ? " has-x" : ""}`}
      id={note.id}
    >
      <header className="ac-cn-entry-head">
        <span className="ac-cn-num">Climb Note {note.number}</span>
        <span className="ac-cn-badge ac-cn-badge-stored">Stored on site</span>
        {note.xUrl ? (
          <span className="ac-cn-badge ac-cn-badge-x">Cited on X</span>
        ) : null}
        <time dateTime={note.date}>{note.date}</time>
        {note.sourceFile ? (
          <span className="ac-cn-source" title="Obsidian file">
            {note.sourceFile}
          </span>
        ) : null}
      </header>
      <h2 className="ac-cn-entry-title">{note.title}</h2>

      <div className="ac-cn-fields">
        <div>
          <h3>Problem</h3>
          <p>{note.problem}</p>
        </div>
        <div>
          <h3>Measure</h3>
          <p>{note.measure}</p>
        </div>
        <div>
          <h3>Slice</h3>
          <p>{note.slice}</p>
        </div>
        <div>
          <h3>Lesson</h3>
          <p>{note.lesson}</p>
        </div>
      </div>

      <footer className="ac-cn-entry-foot">
        {note.xUrl ? (
          <a
            className="rn-btn"
            href={note.xUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>X citation</span>
          </a>
        ) : null}
        <details className="ac-cn-x-template">
          <summary>Optional: cite this note on X</summary>
          <p className="ac-cn-x-hint" style={{ marginTop: 10 }}>
            The full note already lives here. On X, post a short pointer—not a
            second full copy.
          </p>
          <pre className="ac-cn-x-pre">
            <code>{citeText}</code>
          </pre>
          <p className="ac-cn-x-hint">
            After you post, send the status URL so we can attach{" "}
            <code>xUrl</code> on this note (optional back-link).
          </p>
          <a
            className="ac-note-link"
            href={X_ACORNSOFT}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open @acornsoftai →
          </a>
        </details>
      </footer>
    </article>
  );
}

export function ClimbNotesPage() {
  return (
    <div className="template-color-1 spybody ac-inbio ac-climb-notes">
      <header className="rn-header haeder-default black-logo-version header--fixed header--sticky sticky">
        <div className="header-wrapper m--0 row align-items-center">
          <div className="col-lg-3 col-6">
            <div className="header-left">
              <div className="logo">
                <Link to="/">
                  <Logo className="acornsoft-logo" />
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-9 col-6">
            <div className="header-center">
              <nav className="mainmenu-nav d-none d-xl-block">
                <ul className="primary-menu nav nav-pills">
                  <li className="nav-item">
                    <Link className="nav-link" to="/">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link active" to="/climb-notes">
                      <ClimbNotesMark />
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/canopy">
                      Canopy
                    </Link>
                  </li>
                </ul>
              </nav>
              <div className="header-right">
                <Link className="ac-menu-text d-xl-none" to="/">
                  Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="main-page-wrapper cn-page">
        <section className="cn-hero rn-section-gap">
          <div className="container">
            <div className="row">
              <div className="col-lg-10">
                <div className="section-title text-left">
                  <span className="subtitle">Studio energy</span>
                  <h1 className="title cn-page-title">
                    <ClimbNotesMark large />
                  </h1>
                  <p className="description">
                    Climbing logs are written in{" "}
                    <strong>Obsidian</strong> as Markdown, then stored on this
                    site—that is the source of truth. Each note is Problem,
                    Measure, Slice, Lesson. X is optional: a short citation that
                    points back here.
                  </p>
                </div>
              </div>
            </div>

            <div className="row mt--30">
              <div className="col-lg-12">
                <div className="ac-cn-workflow">
                  <h2 className="ac-cn-workflow-title">
                    Obsidian → site → optional X
                  </h2>
                  <ol>
                    <li>
                      <strong>Obsidian:</strong> new note from the Climb Note
                      template (Problem · Measure · Slice · Lesson). File name
                      like <code>002 Title.md</code>.
                    </li>
                    <li>
                      <strong>Automate sync:</strong> set{" "}
                      <code>CLIMB_NOTES_VAULT</code> or{" "}
                      <code>.climb-notes-sync.json</code>, then{" "}
                      <code>npm run climb-notes:watch</code>. Saves in Obsidian
                      copy into <code>content/climb-notes/</code>.
                    </li>
                    <li>
                      <strong>Site loads Markdown</strong> at{" "}
                      <code>/climb-notes#cn-00N</code>. One-shot:{" "}
                      <code>npm run climb-notes:sync</code>.
                    </li>
                    <li>
                      <strong>Optional — cite on X:</strong> short post + link
                      to the site note. Set <code>xUrl</code> in frontmatter if
                      you want a back-link.
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rn-section-gap" id="notes">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                {climbNotes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rn-section-gap cn-cta-band">
          <div className="container text-center">
            <h3 className="title">Radar lives on Canopy</h3>
            <p className="description">
              Climb Notes™ hold the journal on this site. Canopy is the live
              signal layer.
            </p>
            <div className="ac-hero-cta" style={{ marginTop: 24 }}>
              <Link className="rn-btn" to="/canopy">
                <span>Open Canopy</span>
              </Link>
              <Link className="rn-btn ac-btn-outline" to="/">
                <span>Back to Acornsoft</span>
              </Link>
            </div>
          </div>
        </section>

        <div className="rn-footer-area" style={{ paddingBottom: 48 }}>
          <div className="container">
            <div className="footer-area text-center">
              <Logo className="acornsoft-logo ac-footer-logo" />
              <ul className="ac-footer-nav">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/climb-notes">
                    <ClimbNotesMark />
                  </Link>
                </li>
                <li>
                  <Link to="/canopy">Canopy</Link>
                </li>
                <li>
                  <Link to="/corporate" className="ac-corp-foot-link">
                    Corporate
                  </Link>
                </li>
              </ul>
              <p className="description mt--20">
                © {new Date().getFullYear()} Acornsoft. Reach us via{" "}
                <a href={VOICE_URL} target="_blank" rel="noopener noreferrer">
                  Voice
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
