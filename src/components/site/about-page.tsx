import { useEffect, useState } from "react";
import { SiteChrome } from "./site-chrome";
import { VoiceCta } from "./voice-access";
import { PERSONAL_SITE, dualSiteNote } from "@/lib/site-links";

const aboutSections = [
  { id: "about-intro", label: "Who we are" },
  { id: "company-vision", label: "Company Vision" },
  { id: "first-principles", label: "First Principles" },
  { id: "core-beliefs", label: "Core Beliefs" },
  { id: "charter", label: "Charter" },
  { id: "founder", label: "Founder" },
] as const;

export function AboutPage() {
  const [activeId, setActiveId] = useState<string>(aboutSections[0].id);

  useEffect(() => {
    const onScroll = () => {
      const offset = 120;
      let current = aboutSections[0].id;
      for (const s of aboutSections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - offset <= 0) {
          current = s.id;
        }
      }
      setActiveId(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <SiteChrome loginRedirect="/about">
      <div className="ac-about-page ac-page-top">
        <div className="container ac-about-container">
          <div className="ac-about-layout">
            <aside className="ac-about-side" aria-label="About sections">
              <div className="ac-about-side-inner">
                <p className="ac-about-side-label">On this page</p>
                <nav className="ac-about-side-nav">
                  {aboutSections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className={activeId === s.id ? "is-active" : undefined}
                      aria-current={activeId === s.id ? "true" : undefined}
                    >
                      {s.label}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            <div className="ac-about-main">
              <section
                className="ac-about-block"
                id="about-intro"
                aria-labelledby="about-intro-heading"
              >
                <div className="ac-about-intro-grid ac-about-intro-grid--copy-only">
                  <div className="ac-about-intro-copy">
                    <span className="subtitle">About</span>
                    <h1 className="title" id="about-intro-heading">
                      We Are Acornsoft
                    </h1>
                    <p className="discription">
                      Acornsoft is a New York–based, AI-first organization that
                      builds production artificial intelligence systems via Climb
                      Notes™. Our software has to work under real load, with real
                      users, and under real rules.
                    </p>
                    <p className="discription">
                      We start from first principles: keep what is true and
                      measurable, drop what is not. Failure is how we succeed. We
                      are always trying to improve. Small starts. Strong roots.
                    </p>
                  </div>
                </div>
              </section>

              <section
                className="ac-about-block"
                id="company-vision"
                aria-labelledby="company-vision-heading"
              >
                <article className="ac-vision-card">
                  <h2
                    className="ac-vision-card-title"
                    id="company-vision-heading"
                  >
                    Company Vision
                  </h2>
                  <p>
                    Artificial intelligence should run like durable
                    infrastructure—not a demo that breaks under traffic, audit, or
                    edge cases. Acornsoft helps teams climb from prototype to
                    production with Climb Notes: a clear problem, a clear metric, a
                    thin slice that works, then make it strong.
                  </p>
                  <p>
                    We aim for software people can open, trust, and own: small
                    useful tools, humans in the loop where judgment matters, and
                    systems that stay honest when things get messy.
                  </p>
                  <p>
                    We aim at a multiplanetary future. That ambition runs in the
                    same direction as Elon Musk’s work at SpaceX and the wider
                    stack—without partnership or endorsement. We are independent
                    builders. Tesla, SpaceX, X, and SpaceXAI marks stay theirs. We
                    do not speak for them. We put energy into Climb Notes™ and
                    tools that make hard problems real under load—on Earth first.
                  </p>
                </article>
              </section>

              <section
                className="ac-about-block"
                id="first-principles"
                aria-labelledby="first-principles-heading"
              >
                <article className="ac-vision-card">
                  <h2
                    className="ac-vision-card-title"
                    id="first-principles-heading"
                  >
                    First Principles Approach
                  </h2>
                  <ol className="ac-vision-list ac-vision-list-ordered">
                    <li>
                      <strong>Climb Notes™ are our energy.</strong> The difference
                      maker is not a model alone—it is the written climb: problem,
                      measure, slice, lesson. That energy compounds. Tools without
                      notes fade.
                    </li>
                    <li>
                      <strong>Name the real constraints first.</strong> Data,
                      speed, cost, risk, and who is responsible—write those down
                      before you pick a model.
                    </li>
                    <li>
                      <strong>Drop what you cannot justify.</strong> No process,
                      vendor pitch, or architecture is sacred if it fails those
                      constraints.
                    </li>
                    <li>
                      <strong>Build the smallest system that can learn.</strong>{" "}
                      Prefer something you can measure, fail safely, and improve in
                      front of the team that owns it. Capture the climb in Climb
                      Notes.
                    </li>
                    <li>
                      <strong>Check assumptions again in production.</strong> Live
                      systems change the problem. First principles is a loop, not a
                      one-time slide. Update the note when reality moves.
                    </li>
                    <li>
                      <strong>Treat failure as tuition.</strong> A miss maps the
                      real problem. Write it into Climb Notes™. We succeed by
                      learning fast—not by pretending we never miss.
                    </li>
                  </ol>
                </article>
              </section>

              <section
                className="ac-about-block"
                id="core-beliefs"
                aria-labelledby="core-beliefs-heading"
              >
                <article className="ac-vision-card ac-vision-card-wide">
                  <h2
                    className="ac-vision-card-title"
                    id="core-beliefs-heading"
                  >
                    Core Beliefs
                  </h2>
                  <ul className="ac-vision-list">
                    <li>
                      <strong>Failure is how we succeed.</strong> We are always
                      trying to improve. When a slice fails, we learn what
                      production needs—then we climb again.
                    </li>
                    <li>
                      <strong>Truth before theater.</strong> Demos and scores are
                      useful. What matters is how the system behaves under real
                      load.
                    </li>
                    <li>
                      <strong>People stay accountable.</strong> Automation is a
                      tool with clear handoffs—not a way to drop ownership.
                    </li>
                    <li>
                      <strong>Privacy and proper usage come first.</strong> They
                      shape the design. They are not patches after launch.
                    </li>
                    <li>
                      <strong>The record is the boss.</strong> Put claims next to
                      sources. Climb Notes™ and Our Work on Canopy favor evidence
                      over story.
                    </li>
                    <li>
                      <strong>Respect other brands.</strong> Tesla, Optimus,
                      SpaceX, X, Grok, Grok Build, and SpaceXAI are trademarks of
                      their owners. We use tools. We do not speak for them.
                    </li>
                    <li>
                      <strong>Small starts, strong roots.</strong> One sharp
                      workflow beats a vague platform promise.
                    </li>
                    <li>
                      <strong>
                        Mars-facing ambition, Earth-proven systems.
                      </strong>{" "}
                      We share the vision of a multiplanetary future with Elon
                      Musk’s direction for SpaceX and the wider stack—while
                      shipping software that works here and now.
                    </li>
                  </ul>
                </article>
              </section>

              <section
                className="ac-about-block"
                id="charter"
                aria-labelledby="charter-heading"
              >
                <article className="ac-vision-card ac-vision-card-charter">
                  <h2 className="ac-vision-card-title" id="charter-heading">
                    Acornsoft Charter
                  </h2>
                  <p className="ac-charter-lede">
                    First principles. Few rules. Hold them when it is hard.
                  </p>
                  <ol className="ac-vision-list ac-vision-list-ordered ac-charter-list">
                    <li>Define success before you build.</li>
                    <li>Keep only what the problem requires.</li>
                    <li>Make it safe, private, and operable—or refuse it.</li>
                    <li>
                      Write assumptions. Write failures. Improve the next slice.
                    </li>
                    <li>People stay accountable. Machines do not own risk.</li>
                    <li>Contact is Voice. No form theater.</li>
                    <li>Name other brands honestly. Never claim their voice.</li>
                    <li>When evidence contradicts you, change.</li>
                  </ol>
                  <div className="ac-hero-cta" style={{ marginTop: 20 }}>
                    <VoiceCta
                      className="rn-btn"
                      outline
                      label="ACORNSOFT is OPEN"
                    />
                  </div>
                </article>
              </section>

              {/* Single section: Founder + personal site (was Founder + Also) */}
              <section
                className="ac-about-block"
                id="founder"
                aria-labelledby="founder-heading"
              >
                <article className="ac-vision-card ac-founder-card ac-founder-combined">
                  <h2 className="ac-vision-card-title" id="founder-heading">
                    Founder
                  </h2>
                  <div className="ac-founder-row">
                    <picture className="ac-founder-photo">
                      <source
                        srcSet="/david-blaszyk-headshot.webp"
                        type="image/webp"
                      />
                      <img
                        src="/david-blaszyk-headshot.jpg"
                        alt="David Blaszyk, founder of Acornsoft"
                        width={320}
                        height={400}
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                    <div className="ac-founder-copy">
                      <p className="ac-founder-name">
                        <strong>{PERSONAL_SITE.ownerName}</strong>
                        <span className="ac-founder-role">
                          {PERSONAL_SITE.ownerTitle}, Acornsoft
                        </span>
                      </p>
                      <p>
                        Founded Acornsoft to turn Climb Notes™ into production
                        systems—not slide decks. Based in New York, he builds with
                        first principles: clear problem, clear measure, thin slice
                        that works, then strengthen under real load.
                      </p>
                      <p className="ac-founder-bridge-note">{dualSiteNote}</p>
                      <a
                        className="rn-btn ac-btn-maroon ac-founder-bio-cta"
                        href={PERSONAL_SITE.workBio}
                        target="_blank"
                        rel="noopener noreferrer me"
                      >
                        <span>Personal work bio · {PERSONAL_SITE.label}</span>
                      </a>
                    </div>
                  </div>
                </article>
              </section>
            </div>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
