import { Link } from "@tanstack/react-router";
import { SiteChrome } from "./site-chrome";
import { VoiceCta, VoiceWhenSignedIn } from "./voice-access";
import { ClimbNotesMark } from "./climb-notes-mark";
import { serviceFaqs, services } from "./service-data";

function assistanceLabel(kind: "direct" | "indirect" | "both"): string {
  if (kind === "direct") return "Direct assistance";
  if (kind === "indirect") return "Indirect assistance";
  return "Direct and indirect";
}

export function ServicePage() {
  return (
    <SiteChrome loginRedirect="/service">
      <div className="ac-service-page ac-page-top" id="service">
        <div className="container">
          <header className="ac-service-head">
            <span className="ac-service-kicker">Services</span>
            <h1 className="ac-service-title">How we help you climb</h1>
            <div className="ac-service-lede-box">
              <p className="ac-service-lede">
                Acornsoft helps people{" "}
                <strong>learn the Mountaineering approach</strong>—a metaphor
                anyone can understand and use. <strong>You climb</strong>, with{" "}
                <strong>Luna as your Sherpa</strong> along the way—not as a rope
                team. Prior Climb Notes are guidelines for future climbs: some on
                the same mountain path, some on completely new paths. Then we
                offer <strong>indirect</strong> assistance (journal, walkthroughs,
                Voice) and <strong>direct</strong> assistance (strategy, build,
                systems, delivery). Modular: start with one slice; stack as the
                climb demands.
              </p>
            </div>
            <div className="ac-service-head-links">
              <Link className="rn-btn ac-btn-outline" to="/climb-notes">
                <span>
                  Read <ClimbNotesMark />
                </span>
              </Link>
              <VoiceWhenSignedIn>
                <Link className="rn-btn ac-btn-maroon" to="/voice">
                  <span>Talk to Luna</span>
                </Link>
              </VoiceWhenSignedIn>
            </div>
          </header>

          <ul className="ac-service-grid" aria-label="Service offerings">
            {services.map((item, i) => {
              const Icon = item.icon;
              return (
                <li key={item.title} className="ac-service-card">
                  <div className="ac-service-card-top">
                    <span className="ac-service-index" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="ac-service-rule" aria-hidden="true" />
                    <span className="ac-service-icon" aria-hidden="true">
                      <Icon strokeWidth={1.75} />
                    </span>
                  </div>
                  <p
                    className={`ac-service-assist ac-service-assist--${item.assistance}`}
                  >
                    {assistanceLabel(item.assistance)}
                  </p>
                  <h2 className="ac-service-card-title">{item.title}</h2>
                  <p className="ac-service-card-text">{item.description}</p>
                  <ul className="ac-service-card-points">
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>

          <section
            className="ac-service-faq"
            aria-labelledby="service-faq-heading"
          >
            <div className="ac-service-faq-head">
              <span className="ac-service-kicker">Questions</span>
              <h2 className="ac-service-faq-title" id="service-faq-heading">
                Common questions
              </h2>
            </div>
            <div className="ac-service-faq-list">
              {serviceFaqs.map((item) => (
                <details key={item.q} className="ac-service-faq-item">
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          <div className="ac-service-foot">
            <VoiceCta className="rn-btn" outline label="ACORNSOFT is OPEN" />
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
