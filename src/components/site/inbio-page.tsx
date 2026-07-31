import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { ClimbNotesMark } from "./climb-notes-mark";

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#features", label: "Service" },
  { href: "/climb-notes", label: "Climb Notes", route: "/climb-notes" as const },
  { href: "/canopy", label: "Canopy", route: "/canopy" as const },
] as const;

const footerNavItems = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#features", label: "Service" },
  { href: "/climb-notes", label: "Climb Notes", route: "/climb-notes" as const },
  { href: "/canopy", label: "Canopy", route: "/canopy" as const },
  { href: "#contacts", label: "Contact" },
  { href: "/corporate", label: "Corporate", route: "/corporate" as const },
] as const;

const slideWords = [
  "Grok Build",
  "Imagine",
  "Voice",
  "Agents",
  "Skills",
  "Connectors",
] as const;

const features = [
  {
    title: "AI Strategy",
    text: "Sharp use cases, clear metrics, path from pilot to production.",
  },
  {
    title: "Product Build",
    text: "Full-stack artificial intelligence apps that fit real workflows and real users.",
  },
  {
    title: "Model Systems",
    text: "Retrieval, evals, guardrails, and monitoring that hold up.",
  },
  {
    title: "Trust and Safety",
    text: "Privacy, reliability, and human checkpoints where it matters.",
  },
  {
    title: "Automation",
    text: "Agents and workflows with clear handoffs—not black boxes.",
  },
  {
    title: "Delivery",
    text: "Climb Notes structure: capture, build, ship, measure.",
  },
] as const;

const VOICE_URL = "https://grok.x.ai/";

export function InbioPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = window.setInterval(() => {
      setSlideIndex((i) => (i + 1) % slideWords.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="template-color-1 spybody ac-inbio" data-spy="scroll">
      <header
        className={`rn-header haeder-default black-logo-version header--fixed header--sticky${scrolled || menuOpen ? " sticky" : ""}`}
      >
        <div className="header-wrapper m--0 row align-items-center">
          <div className="col-lg-3 col-6">
            <div className="header-left">
              <div className="logo">
                <a href="#home" onClick={() => setMenuOpen(false)}>
                  <Logo className="acornsoft-logo" />
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-9 col-6">
            <div className="header-center">
              <nav
                id="sideNav"
                className="mainmenu-nav navbar-example2 d-none d-xl-block onepagenav"
              >
                <ul className="primary-menu nav nav-pills">
                  {navItems.map((item) => (
                    <li className="nav-item" key={item.href}>
                      {"route" in item && item.route === "/climb-notes" ? (
                        <Link className="nav-link cn-nav-link" to="/climb-notes">
                          <ClimbNotesMark />
                        </Link>
                      ) : "route" in item && item.route === "/canopy" ? (
                        <Link className="nav-link" to="/canopy">
                          Canopy
                        </Link>
                      ) : "route" in item && item.route === "/corporate" ? (
                        <Link className="nav-link" to="/corporate">
                          Corporate
                        </Link>
                      ) : (
                        <a className="nav-link" href={item.href}>
                          {item.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="header-right">
                <a
                  className="rn-btn d-none d-md-inline-flex"
                  href={VOICE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Voice</span>
                </a>
                <button
                  type="button"
                  className="ac-menu-text d-xl-none"
                  aria-expanded={menuOpen}
                  aria-controls="ac-mobile-panel"
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  {menuOpen ? "Close" : "Menu"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div
        id="ac-mobile-panel"
        className={`popup-mobile-menu${menuOpen ? " menu-open" : ""}`}
      >
        <div className="inner">
          <div className="menu-top">
            <div className="menu-header">
              <a className="logo" href="#home" onClick={() => setMenuOpen(false)}>
                <Logo className="acornsoft-logo" />
              </a>
              <div className="close-button">
                <button
                  type="button"
                  className="close-menu-activation close ac-menu-text"
                  onClick={() => setMenuOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
            <p className="discription">
              Building Production AI Solutions via Climb Notes™. Reach us via
              VOICE.
            </p>
          </div>
          <div className="content">
            <ul className="primary-menu">
              {navItems.map((item) => (
                <li key={item.href}>
                  {"route" in item && item.route === "/climb-notes" ? (
                    <Link
                      className="nav-link cn-nav-link"
                      to="/climb-notes"
                      onClick={() => setMenuOpen(false)}
                    >
                      <ClimbNotesMark />
                    </Link>
                  ) : "route" in item && item.route === "/canopy" ? (
                    <Link
                      className="nav-link"
                      to="/canopy"
                      onClick={() => setMenuOpen(false)}
                    >
                      Canopy
                    </Link>
                  ) : (
                    <a
                      className="nav-link"
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
              <li>
                <a
                  className="nav-link"
                  href={VOICE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                >
                  Voice
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <main className="main-page-wrapper">
        <div
          id="home"
          className="rn-slider-area ac-home-hero"
          style={{
            backgroundImage: "url(/hero.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="slide slider-style-1 ac-hero-center">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-11 col-12">
                  <div className="content text-center">
                    <div className="inner ac-hero-inner">
                      <h1 className="title hero-title">
                        Building Production AI Solutions via Climb Notes™
                      </h1>
                      <div className="hero-sub">
                        <span className="hero-with">with</span>
                        <span
                          className="cd-words-wrapper hero-slide"
                          aria-live="polite"
                        >
                          {slideWords.map((word, i) => (
                            <b
                              key={word}
                              className={
                                i === slideIndex
                                  ? "is-visible is-sliding"
                                  : "is-hidden"
                              }
                            >
                              {word.toUpperCase()}
                            </b>
                          ))}
                        </span>
                      </div>
                      <p className="description ac-hero-desc">
                        Production artificial intelligence systems for teams that need more than a
                        demo—strategy, build, and reliable delivery.
                      </p>
                      <div className="ac-hero-cta">
                        <a className="rn-btn" href="#features">
                          <span>Explore services</span>
                        </a>
                        <a
                          className="rn-btn ac-btn-outline"
                          href={VOICE_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>Talk via Voice</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rn-about-area about-style-1 rn-section-gap" id="about">
          <div className="container">
            <div className="row row--30 align-items-center">
              <div className="col-lg-5">
                <div className="thumbnail">
                  <img className="w-100" src="/hero.jpg" alt="Acornsoft" />
                </div>
              </div>
              <div className="col-lg-7 mt_md--40 mt_sm--40">
                <div className="content">
                  <div className="section-title">
                    <span className="subtitle">About</span>
                    <h2 className="title">We Are Acornsoft</h2>
                  </div>
                  <p className="discription">
                    Acornsoft is a New York studio that builds production
                    artificial intelligence systems via Climb Notes™. Our software
                    has to work under real load, with real users, and under real
                    rules.
                  </p>
                  <p className="discription">
                    We start from first principles: keep what is true and
                    measurable, drop what is not. Failure is how we succeed. We
                    are always trying to improve. Small starts. Strong roots.
                  </p>
                  <a className="rn-btn" href="#vision">
                    <span>Vision and Charter</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="rn-section-gap ac-vision-section"
          id="vision"
          aria-labelledby="vision-heading"
        >
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-title text-center">
                  <span className="subtitle">First Principles</span>
                  <h2 className="title" id="vision-heading">
                    Vision, Beliefs, and Charter
                  </h2>
                  <p className="description">
                    Clear rules for what we build, what we refuse, and how we
                    ship. We use tools such as Grok Build, Imagine, and Voice.
                    We are independent builders—not spokespeople for Tesla,
                    SpaceX, X, or SpaceXAI.
                  </p>
                </div>
              </div>
            </div>

            <div className="row row--25 mt--40">
              <div className="col-lg-6 col-md-6 col-12 mt--30">
                <article className="ac-vision-card">
                  <h3 className="ac-vision-card-title">Company Vision</h3>
                  <p>
                    Artificial intelligence should run like durable
                    infrastructure—not a demo that breaks under traffic, audit,
                    or edge cases. Acornsoft helps teams climb from prototype to
                    production with Climb Notes: a clear problem, a clear
                    metric, a thin slice that works, then make it strong.
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
                    builders. Tesla, SpaceX, X, and SpaceXAI marks stay theirs.
                    We do not speak for them. We put energy into Climb Notes™ and
                    tools that make hard problems real under load—on Earth first.
                  </p>
                </article>
              </div>
              <div className="col-lg-6 col-md-6 col-12 mt--30">
                <article className="ac-vision-card">
                  <h3 className="ac-vision-card-title">
                    First Principles Approach
                  </h3>
                  <ol className="ac-vision-list ac-vision-list-ordered">
                    <li>
                      <strong>Climb Notes™ are our energy.</strong> The difference
                      maker is not a model alone—it is the written climb:
                      problem, measure, slice, lesson. That energy compounds.
                      Tools without notes fade.
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
                      <strong>Build the smallest system that can learn.</strong>
                      Prefer something you can measure, fail safely, and improve
                      in front of the team that owns it. Capture the climb in
                      Climb Notes.
                    </li>
                    <li>
                      <strong>Check assumptions again in production.</strong>
                      Live systems change the problem. First principles is a
                      loop, not a one-time slide. Update the note when reality
                      moves.
                    </li>
                    <li>
                      <strong>Treat failure as tuition.</strong> A miss maps the
                      real problem. Write it into Climb Notes™. We succeed by
                      learning fast—not by pretending we never miss.
                    </li>
                  </ol>
                </article>
              </div>
            </div>

            <div className="row row--25">
              <div className="col-lg-12 col-12 mt--30">
                <article className="ac-vision-card ac-vision-card-wide">
                  <h3 className="ac-vision-card-title">Core Beliefs</h3>
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
                      sources. Climb Notes™ and Our Work on Canopy favor
                      evidence over story.
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
                      <strong>Mars-facing ambition, Earth-proven systems.</strong>{" "}
                      We share the vision of a multiplanetary future with Elon
                      Musk’s direction for SpaceX and the wider stack—while
                      shipping software that works here and now.
                    </li>
                  </ul>
                </article>
              </div>
            </div>

            <div className="row row--25">
              <div className="col-lg-12 col-12 mt--30">
                <article className="ac-vision-card ac-vision-card-charter">
                  <h3 className="ac-vision-card-title">Acornsoft Charter</h3>
                  <p className="ac-charter-lede">
                    First principles. Few rules. Hold them when it is hard.
                  </p>
                  <ol className="ac-vision-list ac-vision-list-ordered ac-charter-list">
                    <li>Define success before you build.</li>
                    <li>Keep only what the problem requires.</li>
                    <li>Make it safe, private, and operable—or refuse it.</li>
                    <li>Write assumptions. Write failures. Improve the next slice.</li>
                    <li>People stay accountable. Machines do not own risk.</li>
                    <li>Contact is Voice. No form theater.</li>
                    <li>Name other brands honestly. Never claim their voice.</li>
                    <li>When evidence contradicts you, change.</li>
                  </ol>
                  <div className="ac-hero-cta" style={{ marginTop: 20 }}>
                    <a className="rn-btn" href="#features">
                      <span>Explore Services</span>
                    </a>
                    <a
                      className="rn-btn ac-btn-outline"
                      href={VOICE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>Talk via Voice</span>
                    </a>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>

        <div
          className="rn-section-gap ac-adr-section"
          id="climb-note-001"
        >
          <div className="container">
            <div className="row align-items-start">
              <div className="col-lg-7">
                <div className="section-title">
                  <span className="subtitle">Climb Notes™ · energy</span>
                  <h2 className="title">Climb Note 001</h2>
                  <p className="description ac-cn-note-meta">
                    Advanced Development — Climb Note 001, stored on this site.
                    This home block is a spotlight. Full note: Climb Notes™. X is
                    optional citation only.
                  </p>
                </div>
                <article className="ac-climb-note-card">
                  <h3 className="ac-cn-field-label">Problem</h3>
                  <p>
                    Research in public is usually a thread or a demo. It rarely
                    leaves a climb: problem, measure, slice, lesson. Without
                    that energy, tools fade.
                  </p>
                  <h3 className="ac-cn-field-label">Measure</h3>
                  <p>
                    A reader can open a small usable tool, see claims next to
                    sources, and follow the trail on X and Canopy without us
                    speaking for SpaceXAI or any other company.
                  </p>
                  <h3 className="ac-cn-field-label">Slice</h3>
                  <p>
                    Advanced Development: first-principles research in the open
                    with Grok Build, Imagine, and Voice. Live example—the
                    Unofficial COVID Report: primary documents, color-coded
                    claims, year and theme filters. Standouts on Canopy under
                    Advanced Development.
                  </p>
                  <h3 className="ac-cn-field-label">Lesson</h3>
                  <p>
                    Climb Notes™ are our energy. The difference maker is the
                    written climb, not the model alone. Failure is tuition—write
                    it down, improve the next slice. The record is the boss.
                  </p>
                </article>
                <div className="ac-hero-cta" style={{ marginTop: 20 }}>
                  <Link className="rn-btn" to="/climb-notes">
                    <span>Open stored Climb Notes™</span>
                  </Link>
                  <Link className="rn-btn ac-btn-outline" to="/canopy">
                    <span>See Canopy standouts</span>
                  </Link>
                </div>
              </div>
              <div className="col-lg-5 mt_md--40 mt_sm--40">
                <div className="ac-cn-how">
                  <h3 className="ac-cn-how-title">Stored on this site</h3>
                  <ol className="ac-cn-how-list">
                    <li>
                      <strong>Source of truth:</strong> Climb Notes™ are written
                      and kept on this site (
                      <code>/climb-notes#cn-001</code>).
                    </li>
                    <li>
                      <strong>This card</strong> is a home spotlight of Note
                      001. The full stored note is on Climb Notes™.
                    </li>
                    <li>
                      <strong>Optional:</strong> cite on X with a short post that
                      links back to the site note—not a second archive.
                    </li>
                    <li>
                      When you no longer want this spotlight, say so and we
                      remove the home block only. The Climb Notes™ entry stays.
                    </li>
                  </ol>
                  <p className="ac-cn-how-foot">
                    X amplifies. The site stores the climb.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rn-service-area rn-section-gap" id="features">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-title text-center">
                  <span className="subtitle">Services</span>
                  <h2 className="title">What we deliver</h2>
                  <p className="description">
                    Modular engagements—from a focused prototype to a full
                    production program.
                  </p>
                </div>
              </div>
            </div>
            <div className="row row--25 mt_md--10 mt_sm--10">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className="col-lg-4 col-md-6 col-sm-12 col-12 mt--50 mt_md--30 mt_sm--30"
                >
                  <div className="rn-service">
                    <div className="inner">
                      <div className="content">
                        <h4 className="title">
                          <span className="ac-feat-num">
                            {String(i + 1).padStart(2, "0")}
                          </span>{" "}
                          {f.title}
                        </h4>
                        <p className="description">{f.text}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rn-blog-area rn-section-gap" id="climb-notes">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-title text-center">
                  <span className="subtitle">Two distinct surfaces</span>
                  <h2 className="title">Journal and radar</h2>
                </div>
              </div>
            </div>
            <div className="row row--25 mt--30">
              <div className="col-lg-6 col-md-6 col-12 mt--30">
                <div className="rn-blog">
                  <div className="inner">
                    <div className="content">
                      <div className="category-info">
                        <div className="category-list">
                          <span>Studio journal</span>
                        </div>
                      </div>
                      <h4 className="title">
                        <ClimbNotesMark />
                      </h4>
                      <p className="description">
                        Acornsoft’s field journal—how we scope, ship, and harden
                        production AI. Climb and Notes always travel together.
                      </p>
                      <Link className="rn-btn" to="/climb-notes" style={{ marginTop: 16 }}>
                        <span>Open Climb Notes™</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-12 mt--30">
                <div className="rn-blog">
                  <div className="inner">
                    <div className="content">
                      <div className="category-info">
                        <div className="category-list">
                          <span>Grok · SpaceXAI radar</span>
                        </div>
                      </div>
                      <h4 className="title">Canopy</h4>
                      <p className="description">
                        Acornsoft’s high perch on Grok and SpaceXAI—animated timeline
                        from founding day through the latest X feednotes.
                      </p>
                      <Link className="rn-btn" to="/canopy" style={{ marginTop: 16 }}>
                        <span>Open Canopy</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rn-contact-area rn-section-gap" id="contacts">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-title text-center">
                  <span className="subtitle">Contact</span>
                  <h2 className="title">Reach Acornsoft via Voice</h2>
                  <p className="description">
                    VOICE is how you reach Acornsoft. Open a conversation, ask
                    for Acornsoft, and share what you are building—we will
                    respond with fit, timing, and next steps.
                  </p>
                </div>
              </div>
            </div>
            <div className="row row--25 mt--40 justify-content-center">
              <div className="col-lg-8 col-md-10 col-12 mt--30">
                <div className="rn-address text-center ac-voice-card">
                  <div className="inner">
                    <h4 className="title">Voice</h4>
                    <p className="description">
                      Start a conversation on VOICE to connect with Acornsoft.
                      We handle first response and project intake there.
                    </p>
                    <a
                      className="rn-btn"
                      href={VOICE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginTop: 20 }}
                    >
                      <span>Open Voice</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="rn-footer-area rn-section-gap">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="footer-area text-center">
                  <div className="logo">
                    <Logo className="acornsoft-logo ac-footer-logo" />
                  </div>
                  <ul className="ac-footer-nav">
                    {footerNavItems.map((item) => (
                      <li key={item.href}>
                        {"route" in item && item.route === "/climb-notes" ? (
                          <Link to="/climb-notes">
                            <ClimbNotesMark />
                          </Link>
                        ) : "route" in item && item.route === "/canopy" ? (
                          <Link to="/canopy">Canopy</Link>
                        ) : "route" in item && item.route === "/corporate" ? (
                          <Link to="/corporate" className="ac-corp-foot-link">
                            Corporate
                          </Link>
                        ) : (
                          <a href={item.href}>{item.label}</a>
                        )}
                      </li>
                    ))}
                  </ul>
                                    <p className="description mt--20">
                    © {new Date().getFullYear()} Acornsoft. Reach us via{" "}
                    <a
                      href={VOICE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Voice
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
