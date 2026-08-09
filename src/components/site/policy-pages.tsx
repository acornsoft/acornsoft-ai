import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { VoiceLink, useVoiceAccessState } from "./voice-access";
import { SiteHeader } from "./site-chrome";
import { ClimbNotesMark } from "./climb-notes-mark";


function PolicyChrome({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="template-color-1 spybody ac-inbio ac-hero-stage ac-policy-page">
      <SiteHeader loginRedirect="/gnomah" />

      <main className="main-page-wrapper ac-policy-main">
        <section className="rn-section-gap ac-policy-shell">
          <div className="container">
            <div className="section-title text-center">
              <span className="subtitle">{subtitle}</span>
              <h1 className="title">{title}</h1>
            </div>
            <div className="ac-policy-body">{children}</div>
            <div className="ac-policy-links">
              <Link to="/privacy">Privacy</Link>
              <Link to="/policies">Policies</Link>
              <Link to="/procedures">Procedures</Link>
              <Link to="/">Back to Home</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export function PrivacyPage() {
  const voice = useVoiceAccessState();
  return (
    <PolicyChrome title="Privacy" subtitle="Company ethos">
      <p>
        Acornsoft respects your privacy. This site does not use email forms or
        phone queues. Conversations with Acornsoft begin through Voice after you
        sign in with X.
      </p>
      <h2>What we collect</h2>
      <p>
        We collect only what is needed to respond to project inquiries and to
        operate this site. That may include standard server logs, basic
        analytics that do not sell personal data, and what you choose to share
        in a Voice session.
      </p>
      <h2>What we do not do</h2>
      <p>
        We do not sell personal information. We do not ask you to send secrets,
        regulated health data, or credentials through public Voice sessions or
        social posts.
      </p>
      <h2>How to reach us</h2>
      <p>
        For privacy questions,{" "}
        {voice.allowed ? (
          <>
            <VoiceLink>reach us via Voice</VoiceLink> and request a privacy
            follow-up.
          </>
        ) : (
          <>
            sign in with X on Climb Notes to unlock Voice, then request a privacy
            follow-up.
          </>
        )}
      </p>
      <p className="ac-policy-note">
        Last updated July 2026. This page is part of Acornsoft company ethos—not
        marketing surface.
      </p>
    </PolicyChrome>
  );
}

export function PoliciesPage() {
  return (
    <PolicyChrome title="Policies" subtitle="Company ethos">
      <p>
        These policies guide how Acornsoft presents work, uses third-party tools,
        and stays honest with customers and the public. Our company ethos shares
        the vision of going to Mars with Elon Musk’s multiplanetary ambition—as
        independent builders, never as spokespeople for SpaceX, Tesla, X, or
        SpaceXAI.
      </p>
      <h2>Proper usage</h2>
      <p>
        Use Acornsoft materials, Climb Notes™, and Canopy for lawful,
        professional purposes only. Do not misrepresent Acornsoft as affiliated
        with, endorsed by, or speaking for Tesla, Incorporated; Space Exploration
        Technologies Corporation (SpaceX); X Corporation; SpaceXAI (formerly
        X.AI Corporation); or any other third party.
      </p>
      <h2>Platform rules</h2>
      <p>
        Do not scrape, reverse engineer, or republish Canopy feednotes in ways
        that violate third-party platform rules, including X terms of service.
        Production systems built with Grok Build, Grok, or related tools remain
        your responsibility for safety, evaluation, access control, and
        compliance.
      </p>
      <h2>Trademarks and copyrights</h2>
      <p>
        All product and company names are trademarks or registered trademarks of
        their respective owners. Acornsoft is not affiliated with, sponsored by,
        or endorsed by those owners unless a written agreement says otherwise.
      </p>
      <ul>
        <li>
          Tesla, Optimus, and related marks are trademarks of Tesla,
          Incorporated.
        </li>
        <li>
          SpaceX, Falcon, Starship, Starlink, and related marks are trademarks of
          Space Exploration Technologies Corporation.
        </li>
        <li>X is a trademark of X Corporation (or its affiliates).</li>
        <li>
          Grok, Grok Build, SpaceXAI, xAI, and related marks are trademarks of
          SpaceXAI / X.AI Corporation (or its affiliates), used here only for
          identification and commentary.
        </li>
        <li>
          Acornsoft, Climb Notes™, and Canopy are marks of Acornsoft.
        </li>
      </ul>
      <p>
        Timeline entries about third-party products are curated public
        announcements for information only. They are not official statements from
        Tesla, SpaceX, X, or SpaceXAI. Copyright in third-party posts, images,
        and videos remains with the original rights holders.
      </p>
      <p className="ac-policy-note">
        Last updated July 2026. Quiet by design—linked from the site footer.
      </p>
    </PolicyChrome>
  );
}

export function ProceduresPage() {
  return (
    <PolicyChrome title="Procedures" subtitle="Company ethos">
      <p>
        Procedures turn our charter into daily practice. They are short on purpose
        so teams can follow them under pressure.
      </p>
      <h2>How we start work</h2>
      <ol>
        <li>Define success in a measure the customer owns.</li>
        <li>Name constraints: data, speed, cost, risk, and who is accountable.</li>
        <li>Ship a thin Climb Notes slice that can fail safely and be measured.</li>
        <li>Write assumptions and known failure modes before production.</li>
      </ol>
      <h2>How we handle failure</h2>
      <ol>
        <li>Write the miss down the same day.</li>
        <li>Share it with the people who own the system.</li>
        <li>Improve the next slice. Do not wait for a perfect plan.</li>
        <li>Update Climb Notes when evidence contradicts prior methods.</li>
      </ol>
      <h2>How we contact and intake</h2>
      <p>
        First contact is Voice only—no email forms, no phone queue theater. Luna
        and Ara are one and the same — your Sherpa on Grok Voice (or your custom
        Acornsoft Grok Voice when configured). Do not send secrets in public
        sessions.
      </p>
      <h2>How we credit others</h2>
      <p>
        Name tools and companies accurately. Never imply endorsement by Tesla,
        SpaceX, X, or SpaceXAI without a written agreement. Canopy labels public
        signals by source.
      </p>
      <p className="ac-policy-note">
        Last updated July 2026. Part of Acornsoft ethos—available from the fixed
        footer on every page.
      </p>
    </PolicyChrome>
  );
}
