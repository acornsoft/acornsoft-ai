import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { SiteHeader } from "./site-chrome";
import {
  buildRadarTimeline,
  withInferredSurface,
  type TimelineActor,
  type TimelineEntry,
  type TimelineKind,
  type TimelineSurface,
} from "./timeline-data";
import type { LiveFeedEntry, LiveFeedFile } from "@/lib/canopy/types";
import {
  climbNotes as staticClimbNotes,
  isPublicClimbNoteStatus,
  type ClimbNote,
} from "./climb-notes-data";
import { listPublishedClimbNotes } from "@/lib/climb-notes/actions";


const kindLabel: Record<TimelineKind, string> = {
  origin: "Origin",
  milestone: "Milestone",
  product: "Product",
  feednote: "X Feednote",
  changelog: "Build Changelog",
};

const actorLabel: Record<TimelineActor, string> = {
  xai: "SpaceXAI",
  build: "Grok Build",
  acornsoft: "Our Work",
  tesla: "Tesla",
  spacex: "SpaceX",
  research: "Advanced Development",
};

type FilterKey =
  | "all"
  | `kind:${TimelineKind}`
  | `actor:${TimelineActor}`
  | `surface:${TimelineSurface}`
  | "lane:climb-notes";

type FilterOption = {
  key: FilterKey;
  label: string;
  count: number;
  tone: "default" | "build" | "acornsoft" | "xai" | "grok" | "imagine" | "voice";
  group: "stack" | "org" | "all";
};

/** Default: all radar signals. */
const DEFAULT_FILTERS: FilterKey[] = ["all"];

function kindClass(kind: TimelineKind) {
  return `cn-kind cn-kind-${kind}`;
}


/** Density size — vary by kind + body weight for a richer mix */
/** Callout size — mostly varied; only standout/origin forced large */
/** Stable hash so layout does not jump every render */
function stableRand(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}

type CalloutLayout = {
  /** Typography bucket */
  size: "sm" | "md" | "lg" | "xl";
  /** Continuous width of half-column (48–100) */
  w: number;
  /** Inset from outer edge toward center (px) — uneven rails */
  inset: number;
  /** Vertical offset (px), can be negative */
  nudge: number;
  /** Extra bottom gap (px) */
  gap: number;
  /** Full-width interrupt band */
  wide: boolean;
};

/** Continuous asymmetric layout metrics (stable per entry id) */
function calloutLayout(entry: TimelineEntry): CalloutLayout {
  const rW = stableRand(`w-${entry.id}`);
  const rI = stableRand(`inset-${entry.id}`);
  const rN = stableRand(`nudge-${entry.id}`);
  const rG = stableRand(`gap-${entry.id}`);

  const wide =
    entry.standout ||
    entry.kind === "origin" ||
    (entry.kind === "milestone" && rW > 0.72);

  // Width continuum; standouts still often larger
  let w = 48 + Math.floor(rW * 52); // 48–99
  if (entry.standout || entry.kind === "origin") w = 88 + Math.floor(rW * 12);
  else if (entry.kind === "changelog") w = 48 + Math.floor(rW * 28);
  else if (entry.kind === "product") w = 60 + Math.floor(rW * 36);

  const inset = wide ? 0 : Math.floor(rI * 52); // 0–51px from outer
  const nudge = -14 + Math.floor(rN * 52); // -14 … +37
  const gap = 8 + Math.floor(rG * 28);

  let size: CalloutLayout["size"] = "md";
  if (w < 58) size = "sm";
  else if (w < 72) size = "md";
  else if (w < 88) size = "lg";
  else size = "xl";
  if (wide) size = "xl";

  return { size, w, inset, nudge, gap, wide };
}

function matchesFilter(entry: TimelineEntry, filter: FilterKey): boolean {
  if (filter === "all") return true;
  if (filter.startsWith("kind:")) {
    return entry.kind === (filter.slice(5) as TimelineKind);
  }
  if (filter.startsWith("actor:")) {
    return entry.actor === (filter.slice(6) as TimelineActor);
  }
  if (filter.startsWith("surface:")) {
    const surface = filter.slice(8) as TimelineSurface;
    return (entry.surface ?? "other") === surface;
  }
  if (filter === "lane:climb-notes") {
    return entry.lane === "climb-notes";
  }
  return true;
}

function matchesAnyFilter(entry: TimelineEntry, filters: FilterKey[]): boolean {
  if (filters.length === 0 || filters.includes("all")) return true;
  return filters.some((f) => matchesFilter(entry, f));
}

function journalToTimeline(notes: ClimbNote[]): TimelineEntry[] {
  return notes
    .filter((n) => isPublicClimbNoteStatus(n.status))
    .map((n) => {
      const body = [n.problem, n.measure, n.slice, n.lesson]
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      return withInferredSurface({
        id: `climb-note-${n.id}`,
        date: n.date,
        sortKey: (n.publishedAt || n.date || "1970-01-01").slice(0, 19),
        title: `Climb Note ${n.number} · ${n.title}`,
        body: body.length > 420 ? `${body.slice(0, 417)}…` : body,
        kind: "product",
        actor: "acornsoft",
        lane: "climb-notes",
        source: "Climb Notes",
        href: n.xUrl || "/climb-notes",
      });
    });
}

function buildFilterOptions(items: TimelineEntry[]): FilterOption[] {
  const actorCounts = new Map<TimelineActor, number>();
  const surfaceCounts = new Map<string, number>();
  let changelog = 0;
  let climbLane = 0;
  for (const item of items) {
    actorCounts.set(item.actor, (actorCounts.get(item.actor) ?? 0) + 1);
    if (item.kind === "changelog") changelog += 1;
    if (item.lane === "climb-notes") climbLane += 1;
    const surface = item.surface ?? "other";
    surfaceCounts.set(surface, (surfaceCounts.get(surface) ?? 0) + 1);
  }

  const stack: FilterOption[] = [
    { key: "all", label: "All", count: items.length, tone: "default", group: "all" },
    { key: "surface:grok", label: "Grok", count: surfaceCounts.get("grok") ?? 0, tone: "grok", group: "stack" },
    { key: "surface:imagine", label: "Imagine", count: surfaceCounts.get("imagine") ?? 0, tone: "imagine", group: "stack" },
    { key: "surface:voice", label: "Voice", count: surfaceCounts.get("voice") ?? 0, tone: "voice", group: "stack" },
    { key: "kind:changelog", label: "Build Notes", count: changelog, tone: "build", group: "stack" },
  ];

  const org = (
    [
      { key: "actor:acornsoft", label: "Our Work", count: actorCounts.get("acornsoft") ?? 0, tone: "default", group: "org" },
      { key: "lane:climb-notes", label: "Climb Notes", count: climbLane, tone: "default", group: "org" },
      { key: "actor:research", label: "Advanced Development", count: actorCounts.get("research") ?? 0, tone: "default", group: "org" },
      { key: "actor:spacex", label: "SpaceX", count: actorCounts.get("spacex") ?? 0, tone: "default", group: "org" },
      { key: "actor:xai", label: "SpaceXAI", count: actorCounts.get("xai") ?? 0, tone: "default", group: "org" },
      { key: "actor:tesla", label: "Tesla", count: actorCounts.get("tesla") ?? 0, tone: "default", group: "org" },
    ] as FilterOption[]
  ).sort((a, b) => a.label.localeCompare(b.label));

  return [...stack, ...org];
}

function filterTone(
  filters: FilterKey[],
): "default" | "build" | "acornsoft" | "xai" | "grok" | "imagine" | "voice" {
  if (filters.includes("surface:grok")) return "grok";
  if (filters.includes("surface:imagine")) return "imagine";
  if (filters.includes("surface:voice")) return "voice";
  if (filters.includes("kind:changelog") || filters.includes("actor:build")) return "build";
  if (filters.includes("actor:acornsoft") || filters.includes("lane:climb-notes")) return "acornsoft";
  if (filters.includes("actor:xai")) return "xai";
  return "default";
}

function blipStyle(
  entry: TimelineEntry,
  index: number,
  total: number,
): CSSProperties {
  const sector: Record<TimelineActor, [number, number]> = {
    xai: [200, 270],
    build: [270, 320],
    spacex: [320, 400],
    acornsoft: [20, 70],
    research: [70, 120],
    tesla: [120, 170],
  };
  const [a0, a1] = sector[entry.actor];
  const span = a1 - a0;
  const t = total <= 1 ? 0.5 : index / Math.max(total - 1, 1);
  let deg = a0 + span * (0.15 + t * 0.7);
  if (deg >= 360) deg -= 360;
  const ringByKind: Record<TimelineKind, number> = {
    changelog: 0.48,
    feednote: 0.56,
    product: 0.64,
    milestone: 0.72,
    origin: 0.8,
  };
  const r = ringByKind[entry.kind] ?? 0.5;
  const rad = ((deg - 90) * Math.PI) / 180;
  return {
    left: `${50 + Math.cos(rad) * r * 50}%`,
    top: `${50 + Math.sin(rad) * r * 50}%`,
  };
}


export function CanopyPage() {
  const curated = useMemo(
    () => buildRadarTimeline().map(withInferredSurface),
    [],
  );
  const [journalEntries, setJournalEntries] = useState<TimelineEntry[]>(() =>
    journalToTimeline(staticClimbNotes),
  );
  const [liveEntries, setLiveEntries] = useState<TimelineEntry[]>([]);
  const [liveMeta, setLiveMeta] = useState<{
    updatedAt?: string;
    source?: string;
    error?: string;
  }>({});

  // Load scheduled live feed cache; optionally refresh via API if token path works
  useEffect(() => {
    let cancelled = false;
    const toTimeline = (e: LiveFeedEntry): TimelineEntry =>
      withInferredSurface({
        id: e.id,
        date: e.date,
        sortKey: e.sortKey,
        title: e.title,
        body: e.body,
        kind: e.kind,
        actor: e.actor,
        source: e.source,
        href: e.href,
        xId: e.xId,
        standout: e.standout,
        live: e.live ?? true,
      });

    async function loadLive() {
      try {
        const res = await fetch("/canopy/live-feed.json", { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as LiveFeedFile;
          if (!cancelled) {
            setLiveMeta({
              updatedAt: data.updatedAt,
              source: data.source,
              error: data.error,
            });
            setLiveEntries((data.entries || []).map(toTimeline));
          }
        }
      } catch {
        /* ignore */
      }

      // Soft refresh: hits in-memory/API path when CRON secret not required
      try {
        const res = await fetch("/api/canopy/refresh", { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as LiveFeedFile;
          if (!cancelled && data.entries?.length) {
            setLiveMeta({
              updatedAt: data.updatedAt,
              source: data.source,
              error: data.error,
            });
            setLiveEntries(data.entries.map(toTimeline));
          }
        }
      } catch {
        /* API may not be configured */
      }
    }

    loadLive();
    const id = window.setInterval(loadLive, 15 * 60 * 1000); // re-check every 15m
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const notes = await listPublishedClimbNotes();
        if (!cancelled && notes.length > 0) {
          setJournalEntries(journalToTimeline(notes));
        }
      } catch {
        /* keep static */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo(() => {
    const byId = new Map<string, TimelineEntry>();
    for (const e of curated) byId.set(e.id, e);
    for (const e of journalEntries) byId.set(e.id, e);
    for (const e of liveEntries) {
      if (e.xId) {
        for (const [k, v] of byId) {
          if (v.xId && v.xId === e.xId) byId.delete(k);
        }
      }
      byId.set(e.id, e);
    }
    return [...byId.values()].sort((a, b) =>
      b.sortKey.localeCompare(a.sortKey),
    );
  }, [curated, journalEntries, liveEntries]);

  const filterOptions = useMemo(() => buildFilterOptions(items), [items]);
  const [filters, setFilters] = useState<FilterKey[]>(DEFAULT_FILTERS);
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [pulse, setPulse] = useState(0);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 991px)");
    const onChange = () => {
      if (!mq.matches) setMobileFiltersOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const valid = new Set(filterOptions.map((o) => o.key));
    setFilters((prev) => {
      const next = prev.filter((f) => f === "all" || valid.has(f));
      if (next.length === 0) return ["all"];
      return next;
    });
  }, [filterOptions]);

  function toggleFilter(key: FilterKey, e?: MouseEvent) {
    const multi = e?.shiftKey === true;
    setFilters((prev) => {
      if (key === "all") return ["all"];
      if (!multi) return [key];
      const withoutAll = prev.filter((f) => f !== "all");
      if (withoutAll.includes(key)) {
        const next = withoutAll.filter((f) => f !== key);
        return next.length ? next : ["all"];
      }
      return [...withoutAll, key];
    });
  }

  const visible = useMemo(
    () => items.filter((i) => matchesAnyFilter(i, filters)),
    [filters, items],
  );

  const activeFilterLabel = useMemo(() => {
    if (filters.includes("all") || filters.length === 0) return "All";
    const labels = filters
      .map((f) => filterOptions.find((o) => o.key === f)?.label)
      .filter(Boolean);
    return labels.length ? labels.join(" · ") : "All";
  }, [filters, filterOptions]);


  const laneCounts = useMemo(() => {
    const c: Record<TimelineActor, number> = {
      xai: 0,
      build: 0,
      acornsoft: 0,
      tesla: 0,
      spacex: 0,
      research: 0,
    };
    for (const i of items) c[i.actor] += 1;
    return c;
  }, [items]);

  const radarBlips = useMemo(() => {
    const pool = visible.slice(0, 18);
    const byActor: Record<TimelineActor, TimelineEntry[]> = {
      xai: [],
      build: [],
      acornsoft: [],
      tesla: [],
      spacex: [],
      research: [],
    };
    for (const e of pool) byActor[e.actor].push(e);
    return pool.map((entry) => {
      const siblings = byActor[entry.actor];
      return {
        entry,
        style: blipStyle(entry, siblings.indexOf(entry), siblings.length),
      };
    });
  }, [visible]);

  useEffect(() => {
    const id = window.setInterval(() => setPulse((p) => p + 1), 2200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!visible.length || focusId) return;
    const hot = visible.filter(
      (i) =>
        i.standout ||
        i.actor === "research" ||
        i.kind === "feednote" ||
        i.kind === "changelog" ||
        i.actor === "acornsoft" ||
        i.lane === "climb-notes",
    );
    const pool = hot.length ? hot : visible;
    setActiveId(pool[pulse % pool.length].id);
  }, [pulse, visible, focusId]);

  const tone = filterTone(filters);

  return (
    <div className="template-color-1 spybody ac-inbio ac-canopy ac-hero-stage">
      <SiteHeader loginRedirect="/gnomah" />

      <main className="main-page-wrapper cn-page canopy-page">
        <section className="cn-canopy-shell ac-hero-stage-panel">
          <div className="container cn-canopy-shell-inner">
            <div className="row cn-canopy-workspace">
              <div
                className="col-lg-9 col-md-12 col-12 cn-timeline-col order-2 order-lg-1"
                id="timeline"
              >
                <div className="cn-active-filter-bar">
                  <span className="cn-active-filter-label">Showing</span>
                  <span className="cn-active-filter-value">
                    {activeFilterLabel} ({visible.length}
                    {visible.length !== items.length
                      ? ` of ${items.length}`
                      : ""}
                    )
                  </span>
                  <span className="cn-signal-total" title="Curated + live X + public Climb Notes">
                    {items.length} signals
                    {liveEntries.length ? ` · ${liveEntries.length} live` : ""}
                  </span>
                  {liveEntries.length > 0 ? (
                    <span
                      className="cn-live-meta"
                      title={liveMeta.error || liveMeta.source || "live"}
                    >
                      Live · {liveEntries.length} pulled
                    </span>
                  ) : liveMeta.error ? (
                    <span
                      className="cn-live-meta cn-live-meta--warn"
                      title={liveMeta.error}
                    >
                      Live feed offline
                    </span>
                  ) : null}
                </div>
                {visible.length === 0 ? (
                  <p className="cn-empty">No signals for this filter.</p>
                ) : (
                  <TimelineFeed
                    items={visible}
                    activeId={activeId}
                    focusId={focusId}
                    onSelect={(id) => {
                      setActiveId(id);
                      setFocusId(id);
                    }}
                    onFocused={() => setFocusId(null)}
                    pageSize={48}
                  />
                )}
              </div>

              {/* Filters: desktop sticky; mobile accordion collapsed by default */}
              <aside
                className="col-lg-3 col-md-12 col-12 cn-radar-col order-1 order-lg-2"
                aria-label="Canopy filters"
              >
                <div className="cn-radar-sticky cn-filter-always">
                  <div className="cn-mobile-filter-bar">
                    <button
                      type="button"
                      className="cn-mobile-filter-toggle"
                      aria-expanded={mobileFiltersOpen}
                      aria-controls="cn-filter-panel"
                      onClick={() => setMobileFiltersOpen((v) => !v)}
                    >
                      <span className="cn-mobile-filter-toggle-label">Filters</span>
                      <span className="cn-mobile-filter-toggle-value">
                        {activeFilterLabel} · {visible.length}
                      </span>
                      <span
                        className={
                          "cn-mobile-filter-chevron" +
                          (mobileFiltersOpen ? " is-open" : "")
                        }
                        aria-hidden
                      >
                        ▾
                      </span>
                    </button>
                  </div>

                  <div
                    id="cn-filter-panel"
                    className={
                      "cn-filter-panel" +
                      (mobileFiltersOpen ? " is-open" : " is-collapsed")
                    }
                  >
                    <div
                      className={`cn-radar cn-radar-sm cn-radar-live cn-radar-tone-${tone}`}
                      role="group"
                      aria-label="Radar filter"
                    >
                      <div className="cn-radar-ring r1" />
                      <div className="cn-radar-ring r2" />
                      <div className="cn-radar-ring r3" />
                      <div className="cn-radar-sweep" />
                      <button
                        type="button"
                        className="cn-radar-core"
                        aria-label={`Show all signals (${items.length})`}
                        onClick={() => {
                          setFilters(["all"]);
                          if (window.matchMedia("(max-width: 991px)").matches) {
                            setMobileFiltersOpen(false);
                          }
                        }}
                      >
                        <span className="cn-radar-core-count">{visible.length}</span>
                        <span className="cn-radar-core-label">
                          {filters.includes("all")
                            ? "ALL"
                            : activeFilterLabel.slice(0, 8).toUpperCase()}
                        </span>
                      </button>
                      {radarBlips.map(({ entry, style }) => (
                        <button
                          key={entry.id}
                          type="button"
                          className={`cn-radar-blip cn-blip-${entry.actor}${entry.id === activeId ? " is-ping" : ""}`}
                          style={style}
                          title={entry.title}
                          aria-label={`${entry.title} — ${actorLabel[entry.actor]}`}
                          onClick={() => {
                            const key =
                              entry.lane === "climb-notes"
                                ? ("lane:climb-notes" as FilterKey)
                                : entry.kind === "changelog"
                                  ? ("kind:changelog" as FilterKey)
                                  : (`actor:${entry.actor}` as FilterKey);
                            setFilters([key]);
                            setActiveId(entry.id);
                            setFocusId(entry.id);
                            if (window.matchMedia("(max-width: 991px)").matches) {
                              setMobileFiltersOpen(false);
                            }
                          }}
                        />
                      ))}
                    </div>

                    <div className="cn-radar-meta">
                      <p className="cn-radar-caption">
                        {activeFilterLabel} ({visible.length})
                      </p>
                    </div>

                    <div
                      className="cn-filters cn-filter-pills"
                      role="toolbar"
                      aria-label="Timeline filters"
                    >
                      <span className="cn-filters-kicker">Stack</span>
                      <div className="cn-pill-row">
                        {filterOptions
                          .filter((o) => o.group === "all" || o.group === "stack")
                          .map((opt) => {
                            const active =
                              filters.includes(opt.key) ||
                              (opt.key === "all" && filters.includes("all"));
                            return (
                              <button
                                key={opt.key}
                                type="button"
                                data-filter={opt.key}
                                title="Click: single · Shift+click: multi"
                                aria-pressed={active}
                                className={[
                                  "cn-pill",
                                  active ? "active" : "",
                                  opt.count === 0 ? "is-empty" : "",
                                  `cn-pill-${opt.tone}`,
                                  opt.key === "kind:changelog" ? "cn-pill-build" : "",
                                ]
                                  .filter(Boolean)
                                  .join(" ")}
                                onClick={(e) => {
                                  toggleFilter(opt.key, e);
                                  if (
                                    opt.key === "all" &&
                                    window.matchMedia("(max-width: 991px)").matches
                                  ) {
                                    setMobileFiltersOpen(false);
                                  }
                                }}
                              >
                                {opt.label} ({opt.count})
                              </button>
                            );
                          })}
                      </div>
                      <span className="cn-filters-kicker">Commuter Lane</span>
                      <div className="cn-pill-row">
                        {filterOptions
                          .filter((o) => o.group === "org")
                          .map((opt) => {
                            const active = filters.includes(opt.key);
                            return (
                              <button
                                key={opt.key}
                                type="button"
                                data-filter={opt.key}
                                title="Click: single · Shift+click: multi"
                                aria-pressed={active}
                                className={[
                                  "cn-pill",
                                  "cn-pill-commuter",
                                  active ? "active" : "",
                                  opt.count === 0 ? "is-empty" : "",
                                ]
                                  .filter(Boolean)
                                  .join(" ")}
                                onClick={(e) => toggleFilter(opt.key, e)}
                              >
                                {opt.label} ({opt.count})
                              </button>
                            );
                          })}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="cn-mobile-filter-done"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      Done — show timeline
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}


/**
 * Assign left/right by chronological order only — not by actor or filter.
 * Rhythm: often 1+1, sometimes 2–3 on one side and 1–3 on the other.
 */
function assignVisualSides(
  entries: TimelineEntry[],
): { entry: TimelineEntry; side: "left" | "right" }[] {
  const out: { entry: TimelineEntry; side: "left" | "right" }[] = [];
  let i = 0;
  let batch = 0;
  while (i < entries.length) {
    const r = stableRand(`batch-${batch}-${entries[i]?.id ?? i}`);
    batch += 1;

    // ~50%: single left then single right
    // ~30%: 2–3 left, 1–3 right
    // ~20%: 1–3 left, 2–3 right
    let nLeft = 1;
    let nRight = 1;
    if (r < 0.5) {
      nLeft = 1;
      nRight = 1;
    } else if (r < 0.8) {
      nLeft = 2 + Math.floor(stableRand(`nl-${batch}`) * 2); // 2–3
      nRight = 1 + Math.floor(stableRand(`nr-${batch}`) * 3); // 1–3
    } else {
      nLeft = 1 + Math.floor(stableRand(`nl2-${batch}`) * 3); // 1–3
      nRight = 2 + Math.floor(stableRand(`nr2-${batch}`) * 2); // 2–3
    }

    // Randomly flip which side the batch starts on
    const startLeft = stableRand(`flip-${batch}`) >= 0.5;
    const order: ("left" | "right")[] = startLeft
      ? [
          ...Array.from({ length: nLeft }, () => "left" as const),
          ...Array.from({ length: nRight }, () => "right" as const),
        ]
      : [
          ...Array.from({ length: nRight }, () => "right" as const),
          ...Array.from({ length: nLeft }, () => "left" as const),
        ];

    for (const side of order) {
      if (i >= entries.length) break;
      out.push({ entry: entries[i++], side });
    }
  }
  return out;
}

/**
 * Pack into rows without reordering time: pair L+R when consecutive
 * sides differ; stack same-side runs as solo rows (2–3 on one side).
 */
type FeedRow = {
  left?: TimelineEntry;
  right?: TimelineEntry;
  key: string;
  /** Flip column weight 0.85/1.15 */
  flip: boolean;
  /** Single full-width interrupt (standout / origin) */
  wide?: TimelineEntry;
};

function packVisualLanes(entries: TimelineEntry[]): FeedRow[] {
  const assigned = assignVisualSides(entries);
  const rows: FeedRow[] = [];
  let i = 0;
  let rowIndex = 0;
  while (i < assigned.length) {
    const cur = assigned[i];
    const layout = calloutLayout(cur.entry);

    // Occasional wide interrupt — full band, not left/right
    if (layout.wide) {
      rows.push({
        key: `wide-${cur.entry.id}`,
        flip: false,
        wide: cur.entry,
      });
      i += 1;
      rowIndex += 1;
      continue;
    }

    const next = assigned[i + 1];
    const nextWide = next ? calloutLayout(next.entry).wide : false;
    const flip = stableRand(`flip-row-${rowIndex}-${cur.entry.id}`) > 0.5;

    if (
      next &&
      !nextWide &&
      cur.side === "left" &&
      next.side === "right"
    ) {
      rows.push({
        left: cur.entry,
        right: next.entry,
        key: `row-${cur.entry.id}-${next.entry.id}`,
        flip,
      });
      i += 2;
      rowIndex += 1;
    } else if (cur.side === "left") {
      rows.push({ left: cur.entry, key: `row-l-${cur.entry.id}`, flip });
      i += 1;
      rowIndex += 1;
    } else {
      // right alone (including when next is left — no reorder)
      rows.push({ right: cur.entry, key: `row-r-${cur.entry.id}`, flip });
      i += 1;
      rowIndex += 1;
    }
  }
  return rows;
}

function TimelineFeed({
  items,
  activeId,
  focusId,
  onSelect,
  onFocused,
  pageSize = 18,
}: {
  items: TimelineEntry[];
  activeId: string;
  focusId?: string | null;
  onSelect: (id: string) => void;
  onFocused?: () => void;
  pageSize?: number;
}) {
  const [limit, setLimit] = useState(pageSize);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLimit(pageSize);
    setLoading(false);
  }, [items, pageSize]);

  useEffect(() => {
    const id = focusId || activeId;
    if (!id) return;
    const idx = items.findIndex((i) => i.id === id);
    if (idx >= 0 && idx + 1 > limit) {
      setLimit(Math.min(items.length, Math.max(pageSize, idx + 6)));
    }
  }, [focusId, activeId, items, limit, pageSize]);

  useEffect(() => {
    if (!focusId) return;
    const el = document.getElementById(`cn-entry-${focusId}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("is-radar-focus");
    const tmr = window.setTimeout(() => {
      el.classList.remove("is-radar-focus");
      onFocused?.();
    }, 1600);
    return () => window.clearTimeout(tmr);
  }, [focusId, limit, items, onFocused]);

  const loaded = useMemo(() => items.slice(0, limit), [items, limit]);
  const hasMore = limit < items.length;

  const loadMore = () => {
    if (!hasMore || loading) return;
    setLoading(true);
    window.setTimeout(() => {
      setLimit((n) => Math.min(n + pageSize, items.length));
      setLoading(false);
    }, 80);
  };

  // Infinite scroll via intersection observer (document flow — no virtualization)
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) loadMore();
      },
      { root: null, rootMargin: "280px 0px", threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loading, limit, items.length]);

  return (
    <div className="cn-timeline-stack cn-feed cn-feed-infinite">
      <div
        className="cn-timeline cn-lanes cn-timeline-feed"
        role="list"
        aria-label="Timeline signals"
        aria-busy={loading}
      >
        <div className="cn-spine" aria-hidden="true" />
        {packVisualLanes(loaded).map((row, index) =>
          row.wide ? (
            <div
              key={row.key}
              className="cn-feed-wide"
              role="listitem"
            >
              <TimelineCard
                entry={row.wide}
                side="left"
                index={index}
                active={row.wide.id === activeId}
                onSelect={() => onSelect(row.wide!.id)}
                wide
              />
            </div>
          ) : (
            <div
              key={row.key}
              className={`cn-feed-pair${row.flip ? " is-flip" : ""}`}
              role="presentation"
            >
              <div className="cn-feed-pair-left" role="listitem">
                {row.left ? (
                  <TimelineCard
                    entry={row.left}
                    side="left"
                    index={index}
                    active={row.left.id === activeId}
                    onSelect={() => onSelect(row.left!.id)}
                  />
                ) : (
                  <div className="cn-feed-spacer" aria-hidden="true" />
                )}
              </div>
              <div className="cn-feed-pair-right" role="listitem">
                {row.right ? (
                  <TimelineCard
                    entry={row.right}
                    side="right"
                    index={index}
                    active={row.right.id === activeId}
                    onSelect={() => onSelect(row.right!.id)}
                  />
                ) : (
                  <div className="cn-feed-spacer" aria-hidden="true" />
                )}
              </div>
            </div>
          ),
        )}
      </div>

      <div ref={sentinelRef} className="cn-feed-sentinel" aria-hidden="true" />

      <div className="cn-feed-controls cn-feed-controls-infinite" aria-live="polite">
        <span className="cn-feed-status">
          Showing {loaded.length} of {items.length}
          {hasMore ? " · scroll for more" : " · end of feed"}
        </span>
        {hasMore ? (
          <button
            type="button"
            className="cn-feed-btn"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function TimelineCard({
  entry,
  side,
  index,
  active,
  onSelect,
  wide = false,
}: {
  entry: TimelineEntry;
  side: "left" | "right";
  index: number;
  active: boolean;
  onSelect: () => void;
  wide?: boolean;
}) {
  const layout = calloutLayout(entry);
  const isWide = wide || layout.wide;
  return (
    <article
      id={`cn-entry-${entry.id}`}
      className={`cn-card cn-${side} cn-actor-${entry.actor} cn-kind-card-${entry.kind} cn-size-${layout.size} cn-asym${isWide ? " cn-wide-interrupt" : ""}${entry.standout ? " cn-standout" : ""}${entry.live ? " cn-is-live" : ""}${active ? " is-active" : ""}`}
      data-actor={entry.actor}
      data-kind={entry.kind}
      data-size={layout.size}
      data-wide={isWide ? "1" : "0"}
      style={
        {
          animationDelay: `${Math.min(index, 12) * 0.04}s`,
          ["--w" as string]: isWide ? 100 : layout.w,
          ["--inset" as string]: `${isWide ? 0 : layout.inset}px`,
          ["--nudge" as string]: `${isWide ? 8 : layout.nudge}px`,
          ["--gap" as string]: `${layout.gap}px`,
        } as CSSProperties
      }
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="cn-node" aria-hidden="true" />
      <div className="cn-card-inner">
        <div className="cn-card-meta">
          <time dateTime={entry.sortKey}>{entry.date}</time>
          <span className={kindClass(entry.kind)}>{kindLabel[entry.kind]}</span>
          <span className={`cn-actor-tag cn-actor-tag-${entry.actor}`}>
            {actorLabel[entry.actor]}
          </span>
          {entry.standout ? (
            <span className="cn-standout-badge">Standout</span>
          ) : null}
          {entry.live ? (
            <span className="cn-live-badge">Live</span>
          ) : null}
        </div>
        <h3 className="cn-card-title">
          {entry.version ? (
            <>
              <span className="cn-version">{entry.version}</span>{" "}
            </>
          ) : null}
          {entry.title}
        </h3>
        {entry.kind === "changelog" ? (
          <>
            <p className="cn-card-body cn-quick-lede">{entry.body}</p>
            {entry.bullets && entry.bullets.length > 0 ? (
              <ul className="cn-bullets cn-quick-hits">
                {entry.bullets.slice(0, 3).map((b) => (
                  <li key={b}>{b.replace(/^(Feature|Perf|Fix):\s*/i, "")}</li>
                ))}
                {entry.bullets.length > 3 ? (
                  <li className="cn-more">
                    +{entry.bullets.length - 3} more in source
                  </li>
                ) : null}
              </ul>
            ) : null}
          </>
        ) : (
          <p className="cn-card-body">{entry.body}</p>
        )}
        <div className="cn-card-foot">
          {entry.source ? (
            <span className="cn-source">{entry.source}</span>
          ) : null}
          {entry.href ? (
            <a
              href={entry.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {entry.kind === "changelog"
                ? "Changelog source →"
                : "Open on X →"}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
