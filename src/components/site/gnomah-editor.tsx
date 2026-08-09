import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, Navigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  FilePlus2,
  Mountain,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { Logo } from "./logo";
import { SiteHeader } from "./site-chrome";
import {
  CLIMB_NOTE_STATUS_LABEL,
  type ClimbNote,
  type ClimbNoteStatus,
} from "./climb-notes-data";
import {
  deleteClimbNoteAction,
  listClimbNotesForEditor,
  refreshClimbNotesLibrary,
  saveClimbNoteAction,
} from "@/lib/climb-notes/actions";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { authEnabled, signOut } from "@/lib/auth/client";

type DraftForm = {
  id: string;
  number: string;
  title: string;
  date: string;
  status: ClimbNoteStatus;
  problem: string;
  measure: string;
  slice: string;
  lesson: string;
  tags: string;
  xUrl: string;
};

type Mode = "browse" | "edit";

type ViewFilter =
  | "all"
  | "engagement"
  | "product"
  | "open"
  | "live"
  | "archived";

const VIEW_FILTERS: { key: ViewFilter; label: string; hint: string }[] = [
  { key: "all", label: "Everything", hint: "Full timeline" },
  { key: "engagement", label: "Engagements", hint: "Client / delivery climbs" },
  { key: "product", label: "Product", hint: "Product & abstract climbs" },
  { key: "open", label: "Open work", hint: "Unapproved, pending, approved" },
  { key: "live", label: "On the journal", hint: "Published only" },
  { key: "archived", label: "Shelved", hint: "Archived climbs" },
];

const STATE_OPTIONS: {
  value: ClimbNoteStatus;
  label: string;
  hint: string;
}[] = [
  {
    value: "draft",
    label: "Unapproved",
    hint: "Draft / unpublished — not on the public journal",
  },
  {
    value: "approved",
    label: "Approved",
    hint: "Ready; not live yet",
  },
  {
    value: "published",
    label: "Published",
    hint: "Live on the public Climb Notes journal",
  },
  {
    value: "archived",
    label: "Archived",
    hint: "Shelved from the active timeline",
  },
];

const emptyForm = (): DraftForm => ({
  id: "",
  number: "",
  title: "",
  date: new Date().toISOString().slice(0, 10),
  status: "draft",
  problem: "",
  measure: "",
  slice: "",
  lesson: "",
  tags: "climb-note",
  xUrl: "",
});

function noteToForm(n: ClimbNote): DraftForm {
  return {
    id: n.id,
    number: n.number,
    title: n.title,
    date: n.date,
    status: n.status,
    problem: n.problem,
    measure: n.measure,
    slice: n.slice,
    lesson: n.lesson,
    tags: (n.tags ?? []).join(", "),
    xUrl: n.xUrl ?? "",
  };
}

function noteRecencyKey(n: ClimbNote): string {
  return (
    n.publishedAt ||
    n.approvedAt ||
    n.submittedAt ||
    n.date ||
    n.number ||
    n.id
  );
}

function folderOf(n: ClimbNote): string {
  const f = (n.sourceFile || "").toLowerCase();
  if (f.includes("engagement")) return "engagement";
  if (f.includes("product")) return "product";
  if (f.includes("foundation")) return "foundation";
  if (f.includes("archive")) return "archive";
  const t = `${n.title} ${(n.tags || []).join(" ")}`.toLowerCase();
  if (/\bengagement\b|\bclient\b|\baurora\b|\bharbor\b/.test(t))
    return "engagement";
  return "product";
}

function matchesView(n: ClimbNote, view: ViewFilter): boolean {
  if (view === "all") return true;
  if (view === "engagement") return folderOf(n) === "engagement";
  if (view === "product") return folderOf(n) === "product";
  if (view === "open")
    return (
      n.status === "draft" ||
      n.status === "pending" ||
      n.status === "approved"
    );
  if (view === "live") return n.status === "published";
  if (view === "archived") return n.status === "archived";
  return true;
}

function countView(notes: ClimbNote[], view: ViewFilter): number {
  return notes.filter((n) => matchesView(n, view)).length;
}

function previewLine(n: ClimbNote): string {
  return (n.problem || n.measure || n.slice || n.lesson || "").slice(0, 140);
}

function isSessionAuthError(err: unknown): boolean {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  return (
    msg.includes("unauthorized") ||
    msg.includes("sign in required") ||
    msg.includes("session expired") ||
    msg.includes("session invalid") ||
    msg.includes("not authenticated") ||
    msg.includes("401")
  );
}

function isOwnerForbiddenError(err: unknown): boolean {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  return (
    msg.includes("owner") ||
    msg.includes("forbidden") ||
    msg.includes("403") ||
    msg.includes("not authorized") ||
    msg.includes("sign in with x")
  );
}

export function GnomahEditorPage() {
  const { user, isPending } = useCurrentUserState();
  const [notes, setNotes] = useState<ClimbNote[]>([]);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [form, setForm] = useState<DraftForm>(emptyForm());
  const [mode, setMode] = useState<Mode>("browse");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [forbidMsg, setForbidMsg] = useState<string | null>(null);
  const [needsReauth, setNeedsReauth] = useState(false);
  const [view, setView] = useState<ViewFilter>("all");
  const [query, setQuery] = useState("");
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [libraryMeta, setLibraryMeta] = useState(
    "Local vault · waiting for first sync",
  );
  const [syncing, setSyncing] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map());
  const formRef = useRef(form);
  formRef.current = form;
  const lastSavedJson = useRef("");
  const suppressAutoSave = useRef(false);
  const saveTimer = useRef<number | null>(null);

  const canEdit = !authEnabled || !!user;

  function formSnapshot(f: DraftForm): string {
    return JSON.stringify({
      id: f.id,
      number: f.number,
      title: f.title,
      date: f.date,
      status: f.status,
      problem: f.problem,
      measure: f.measure,
      slice: f.slice,
      lesson: f.lesson,
      tags: f.tags,
      xUrl: f.xUrl,
    });
  }

  function loadForm(next: DraftForm) {
    suppressAutoSave.current = true;
    lastSavedJson.current = formSnapshot(next);
    setForm(next);
    setSaveState("idle");
  }

  const handleAuthFailure = useCallback(async () => {
    setNeedsReauth(true);
    setNotes([]);
    toast.message("Session expired — sign in again with X as @acornsoftai");
    try {
      await signOut("/login?redirect=/gnomah");
    } catch {
      window.location.href = "/login?redirect=/gnomah";
    }
  }, []);

  const load = useCallback(
    async (opts?: { quiet?: boolean }) => {
      if (!opts?.quiet) setLoading(true);
      setForbidden(false);
      setForbidMsg(null);
      try {
        const list = await listClimbNotesForEditor();
        const sorted = [...list].sort((a, b) =>
          noteRecencyKey(b).localeCompare(noteRecencyKey(a)),
        );
        setNotes(sorted);
        setFocusId((prev) => {
          if (prev && sorted.some((n) => n.id === prev)) return prev;
          return sorted[0]?.id ?? null;
        });
      } catch (e) {
        if (isSessionAuthError(e)) await handleAuthFailure();
        else if (isOwnerForbiddenError(e)) {
          setForbidden(true);
          setForbidMsg(
            e instanceof Error
              ? e.message
              : "This X account is not authorized for Gnomah.",
          );
          setNotes([]);
        } else {
          toast.error(e instanceof Error ? e.message : "Could not load library");
        }
      } finally {
        if (!opts?.quiet) setLoading(false);
      }
    },
    [handleAuthFailure],
  );

  /** Local vault re-scan + optional GitHub Gnomah pull. */
  const syncLibrary = useCallback(
    async (opts?: { quiet?: boolean }) => {
      setSyncing(true);
      try {
        const result = await refreshClimbNotesLibrary();
        setLibraryMeta(
          `${result.source} · ${result.total} notes · ${new Date().toLocaleTimeString()}`,
        );
        if (!opts?.quiet) toast.message(result.message);
        await load({ quiet: true });
      } catch (e) {
        if (isSessionAuthError(e)) await handleAuthFailure();
        else if (isOwnerForbiddenError(e)) {
          setForbidden(true);
          setForbidMsg(
            e instanceof Error ? e.message : "Not authorized for Gnomah.",
          );
        } else if (!opts?.quiet) {
          toast.error(e instanceof Error ? e.message : "Sync failed");
        }
      } finally {
        setSyncing(false);
        setLoading(false);
      }
    },
    [handleAuthFailure, load],
  );

  useEffect(() => {
    if (!canEdit) {
      setLoading(false);
      return;
    }
    void syncLibrary({ quiet: true });
  }, [canEdit, syncLibrary]);

  // Async poll while browsing — new vault/GitHub notes appear without reload
  useEffect(() => {
    if (!canEdit || mode !== "browse") return;
    const id = window.setInterval(() => {
      void syncLibrary({ quiet: true });
    }, 25_000);
    const onFocus = () => void syncLibrary({ quiet: true });
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [canEdit, mode, syncLibrary]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes
      .filter((n) => matchesView(n, view))
      .filter((n) => {
        if (!q) return true;
        const hay = [
          n.number,
          n.title,
          n.problem,
          n.measure,
          n.slice,
          n.lesson,
          ...(n.tags ?? []),
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
  }, [notes, view, query]);

  const focused = useMemo(
    () => filtered.find((n) => n.id === focusId) ?? filtered[0] ?? null,
    [filtered, focusId],
  );
  const focusFolder = focused ? folderOf(focused) : "";

  useEffect(() => {
    if (!filtered.length) {
      setFocusId(null);
      return;
    }
    if (!focusId || !filtered.some((n) => n.id === focusId)) {
      setFocusId(filtered[0].id);
    }
  }, [filtered, focusId]);

  useEffect(() => {
    if (!focusId || mode !== "browse") return;
    const el = cardRefs.current.get(focusId);
    el?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [focusId, mode, filtered.length]);

  function selectCard(n: ClimbNote) {
    setFocusId(n.id);
  }

  function enterEdit(n: ClimbNote, opts?: { refresh?: boolean }) {
    setFocusId(n.id);
    if (opts?.refresh) {
      const fresh = notes.find((x) => x.id === n.id) ?? n;
      loadForm(noteToForm(fresh));
    } else if (form.id !== n.id || mode !== "edit") {
      loadForm(noteToForm(n));
    }
    setMode("edit");
  }

  function exitEdit() {
    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    void persistForm(formRef.current, { quiet: true });
    setMode("browse");
    void load({ quiet: true });
  }

  function newNote() {
    const nextNum =
      notes
        .map((n) => parseInt(n.number, 10))
        .filter((x) => !Number.isNaN(x))
        .reduce((a, b) => Math.max(a, b), 0) + 1;
    loadForm({
      ...emptyForm(),
      id: `cn-${String(nextNum).padStart(3, "0")}`,
      number: String(nextNum).padStart(3, "0"),
      title: "",
    });
    setFocusId(null);
    setMode("edit");
  }

  function scrollCarousel(dir: -1 | 1) {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir * Math.min(340, el.clientWidth * 0.7),
      behavior: "smooth",
    });
  }

  async function persistForm(
    draft: DraftForm,
    opts?: { quiet?: boolean; toastLabel?: string },
  ): Promise<ClimbNote | null> {
    if (!draft.number.trim()) return null;
    const snap = formSnapshot(draft);
    if (snap === lastSavedJson.current) return null;

    setSaving(true);
    setSaveState("saving");
    try {
      const saved = await saveClimbNoteAction({
        data: {
          id: draft.id || undefined,
          number: draft.number,
          title: draft.title,
          date: draft.date,
          status: draft.status,
          problem: draft.problem,
          measure: draft.measure,
          slice: draft.slice,
          lesson: draft.lesson,
          tags: draft.tags
            .split(/[,]+/)
            .map((t) => t.trim())
            .filter(Boolean),
          xUrl: draft.xUrl || null,
        },
      });
      const next = noteToForm(saved);
      lastSavedJson.current = formSnapshot(next);
      suppressAutoSave.current = true;
      setForm(next);
      setFocusId(saved.id);
      setSaveState("saved");
      if (opts?.toastLabel) toast.success(opts.toastLabel);
      else if (!opts?.quiet) {
        toast.success(
          `Saved Climb Note ${saved.number} · ${CLIMB_NOTE_STATUS_LABEL[saved.status]}`,
        );
      }
      const list = await listClimbNotesForEditor();
      setNotes(
        [...list].sort((a, b) =>
          noteRecencyKey(b).localeCompare(noteRecencyKey(a)),
        ),
      );
      return saved;
    } catch (e) {
      setSaveState("error");
      if (isSessionAuthError(e)) await handleAuthFailure();
      else toast.error(e instanceof Error ? e.message : "Save failed");
      return null;
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (mode !== "edit") return;
    if (suppressAutoSave.current) {
      suppressAutoSave.current = false;
      return;
    }
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      void persistForm(formRef.current, { quiet: true });
    }, 650);
    return () => {
      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current);
        saveTimer.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, mode]);

  async function onStateChange(next: ClimbNoteStatus) {
    const draft = { ...formRef.current, status: next };
    setForm(draft);
    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    await persistForm(draft, {
      toastLabel: `State → ${
        STATE_OPTIONS.find((o) => o.value === next)?.label ??
        CLIMB_NOTE_STATUS_LABEL[next]
      }`,
    });
  }

  /** Delete only from carousel / browse surface. */
  async function onDeleteNote(n: ClimbNote) {
    if (
      !window.confirm(
        `Delete Climb Note ${n.number} — ${n.title || "Untitled"}? This cannot be undone.`,
      )
    ) {
      return;
    }
    setSaving(true);
    try {
      await deleteClimbNoteAction({ data: { id: n.id } });
      toast.success(`Deleted #${n.number}`);
      if (form.id === n.id) {
        loadForm(emptyForm());
        setMode("browse");
      }
      await load({ quiet: true });
    } catch (e) {
      if (isSessionAuthError(e)) await handleAuthFailure();
      else toast.error(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  }

  if (isPending || needsReauth) {
    return (
      <div className="ac-gnomah ac-gnomah-loading ac-gnomah-app">
        <p>{needsReauth ? "Redirecting to sign in…" : "Loading session…"}</p>
      </div>
    );
  }

  if (authEnabled && !user) {
    return <Navigate to="/login" search={{ redirect: "/gnomah" }} />;
  }

  if (forbidden) {
    return (
      <div className="template-color-1 spybody ac-inbio ac-gnomah ac-gnomah-app ac-hero-stage">
        <SiteHeader loginRedirect="/gnomah" />
        <main className="main-page-wrapper ac-gnomah-gate">
          <div className="ac-gnomah-gate-card">
            <Mountain aria-hidden className="ac-gnomah-gate-icon" />
            <h1>Gnomah</h1>
            <p className="ac-gnomah-gate-copy ac-gnomah-gate-copy--alert">
              Climb Notes may only be edited when signed in with X as
              @acornsoftai.
              {user
                ? ` You are signed in as ${user.displayName || user.primaryEmail || "this account"}, but this account is not authorized for Gnomah.`
                : ""}
            </p>
            <p className="ac-gnomah-gate-copy ac-gnomah-gate-copy--alert">
              {forbidMsg ||
                "This X account is not the Acornsoft owner. Sign in with @acornsoftai."}
            </p>
            <div className="ac-hero-cta ac-gnomah-gate-actions">
              <Link className="rn-btn" to="/climb-notes">
                <span>Public Climb Notes</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="template-color-1 spybody ac-inbio ac-gnomah ac-gnomah-app ac-hero-stage">
      <SiteHeader loginRedirect="/gnomah" />
      <main className="main-page-wrapper ac-gnomah-main">
        <header className="ac-gn-top">
          <div className="ac-gn-brand">
            <Logo variant="mark" className="ac-gn-mark" />
            <div>
              <p className="ac-gn-kicker">Gnomah</p>
              <h1 className="ac-gn-title">Climb Notes</h1>
            </div>
          </div>
          <p className="ac-gn-library-meta" title="Library source">
            {libraryMeta}
            {syncing ? " · syncing…" : ""}
          </p>
        </header>

        {mode === "browse" ? (
          <>
            <div className="ac-gn-toolbar">
              <div className="ac-gn-toolbar-left">
                <label className="ac-gn-search">
                  <Search aria-hidden strokeWidth={2} size={14} />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Find a climb…"
                    autoComplete="off"
                  />
                </label>
                <button
                  type="button"
                  className="ac-gn-tool-btn"
                  title="New Climb Note"
                  aria-label="New Climb Note"
                  onClick={newNote}
                >
                  <FilePlus2 aria-hidden strokeWidth={2} size={15} />
                </button>
                <button
                  type="button"
                  className="ac-gn-tool-btn"
                  title="Refresh library (local vault + GitHub when configured)"
                  aria-label="Refresh library"
                  disabled={loading || syncing}
                  onClick={() => void syncLibrary({ quiet: false })}
                >
                  <RefreshCw
                    aria-hidden
                    strokeWidth={2}
                    size={15}
                    className={loading || syncing ? "ac-gn-spin" : undefined}
                  />
                </button>
                <span className="ac-gn-tool-sep" aria-hidden />
                <button
                  type="button"
                  className="ac-gn-tool-btn"
                  aria-label="Scroll earlier"
                  onClick={() => scrollCarousel(-1)}
                >
                  <ChevronLeft aria-hidden strokeWidth={2} size={16} />
                </button>
                <button
                  type="button"
                  className="ac-gn-tool-btn"
                  aria-label="Scroll older"
                  onClick={() => scrollCarousel(1)}
                >
                  <ChevronRight aria-hidden strokeWidth={2} size={16} />
                </button>
              </div>
            </div>

            {loading && notes.length === 0 ? (
              <p className="ac-gn-empty">Loading Climb Notes…</p>
            ) : filtered.length === 0 ? (
              <p className="ac-gn-empty">No climbs match this view.</p>
            ) : (
              <div
                className="ac-gn-carousel"
                ref={carouselRef}
                role="list"
                aria-label="Climb Notes timeline"
              >
                <button
                  type="button"
                  className="ac-gn-card ac-gn-card--new"
                  onClick={newNote}
                  aria-label="Create new Climb Note"
                >
                  <FilePlus2
                    aria-hidden
                    strokeWidth={1.75}
                    className="ac-gn-card-new-icon"
                  />
                  <span className="ac-gn-card-new-title">New climb</span>
                  <span className="ac-gn-card-new-sub">Start a note</span>
                </button>

                {filtered.map((n, i) => {
                  const active = focused?.id === n.id;
                  const folder = folderOf(n);
                  return (
                    <article
                      key={n.id}
                      role="listitem"
                      ref={(el) => {
                        if (el) cardRefs.current.set(n.id, el);
                        else cardRefs.current.delete(n.id);
                      }}
                      className={[
                        "ac-gn-card",
                        active ? "is-focus" : "",
                        `ac-gn-card--${n.status}`,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => selectCard(n)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          selectCard(n);
                        }
                      }}
                      tabIndex={0}
                    >
                      <div className="ac-gn-card-top">
                        <span className="ac-gn-card-num">{n.number}</span>
                        <span
                          className={`ac-gnomah-status ac-gnomah-status-${n.status}`}
                        >
                          {CLIMB_NOTE_STATUS_LABEL[n.status]}
                        </span>
                        <button
                          type="button"
                          className="ac-gn-card-edit"
                          title={`Edit Climb Note ${n.number}`}
                          aria-label={`Edit ${n.title || n.number}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            enterEdit(n);
                          }}
                        >
                          <Edit3 aria-hidden strokeWidth={2} size={14} />
                        </button>
                        <button
                          type="button"
                          className="ac-gn-card-delete"
                          title={`Delete Climb Note ${n.number}`}
                          aria-label={`Delete ${n.title || n.number}`}
                          disabled={saving}
                          onClick={(e) => {
                            e.stopPropagation();
                            void onDeleteNote(n);
                          }}
                        >
                          <Trash2 aria-hidden strokeWidth={2} size={14} />
                        </button>
                      </div>
                      <h2 className="ac-gn-card-title">
                        {n.title || "Untitled"}
                      </h2>
                      <p className="ac-gn-card-preview">
                        {previewLine(n) || "No problem statement yet."}
                      </p>
                      <div className="ac-gn-card-foot">
                        <time dateTime={n.date}>{n.date || "—"}</time>
                        {folder ? (
                          <span className="ac-gn-card-folder">{folder}</span>
                        ) : null}
                        <span className="ac-gn-card-idx" aria-hidden>
                          {i + 1}/{filtered.length}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {focused ? (
              <section
                className="ac-gn-focus"
                aria-label={`Climb Note ${focused.number}`}
              >
                <div className="ac-gn-focus-head">
                  <div>
                    <p className="ac-gn-focus-kicker">
                      Climb Note {focused.number}
                      {focusFolder ? ` · ${focusFolder}` : ""}
                    </p>
                    <h2 className="ac-gn-focus-title">{focused.title}</h2>
                  </div>
                  <div className="ac-gn-focus-actions">
                    <button
                      type="button"
                      className="ac-gn-icon-btn ac-gn-icon-btn--primary"
                      onClick={() => enterEdit(focused)}
                    >
                      <Edit3 aria-hidden strokeWidth={2} size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      className="ac-gn-icon-btn"
                      onClick={() => enterEdit(focused, { refresh: true })}
                    >
                      <RefreshCw aria-hidden strokeWidth={2} size={14} />
                      <span>Refresh</span>
                    </button>
                    <button
                      type="button"
                      className="ac-gn-icon-btn ac-gn-icon-btn--danger"
                      disabled={saving}
                      onClick={() => void onDeleteNote(focused)}
                    >
                      <Trash2 aria-hidden strokeWidth={2} size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
                <div className="ac-gn-focus-body">
                  <div>
                    <h3>Problem</h3>
                    <p>{focused.problem || "—"}</p>
                  </div>
                  <div>
                    <h3>Measure</h3>
                    <p>{focused.measure || "—"}</p>
                  </div>
                  <div>
                    <h3>Slice</h3>
                    <p>{focused.slice || "—"}</p>
                  </div>
                  <div>
                    <h3>Lesson</h3>
                    <p>{focused.lesson || "—"}</p>
                  </div>
                </div>
              </section>
            ) : null}

            <nav className="ac-gn-view-bar" aria-label="Timeline filters">
              <div className="ac-gn-view-row" role="tablist">
                {VIEW_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    role="tab"
                    title={f.hint}
                    aria-selected={view === f.key}
                    className={
                      view === f.key
                        ? "ac-gn-view-btn is-active"
                        : "ac-gn-view-btn"
                    }
                    onClick={() => setView(f.key)}
                  >
                    {f.label}
                    <span className="ac-gn-view-n">
                      {countView(notes, f.key)}
                    </span>
                  </button>
                ))}
              </div>
            </nav>
          </>
        ) : (
          <section className="ac-gn-editor" aria-label="Edit Climb Note">
            <div className="ac-gn-editor-bar">
              <button
                type="button"
                className="ac-gn-icon-btn"
                onClick={exitEdit}
              >
                <ChevronLeft aria-hidden strokeWidth={2} size={14} />
                <span>Timeline</span>
              </button>
              <div className="ac-gn-editor-id">
                <span
                  className={`ac-gnomah-status ac-gnomah-status-${form.status}`}
                >
                  {CLIMB_NOTE_STATUS_LABEL[form.status]}
                </span>
                <strong>
                  {form.number ? `#${form.number}` : "New"}
                  {form.title ? ` · ${form.title}` : ""}
                </strong>
              </div>
              <div className="ac-gn-editor-actions">
                <label className="ac-gn-state">
                  <span className="visually-hidden">Climb Note state</span>
                  <select
                    value={form.status === "pending" ? "draft" : form.status}
                    disabled={saving}
                    title="Jump to any state — saves immediately"
                    onChange={(e) =>
                      void onStateChange(e.target.value as ClimbNoteStatus)
                    }
                  >
                    {STATE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value} title={o.hint}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
                <span
                  className={`ac-gn-autosave ac-gn-autosave--${saveState}`}
                  aria-live="polite"
                >
                  {saveState === "saving"
                    ? "Saving…"
                    : saveState === "saved"
                      ? "Saved"
                      : saveState === "error"
                        ? "Save failed"
                        : "Auto-save"}
                </span>
              </div>
            </div>

            <form
              className="ac-gn-form"
              onSubmit={(e) => {
                e.preventDefault();
                void persistForm(formRef.current, { quiet: false });
              }}
            >
              <div className="ac-gn-form-meta">
                <label>
                  Number
                  <input
                    value={form.number}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, number: e.target.value }))
                    }
                    required
                  />
                </label>
                <label>
                  Date
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, date: e.target.value }))
                    }
                    required
                  />
                </label>
                <label className="ac-gn-grow">
                  Tags
                  <input
                    value={form.tags}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, tags: e.target.value }))
                    }
                    placeholder="climb-note, product"
                  />
                </label>
              </div>
              <label className="ac-gn-full">
                Title
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  required
                  placeholder="Climb Note title"
                />
              </label>
              {(
                [
                  ["problem", "Problem", "What is true and hard?"],
                  ["measure", "Measure", "How do we know it worked?"],
                  ["slice", "Slice", "What thin vertical ships first?"],
                  ["lesson", "Lesson", "What energy carries next?"],
                ] as const
              ).map(([key, label, ph]) => (
                <label key={key} className="ac-gn-full">
                  {label}
                  <textarea
                    rows={4}
                    value={form[key]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    placeholder={ph}
                  />
                </label>
              ))}
              <label className="ac-gn-full">
                X citation URL
                <input
                  value={form.xUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, xUrl: e.target.value }))
                  }
                  placeholder="https://x.com/…"
                />
              </label>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
