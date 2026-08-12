import { useEffect, useId, useState } from "react";
import { SiteChrome } from "./site-chrome";
import { VoiceCta, VoiceWhenSignedIn } from "./voice-access";
import { type ServiceItem } from "./service-data";
import { useServiceFaqRanking } from "@/hooks/use-service-faq-ranking";
import { useServiceCardRanking } from "@/hooks/use-service-card-ranking";
import { trackPageView } from "@/lib/analytics/client";

function assistanceLabel(kind: "direct" | "indirect" | "both"): string {
  if (kind === "direct") return "Direct assistance";
  if (kind === "indirect") return "Indirect assistance";
  return "Direct and indirect";
}

function ServiceFlipCard({
  item,
  catalogNum,
  total,
  lead,
  interest,
  onFlipToBack,
}: {
  item: ServiceItem;
  catalogNum: string;
  total: number;
  lead?: boolean;
  interest: number;
  onFlipToBack: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const Icon = item.icon;

  function toggle() {
    setFlipped((v) => {
      const next = !v;
      if (next) onFlipToBack();
      return next;
    });
  }

  return (
    <div
      className={`ac-svc-flip${lead ? " is-lead" : ""}${
        flipped ? " is-flipped" : ""
      }`}
    >
      <button
        type="button"
        className="ac-svc-flip-hit"
        onClick={toggle}
        aria-pressed={flipped}
        aria-label={`${item.title} (${catalogNum} of ${String(total).padStart(2, "0")}). ${
          flipped ? "Show overview" : "Show outcomes"
        }`}
      >
        <span className="ac-svc-flip-inner">
          <span className="ac-svc-flip-face ac-svc-flip-face--front">
            <span className="ac-svc-card-top">
              <span className="ac-svc-card-num">{catalogNum}</span>
              <span
                className={`ac-service-assist ac-service-assist--${item.assistance}`}
              >
                {assistanceLabel(item.assistance)}
              </span>
              {interest > 0 ? (
                <span className="ac-svc-interest" title="Times flipped">
                  {interest}
                </span>
              ) : null}
              <span className="ac-svc-card-icon" aria-hidden="true">
                <Icon strokeWidth={1.75} />
              </span>
            </span>
            <span className="ac-svc-card-title">{item.title}</span>
            <span className="ac-svc-card-text">{item.description}</span>
            {item.composedFrom?.includes("delivery-climb-notes") ? (
              <span className="ac-svc-flip-composed">
                Includes Delivery with Climb Notes™
              </span>
            ) : null}
            <span className="ac-svc-flip-hint">Flip for outcomes →</span>
          </span>

          <span className="ac-svc-flip-face ac-svc-flip-face--back">
            <span className="ac-svc-card-top">
              <span className="ac-svc-card-num">{catalogNum}</span>
              <span className="ac-svc-flip-back-kicker">Outcomes</span>
              <span className="ac-svc-card-icon" aria-hidden="true">
                <Icon strokeWidth={1.75} />
              </span>
            </span>
            <span className="ac-svc-card-title">{item.title}</span>
            <span className="ac-svc-card-points" role="list">
              {item.points.map((point) => (
                <span key={point} role="listitem">
                  {point}
                </span>
              ))}
            </span>
            <span className="ac-svc-flip-hint">← Flip back</span>
          </span>
        </span>
      </button>
    </div>
  );
}

function ServiceCatalog() {
  const labelId = useId();
  const { ranked, clickMap, recordFlip } = useServiceCardRanking();
  const total = ranked.length;

  return (
    <section
      className="ac-service-series ac-svc-catalog"
      aria-labelledby={labelId}
    >
      <div className="ac-svc-catalog-bar">
        <h2 className="ac-service-series-title" id={labelId}>
          Service catalog
        </h2>
      </div>


      <div className="ac-svc-grid" role="list" aria-label="All services">
        {ranked.map((s, i) => (
          <div key={s.id} role="listitem" id={`service-${s.id}`}>
            <ServiceFlipCard
              item={s}
              catalogNum={String(i + 1).padStart(2, "0")}
              total={total}
              lead={i === 0}
              interest={clickMap[s.id] ?? 0}
              onFlipToBack={() => void recordFlip(s)}
            />
          </div>
        ))}
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

          <ServiceCatalog />

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

