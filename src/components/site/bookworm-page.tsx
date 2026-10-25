import { SiteChrome } from "./site-chrome";

const STUDY_DATE = "2026-10-25";
const STUDY_SOURCES = 32;

/** Study readout. These are sample findings, shown separately and never summed. */
const STUDY_FINDINGS = [
  { label: "Saved and never revisited", figure: "11 of 32" },
  { label: "Folders paywalled or capped", figure: "9" },
  { label: "Deleted posts vanish", figure: "7" },
  { label: "No export", figure: "6" },
  { label: "Weak or missing search", figure: "5" },
] as const;

const CAPABILITIES = [
  {
    title: "Daily filing",
    text: "A daily run files new bookmarks. No folders needed.",
  },
  {
    title: "A note for each keeper",
    text: "Each keeper becomes a Markdown note with tags, purpose, project, and takeaway.",
  },
  {
    title: "Archive",
    text: "The full post, thread, and images are archived, so deleted posts survive.",
  },
  {
    title: "Deduped saves",
    text: "Repeat saves are deduped.",
  },
  {
    title: "Daily digest",
    text: "A daily digest lists 3 saves to revisit.",
  },
] as const;

const PRICING_HREF = "https://docs.x.ai/x-subscription/pricing";

/**
 * Public Bookworm page. Direct URL only.
 * Counters are deferred to a separate climb.
 */
export function BookwormPage() {
  return (
    <SiteChrome loginRedirect="/bookworm">
      <div className="ac-service-page bw ac-page-top">
        <div className="ac-service-stack bw-stack">
          <header className="bw-panel bw-hero bw-rise">
            <p className="bw-kicker">Product</p>
            <h1 className="bw-title">Bookworm</h1>
            <span className="bw-rule" aria-hidden="true" />
            <p className="bw-lede">
              Bookworm turns X bookmarks into a searchable, tagged library and a
              daily habit of revisiting what you saved.
            </p>
            <p className="bw-tagline">
              Making the Bot-world better one worm at a time.
            </p>
          </header>

          <section className="bw-section bw-rise" aria-labelledby="bw-problem-title">
            <div className="bw-section-head">
              <p className="bw-kicker">The problem</p>
              <h2 id="bw-problem-title" className="bw-heading">
                X bookmarks get saved and rarely revisited
              </h2>
            </div>
            <div className="bw-panel bw-study">
              <p className="bw-sample" role="note">
                Small sample, not a survey
              </p>
              <p className="bw-study-meta">
                Study of {STUDY_SOURCES} sources
                <span className="bw-dot" aria-hidden="true">
                  ·
                </span>
                <time dateTime={STUDY_DATE}>{STUDY_DATE}</time>
              </p>
              <ul className="bw-findings">
                {STUDY_FINDINGS.map((item) => (
                  <li key={item.label} className="bw-finding">
                    <span className="bw-finding-label">{item.label}</span>
                    <span className="bw-finding-figure">{item.figure}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="bw-section bw-rise" aria-labelledby="bw-does-title">
            <div className="bw-section-head">
              <p className="bw-kicker">What it does</p>
              <h2 id="bw-does-title" className="bw-heading">
                What Bookworm does
              </h2>
            </div>
            <ol className="bw-capabilities">
              {CAPABILITIES.map((item, index) => (
                <li key={item.title} className="bw-panel bw-capability">
                  <span className="bw-capability-index" aria-hidden="true">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="bw-capability-title">{item.title}</h3>
                    <p className="bw-copy">{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="bw-section bw-rise" aria-labelledby="bw-get-title">
            <div className="bw-section-head">
              <p className="bw-kicker">How to get it</p>
              <h2 id="bw-get-title" className="bw-heading">
                Bookworm runs as a Grok Bot
              </h2>
            </div>
            <div className="bw-panel bw-get">
              <p className="bw-copy bw-copy-lead">
                Running it needs X Premium ($30/mo) or higher (Super $100, Ultra
                $200), or the 7-day trial credit. Not Free or Plus.
              </p>
              <p className="bw-source">
                Pricing source:{" "}
                <a href={PRICING_HREF} rel="noopener noreferrer">
                  docs.x.ai/x-subscription/pricing
                </a>
              </p>
              <p className="bw-soon">Template link coming soon</p>
            </div>
          </section>
        </div>
      </div>
    </SiteChrome>
  );
}
