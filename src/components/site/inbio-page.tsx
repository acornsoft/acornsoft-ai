import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SiteHeader, SiteFooter } from "./site-chrome";
import { ClimbNotesMark } from "./climb-notes-mark";
import { VoiceWhenSignedIn } from "./voice-access";

const TOTAL = 3;
const TRANS_OUT_MS = 240;
const TRANS_IN_MS = 420;

const stackWords = [
  "Grok Build",
  "Imagine",
  "Voice",
  "Agents",
  "Skills",
  "Connectors",
] as const;

/** Teaching climb for slide 2 — not a published Climb Note. 000 lives on /climb-notes. */
const teachingClimb = {
  kicker: "Teaching climb · not a journal entry",
  title: "A shop has a site. Nobody books from it.",
  moves: [
    {
      n: "1",
      label: "What’s stuck",
      body: "People find the shop online, then call or leave. The site does not turn a visit into a booking.",
    },
    {
      n: "2",
      label: "How we know it moved",
      body: "In two weeks, at least five bookings start on the site — not on the phone.",
    },
    {
      n: "3",
      label: "The small step",
      body: "One page: hours, service, and a single “Book” action. Nothing else this week.",
    },
    {
      n: "4",
      label: "What we carry next",
      body: "One obvious next step beats a pretty site with five paths. Write that down before the next pitch.",
    },
  ],
};


type TransPhase = "in" | "out";

/**
 * Three-act home story:
 * 1) Mountaineering metaphor — you climb with Luna as guide; prior climbs guide next
 * 2) Plain-language walkthrough (numbered four moves + consumer flagship)
 * 3) Classic build hero + lingua franca path
 */
export function InbioPage() {
  const [index, setIndex] = useState(0);
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
                    aria-label="1 of 3"
                    aria-hidden={phase === "out"}
                  >
                    <p className="ac-story-kicker">
                      The Mountaineering approach to AI-first solutioning ·{" "}
                      <ClimbNotesMark />
                    </p>
                    <h1 className="ac-story-headline">
                      Building with AI is like climbing a mountain — not a free
                      solo adventure.
                    </h1>
                    <p className="ac-story-lede">
                      You climb. Not as a rope team — as a climber on a path,
                      with{" "}
                      <strong className="ac-story-em">
                        Luna as your Sherpa
                      </strong>{" "}
                      along the way. Past Climb Notes are your trail notes:
                      guidelines for the next ascent. Some climbs continue on
                      the same mountain path; others open a completely new path.
                      The{" "}
                      <strong className="ac-story-em">
                        Mountaineering approach
                      </strong>{" "}
                      makes AI-first solutioning usable as history — so you do
                      not free-solo without a map.
                    </p>
                    <ul
                      className="ac-story-beats"
                      aria-label="The metaphor at a glance"
                    >
                      <li>
                        <strong>You climb</strong> — your problem, your pitch,
                        your pace
                      </li>
                      <li>
                        <strong>Luna as your Sherpa</strong> — guide on this
                        climb and the ones before
                      </li>
                      <li>
                        <strong>Prior climbs</strong> — Climb Notes as
                        guidelines for what comes next
                      </li>
                      <li>
                        <strong>Same path or new</strong> — continue a mountain
                        route, or start a fresh one
                      </li>
                    </ul>
                    <p className="ac-story-support">
                      We educate first: before tools, before demos — so you know
                      the metaphor. Next: a concrete climb at 10,000 feet.
                      <VoiceWhenSignedIn>
                        {" "}
                        Or talk it through with{" "}
                        <Link className="ac-story-inline-link" to="/voice">
                          Luna as your Sherpa
                        </Link>
                        .
                      </VoiceWhenSignedIn>
                    </p>
                    <div className="ac-story-actions">
                      <button
                        type="button"
                        className="rn-btn ac-btn-maroon"
                        onClick={() => go(1)}
                      >
                        <span>See a walkthrough</span>
                      </button>
                      <Link className="rn-btn ac-btn-outline" to="/climb-notes">
                        <span>Open Climb Notes</span>
                      </Link>
                    </div>
                  </article>
                ) : null}

                {index === 1 ? (
                  <article
                    className={slideClass}
                    aria-label="2 of 3"
                    aria-hidden={phase === "out"}
                  >
                    <p className="ac-story-kicker">
                      Walkthrough · four moves · for everyone
                    </p>
                    <h1 className="ac-story-headline ac-story-headline--md">
                      Four moves everyone can follow.
                    </h1>
                    <p className="ac-story-lede">
                      You do not need a computer science degree. Name what is
                      stuck, how you will know it moved, the small step this
                      week, and the lesson you carry next time. That is a climb.
                      The written note is the trail.
                    </p>

                    <div className="ac-story-note">
                      <header className="ac-story-note-head">
                        <span className="ac-story-note-num">
                          {teachingClimb.kicker}
                        </span>
                        <h2 className="ac-story-note-title">
                          {teachingClimb.title}
                        </h2>
                      </header>
                      <dl className="ac-story-note-grid">
                        {teachingClimb.moves.map(({ n, label, body }) => (
                          <div key={label}>
                            <dt>
                              <span className="ac-story-move-n">{n}</span>
                              <span className="ac-story-move-label">
                                {label}
                              </span>
                            </dt>
                            <dd>{body}</dd>
                          </div>
                        ))}
                      </dl>
                      <p className="ac-story-note-close">
                        That is the shape of every Climb Note. The journal is
                        where finished climbs live — starting with the origin
                        trail.
                      </p>
                    </div>

                    <div className="ac-story-actions">
                      <Link className="rn-btn ac-btn-maroon" to="/climb-notes">
                        <span>See the journal</span>
                      </Link>
                      <button
                        type="button"
                        className="rn-btn ac-btn-outline"
                        onClick={() => go(1)}
                      >
                        <span>Meet the path ahead</span>
                      </button>
                    </div>

                  </article>
                ) : null}

                {index === 2 ? (
                  <article
                    className={slideClass}
                    aria-label="3 of 3"
                    aria-hidden={phase === "out"}
                  >
                    <p className="ac-story-kicker">
                      Everyday language · Luna as your Sherpa
                    </p>
                    <h1 className="ac-story-headline ac-story-headline--build">
                      Climb Notes™ — the shared language for everyday AI
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
                    <p className="ac-story-lede ac-story-lede--center">
                      Our zero-to-one play: Climb Notes become the common tongue
                      for people who are not developers — so anyone can
                      understand and use AI in daily life. Learn the metaphor,
                      follow real examples, reuse prior climbs. Next: a{" "}
                      <strong className="ac-story-em">voice-first</strong> path
                      where you talk to{" "}
                      <strong className="ac-story-em">
                        Luna as your Sherpa
                      </strong>{" "}
                      — on this path or a new one — and she guides you to the
                      Climb Notes that fit.
                    </p>
                    <div className="ac-story-actions ac-story-actions--center">
                      <VoiceWhenSignedIn>
                        <Link className="rn-btn ac-btn-maroon" to="/voice">
                          <span>Talk to Luna</span>
                        </Link>
                      </VoiceWhenSignedIn>
                      <Link className="rn-btn ac-btn-outline" to="/service">
                        <span>Explore services</span>
                      </Link>
                      <Link className="rn-btn ac-btn-outline" to="/climb-notes">
                        <span>Open Climb Notes</span>
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
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
