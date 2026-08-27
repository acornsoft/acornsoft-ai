import { useEffect, useState } from "react";
import { SiteChrome } from "./site-chrome";
import { VoiceCta, VoiceWhenSignedIn, useVoiceVisible } from "./voice-access";

import { PERSONAL_SITE, dualSiteNote } from "@/lib/site-links";

const aboutSections = [
  { id: "about-intro", label: "Who we are" },
  { id: "company-vision", label: "Vision" },
  { id: "first-principles", label: "First principles" },
  { id: "core-beliefs", label: "Beliefs" },
  { id: "charter", label: "Charter" },
  { id: "founder", label: "Founder" },
] as const;

const principles = [
  {
    title: "Climb Notes™ are the work",
    body: "The difference maker is not a model alone. It is the written climb: problem, measure, pitch, lesson. Tools without notes fade.",
  },
  {
    title: "Name the constraints first",
    body: "Data, speed, cost, risk, and who is responsible — write those down before you pick a model.",
  },
  {
    title: "Drop what you cannot justify",
    body: "No process, vendor pitch, or architecture is sacred if it fails those constraints.",
  },
  {
    title: "Build the smallest system that can learn",
    body: "Prefer something you can measure, fail safely, and improve in front of the team that owns it. Capture the climb.",
  },
  {
    title: "Check assumptions in production",
    body: "Live systems change the problem. First principles is a loop, not a one-time slide. Update the note when reality moves.",
  },
  {
    title: "Treat failure as tuition",
    body: "A miss maps the real problem. Write it down. We succeed by learning fast — not by pretending we never miss.",
  },
] as const;

const beliefs = [
  {
    title: "Failure is how we succeed",
    body: "When a pitch fails, we learn what production needs — then we climb again.",
  },
  {
    title: "Truth before theater",
    body: "Demos and scores are useful. What matters is how the system behaves under real load.",
  },
  {
    title: "People stay accountable",
    body: "Automation is a tool with clear handoffs — not a way to drop ownership.",
  },
  {
    title: "Privacy and proper usage come first",
    body: "They shape the design. They are not patches after launch.",
  },
  {
    title: "The record is the boss",
    body: "Put claims next to sources. Climb Notes and Canopy favor evidence over story.",
  },
  {
    title: "Respect other brands",
    body: "Tesla, SpaceX, X, Grok, and SpaceXAI stay theirs. We use tools. We do not speak for them.",
  },
  {
    title: "Small starts, strong roots",
    body: "One sharp workflow beats a vague platform promise.",
  },
  {
    title: "Mars-facing, Earth-proven",
    body: "We share a multiplanetary ambition. We ship software that works here and now.",
  },
] as const;

const charter = [
  "Define success before you build.",
  "Keep only what the problem requires.",
  "Make it safe, private, and operable — or refuse it.",
  "Write assumptions. Write failures. Improve the next pitch.",
  "People stay accountable. Machines do not own risk.",
  "Contact is Voice. No form theater.",
  "Name other brands honestly. Never claim their voice.",
  "When evidence contradicts you, change.",
] as const;

export function AboutPage() {
  const [activeId, setActiveId] = useState<string>(aboutSections[0].id);
  const { visible: signedIn } = useVoiceVisible();
  const navSections = signedIn
    ? aboutSections
    : aboutSections.filter((s) => s.id !== "founder");

  useEffect(() => {
    const ids = signedIn
      ? aboutSections
      : aboutSections.filter((s) => s.id !== "founder");
    const onScroll = () => {
      const offset = 120;
      let current = ids[0].id;
      for (const s of ids) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - offset <= 0) current = s.id;
      }
      setActiveId(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [signedIn]);

  return (
    <SiteChrome loginRedirect="/about">
      <div className="ac-service-page ac-about-page ac-page-top" id="about">
        <div className="ac-service-stack ac-about-shell">
          <nav className="ac-about-rail" aria-label="On this page">
            <span className="ac-about-rail-label">On this page</span>
            {navSections.map((s) => (
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

          <div className="ac-about-col">
          <header className="ac-service-head" id="about-intro">

            <span className="ac-service-kicker">About</span>
            <h1 className="ac-service-title">We are Acornsoft</h1>
            <div className="ac-service-lede-box">
              <p className="ac-service-lede">
                A New York–based, AI-first organization. We build production
                systems via Climb Notes™ — software that has to work under real
                load, with real users, and under real rules.
              </p>
              <p className="ac-service-lede">
                We start from first principles: keep what is true and
                measurable, drop what is not. Failure is how we succeed. We are
                always trying to improve.
              </p>
              <p className="ac-service-lede ac-service-lede--last">
                Small starts. Strong roots.
              </p>
            </div>
          </header>


          <section
            className="ac-about-sec"
            id="company-vision"
            aria-labelledby="company-vision-heading"
          >
            <span className="ac-service-kicker">Vision</span>
            <h2 className="ac-about-h2" id="company-vision-heading">
              Production, not a demo that dies
            </h2>
            <div className="ac-about-prose">
              <p>
                Artificial intelligence should run like durable infrastructure —
                not a demo that breaks under traffic, audit, or edge cases. We
                help teams climb from prototype to production with Climb Notes:
                a clear problem, a clear metric, a thin slice that works, then
                make it strong.
              </p>
              <p>
                We aim for software people can open, trust, and own: small
                useful tools, humans in the loop where judgment matters, and
                systems that stay honest when things get messy.
              </p>
              <p>
                We aim at a multiplanetary future. That ambition runs in the
                same direction as Elon Musk’s work at SpaceX and the wider stack
                — without partnership or endorsement. We are independent
                builders. Tesla, SpaceX, X, and SpaceXAI marks stay theirs. We
                do not speak for them. We put energy into Climb Notes™ and tools
                that make hard problems real under load — on Earth first.
              </p>
            </div>
          </section>

          <section
            className="ac-about-sec"
            id="first-principles"
            aria-labelledby="first-principles-heading"
          >
            <span className="ac-service-kicker">Method</span>
            <h2 className="ac-about-h2" id="first-principles-heading">
              First principles
            </h2>
            <ol className="ac-about-steps">
              {principles.map((item, i) => (
                <li key={item.title}>
                  <span className="ac-about-step-n">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="ac-about-step-body">
                    <strong>{item.title}</strong>
                    {item.body}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section
            className="ac-about-sec"
            id="core-beliefs"
            aria-labelledby="core-beliefs-heading"
          >
            <span className="ac-service-kicker">Stance</span>
            <h2 className="ac-about-h2" id="core-beliefs-heading">
              Core beliefs
            </h2>
            <ul className="ac-about-beliefs">
              {beliefs.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.body}</span>
                </li>
              ))}
            </ul>
          </section>

          <section
            className="ac-about-sec"
            id="charter"
            aria-labelledby="charter-heading"
          >
            <span className="ac-service-kicker">Rules</span>
            <h2 className="ac-about-h2" id="charter-heading">
              Acornsoft Charter
            </h2>
            <p className="ac-about-charter-lede">
              First principles. Few rules. Hold them when it is hard.
            </p>
            <ol className="ac-about-charter">
              {charter.map((rule, i) => (
                <li key={rule}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {rule}
                </li>
              ))}
            </ol>
          </section>

          <VoiceWhenSignedIn>
          <section
            className="ac-about-sec ac-about-founder"
            id="founder"
            aria-labelledby="founder-heading"
          >
            <span className="ac-service-kicker">People</span>
            <h2 className="ac-about-h2" id="founder-heading">
              Founder
            </h2>
            <div className="ac-about-founder-row">
              <picture className="ac-about-founder-photo">
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
              <div className="ac-about-founder-copy">
                <p className="ac-about-founder-name">
                  {PERSONAL_SITE.ownerName}
                </p>
                <p className="ac-about-founder-role">
                  {PERSONAL_SITE.ownerTitle}, Acornsoft
                </p>
                <p>
                  Founded Acornsoft to turn Climb Notes™ into production
                  systems — not slide decks. Based in New York. Clear problem,
                  clear measure, next pitch that works, then strengthen under
                  real load.
                </p>
                <p className="ac-about-founder-note">{dualSiteNote}</p>
                <div className="ac-about-founder-actions">
                  <a
                    className="rn-btn ac-btn-maroon"
                    href={PERSONAL_SITE.workBio}
                    target="_blank"
                    rel="noopener noreferrer me"
                  >
                    <span>Personal work bio · {PERSONAL_SITE.label}</span>
                  </a>
                  <VoiceCta
                    className="rn-btn ac-btn-outline"
                    outline
                    label="ACORNSOFT is OPEN"
                  />
                </div>
              </div>
            </div>
          </section>
          </VoiceWhenSignedIn>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
