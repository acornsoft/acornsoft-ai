import { Link } from "@tanstack/react-router";
import { SiteHeader } from "./site-chrome";
import { ClimbNotesMark } from "./climb-notes-mark";
import { VoiceLink, useVoiceAccessState } from "./voice-access";
import { SignedIn } from "@/lib/auth/gates";

const sections = [
  { id: "identity", label: "Identity" },
  { id: "independence", label: "Independence" },
  { id: "privacy", label: "Privacy" },
  { id: "policies", label: "Policies" },
  { id: "procedures", label: "Procedures" },
  { id: "terms", label: "Terms of use" },
  { id: "ai-disclaimer", label: "Artificial intelligence" },
  { id: "research", label: "Research" },
  { id: "trademarks", label: "Trademarks" },
  { id: "ip", label: "Intellectual property" },
  { id: "security", label: "Security" },
  { id: "communications", label: "Communications" },
] as const;

/**
 * Full corporate / ethos document.
 * Linked only from quiet page footers — not primary marketing nav.
 */
export function CorporatePage() {
  const voice = useVoiceAccessState();

  return (
    <div className="template-color-1 spybody ac-inbio ac-corporate-page ac-hero-stage">
      <SiteHeader loginRedirect="/gnomah" />

      <main className="main-page-wrapper ac-corporate-main">
        <section className="rn-section-gap ac-corporate-shell">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-title text-center ac-corporate-intro">
                  <span className="subtitle">Company documents</span>
                  <h1 className="title">Corporate</h1>
                  <p className="description">
                    First principles. Plain language. Not legal advice—policies
                    for how Acornsoft operates in public. Independent builders.
                    Multiplanetary ambition. Earth-proven systems.
                  </p>
                </div>
              </div>
            </div>

            <div className="row ac-corporate-layout">
              <div className="col-lg-8 col-md-7 col-12 ac-corporate-content">
                <article className="ac-corp-section" id="identity">
                  <h2>Identity</h2>
                  <p>
                    <strong>Acornsoft</strong> is a New York–based AI-first
                    organization. Public surfaces include this site, Climb Notes,
                    Canopy, and the X account @acornsoftai.
                    <SignedIn>
                      {" "}
                      The founder’s personal work biography, resume, and
                      enterprise portfolio live at{" "}
                      <a
                        href="https://blaszyk.us/"
                        target="_blank"
                        rel="noopener noreferrer me"
                      >
                        blaszyk.us
                      </a>
                      —a separate personal site, not this organization surface.
                    </SignedIn>


                  </p>
                  <p>
                    Contact for project and privacy questions:{" "}
                    {voice.allowed ? (
                      <VoiceLink>Voice</VoiceLink>
                    ) : (
                      <>
                        Voice (available after signing in with X on Climb Notes)
                      </>
                    )}
                    . No email forms. No phone queue theater.
                  </p>
                  <p>
                    If a formal legal entity name, registration number, or
                    mailing address is required for a contract, it will be stated
                    on the statement of work. Until then, “Acornsoft” is the
                    public trade name of the organization.

                  </p>
                </article>

                <article className="ac-corp-section" id="independence">
                  <h2>Independence and conflicts</h2>
                  <p>
                    Acornsoft is independent. It is not a product, partner, or
                    affiliate of Tesla, SpaceX, X, SpaceXAI, Accenture, Avanade,
                    Microsoft, or any client of those companies unless a written
                    agreement says otherwise.
                  </p>
                  <h3>Outside employment</h3>
                  <p>
                    The founder may hold other employment while Acornsoft is
                    built. Public Acornsoft work is intended to use personal time
                    and personal equipment, and not to use confidential
                    information, client data, or proprietary methods belonging to
                    any employer.
                  </p>
                  <h3>What we will not do</h3>
                  <ul>
                    <li>
                      Present Acornsoft work as work of an employer or client.
                    </li>
                    <li>
                      Use employer or client confidential information in Climb
                      Notes, Canopy, demos, or posts.
                    </li>
                    <li>
                      Claim endorsement by an employer, vendor, or platform.
                    </li>
                    <li>
                      Solicit an employer’s clients in violation of applicable
                      agreements.
                    </li>
                  </ul>
                  <h3>Conflict of interest</h3>
                  <p>
                    A conflict exists when personal interest could improperly
                    influence professional judgment—or appear to. Adjacent
                    services (production artificial intelligence for teams) can
                    create conflict even when an employer does not use a given
                    model vendor (for example Grok). Scope, IP, time, clients,
                    and disclosure rules of any employer still apply.
                  </p>
                  <p>
                    Before commercial offers or client work under Acornsoft, the
                    founder will complete required outside-activity review with
                    counsel and, where required, with the employer. Until that
                    path is clear, public materials emphasize research, journal,
                    and tooling—not undisclosed competitive engagement.
                  </p>
                  <p className="ac-corp-note">
                    This section is a public posture, not a waiver of any
                    employment agreement. Employment terms control where they
                    apply.
                  </p>
                </article>

                <article className="ac-corp-section" id="privacy">
                  <h2>Privacy</h2>
                  <p>
                    Acornsoft respects your privacy. This site does not use email
                    forms or phone queues. Conversations begin through Voice.
                  </p>
                  <h3>What we collect</h3>
                  <p>
                    Only what is needed to respond to inquiries and operate this
                    site: standard server logs, basic analytics that do not sell
                    personal data, and what you choose to share in a Voice
                    session.
                  </p>
                  <h3>What we do not do</h3>
                  <p>
                    We do not sell personal information. Do not send secrets,
                    regulated health data, credentials, or employer confidential
                    information through public Voice sessions or social posts.
                  </p>
                  <h3>Third parties</h3>
                  <p>
                    Voice, X, hosting, and analytics providers process data under
                    their own terms. We do not control those services.
                  </p>
                  <h3>Requests</h3>
                  <p>
                    For privacy questions or deletion requests about information
                    you shared with Acornsoft, reach us via Voice and request a
                    privacy follow-up.
                  </p>
                </article>

                <article className="ac-corp-section" id="policies">
                  <h2>Policies</h2>
                  <h3>Proper usage</h3>
                  <p>
                    Use Acornsoft materials, Climb Notes™, and Canopy for lawful,
                    professional purposes only. Do not misrepresent Acornsoft as
                    affiliated with, endorsed by, or speaking for third parties
                    listed under Trademarks.
                  </p>
                  <h3>Platform rules</h3>
                  <p>
                    Do not scrape, reverse engineer, or republish Canopy
                    feednotes in ways that violate third-party platform rules,
                    including X terms of service. Systems you build with Grok,
                    Grok Build, or related tools remain your responsibility for
                    safety, evaluation, access control, and compliance.
                  </p>
                  <h3>Marketing accuracy</h3>
                  <p>
                    We do not invent case studies or testimonials. “Production”
                    means systems intended to run under real load with owners and
                    measures—not a demo alone.
                  </p>
                  <h3>Multiplanetary ethos</h3>
                  <p>
                    We aim at a multiplanetary future, in the same direction as
                    Elon Musk’s work at SpaceX and the wider stack. Ambition and
                    curiosity—not partnership, employment, or endorsement. We
                    remain independent builders.
                  </p>
                </article>

                <article className="ac-corp-section" id="procedures">
                  <h2>Procedures</h2>
                  <p>Daily practice. Short on purpose.</p>
                  <h3>Start work</h3>
                  <ol>
                    <li>Define success in a measure the customer owns.</li>
                    <li>
                      Name constraints: data, speed, cost, risk, accountability.
                    </li>
                    <li>
                      Ship a thin Climb Notes slice that can fail safely and be
                      measured.
                    </li>
                    <li>
                      Write assumptions and known failure modes before production.
                    </li>
                  </ol>
                  <h3>Handle failure</h3>
                  <ol>
                    <li>Write the miss the same day.</li>
                    <li>Share it with the people who own the system.</li>
                    <li>Improve the next slice.</li>
                    <li>
                      Update Climb Notes when evidence contradicts prior methods.
                    </li>
                  </ol>
                  <h3>Intake</h3>
                  <p>
                    First contact is Voice. Luna and Ara are one and the same —
                    your Sherpa on Grok Voice (or your custom Acornsoft Grok
                    Voice when configured).
                  </p>
                  <h3>Credit others</h3>
                  <p>
                    Name tools and companies accurately. Never imply endorsement
                    without a written agreement.
                  </p>
                </article>

                <article className="ac-corp-section" id="terms">
                  <h2>Terms of use</h2>
                  <p>
                    By using this site, Climb Notes, Canopy, or related Acornsoft
                    materials, you agree to these terms. If you do not agree, do
                    not use them.
                  </p>
                  <h3>License</h3>
                  <p>
                    Content is provided for personal and internal evaluation. You
                    may not copy the site for commercial resale, scrape at scale,
                    or present our materials as your product without written
                    permission.
                  </p>
                  <h3>No professional advice</h3>
                  <p>
                    Nothing on this site is legal, medical, financial, or other
                    regulated professional advice. Research tools that place
                    claims next to sources are literacy aids—not determinations of
                    fact for any authority.
                  </p>
                  <h3>Acceptable use</h3>
                  <ul>
                    <li>No unlawful, harmful, or abusive use.</li>
                    <li>No attempts to break security or overload services.</li>
                    <li>
                      No upload of malware, secrets you do not own, or others’
                      personal data without a lawful basis.
                    </li>
                  </ul>
                  <h3>Disclaimers</h3>
                  <p>
                    Materials are provided “as is.” We disclaim warranties to the
                    fullest extent permitted by law, including merchantability and
                    fitness for a particular purpose.
                  </p>
                  <h3>Limitation of liability</h3>
                  <p>
                    To the fullest extent permitted by law, Acornsoft is not
                    liable for indirect, incidental, special, consequential, or
                    punitive damages, or for lost profits or data, arising from
                    use of the site or materials.
                  </p>
                  <h3>Governing law</h3>
                  <p>
                    These terms are governed by the laws of the State of New York,
                    excluding conflict-of-law rules, unless mandatory law says
                    otherwise. Venue for disputes lies in courts located in New
                    York, where permitted.
                  </p>
                  <h3>Changes</h3>
                  <p>
                    We may update these terms. The “Last updated” date at the
                    bottom of this page will change when we do.
                  </p>
                </article>

                <article className="ac-corp-section" id="ai-disclaimer">
                  <h2>Artificial intelligence systems</h2>
                  <p>
                    Acornsoft builds and writes about production artificial
                    intelligence systems. Models can be wrong, incomplete, or
                    biased.
                  </p>
                  <ul>
                    <li>
                      <strong>People stay accountable.</strong> Automation does
                      not own risk. Define human handoffs for money, access,
                      safety, and reputation.
                    </li>
                    <li>
                      <strong>No outcome guarantee.</strong> Benchmarks and demos
                      are not production behavior under load.
                    </li>
                    <li>
                      <strong>Evaluation is required.</strong> Measure what
                      matters before you scale.
                    </li>
                    <li>
                      <strong>High-risk uses.</strong> Do not rely on our demos or
                      generic guidance alone for medical diagnosis, legal advice,
                      credit, employment, or other regulated decisions.
                    </li>
                    <li>
                      <strong>Your data.</strong> Do not send secrets or regulated
                      data into public tools. Customer data handling in a paid
                      engagement is defined in that engagement’s statement of
                      work—not in marketing copy.
                    </li>
                  </ul>
                </article>

                <article className="ac-corp-section" id="research">
                  <h2>Research and Advanced Development</h2>
                  <p>
                    Advanced Development and Climb Notes may discuss public
                    claims, primary documents, and tools built with Grok Build.
                    Color labels (for example green, yellow, red) are editorial
                    aids for literacy—not legal, medical, or governmental
                    findings.
                  </p>
                  <p>
                    Public archives and report-style apps are for exploration and
                    education. Verify sources yourself. We may correct errors when
                    shown; failure is how we succeed—we write misses down and
                    improve.
                  </p>
                  <p>
                    Climb Notes published on X via @acornsoftai are studio
                    journal entries. They are not official statements of Tesla,
                    SpaceX, X, SpaceXAI, or any employer.
                  </p>
                </article>

                <article className="ac-corp-section" id="trademarks">
                  <h2>Trademarks and copyrights</h2>
                  <p>
                    All product and company names are trademarks or registered
                    trademarks of their respective owners. Use here is for
                    identification and commentary only.
                  </p>
                  <ul>
                    <li>
                      Tesla, Optimus, and related marks — Tesla, Incorporated.
                    </li>
                    <li>
                      SpaceX, Falcon, Starship, Starlink — Space Exploration
                      Technologies Corporation.
                    </li>
                    <li>X — X Corporation (or affiliates).</li>
                    <li>
                      Grok, Grok Build, SpaceXAI, xAI — SpaceXAI / X.AI
                      Corporation (or affiliates).
                    </li>
                    <li>
                      Accenture, Avanade, Microsoft — their respective owners.
                    </li>
                    <li>
                      <strong>Climb Notes™</strong> and <strong>Canopy</strong> —
                      trademarks of Acornsoft. Climb Notes is claimed as a mark
                      for studio methodology, journal, and related software
                      services. <strong>Acornsoft</strong> is a mark of the
                      studio.
                    </li>
                  </ul>
                  <p>
                    Copyright in third-party posts, images, and videos remains
                    with the original rights holders. Canopy feednotes point to
                    public sources; we do not claim ownership of that content.
                  </p>
                </article>

                <article className="ac-corp-section" id="ip">
                  <h2>Intellectual property</h2>
                  <p>
                    Subject to third-party rights and any employer IP terms that
                    may apply to the founder, Acornsoft claims rights in original
                    site design, original writing, Climb Notes authored for
                    Acornsoft, Canopy curation presentation, and original tools
                    we publish under the Acornsoft name.
                  </p>
                  <p>
                    Open-source components remain under their licenses. Templates
                    or libraries used in the stack retain their authors’ rights.
                  </p>
                  <p>
                    To report copyright concerns, reach us via Voice with
                    “copyright” in your request.
                  </p>
                </article>

                <article className="ac-corp-section" id="security">
                  <h2>Security</h2>
                  <p>
                    We aim for reasonable protective measures appropriate to a
                    small studio site. No method is perfect. Do not treat public
                    channels as secure for secrets.
                  </p>
                  <p>
                    If you believe you have found a security issue in an Acornsoft
                    property, contact us via Voice and describe it responsibly. Do
                    not exploit it.
                  </p>
                </article>

                <article className="ac-corp-section" id="communications">
                  <h2>Communications</h2>
                  <p>
                    @acornsoftai on X is the public trail for Climb Notes and
                    Advanced Development standouts. Canopy may surface those posts
                    next to third-party signals. None of that makes Acornsoft an
                    official channel for any other company.
                  </p>
                  <p>
                    Official intake for Acornsoft remains Voice. Social replies
                    are not a guaranteed support queue.
                  </p>
                </article>

                <p className="ac-corp-updated">
                  Last updated July 31, 2026. These documents may change as the
                  studio’s legal structure and outside-activity status change.
                  This page is not a substitute for legal counsel.
                </p>
              </div>

              <aside
                className="col-lg-4 col-md-5 col-12 ac-corporate-rail"
                aria-label="On this page"
              >
                <div className="ac-corp-quick">
                  <p className="ac-corp-quick-label">On this page</p>
                  <nav className="ac-corp-quick-nav">
                    {sections.map((s) => (
                      <a key={s.id} href={`#${s.id}`}>
                        {s.label}
                      </a>
                    ))}
                  </nav>
                  <Link className="ac-corp-quick-home" to="/">
                    ← Back to Home
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <div className="rn-footer-area ac-quiet-footer">
          <div className="container">
            <div className="footer-area text-center">
              <p className="ac-quiet-footer-line">
                <Link to="/">Home</Link>
                <span className="ac-quiet-sep">·</span>
                <Link to="/climb-notes">Climb Notes</Link>
                <span className="ac-quiet-sep">·</span>
                <Link to="/canopy">Canopy</Link>
                <span className="ac-quiet-sep">·</span>
                <Link to="/corporate" className="ac-corp-foot-link">
                  Corporate
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
