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
  RefreshCw,

  Search,
  X,

} from "lucide-react";
import { SiteChrome } from "./site-chrome";

import {
  CLIMB_NOTE_STATUS_LABEL,
  type ClimbNote,
  type ClimbNoteStatus,
} from "./climb-notes-data";
import {
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
  onCanopy: boolean;
  /** ISO string or empty */
  canopyAt: string;
};

type Mode = "browse" | "edit";


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
  onCanopy: false,
  canopyAt: "",
});

/** datetime-local value from ISO (local wall clock). */
function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** ISO UTC from datetime-local string. */
function fromDatetimeLocalValue(local: string): string {
  if (!local.trim()) return "";
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString();
}

function nextMondayNineLocal(): Date {
  const d = new Date();
  d.setSeconds(0, 0);
  d.setMinutes(0);
  d.setHours(9);
  const day = d.getDay(); // 0 Sun … 6 Sat
  const add = day === 1 ? 7 : (8 - day) % 7 || 7;
  d.setDate(d.getDate() + add);
  return d;
}

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
    onCanopy: n.onCanopy === true,
    canopyAt: n.canopyAt ?? "",
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

function previewLine(n: ClimbNote): string {
  return (n.problem || n.measure || n.slice || n.lesson || "").slice(0, 140);
}

function noteSearchHay(n: ClimbNote): string {
  return [
    n.number,
    `cn-${n.number}`,
    n.title,
    n.problem,
    n.measure,
    n.slice,
    n.lesson,
    ...(n.tags ?? []),
  ]
    .join(" ")
    .toLowerCase();
}

function searchScore(n: ClimbNote, q: string): number {
  const num = n.number.toLowerCase();
  const title = n.title.toLowerCase();
  if (num === q || `cn-${num}` === q) return 100;
  if (num.startsWith(q) || `cn-${num}`.startsWith(q)) return 90;
  if (title.startsWith(q)) return 80;
  if (title.includes(q)) return 60;
  if (noteSearchHay(n).includes(q)) return 40;
  return 0;
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
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchHi, setSearchHi] = useState(0);

  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [libraryMeta, setLibraryMeta] = useState(
    "Local vault · waiting for first sync",
  );
  const [syncing, setSyncing] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);

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
      onCanopy: f.onCanopy,
      canopyAt: f.canopyAt,
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
    if (!q) return notes;
    return notes
      .map((n) => ({ n, s: searchScore(n, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s || a.n.number.localeCompare(b.n.number))
      .map((x) => x.n);
  }, [notes, query]);

  const suggestions = useMemo(() => filtered.slice(0, 8), [filtered]);


  function scrollCarousel(dir: -1 | 1) {

    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir * Math.min(360, el.clientWidth * 0.72),
      behavior: "smooth",
    });
  }


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
    enterEdit(n);
  }

  function pickSearchHit(n: ClimbNote) {
    setQuery(n.title || `CN-${n.number}`);
    setSearchOpen(false);
    setSearchHi(0);
    enterEdit(n);
  }

  useEffect(() => {
    setSearchHi(0);
  }, [query]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!searchWrapRef.current?.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);



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

  useEffect(() => {
    if (mode !== "edit") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") exitEdit();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

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
          onCanopy: draft.onCanopy,
          canopyAt: draft.onCanopy
            ? draft.canopyAt || null
            : null,
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
    formRef.current = draft;
    suppressAutoSave.current = true;
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


  function setCanopySchedule(patch: Partial<Pick<DraftForm, "onCanopy" | "canopyAt">>) {
    const draft = { ...formRef.current, ...patch };
    if (patch.onCanopy === false) draft.canopyAt = "";
    if (patch.onCanopy === true && !draft.canopyAt) {
      draft.canopyAt = new Date().toISOString();
    }
    setForm(draft);
  }

  function applyCanopyPreset(
    kind: "now" | "plus1d" | "monday" | "clear",
  ) {
    if (kind === "clear") {
      setCanopySchedule({ onCanopy: false, canopyAt: "" });
      return;
    }
    let when = new Date();
    if (kind === "plus1d") {
      when = new Date(Date.now() + 24 * 60 * 60 * 1000);
    } else if (kind === "monday") {
      when = nextMondayNineLocal();
    }
    setCanopySchedule({ onCanopy: true, canopyAt: when.toISOString() });
  }

  if (isPending || needsReauth) {

    return (
      <SiteChrome loginRedirect="/gnomah">
        <div className="ac-service-page ac-gnomah ac-page-top">
          <p className="ac-gn-empty">
            {needsReauth ? "Redirecting to sign in…" : "Loading session…"}
          </p>
        </div>
      </SiteChrome>
    );
  }

  if (authEnabled && !user) {
    return <Navigate to="/login" search={{ redirect: "/gnomah" }} />;
  }

  if (forbidden) {
    return (
      <SiteChrome loginRedirect="/gnomah">
        <div className="ac-service-page ac-gnomah ac-page-top">
          <div className="ac-service-stack">
            <header className="ac-service-head">
              <span className="ac-service-kicker">Studio</span>
              <h1 className="ac-service-title">Gnomah</h1>
              <div className="ac-service-lede-box">
                <p className="ac-service-lede">
                  Climb Notes may only be edited when signed in with X as
                  @acornsoftai.
                  {user
                    ? ` You are signed in as ${user.displayName || user.primaryEmail || "this account"}, but this account is not authorized.`
                    : ""}
                </p>
                <p className="ac-service-lede ac-service-lede--last">
                  {forbidMsg ||
                    "This X account is not the Acornsoft owner. Sign in with @acornsoftai."}
                </p>
              </div>
            </header>
            <Link className="rn-btn" to="/climb-notes">
              <span>Public Climb Notes</span>
            </Link>
          </div>
        </div>
      </SiteChrome>
    );
  }

  return (
    <SiteChrome loginRedirect="/gnomah" mainClassName="ac-gnomah">
      <div className="ac-service-page ac-gnomah ac-page-top" id="gnomah">
        <div className="ac-service-stack">
          <header className="ac-service-head">
            <span className="ac-service-kicker">Studio</span>
            <h1 className="ac-service-title">Gnomah</h1>
            <div className="ac-service-lede-box">
              <p className="ac-service-lede">
                Choose a Climb Note to edit. The carousel is the library —
                click a card to open the editor.
              </p>
              <p className="ac-service-lede ac-service-lede--last">
                {libraryMeta}
                {syncing ? " · syncing…" : ""}
              </p>
            </div>
          </header>

          <div className="ac-gn-toolbar">
            <div className="ac-gn-search-wrap" ref={searchWrapRef}>
              <label className="ac-gn-search">
                <Search aria-hidden strokeWidth={2} size={16} />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  onKeyDown={(e) => {
                    if (!searchOpen && (e.key === "ArrowDown" || e.key === "Enter")) {
                      setSearchOpen(true);
                    }
                    if (e.key === "Escape") {
                      setSearchOpen(false);
                      return;
                    }
                    if (!suggestions.length) return;
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setSearchHi((i) => (i + 1) % suggestions.length);
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setSearchHi(
                        (i) => (i - 1 + suggestions.length) % suggestions.length,
                      );
                    } else if (e.key === "Enter") {
                      e.preventDefault();
                      const hit = suggestions[searchHi] ?? suggestions[0];
                      if (hit) pickSearchHit(hit);
                    }
                  }}
                  placeholder="Find a climb"
                  autoComplete="off"
                  role="combobox"
                  aria-expanded={searchOpen && query.trim().length > 0}
                  aria-controls="ac-gn-search-list"
                  aria-autocomplete="list"
                />
              </label>
              {searchOpen && query.trim() ? (
                <ul
                  id="ac-gn-search-list"
                  className="ac-gn-suggest"
                  role="listbox"
                >
                  {suggestions.length === 0 ? (
                    <li className="ac-gn-suggest-empty">No matching climbs</li>
                  ) : (
                    suggestions.map((n, i) => (
                      <li key={n.id} role="presentation">
                        <button
                          type="button"
                          role="option"
                          aria-selected={i === searchHi}
                          className={
                            i === searchHi
                              ? "ac-gn-suggest-item is-hi"
                              : "ac-gn-suggest-item"
                          }
                          onMouseEnter={() => setSearchHi(i)}
                          onClick={() => pickSearchHit(n)}
                        >
                          <span className="ac-gn-suggest-num">CN-{n.number}</span>
                          <span className="ac-gn-suggest-title">
                            {n.title || "Untitled"}
                          </span>
                          <span
                            className={`ac-gnomah-status ac-gnomah-status-${n.status}`}
                          >
                            {CLIMB_NOTE_STATUS_LABEL[n.status]}
                          </span>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              ) : null}
            </div>
            <div className="ac-gn-toolbar-actions">

              <button
                type="button"
                className="ac-gn-action ac-gn-action--primary"
                onClick={newNote}
              >
                New climb
              </button>
              <button
                type="button"
                className="ac-gn-action ac-gn-action--icon"
                title="Refresh library"
                aria-label="Refresh library"
                disabled={loading || syncing}
                onClick={() => void syncLibrary({ quiet: false })}
              >
                <RefreshCw
                  aria-hidden
                  strokeWidth={2}
                  size={16}
                  className={loading || syncing ? "ac-gn-spin" : undefined}
                />
              </button>
            </div>
          </div>


          {loading && notes.length === 0 ? (
            <p className="ac-gn-empty">Loading Climb Notes…</p>
          ) : filtered.length === 0 ? (
            <p className="ac-gn-empty">No climbs yet.</p>
          ) : (
            <div className="ac-gn-rail">
              <button
                type="button"
                className="ac-gn-rail-btn"
                aria-label="Earlier notes"
                onClick={() => scrollCarousel(-1)}
              >
                <ChevronLeft aria-hidden strokeWidth={2} size={20} />
              </button>
              <div
                className="ac-gn-carousel"
                ref={carouselRef}
                role="list"
                aria-label="Climb Notes carousel"
              >
                {filtered.map((n, i) => (
                  <article
                    key={n.id}
                    role="listitem"
                    ref={(el) => {
                      if (el) cardRefs.current.set(n.id, el);
                      else cardRefs.current.delete(n.id);
                    }}
                    className={[
                      "ac-gn-card",
                      form.id === n.id && mode === "edit" ? "is-focus" : "",
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
                      <span className="ac-gn-card-num">CN-{n.number}</span>
                      <span
                        className={`ac-gnomah-status ac-gnomah-status-${n.status}`}
                      >
                        {CLIMB_NOTE_STATUS_LABEL[n.status]}
                      </span>
                    </div>
                    <h2 className="ac-gn-card-title">{n.title || "Untitled"}</h2>
                    <p className="ac-gn-card-preview">
                      {previewLine(n) || "No problem statement yet."}
                    </p>
                    <div className="ac-gn-card-foot">
                      <time dateTime={n.date}>{n.date || "—"}</time>
                      {n.onCanopy ? (
                        <span className="ac-gn-card-canopy">Canopy</span>
                      ) : null}
                      <span className="ac-gn-card-idx" aria-hidden>
                        {i + 1}/{filtered.length}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
              <button
                type="button"
                className="ac-gn-rail-btn"
                aria-label="Later notes"
                onClick={() => scrollCarousel(1)}
              >
                <ChevronRight aria-hidden strokeWidth={2} size={20} />
              </button>
            </div>
          )}

          {mode === "edit" ? (

            <div className="ac-gn-modal" role="presentation">
              <button
                type="button"
                className="ac-gn-modal-backdrop"
                aria-label="Close editor"
                onClick={exitEdit}
              />
              <section
                className="ac-gn-modal-sheet"
                role="dialog"
                aria-modal="true"
                aria-label="Edit Climb Note"
              >
                <div className="ac-gn-editor-bar">
                  <div className="ac-gn-editor-id">
                    <span
                      className={`ac-gnomah-status ac-gnomah-status-${form.status}`}
                    >
                      {CLIMB_NOTE_STATUS_LABEL[form.status]}
                    </span>
                    <strong>
                      {form.number ? `CN-${form.number}` : "New climb"}
                    </strong>
                  </div>
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
                          : "Auto-save on"}
                  </span>
                  <button
                    type="button"
                    className="ac-gn-modal-x"
                    onClick={exitEdit}
                    aria-label="Close editor"
                  >
                    <X aria-hidden strokeWidth={2} size={18} />
                  </button>
                </div>


                <form
                  className="ac-gn-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void persistForm(formRef.current, { quiet: false });
                  }}
                >
                  <div className="ac-gn-form-main">
                    <label className="ac-gn-full">
                      Title
                      <input
                        value={form.title}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, title: e.target.value }))
                        }
                        required
                        placeholder="What is this climb?"
                      />
                    </label>
                    {(
                      [
                        ["problem", "01", "What’s stuck", "Name the real problem."],
                        ["measure", "02", "How we know it moved", "A test you can check."],
                        ["slice", "03", "Pitch", "The next safe pitch that can move the measure."],
                        ["lesson", "04", "What we carry next", "What the next climb reuses."],
                      ] as const
                    ).map(([key, n, label, ph]) => (
                      <label key={key} className="ac-gn-climb-field">
                        <span className="ac-gn-climb-lab">
                          <span className="ac-gn-climb-n">{n}</span>
                          {label}
                        </span>
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
                  </div>

                  <aside className="ac-gn-form-side">
                    <label>
                      Number
                      <input
                        value={form.number}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, number: e.target.value }))
                        }
                        required
                        placeholder="000"
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
                    <label>
                      State
                      <select
                        value={form.status === "pending" ? "draft" : form.status}
                        disabled={saving}
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
                    <label>
                      Tags
                      <input
                        value={form.tags}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, tags: e.target.value }))
                        }
                        placeholder="climb-note, product"
                      />
                    </label>
                    <label>
                      X post URL
                      <input
                        value={form.xUrl}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, xUrl: e.target.value }))
                        }
                        placeholder="https://x.com/…"
                      />
                    </label>
                    <fieldset className="ac-gn-canopy-panel">
                      <legend>Canopy</legend>
                      <label className="ac-gn-canopy-toggle">
                        <input
                          type="checkbox"
                          checked={form.onCanopy}
                          disabled={saving}
                          onChange={(e) =>
                            setCanopySchedule({ onCanopy: e.target.checked })
                          }
                        />
                        <span>Show on Canopy</span>
                      </label>
                      <label className="ac-gn-canopy-when">
                        Go live
                        <input
                          type="datetime-local"
                          value={toDatetimeLocalValue(form.canopyAt || null)}
                          disabled={saving || !form.onCanopy}
                          onChange={(e) =>
                            setCanopySchedule({
                              onCanopy: true,
                              canopyAt: fromDatetimeLocalValue(e.target.value),
                            })
                          }
                        />
                      </label>
                      <div className="ac-gn-canopy-presets" role="group">
                        <button type="button" className="ac-gn-preset" disabled={saving} onClick={() => applyCanopyPreset("now")}>Now</button>
                        <button type="button" className="ac-gn-preset" disabled={saving} onClick={() => applyCanopyPreset("plus1d")}>+1 day</button>
                        <button type="button" className="ac-gn-preset" disabled={saving} onClick={() => applyCanopyPreset("monday")}>Mon 9:00</button>
                        <button type="button" className="ac-gn-preset ac-gn-preset--quiet" disabled={saving || (!form.onCanopy && !form.canopyAt)} onClick={() => applyCanopyPreset("clear")}>Off</button>
                      </div>
                      {form.onCanopy ? (
                        <p className="ac-gn-canopy-status">
                          {!form.canopyAt
                            ? "Goes live on save."
                            : Date.parse(form.canopyAt) > Date.now()
                              ? `Hidden until ${new Date(form.canopyAt).toLocaleString()}.`
                              : `Live since ${new Date(form.canopyAt).toLocaleString()}.`}
                        </p>
                      ) : (
                        <p className="ac-gn-canopy-status ac-gn-canopy-status--off">
                          Journal only.
                        </p>
                      )}
                    </fieldset>
                  </aside>
                </form>
              </section>
            </div>
          ) : null}
        </div>
      </div>
    </SiteChrome>
  );
}
