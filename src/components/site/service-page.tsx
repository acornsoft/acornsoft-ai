import {
  useCallback,
  useEffect,
  useId,
  useState,
} from "react";
import { SiteChrome } from "./site-chrome";
import { VoiceCta, VoiceWhenSignedIn } from "./voice-access";
import { services, type ServiceItem } from "./service-data";
import { useServiceFaqRanking } from "@/hooks/use-service-faq-ranking";
import { track, trackPageView } from "@/lib/analytics/client";

function assistanceLabel(kind: "direct" | "indirect" | "both"): string {
  if (kind === "direct") return "Direct assistance";
  if (kind === "indirect") return "Indirect assistance";
  return "Direct and indirect";
}

/** How many open leaves: 1 phone · 2 tablet · 3 desktop */
function useSpreadCount() {
  const [count, setCount] = useState(1);
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w >= 1100) setCount(3);
      else if (w >= 720) setCount(2);
      else setCount(1);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return count;
}

function ServiceBookPage({
  item,
  index,
  total,
  role,
}: {
  item: ServiceItem;
  index: number;
  total: number;
  role: "past" | "current" | "ahead";
}) {
  const Icon = item.icon;
  return (
    <article
      className={`ac-book-page-face ac-book-page-face--${role}`}
      aria-label={`Service ${index + 1} of ${total}: ${item.title}`}
    >
      <header className="ac-book-page-head">
        <span className="ac-book-page-num" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="ac-book-page-folio" aria-hidden="true">
          Service catalog · leaf {index + 1}
        </span>
        <span className="ac-service-icon ac-book-page-icon" aria-hidden="true">
          <Icon strokeWidth={1.75} />
        </span>
      </header>

      <p className={`ac-service-assist ac-service-assist--${item.assistance}`}>
        {assistanceLabel(item.assistance)}
      </p>

      <h3 className="ac-book-page-title">{item.title}</h3>
      <p className="ac-book-page-text">{item.description}</p>

      <ul className="ac-book-page-points">
        {item.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>

      <footer className="ac-book-page-foot" aria-hidden="true">
        <span>{index + 1}</span>
        <span className="ac-book-page-foot-rule" />
        <span>{total}</span>
      </footer>
    </article>
  );
}

type CurlKind = "forward" | "back" | null;

function ServiceBookCarousel() {
  const total = services.length;
  const spread = useSpreadCount();
  const [page, setPage] = useState(0);
  const [curl, setCurl] = useState<CurlKind>(null);
  const [animating, setAnimating] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const labelId = useId();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // Keep page in range when spread changes so we never overshoot the end
  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(0, total - spread)));
  }, [spread, total]);

  const maxStart = Math.max(0, total - spread);

  const turn = useCallback(
    (dir: "forward" | "back") => {
      if (animating) return;
      const next =
        dir === "forward"
          ? Math.min(page + 1, maxStart)
          : Math.max(page - 1, 0);
      if (next === page) return;

      track("service_card_select", {
        index: next,
        service: services[next]?.title ?? "",
        assistance: services[next]?.assistance ?? "",
        flip: dir,
        spread,
      });

      if (reducedMotion) {
        setPage(next);
        return;
      }

      setAnimating(true);
      setCurl(dir);
      // Mid-curl: swap spread; end: clear curl class
      window.setTimeout(() => setPage(next), 280);
      window.setTimeout(() => {
        setCurl(null);
        setAnimating(false);
      }, 560);
    },
    [animating, maxStart, page, reducedMotion, spread],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") turn("forward");
      if (e.key === "ArrowLeft" || e.key === "PageUp") turn("back");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [turn]);

  const visible = Array.from({ length: spread }, (_, i) => {
    const idx = page + i;
    if (idx >= total) return null;
    return { item: services[idx], index: idx };
  }).filter(Boolean) as { item: ServiceItem; index: number }[];

  const canBack = page > 0;
  const canForward = page < maxStart;
  const endLeaf = Math.min(page + spread, total);

  const stageClass = [
    "ac-book-stage",
    `ac-book-stage--spread-${spread}`,
    curl === "forward" ? "is-curl-forward" : "",
    curl === "back" ? "is-curl-back" : "",
    reducedMotion ? "is-reduced-motion" : "",
    animating ? "is-animating" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className="ac-service-series ac-service-book"
      aria-labelledby={labelId}
      aria-roledescription="carousel"
    >
      <div className="ac-service-series-head">
        <h2 className="ac-service-series-title" id={labelId}>
          Service catalog
        </h2>
        <p className="ac-service-series-meta" aria-live="polite">
          Leaves {String(page + 1).padStart(2, "0")}–
          {String(endLeaf).padStart(2, "0")} of {String(total).padStart(2, "0")}
          <span className="ac-book-spread-label"> · open {spread}</span>
        </p>
      </div>

      <p className="ac-book-hint">
        Top-left corner turns back · bottom-right corner curls forward · arrow
        keys work too.
      </p>

      <div className="ac-book-shell">
        <div className="ac-book-spine" aria-hidden="true">
          <span className="ac-book-spine-title">Acornsoft</span>
          <span className="ac-book-spine-sub">Services</span>
        </div>

        <div className={stageClass}>
          {/* Open spread: 1–3 pages */}
          <div
            className="ac-book-spread"
            style={{
              ["--ac-spread" as string]: String(spread),
            }}
          >
            {visible.map(({ item, index }, i) => {
              const role =
                i === 0 ? "current" : i === visible.length - 1 ? "ahead" : "past";
              // middle of 3 is "past" in naming — use current for center emphasis
              const r =
                spread === 3
                  ? i === 0
                    ? "past"
                    : i === 1
                      ? "current"
                      : "ahead"
                  : i === 0
                    ? "current"
                    : "ahead";
              return (
                <div
                  key={`${item.title}-${index}`}
                  className={`ac-book-leaf-slot ac-book-leaf-slot--${i} ac-book-leaf-slot--${r}`}
                >
                  <ServiceBookPage
                    item={item}
                    index={index}
                    total={total}
                    role={role === "past" ? r : r}
                  />
                </div>
              );
            })}
          </div>

          {/* Corner: top-left = back */}
          <button
            type="button"
            className={`ac-book-corner ac-book-corner--back${
              canBack ? "" : " is-disabled"
            }`}
            onClick={() => turn("back")}
            disabled={!canBack || animating}
            aria-label="Turn back a page"
            title={canBack ? "Turn back" : "Start of catalog"}
          >
            <span className="ac-book-corner-curl" aria-hidden="true" />
            <span className="ac-book-corner-label">Back</span>
          </button>

          {/* Corner: bottom-right = forward (page curl / wipe) */}
          <button
            type="button"
            className={`ac-book-corner ac-book-corner--forward${
              canForward ? "" : " is-disabled"
            }`}
            onClick={() => turn("forward")}
            disabled={!canForward || animating}
            aria-label="Turn forward a page"
            title={canForward ? "Curl page forward" : "End of catalog"}
          >
            <span className="ac-book-corner-curl" aria-hidden="true" />
            <span className="ac-book-corner-label">Next</span>
          </button>

          {/* Full-stage curl wipe overlay during forward/back */}
          <div className="ac-book-curl-wipe" aria-hidden="true">
            <div className="ac-book-curl-sheet" />
            <div className="ac-book-curl-shade" />
          </div>
        </div>
      </div>

      <div className="ac-book-controls">
        <div className="ac-book-dots" role="tablist" aria-label="Service leaves">
          {services.map((s, i) => {
            const inView = i >= page && i < page + spread;
            return (
              <button
                key={s.title}
                type="button"
                role="tab"
                aria-selected={inView}
                aria-label={`${s.title} (${i + 1} of ${total})`}
                className={`ac-book-dot${inView ? " is-active" : ""}`}
                disabled={animating}
                onClick={() => {
                  if (animating) return;
                  const target = Math.min(i, maxStart);
                  if (target === page) return;
                  const dir = target > page ? "forward" : "back";
                  track("service_card_select", {
                    index: target,
                    service: services[target]?.title ?? "",
                    via: "dot",
                  });
                  if (reducedMotion) {
                    setPage(target);
                    return;
                  }
                  setAnimating(true);
                  setCurl(dir);
                  window.setTimeout(() => setPage(target), 280);
                  window.setTimeout(() => {
                    setCurl(null);
                    setAnimating(false);
                  }, 560);
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ServicePage() {
  const { rankedFaqs, clickMap, onFaqToggle } = useServiceFaqRanking();

  useEffect(() => {
    trackPageView({ page: "service" });
  }, []);

  return (
    <SiteChrome loginRedirect="/service">
      <div className="ac-service-page ac-page-top" id="service">
        <div className="ac-service-stack">
          <header className="ac-service-head">
            <span className="ac-service-kicker">Services</span>
            <h1 className="ac-service-title">How we help you climb</h1>

            <div className="ac-service-lede-box">
              <p className="ac-service-lede">
                Acornsoft helps people turn AI work into climbs they can finish
                and reuse — not demos that die on a slide deck.
              </p>
              <p className="ac-service-lede">
                In plain language, name{" "}
                <strong>what’s stuck</strong>, how you’ll{" "}
                <strong>know it moved</strong>, the{" "}
                <strong>small step</strong> this week, and the{" "}
                <strong>lesson</strong> you carry next time.
              </p>
              <p className="ac-service-lede">
                That is the Mountaineering approach to AI-first solutioning.{" "}
                <strong>You climb</strong>, with{" "}
                <strong>Luna as your Sherpa</strong> — not as a solo climber.
              </p>
              <p className="ac-service-lede">
                Climb Notes are your trail map for the same path next week, or a
                new one. We offer <strong>indirect</strong> help (journal,
                walkthroughs, Voice) and <strong>direct</strong> help (strategy,
                build, systems, delivery).
              </p>
              <p className="ac-service-lede ac-service-lede--last">
                Start with one slice. Stack as the climb demands.
              </p>
            </div>
          </header>

          <ServiceBookCarousel />

          <section
            className="ac-service-faq"
            aria-labelledby="service-faq-heading"
          >
            <div className="ac-service-faq-head">
              <span className="ac-service-kicker">Questions</span>
              <h2 className="ac-service-faq-title" id="service-faq-heading">
                Common questions
              </h2>
              <p className="ac-service-faq-hint">
                Opens rank questions: more opens rise higher. Default first: What
                is a Climb Note?
              </p>
            </div>
            <div className="ac-service-faq-list">
              {rankedFaqs.map((faq) => (
                <details
                  key={faq.id}
                  className="ac-service-faq-item"
                  onToggle={(e) => onFaqToggle(faq, e)}
                >
                  <summary>
                    <span className="ac-service-faq-q">{faq.q}</span>
                    {(clickMap[faq.id] ?? 0) > 0 ? (
                      <span
                        className="ac-service-faq-rank"
                        title="Opens (interest rank)"
                      >
                        {clickMap[faq.id]}
                      </span>
                    ) : null}
                  </summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>
          </section>

          <VoiceWhenSignedIn>
            <div className="ac-service-foot">
              <VoiceCta className="rn-btn" outline label="ACORNSOFT is OPEN" />
            </div>
          </VoiceWhenSignedIn>
        </div>
      </div>
    </SiteChrome>
  );
}
