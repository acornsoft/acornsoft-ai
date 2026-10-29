import type { ReactNode } from "react";
import type { CanopyNote } from "./types";

export function CanopyNotesBody({
  signedIn,
  notes,
}: {
  signedIn: boolean;
  notes: CanopyNote[];
}) {
  const shared = notes.filter((note) => note.onAllowlist);
  const assigned = notes.filter((note) => !note.onAllowlist);
  return (
    <div className="ac-canopy-notes">
      <header className="ac-canopy-notes-mast">
        <p className="ac-canopy-notes-kicker">Canopy</p>
        <h1 className="ac-canopy-notes-title">Notes</h1>
      </header>
      {shared.length > 0 ? (
        <section className="ac-canopy-notes-section" aria-label="Shared">
          <NoteList notes={shared} />
        </section>
      ) : null}
      {assigned.length > 0 ? (
        <section className="ac-canopy-notes-section" aria-label="Assigned">
          <h2 className="ac-canopy-notes-sub">For this account</h2>
          <NoteList notes={assigned} />
        </section>
      ) : null}
      {signedIn ? null : (
        <p className="ac-canopy-notes-signin">
          <a href="/login?redirect=/canopy/notes">Log in</a>
        </p>
      )}
    </div>
  );
}

function NoteList({ notes }: { notes: CanopyNote[] }) {
  return (
    <ul className="ac-canopy-notes-list">
      {notes.map((note) => (
        <li key={note.noteId}>
          <a className="ac-canopy-notes-card" href={`/canopy/notes/${note.noteId}`}>
            <span className="ac-canopy-notes-card-title">{note.title}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function CanopyNoteDetail({ note }: { note: CanopyNote }) {
  return (
    <article className="ac-canopy-notes">
      <p className="ac-canopy-notes-kicker">
        <a href="/canopy/notes">Notes</a>
      </p>
      <h1 className="ac-canopy-notes-title">{note.title}</h1>
      <div className="ac-canopy-notes-body">{note.bodyMd}</div>
    </article>
  );
}

export function CanopyNotFound() {
  return (
    <div className="ac-canopy-notes">
      <p className="ac-canopy-notes-missing">Not found</p>
    </div>
  );
}

export function CanopyNotesFrame({ children }: { children: ReactNode }) {
  return <div className="ac-canopy-notes-frame">{children}</div>;
}
