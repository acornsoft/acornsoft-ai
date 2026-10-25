import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  allowlistAddCanopyNote,
  allowlistRemoveCanopyNote,
  assignCanopyNote,
  getCanopyAdminPage,
  restoreCanopyAccount,
  revokeCanopyAccount,
  unassignCanopyNote,
  upsertCanopyNote,
} from "@/lib/canopy-notes/actions";
import { CanopyNotesShell } from "@/lib/canopy-notes/shell";
import { CanopyNotFound } from "@/lib/canopy-notes/view";
import type { AuditRow, NoteKind } from "@/lib/canopy-notes/types";
import { NOTE_KINDS } from "@/lib/canopy-notes/types";

export const Route = createFileRoute("/canopy/notes/admin")({
  loader: async () => {
    const result = await getCanopyAdminPage();
    if (result.status === 404) throw notFound();
    return result.audit;
  },
  component: AdminRoute,
  notFoundComponent: AdminMissing,
  head: () => ({
    meta: [
      { title: "Notes admin — Acornsoft" },
      { name: "description", content: "Assign notes to accounts." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function AdminMissing() {
  return (
    <CanopyNotesShell>
      <CanopyNotFound />
    </CanopyNotesShell>
  );
}

function AdminRoute() {
  const audit = Route.useLoaderData();
  return (
    <CanopyNotesShell>
      <AdminForm audit={audit} />
    </CanopyNotesShell>
  );
}

function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toISOString().replace("T", " ").replace(/\.\d{3}Z$/, " UTC");
}

function errorText(err: unknown): string {
  if (err instanceof Error && err.message && err.message.length < 180) {
    return err.message;
  }
  return "That did not save";
}

function AdminForm({ audit }: { audit: AuditRow[] }) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(task: () => Promise<unknown>) {
    setBusy(true);
    setStatus(null);
    try {
      await task();
      setStatus("Saved");
      await router.invalidate();
    } catch (err) {
      setStatus(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ac-canopy-notes">
      <header className="ac-canopy-notes-mast">
        <p className="ac-canopy-notes-kicker">Canopy</p>
        <h1 className="ac-canopy-notes-title">Account notes</h1>
      </header>
      {status ? <p className="ac-canopy-notes-status">{status}</p> : null}
      <div className="ac-canopy-notes-admin">
        <SaveNoteForm
          busy={busy}
          onSubmit={(input) => run(() => upsertCanopyNote({ data: input }))}
        />
        <PairForm
          title="Assign"
          action="Assign"
          busy={busy}
          onSubmit={(noteId, userId) =>
            run(() => assignCanopyNote({ data: { noteId, userId } }))
          }
        />
        <PairForm
          title="Remove"
          action="Remove"
          busy={busy}
          onSubmit={(noteId, userId) =>
            run(() => unassignCanopyNote({ data: { noteId, userId } }))
          }
        />
        <AccountForm
          title="Revoke"
          action="Revoke"
          busy={busy}
          onSubmit={(userId) => run(() => revokeCanopyAccount({ data: { userId } }))}
        />
        <AccountForm
          title="Restore"
          action="Restore"
          busy={busy}
          onSubmit={(userId) => run(() => restoreCanopyAccount({ data: { userId } }))}
        />
        <NoteIdForm
          title="Allow"
          action="Allow"
          busy={busy}
          onSubmit={(noteId) => run(() => allowlistAddCanopyNote({ data: { noteId } }))}
        />
        <NoteIdForm
          title="Drop from allowlist"
          action="Drop"
          busy={busy}
          onSubmit={(noteId) =>
            run(() => allowlistRemoveCanopyNote({ data: { noteId } }))
          }
        />
        <section className="ac-canopy-notes-form">
          <h2>Audit</h2>
          {audit.length === 0 ? null : (
            <ul className="ac-canopy-notes-audit">
              {audit.map((row) => (
                <li key={row.id}>
                  <time dateTime={row.at}>{formatWhen(row.at)}</time>
                  <span className="ac-canopy-notes-audit-action">{row.action}</span>
                  <span>{row.actorUserId}</span>
                  {row.noteId ? <span>{row.noteId}</span> : null}
                  {row.targetUserId ? <span>{row.targetUserId}</span> : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function SaveNoteForm({
  busy,
  onSubmit,
}: {
  busy: boolean;
  onSubmit: (input: {
    noteId?: string;
    kind: NoteKind;
    title: string;
    bodyMd: string;
  }) => void;
}) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const noteId = String(form.get("noteId") ?? "").trim();
    onSubmit({
      noteId: noteId || undefined,
      kind: String(form.get("kind") ?? "other") as NoteKind,
      title: String(form.get("title") ?? ""),
      bodyMd: String(form.get("bodyMd") ?? ""),
    });
  }
  return (
    <form className="ac-canopy-notes-form" onSubmit={submit}>
      <h2>Save note</h2>
      <label>
        Kind
        <select name="kind" defaultValue="other">
          {NOTE_KINDS.map((kind) => (
            <option key={kind} value={kind}>
              {kind}
            </option>
          ))}
        </select>
      </label>
      <label>
        Title
        <input name="title" required maxLength={200} />
      </label>
      <label>
        Body
        <textarea name="bodyMd" required />
      </label>
      <label>
        Existing id
        <input name="noteId" autoComplete="off" />
      </label>
      <button type="submit" disabled={busy}>
        Save note
      </button>
    </form>
  );
}

function PairForm({
  title,
  action,
  busy,
  onSubmit,
}: {
  title: string;
  action: string;
  busy: boolean;
  onSubmit: (noteId: string, userId: string) => void;
}) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSubmit(String(form.get("noteId") ?? ""), String(form.get("userId") ?? ""));
  }
  return (
    <form className="ac-canopy-notes-form" onSubmit={submit}>
      <h2>{title}</h2>
      <div className="ac-canopy-notes-row">
        <label>
          Note id
          <input name="noteId" required autoComplete="off" />
        </label>
        <label>
          Account id
          <input name="userId" required autoComplete="off" />
        </label>
      </div>
      <button type="submit" disabled={busy}>
        {action}
      </button>
    </form>
  );
}

function AccountForm({
  title,
  action,
  busy,
  onSubmit,
}: {
  title: string;
  action: string;
  busy: boolean;
  onSubmit: (userId: string) => void;
}) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSubmit(String(form.get("userId") ?? ""));
  }
  return (
    <form className="ac-canopy-notes-form" onSubmit={submit}>
      <h2>{title}</h2>
      <label>
        Account id
        <input name="userId" required autoComplete="off" />
      </label>
      <button type="submit" disabled={busy}>
        {action}
      </button>
    </form>
  );
}

function NoteIdForm({
  title,
  action,
  busy,
  onSubmit,
}: {
  title: string;
  action: string;
  busy: boolean;
  onSubmit: (noteId: string) => void;
}) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSubmit(String(form.get("noteId") ?? ""));
  }
  return (
    <form className="ac-canopy-notes-form" onSubmit={submit}>
      <h2>{title}</h2>
      <label>
        Note id
        <input name="noteId" required autoComplete="off" />
      </label>
      <button type="submit" disabled={busy}>
        {action}
      </button>
    </form>
  );
}
