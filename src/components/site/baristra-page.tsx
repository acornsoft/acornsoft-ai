import { useEffect, useMemo, useState } from "react";
import { Logo } from "./logo";

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#service", label: "Service" },
  { href: "#blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
] as const;

/** Hero words that slide/fade in (gold, UPPERCASE in UI) */
const slideWords = [
  "Grok Build",
  "Imagine",
  "Voice",
  "Agents",
  "Skills",
  "Connectors",
] as const;

const loveCards = [
  {
    icon: "fa-lightbulb-o",
    title: "AI Strategy",
    text: "Sharp use cases, clear metrics, path from pilot to production.",
  },
  {
    icon: "fa-cogs",
    title: "Product Build",
    text: "Full-stack AI apps that fit real workflows and real users.",
  },
  {
    icon: "fa-line-chart",
    title: "Model Systems",
    text: "Retrieval, evals, guardrails, and monitoring that hold up.",
  },
  {
    icon: "fa-shield",
    title: "Trust & Safety",
    text: "Privacy, reliability, and human checkpoints where it matters.",
  },
] as const;

const stats = [
  { icon: "fa-rocket", value: 48, label: "AI systems shipped" },
  { icon: "fa-bolt", value: 12, label: "M predictions / mo" },
  { icon: "fa-users", value: 96, label: "% client retention" },
  { icon: "fa-coffee", value: 3, label: "wk prototype cycle" },
] as const;

const skillsLeft = [
  { name: "LLM applications", level: 94, cls: "Web" },
  { name: "Systems design", level: 90, cls: "Graphics" },
  { name: "Data pipelines", level: 86, cls: "Developing" },
] as const;

const skillsRight = [
  { name: "Product design", level: 88, cls: "Photoshop" },
  { name: "Evaluation & QA", level: 92, cls: "Photography" },
  { name: "Cloud & DevOps", level: 85, cls: "Bloging" },
] as const;

const services = [
  {
    icon: "fa-html5",
    title: "AI product strategy",
    text: "Find the highest-leverage use cases and define success metrics.",
  },
  {
    icon: "fa-paint-brush",
    title: "Custom AI applications",
    text: "Ship production software that embeds models into workflows.",
  },
  {
    icon: "fa-sliders",
    title: "Model engineering",
    text: "Retrieval, fine-tuning, eval harnesses, and guardrails.",
  },
  {
    icon: "fa-envelope-o",
    title: "Automation & agents",
    text: "Multi-step agents with human checkpoints built in.",
  },
  {
    icon: "fa-life-ring",
    title: "Analytics & insight",
    text: "Turn unstructured data into decisions your team trusts.",
  },
  {
    icon: "fa-cubes",
    title: "Reliability & support",
    text: "Monitoring, fallbacks, and ongoing partnership.",
  },
] as const;

const faqs = [
  {
    q: "What kinds of AI projects do you take on?",
    a: "Applied AI products—assistants, automation, analytics, and model-powered features inside real business workflows.",
  },
  {
    q: "How quickly can we start?",
    a: "Most work starts with a short discovery sprint. Clear scope usually means a pod within two weeks.",
  },
  {
    q: "What is Climb Notes?",
    a: "Climb Notes is how we deliver production AI solutions—structured capture, build, and rollout so teams get systems they can run, not one-off demos.",
  },
  {
    q: "How do you handle data privacy?",
    a: "Least privilege by design, isolated environments, NDAs/DPAs when needed. Your data is never our training corpus.",
  },
] as const;

const portfolio = [
  {
    id: "1",
    cat: "web",
    title: "Atlas Research Desk",
    img: "/baristra/img/portfolios/web/1.jpg",
  },
  {
    id: "2",
    cat: "graphics",
    title: "Hearth Support Copilot",
    img: "/baristra/img/portfolios/graphics/1.jpg",
  },
  {
    id: "3",
    cat: "development",
    title: "Ledger Insights",
    img: "/baristra/img/portfolios/development/1.jpg",
  },
  {
    id: "4",
    cat: "photography",
    title: "Northbound Onboarding",
    img: "/baristra/img/portfolios/photography/1.jpg",
  },
  {
    id: "5",
    cat: "web",
    title: "Signal Review",
    img: "/baristra/img/portfolios/web/2.jpg",
  },
  {
    id: "6",
    cat: "development",
    title: "Forge Knowledge Base",
    img: "/baristra/img/portfolios/development/2.jpg",
  },
  {
    id: "7",
    cat: "graphics",
    title: "Brightfield Ops",
    img: "/baristra/img/portfolios/graphics/2.jpg",
  },
  {
    id: "8",
    cat: "photography",
    title: "Kite Labs Studio",
    img: "/baristra/img/portfolios/photography/2.jpg",
  },
] as const;

const filters = [
  { key: "all", label: "All" },
  { key: "web", label: "Product" },
  { key: "graphics", label: "Automation" },
  { key: "development", label: "Analytics" },
  { key: "photography", label: "Safety" },
] as const;

const team = [
  {
    name: "Avery Chen",
    role: "Founder & CEO",
    img: "/baristra/img/team1.jpg",
  },
  {
    name: "Jordan Miles",
    role: "Head of Engineering",
    img: "/baristra/img/team2.jpg",
  },
  {
    name: "Samira Patel",
    role: "Design Director",
    img: "/baristra/img/team3.jpg",
  },
  {
    name: "Noah Brooks",
    role: "Applied Research",
    img: "/baristra/img/team4.jpg",
  },
] as const;

const plans = [
  {
    price: "$4.8k",
    name: "Spark",
    features: [
      "Discovery workshop",
      "Working prototype",
      "Success metrics plan",
      "2 weeks of support",
      "Async Slack access",
    ],
  },
  {
    price: "$12.5k",
    name: "Growth",
    features: [
      "Dedicated pod",
      "Product + eng + design",
      "Eval & monitoring setup",
      "Weekly demos",
      "Priority support",
    ],
  },
  {
    price: "Custom",
    name: "Enterprise",
    features: [
      "Multiple workstreams",
      "Security & compliance",
      "On-call reliability",
      "Team training",
      "Custom SLAs",
    ],
  },
] as const;

const testimonials = [
  {
    quote:
      "Acornsoft turned a vague AI wishlist into a system our support team uses every day. Clear thinking, clean delivery.",
    name: "Elena Vargas",
    title: "VP Customer Ops, Northline",
    img: "/baristra/img/client1.jpg",
  },
  {
    quote:
      "They treat evaluation as seriously as demos. Our board finally trusts the numbers behind the product.",
    name: "Marcus Hale",
    title: "CTO, Brightfield",
    img: "/baristra/img/client2.jpg",
  },
  {
    quote:
      "Fast without being reckless. We shipped a research copilot in six weeks that still holds up a year later.",
    name: "Priya Nair",
    title: "Head of Product, Kite Labs",
    img: "/baristra/img/client3.jpg",
  },
] as const;

const posts = [
  {
    date: "10 Jan 2026",
    title: "What “production AI” actually means",
    img: "/baristra/img/blog1.jpg",
    excerpt:
      "Demos are easy. Durable systems need evals, fallbacks, and a clear owner for model behavior.",
  },
  {
    date: "21 Feb 2026",
    title: "How we scope a two-week prototype",
    img: "/baristra/img/blog2.jpg",
    excerpt:
      "Pick one workflow, one success metric, and ship a vertical slice your team can judge honestly.",
  },
  {
    date: "13 Mar 2026",
    title: "Agents with human checkpoints",
    img: "/baristra/img/blog3.jpg",
    excerpt:
      "Autonomy is useful until it is not. Design the handoff points before you scale the agent.",
  },
] as const;

function useCountUp(target: number) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1200);
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return value;
}

export function BaristraPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("all");
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [faqOpen, setFaqOpen] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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

  const items = useMemo(() => {
    if (filter === "all") return portfolio;
    return portfolio.filter((p) => p.cat === filter);
  }, [filter]);

  return (
    <>
      <div className="menubar">
        <div className="menubar-content">
          <nav
            className={`navbar navbar-default navbar-fixed-top${scrolled || menuOpen ? " small" : ""}`}
          >
            <div className="site-title acornsoft-logo-corner">
              <a href="#home" onClick={() => setMenuOpen(false)}>
                <Logo className="acornsoft-logo" />
              </a>
            </div>

            <div className="container">
              <div className="row">
                <div className="navbar-header">
                  <button
                    type="button"
                    className={`navbar-toggle${menuOpen ? "" : " collapsed"}`}
                    aria-expanded={menuOpen}
                    aria-label="Toggle navigation"
                    onClick={() => setMenuOpen((v) => !v)}
                  >
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                  </button>
                </div>
                <div className="col-md-12 col-sm-12 navbar-style">
                  <div
                    className={`collapse navbar-collapse${menuOpen ? " ac-open in" : ""}`}
                    id="bs-example-navbar-collapse-1"
                  >
                    <ul className="nav navbar-nav">
                      {navItems.map((item, i) => (
                        <li key={item.href}>
                          <a
                            href={item.href}
                            className={i === 0 ? "active" : undefined}
                            onClick={() => setMenuOpen(false)}
                          >
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>

      <div className="main-page-content">
        <div id="home">
          <div id="particles-js" />
          <div className="home-content-main">
            <div className="table-cell">
              <div className="container">
                <div className="row home-row">
                  <div className="col-md-12 col-sm-12">
                    <div className="home-text text-center">
                      <h1 className="cd-headline clip is-full-width hero-title">
                        Building Production AI Solutions via Climb Notes
                      </h1>
                      <h3 className="hero-sub">
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
                      </h3>
                      <div className="about-social-icon text-center">
                        <ul className="about-social">
                          {[
                            "fa-twitter",
                            "fa-linkedin",
                            "fa-github",
                            "fa-envelope",
                          ].map((icon) => (
                            <li key={icon}>
                              <a href="#contact" aria-label={icon}>
                                <i className={`fa ${icon}`} aria-hidden="true" />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="about">
          <div className="about-content">
            <div className="love-grid text-left">
              <div className="container">
                <div className="row love-row">
                  {loveCards.map((card) => (
                    <div key={card.title} className="col-md-3 col-sm-6 no-padding">
                      <div className="love-details">
                        <i
                          className={`fa ${card.icon} love-icon`}
                          aria-hidden="true"
                        />
                        <h3>{card.title}</h3>
                        <div className="underline1 no-margin white" />
                        <div className="underline2 no-margin white" />
                        <p>{card.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="me-grid">
              <div className="container">
                <div className="row">
                  <div className="col-md-6 col-sm-6 col-xs-12 about-col">
                    <div className="about-image">
                      <img
                        src="/hero.jpg"
                        alt="Acornsoft"
                        className="about-img"
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-6 col-xs-12 about-col">
                    <div className="about-details">
                      <h3>We Are Acornsoft</h3>
                      <div className="underline1 no-margin" />
                      <div className="underline2 no-margin" />
                      <p className="text-2">
                        Acornsoft is a New York–based AI-first organization. We

                        deliver production AI solutions via Climb Notes—software
                        that holds up under real load, real users, and real
                        compliance constraints.
                      </p>
                      <p className="text-2">
                        Our approach is practical: pick a sharp problem, measure
                        what good looks like, ship a thin vertical slice, then
                        harden it. Small starts. Strong roots.
                      </p>
                      <a className="about-link-1" href="#service">
                        Learn more
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="work-counter text-left">
              <div id="counter">
                <div className="container">
                  <div className="row">
                    {stats.map((s) => (
                      <Stat
                        key={s.label}
                        icon={s.icon}
                        value={s.value}
                        label={s.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="skill">
          <div className="skill-main">
            <div className="container">
              <div className="row skill-row">
                <div className="col-md-6 col-sm-6 col-xs-12 about-col">
                  <div className="about-image">
                    <img
                      src="/baristra/img/skill.jpg"
                      alt=""
                      className="about-img"
                    />
                  </div>
                </div>
                <div className="col-md-6 col-sm-6">
                  <div className="skill-text text-left">
                    <h3>Our skill</h3>
                    <div className="underline1 no-margin" />
                    <div className="underline2 no-margin" />
                    <p className="text-2">
                      Product craft and serious engineering move together—so
                      models, data, and interfaces ship as one system instead of
                      parallel experiments.
                    </p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="skill-details">
                    <div className="content">
                      <div className="col">
                        <ul id="skill-main-left">
                          {skillsLeft.map((s) => (
                            <li key={s.name}>
                              <h3>
                                {s.name}-{s.level}%
                              </h3>
                              <span
                                className={`expand ${s.cls}`}
                                style={{ width: `${s.level}%` }}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="skill-details">
                    <div className="content">
                      <div className="col">
                        <ul id="skill-main-right">
                          {skillsRight.map((s) => (
                            <li key={s.name}>
                              <h3>
                                {s.name}-{s.level}%
                              </h3>
                              <span
                                className={`expand ${s.cls}`}
                                style={{ width: `${s.level}%` }}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="service">
          <div className="service-content">
            <div className="service-grid text-left">
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <div className="main-title text-center">
                      <h3>Our Service</h3>
                      <div className="underline1" />
                      <div className="underline2" />
                      <p>
                        Modular engagements that stack—from a sharp prototype to
                        a full production program.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row service-row">
                  {services.map((s) => (
                    <div key={s.title} className="col-md-4 col-sm-6">
                      <div className="service-details">
                        <div className="service-icon">
                          <i className={`fa ${s.icon}`} aria-hidden="true" />
                        </div>
                        <h3>{s.title}</h3>
                        <div className="underline1 no-margin" />
                        <div className="underline2 no-margin" />
                        <p>{s.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="service-grid-2">
              <div className="container">
                <div className="row">
                  <div className="col-md-5 col-sm-12">
                    <div className="service-image">
                      <img
                        src="/baristra/img/service.jpg"
                        alt=""
                        className="img-responsive"
                      />
                    </div>
                  </div>
                  <div className="col-md-7 col-sm-12">
                    <div className="service-details-2">
                      <h3>Faqs About Us</h3>
                      <div className="underline1 no-margin" />
                      <div className="underline2 no-margin" />
                      <div className="panel-group" id="accordion" role="tablist">
                        {faqs.map((f, i) => (
                          <div className="panel panel-default" key={f.q}>
                            <div className="panel-heading" role="tab">
                              <h4 className="panel-title">
                                <a
                                  role="button"
                                  href={`#faq-${i}`}
                                  aria-expanded={faqOpen === i}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setFaqOpen((cur) => (cur === i ? -1 : i));
                                  }}
                                >
                                  {f.q}
                                </a>
                              </h4>
                            </div>
                            {faqOpen === i ? (
                              <div className="panel-collapse collapse in">
                                <div className="panel-body">{f.a}</div>
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="work" hidden aria-hidden="true" />
        <div id="team" hidden aria-hidden="true" />
        <div id="pricing" hidden aria-hidden="true" />
        <div id="testimonial" hidden aria-hidden="true" />

        <div id="blog">
          <div className="blog-content">
            <div className="blog-grid">
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <div className="main-title text-center">
                      <h3>Our Blog</h3>
                      <div className="underline1" />
                      <div className="underline2" />
                      <p>
                        Notes on shipping applied AI with clarity and care.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row blog-row">
                  {posts.map((post) => (
                    <div key={post.title} className="col-md-4 col-sm-6">
                      <div className="blog-details">
                        <div className="blog-image">
                          <img
                            src={post.img}
                            alt=""
                            className="img-responsive"
                          />
                          <div className="blog-date">
                            <h4>{post.date}</h4>
                            <h3>{post.title}</h3>
                          </div>
                        </div>
                        <div className="blog-text">
                          <p>
                            <i className="fa fa-user" aria-hidden="true" />{" "}
                            Admin
                          </p>
                          <p>{post.excerpt}</p>
                          <a href="#contact" className="blog-link">
                            Read more
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="contact">
          <div className="contact-content">
            <div className="contact-grid">
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <div className="main-title text-center">
                      <h3>Contact</h3>
                      <div className="underline1" />
                      <div className="underline2" />
                      <p>
                        Tell us what you are building. We will reply with fit,
                        timing, and next steps.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row contact-cards">
                  <div className="col-md-4 col-sm-4">
                    <div className="contact-info text-center">
                      <i className="fa fa-envelope" aria-hidden="true" />
                      <h4>Email</h4>
                      <p>
                        <a href="mailto:hello@acornsoft.ai">
                          hello@acornsoft.ai
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-4">
                    <div className="contact-info text-center">
                      <i className="fa fa-phone" aria-hidden="true" />
                      <h4>Phone</h4>
                      <p>
                        <a href="tel:+12125550148">+1 (212) 555-0148</a>
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-4">
                    <div className="contact-info text-center">
                      <i className="fa fa-map-marker" aria-hidden="true" />
                      <h4>Location</h4>
                      <p>New York, NY</p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div
                    className="col-md-12 text-center"
                    style={{ marginTop: 28 }}
                  >
                    <a
                      className="about-link-1"
                      href="mailto:hello@acornsoft.ai"
                    >
                      Email Acornsoft
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="copyright-details">
              <div className="container">
                <div className="row">
                  <div className="col-md-12 text-center">
                    <div className="copyright">
                      <h3>
                        © {new Date().getFullYear()} Acornsoft. All rights
                        reserved.
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: string;
  value: number;
  label: string;
}) {
  const n = useCountUp(value);
  return (
    <div className="col-md-3 col-sm-3">
      <div className="work-statistics text-center">
        <i className={`fa ${icon} stat-icon`} aria-hidden="true" />
        <h3 className="Count">{n}</h3>
        <div className="underline1 white" />
        <div className="underline2 white" />
        <p>{label}</p>
      </div>
    </div>
  );
}
