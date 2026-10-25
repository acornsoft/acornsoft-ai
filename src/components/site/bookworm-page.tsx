import { SiteChrome } from "./site-chrome";

const STUDY_DATE = "2026-10-25";
const STUDY_SOURCES = 32;

/** Study readout. Sample findings, shown separately and never summed. */
const STUDY_FINDINGS = [
  { label: "Saved and never revisited", figure: "11 of 32" },
  { label: "Folders paywalled or capped", figure: "9" },
  { label: "Deleted posts vanish", figure: "7" },
  { label: "No export", figure: "6" },
  { label: "Weak or missing search", figure: "5" },
] as const;

const WHAT_IT_IS =
  "Bookworm turns X bookmarks into a searchable, tagged library and a daily habit of revisiting what you saved.";

const WHO_ITS_FOR = "People who save X posts and rarely go back to them.";

const WHAT_IT_DOES = [
  "A daily run files new bookmarks. No folders needed.",
  "Each keeper becomes a Markdown note with tags, purpose, project, and takeaway.",
  "The full post, thread, and images are archived, so deleted posts survive.",
  "Repeat saves are deduped.",
  "A daily digest lists 3 saves to revisit.",
] as const;

const HOW_YOU_START_RUN =
  "Bookworm runs as a Grok Bot. Running it needs X Premium ($30/mo) or higher (Super $100, Ultra $200), or the 7-day trial credit. Not Free or Plus.";

const HOW_YOU_START_SETUP =
  "Setup asks which X account holds your bookmarks, where notes go (GitHub repo, Notion space, or folder), and what weekday time to run; it never removes anything without your yes.";

const TAGLINE = "Making the Bot-world better one worm at a time.";

const TEMPLATE_STATUS = "Template link coming soon";

const PRICING_HREF = "https://docs.x.ai/x-subscription/pricing";

/**
 * Public Bookworm page. Direct URL only.
 * Approved copy only. Study findings stay labelled and are not summed.
 */
export function BookwormPage() {
  return (
    <SiteChrome loginRedirect="/bookworm" mainClassName="bw-page">
      <div className="ac-service-page bw-page ac-page-top">
        <div className="bw-stack">
          <header className="bw-panel bw-hero bw-rise">
            <p className="bw-kicker">Product</p>
            <h1 className="bw-title">Bookworm</h1>
            <span className="bw-rule" aria-hidden="true" />
            <p className="bw-lede">{WHAT_IT_IS}</p>
            <p className="bw-tagline">{TAGLINE}</p>
          </header>

          <section className="bw-section bw-rise" aria-labelledby="bw-explain-title">
            <div className="bw-section-head">
              <p className="bw-kicker">Product explanation</p>
              <h2 id="bw-explain-title" className="bw-heading">
                What it is · Who it&apos;s for · What it does · How you start
              </h2>
            </div>
            <div className="bw-explain">
              <section className="bw-panel bw-part" aria-labelledby="bw-what">
                <h3 id="bw-what" className="bw-part-label">
                  What it is
                </h3>
                <p className="bw-copy">{WHAT_IT_IS}</p>
              </section>

              <section className="bw-panel bw-part" aria-labelledby="bw-who">
                <h3 id="bw-who" className="bw-part-label">
                  Who it&apos;s for
                </h3>
                <p className="bw-copy">{WHO_ITS_FOR}</p>
              </section>

              <section
                className="bw-panel bw-part bw-part-wide"
                aria-labelledby="bw-does"
              >
                <h3 id="bw-does" className="bw-part-label">
                  What it does
                </h3>
                <ol className="bw-does">
                  {WHAT_IT_DOES.map((text) => (
                    <li key={text}>
                      <p className="bw-copy">{text}</p>
                    </li>
                  ))}
                </ol>
              </section>

              <section
                className="bw-panel bw-part bw-part-wide bw-get"
                aria-labelledby="bw-start"
              >
                <h3 id="bw-start" className="bw-part-label">
                  How you start
                </h3>
                <p className="bw-copy bw-copy-lead">{HOW_YOU_START_RUN}</p>
                <p className="bw-copy">{HOW_YOU_START_SETUP}</p>
                <p className="bw-source">
                  Pricing source:{" "}
                  <a href={PRICING_HREF} rel="noopener noreferrer">
                    {PRICING_HREF}
                  </a>
                </p>
                <p className="bw-soon">{TEMPLATE_STATUS}</p>
              </section>
            </div>
          </section>

          <section className="bw-section bw-rise" aria-labelledby="bw-study-title">
            <div className="bw-section-head">
              <p className="bw-kicker">Study</p>
              <h2 id="bw-study-title" className="bw-heading">
                Small sample, not a survey
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
                    <span className="bw-finding-figure">{item.figure}</span>
                    <span className="bw-finding-label">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </SiteChrome>
  );
}
