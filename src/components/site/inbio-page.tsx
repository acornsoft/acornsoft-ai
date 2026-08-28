import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SiteHeader, SiteFooter } from "./site-chrome";
import { ClimbNotesMark } from "./climb-notes-mark";
import { VoiceWhenSignedIn } from "./voice-access";
import { LIGHTSPEED_PLAIN, LUNA_SHERPA_PLAIN, PLATFORM, PUBLIC_AGENTS, PUBLIC_NEED } from "./messaging";
import { ViewportTip } from "./viewport-tip";

const TOTAL = 4;
const MARKETPLACE_URL =
  "https://marketplace.visualstudio.com/items?itemName=acornsoft.luna-foundry-multiagent";
const TRANS_OUT_MS = 240;
const TRANS_IN_MS = 420;

const stackWords = [
  "Grok Bot",
  "Grok Build",
  "Imagine",
  "Grok Voice",
] as const;

/** Teaching climbs for slide 2 — not journal entries. Everyday need → kit. */
const teachingClimbs = [
  {
    id: "taxes",
    tab: "Taxes",
    tip: "Everyday money. The pile is the problem. An agent files it.",
    kicker: "Teaching climb",
    title: "Tax season is a pile. Filing always starts late.",
    close:
      "The pile is the problem. An agent is how it moves. Write it down.",
    moves: [
      {
        n: "1",
        label: "Base Camp",
        body: "W-2s, 1099s, and last year’s return live in email, a drawer, and the camera roll. You dread it, start late, and miss deductions you already paid for.",
      },
      {
        n: "2",
        label: "Route",
        body: "By March 1 you open one place and, in ten minutes, know three things: what’s in, what’s missing, what you likely owe or get back.",
      },
      {
        n: "3",
        label: "Waypoint",
        body: "An agent from this write-up. Grok Bot finds the papers. Grok Build makes a page. Imagine shows the path. Grok Voice is who you talk to.",
      },
      {
        n: "4",
        label: "Summit",
        body: "Start with the write-up. The agent finds. You confirm.",
      },
    ],
  },
  {
    id: "engine",
    tab: "Check engine",
    tip: "Everyday car. The light is the problem. An agent figures it out before you pay a shop to look.",
    kicker: "Teaching climb",
    title: "The check-engine light is on. Nobody knows why.",
    close:
      "The light is the problem. An agent is the diagnosis. Write it down.",
    moves: [
      {
        n: "1",
        label: "Base Camp",
        body: "The light is on. The shop wants a diagnostic fee before they look. You don’t know if it’s a gas cap or a tow.",
      },
      {
        n: "2",
        label: "Route",
        body: "In one sitting you can name the code, the likely cause, and whether you can drive to work tomorrow — without paying to find out.",
      },
      {
        n: "3",
        label: "Waypoint",
        body: "An agent from this write-up. Grok Bot finds the code. Grok Build makes a checklist. Imagine shows the part. Grok Voice is the mechanic you talk to.",
      },
      {
        n: "4",
        label: "Summit",
        body: "Start with the write-up. The agent finds. You decide.",
      },
    ],
  },
  {
    id: "dinner",
    tab: "Dinner",
    tip: "Everyday kitchen. The fridge is the problem. An agent cooks from what’s already there.",
    kicker: "Teaching climb",
    title: "It’s 6 p.m. The fridge is a puzzle.",
    close:
      "Dinner is the problem. An agent is the cook. Write it down.",
    moves: [
      {
        n: "1",
        label: "Base Camp",
        body: "Leftovers, a tired cook, three opinions. Takeout wins by default. The food in the house never becomes a meal.",
      },
      {
        n: "2",
        label: "Route",
        body: "Tonight you cook one meal from what’s already there, and everyone eats. No extra store run.",
      },
      {
        n: "3",
        label: "Waypoint",
        body: "An agent from this write-up. Grok Bot finds a recipe from what’s on hand. Grok Build makes a list. Imagine shows the dish. Grok Voice talks you through the pan.",
      },
      {
        n: "4",
        label: "Summit",
        body: "Start with what’s in the house. The agent finds. You cook.",
      },
    ],
  },
  {
    id: "market",
    tab: "Market",
    tip: "Grok Bot for marketing and research. Who it’s for, what they already tried, one claim you can test this week.",
    kicker: "Teaching climb",
    title: "You sell by hunch. Nobody can name who it’s for.",
    close:
      "The market is the pile. Grok Bot is how it becomes a list. Write it down.",
    moves: [
      {
        n: "1",
        label: "Base Camp",
        body: "Tabs, opinions, and last year’s flyer. You guess who to talk to. The campaign starts late and says everything to no one.",
      },
      {
        n: "2",
        label: "Route",
        body: "In one sitting you can name who it’s for, what they already tried, and one claim you can test this week — without a research firm.",
      },
      {
        n: "3",
        label: "Waypoint",
        body: "A Grok Bot from this write-up. It hunts the audience and the noise. Grok Build puts the findings on a page. Imagine shows the path. Grok Voice is who you talk it through with.",
      },
      {
        n: "4",
        label: "Summit",
        body: "Start with the write-up. The bot finds. You pick the one claim.",
      },
    ],
  },
  {
    id: "website",
    tab: "Website",
    tip: "Grok Build. A COVID timeline from origin to now — one site, claims next to the record. Live: unofficial-covid-report.acornsoft.ai",
    kicker: "Teaching climb",
    title: "COVID claims were a pile. Nobody could walk back to origin.",
    close:
      "The pile was the problem. Grok Build is the site. Live: unofficial-covid-report.acornsoft.ai",
    moves: [
      {
        n: "1",
        label: "Base Camp",
        body: "Public claims and records lived in a pile of tabs. You could not walk from origin to now in one place, or put a claim next to the record.",
      },
      {
        n: "2",
        label: "Route",
        body: "Someone opens one site, jumps year by year from 2019, and can check a claim against the record with sources — without a research desk.",
      },
      {
        n: "3",
        label: "Waypoint",
        body: "Grok Build ships the timeline from this Climb Note. Grok Bot hunts public sources. Imagine shows the path before we build. Grok Voice can walk a visitor through a year.",
      },
      {
        n: "4",
        label: "Summit",
        body: "One job: origin to now, on the record. Educational. Then the next Climb Note.",
      },
    ],
  },
] as const;


type TransPhase = "in" | "out";

/**
 * Three-act home story:
 * 1) Mountaineering metaphor — you climb with Luna as guide; prior climbs guide next
 * 2) Plain-language walkthrough (numbered four moves + consumer flagship)
 * 3) Classic build hero + shared-words path
 */
export function InbioPage() {
  const [index, setIndex] = useState(0);
  const [example, setExample] = useState(0);
  const [phase, setPhase] = useState<TransPhase>("in");
  const [dir, setDir] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const [slideWord, setSlideWord] = useState(0);
  const touchX = useRef<number | null>(null);
  const busyRef = useRef(false);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    for (const t of timers.current) window.clearTimeout(t);
    timers.current = [];
  };

  const prefersReduced = useCallback(() => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const transitionTo = useCallback(
    (next: number, direction: 1 | -1) => {
      if (busyRef.current) return;
      if (next === index) return;

      if (prefersReduced()) {
        setIndex(next);
        setPhase("in");
        setDir(direction);
        setSlideWord(0);
        return;
      }

      busyRef.current = true;
      setDir(direction);
      setPhase("out");

      const t1 = window.setTimeout(() => {
        setIndex(next);
        setSlideWord(0);
        setPhase("in");
        const t2 = window.setTimeout(() => {
          busyRef.current = false;
        }, TRANS_IN_MS);
        timers.current.push(t2);
      }, TRANS_OUT_MS);
      timers.current.push(t1);
    },
    [index, prefersReduced],
  );

  const go = useCallback(
    (direction: -1 | 1) => {
      const next = (index + direction + TOTAL) % TOTAL;
      transitionTo(next, direction);
    },
    [index, transitionTo],
  );

  const goTo = useCallback(
    (i: number) => {
      const next = ((i % TOTAL) + TOTAL) % TOTAL;
      if (next === index) return;
      const forward = (next - index + TOTAL) % TOTAL;
      const backward = (index - next + TOTAL) % TOTAL;
      const d = (forward <= backward ? 1 : -1) as 1 | -1;
      transitionTo(next, d);
    },
    [index, transitionTo],
  );

  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    if (paused || busyRef.current) return;
    if (prefersReduced()) return;
    const id = window.setInterval(() => {
      if (!busyRef.current) go(1);
    }, 11000);
    return () => window.clearInterval(id);
  }, [go, paused, prefersReduced, index]);

  useEffect(() => {
    if (index !== 2) return;
    if (prefersReduced()) return;
    const id = window.setInterval(() => {
      setSlideWord((w) => (w + 1) % stackWords.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [index, prefersReduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const slideClass = [
    "ac-story-slide",
    index === 0 ? "ac-story-slide--50k" : "",
    index === 1 ? "ac-story-slide--10k" : "",
    index === 2 ? "ac-story-slide--build" : "",
    index === 3 ? "ac-story-slide--luna" : "",
    `ac-story-slide--${phase}`,
    dir === 1 ? "ac-story-slide--dir-next" : "ac-story-slide--dir-prev",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className="template-color-1 spybody ac-inbio ac-hero-stage ac-home-shell"
      data-spy="scroll"
    >
      <SiteHeader loginRedirect="/" />

      <main className="main-page-wrapper ac-home-main">
        <section
          id="home"
          className="ac-story"
          aria-roledescription="carousel"
          aria-label="Climb Notes introduction"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setPaused(false);
            }
          }}
          onTouchStart={(e) => {
            touchX.current = e.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            const start = touchX.current;
            const end = e.changedTouches[0]?.clientX;
            touchX.current = null;
            if (start == null || end == null) return;
            const dx = end - start;
            if (Math.abs(dx) < 48) return;
            go(dx < 0 ? 1 : -1);
          }}
        >
          <div className="ac-story-frame">
            <button
              type="button"
              className="ac-story-arrow ac-story-arrow--prev"
              aria-label="Previous"
              onClick={() => go(-1)}
            >
              <ChevronLeft size={22} strokeWidth={2} aria-hidden />
            </button>

            <div className="ac-story-viewport">
              <div
                className="ac-story-stage"
                data-phase={phase}
                data-dir={dir === 1 ? "next" : "prev"}
              >
                {index === 0 ? (
                  <article
                    className={slideClass}
                    aria-label="1 of 4"
                    aria-hidden={phase === "out"}
                  >
                    <p className="ac-story-kicker">
                      Luna as your Sherpa · <ClimbNotesMark />
                    </p>
                    <h1 className="ac-story-headline">
                      Building with AI is a climb.
                    </h1>
                    <p className="ac-story-lede">
                      You climb, with{" "}
                      <strong className="ac-story-em">
                        Luna as your Sherpa
                      </strong>
                      . She walks with you. Your Climb Note is what she
                      follows.{" "}
                      <strong className="ac-story-em">Gnomah</strong> holds
                      the climbs. {PLATFORM}
                    </p>
                    <ul
                      className="ac-story-beats"
                      aria-label="The metaphor at a glance"
                    >
                      <li>
                        <strong>You climb</strong> — your problem, your step,
                        your pace
                      </li>
                      <li>
                        <strong>Luna</strong> — voice Sherpa. She walks with
                        you.
                      </li>
                      <li>
                        <strong>Climb Notes</strong> — the write-up she
                        follows
                      </li>
                      <li>
                        <strong>Gnomah</strong> — the memory that backs her
                      </li>
                    </ul>
                    <p className="ac-story-support">{LUNA_SHERPA_PLAIN}</p>
                    <div className="ac-story-actions">
                      <Link className="rn-btn ac-btn-maroon" to="/start">
                        <span>Send a Climb Note</span>
                      </Link>
                      <button
                        type="button"
                        className="rn-btn ac-btn-outline"
                        onClick={() => go(1)}
                      >
                        <span>See a walkthrough</span>
                      </button>
                    </div>
                  </article>
                ) : null}

                {index === 1 ? (
                  <article
                    className={slideClass}
                    aria-label="2 of 4"
                    aria-hidden={phase === "out"}
                  >
                    <p className="ac-story-kicker">
                      Base Camp · then an agent
                    </p>
                    <h1 className="ac-story-headline ac-story-headline--md">
                      From what’s stuck to something you can use.
                    </h1>
                    <p className="ac-story-lede">
                      {PUBLIC_NEED} {PUBLIC_AGENTS}
                    </p>

                    <div className="ac-story-note">
                      <div className="ac-story-note-bar">
                        <div
                          className="ac-story-ex-tabs"
                          role="tablist"
                          aria-label="Sample climbs"
                        >
                          <span className="ac-story-ex-label">
                            Sample Climbs
                          </span>
                          {teachingClimbs.map((ex, i) => (
                            <ViewportTip
                              key={ex.id}
                              role="tab"
                              selected={i === example}
                              className={
                                i === example
                                  ? "ac-story-ex-tab is-active"
                                  : "ac-story-ex-tab"
                              }
                              tipClassName="ac-story-ex-tip"
                              tipId={`ac-ex-tip-${ex.id}`}
                              label={ex.tab}
                              onActivate={() => setExample(i)}
                            >
                              <span className="ac-story-ex-tip-k">
                                {ex.tab}
                              </span>
                              {ex.tip}
                            </ViewportTip>
                          ))}
                        </div>
                      </div>
                      <h2 className="ac-story-note-title">
                        {teachingClimbs[example].title}
                      </h2>
                      <dl className="ac-story-note-grid">
                        {teachingClimbs[example].moves.map(
                          ({ n, label, body }) => (
                            <div key={label}>
                              <dt>
                                <span className="ac-story-move-n">{n}</span>
                                <span className="ac-story-move-label">
                                  {label}
                                </span>
                              </dt>
                              <dd>{body}</dd>
                            </div>
                          ),
                        )}
                      </dl>
                      <p className="ac-story-note-close">
                        {teachingClimbs[example].close}
                      </p>
                    </div>

                    <div className="ac-story-actions">
                      <Link className="rn-btn ac-btn-maroon" to="/start">
                        <span>Send yours</span>
                      </Link>
                      <Link className="rn-btn ac-btn-outline" to="/climb-notes">
                        <span>See the journal</span>
                      </Link>
                    </div>

                  </article>
                ) : null}

                {index === 2 ? (
                  <article
                    className={slideClass}
                    aria-label="3 of 4"
                    aria-hidden={phase === "out"}
                  >
                    <p className="ac-story-kicker">The workforce</p>
                    <h1 className="ac-story-headline ac-story-headline--build">
                      You provide the Climb Note. We supply the workforce.
                    </h1>
                    <div className="hero-sub ac-story-with">
                      <span className="hero-with">with</span>
                      <span
                        className="cd-words-wrapper hero-slide"
                        aria-live="polite"
                      >
                        {stackWords.map((word, i) => (
                          <b
                            key={word}
                            className={
                              i === slideWord
                                ? "is-visible is-sliding"
                                : "is-hidden"
                            }
                          >
                            {word.toUpperCase()}
                          </b>
                        ))}
                      </span>
                    </div>
                    <p className="ac-story-lede">
                      They bring a diverse set of skills, capabilities, and
                      velocity to the problem. You provide the Climb Note —
                      that’s what they follow. Luna is the Sherpa — she
                      walks with you. Gnomah remembers the climb. {PLATFORM}
                    </p>
                    <div className="ac-story-actions">
                      <Link className="rn-btn ac-btn-maroon" to="/start">
                        <span>Send a Climb Note</span>
                      </Link>
                      <VoiceWhenSignedIn>
                        <Link className="rn-btn ac-btn-outline" to="/voice">
                          <span>Talk to Luna</span>
                        </Link>
                      </VoiceWhenSignedIn>
                      <Link className="rn-btn ac-btn-outline" to="/service">
                        <span>Explore services</span>
                      </Link>
                    </div>
                  </article>
                ) : null}

                {index === 3 ? (
                  <article
                    className={slideClass}
                    aria-label="4 of 4"
                    aria-hidden={phase === "out"}
                  >
                    <p className="ac-story-kicker">Friends and family</p>
                    <h1 className="ac-story-headline">
                      Luna Foundry Multiagent is on the Marketplace.
                    </h1>
                    <p className="ac-story-lede">
                      A first look for people we trust. Install it in VS
                      Code. Luna is the Sherpa. Climb Notes are the trail.
                      Same four beats you already know.
                    </p>
                    <ul
                      className="ac-story-beats"
                      aria-label="What you get"
                    >
                      <li>
                        <strong>Install once</strong> — Marketplace or VSIX.
                        No git clone.
                      </li>
                      <li>
                        <strong>Unify the pack</strong> — one ritual on Grok
                        Build, Copilot, or Cursor.
                      </li>
                      <li>
                        <strong>Docs in the box</strong> — trails ship
                        inside the extension.
                      </li>
                    </ul>
                    <div className="ac-story-actions">
                      <a
                        className="rn-btn ac-btn-maroon"
                        href={MARKETPLACE_URL}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span>Get the extension</span>
                      </a>
                      <Link className="rn-btn ac-btn-outline" to="/luna">
                        <span>How it works</span>
                      </Link>
                    </div>
                  </article>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              className="ac-story-arrow ac-story-arrow--next"
              aria-label="Next"
              onClick={() => go(1)}
            >
              <ChevronRight size={22} strokeWidth={2} aria-hidden />
            </button>
          </div>

          <div className="ac-story-chrome">
            <div className="ac-story-chrome-nav">
              <button
                type="button"
                className="ac-story-arrow-sm"
                aria-label="Previous"
                onClick={() => go(-1)}
              >
                <ChevronLeft size={18} strokeWidth={2.25} aria-hidden />
              </button>
              <button
                type="button"
                className="ac-story-arrow-sm"
                aria-label="Next"
                onClick={() => go(1)}
              >
                <ChevronRight size={18} strokeWidth={2.25} aria-hidden />
              </button>
            </div>
            <div className="ac-story-dots" role="tablist" aria-label="Slides">
              {Array.from({ length: TOTAL }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Slide ${i + 1}`}
                  className={
                    i === index ? "ac-story-dot is-active" : "ac-story-dot"
                  }
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
            <p className="ac-story-index" aria-live="polite">
              {index + 1} / {TOTAL}
            </p>
            <p className="ac-story-way">{LIGHTSPEED_PLAIN}</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
