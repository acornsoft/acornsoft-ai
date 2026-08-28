import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteChrome } from "./site-chrome";
import { LUNA_DOCS } from "@/lib/luna-docs";

const MARKETPLACE =
  "https://marketplace.visualstudio.com/items?itemName=acornsoft.luna-foundry-multiagent";

function DocNav({ current }: { current: string }) {
  return (
    <p className="ac-luna-more">
      <Link to="/luna">All trails</Link>
      {" · "}
      {LUNA_DOCS.filter((d) => d.slug !== current).map((d, i) => (
        <span key={d.slug}>
          {i > 0 ? " · " : null}
          <Link to="/luna/$slug" params={{ slug: d.slug }}>
            {d.title.replace("Trail map: ", "")}
          </Link>
        </span>
      ))}
      {" · "}
      <Link to="/start">Send a Climb Note</Link>
    </p>
  );
}

function TrailShell({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const meta = LUNA_DOCS.find((d) => d.slug === slug);
  return (
    <SiteChrome loginRedirect={`/luna/${slug}`}>
      <div className="ac-service-page ac-luna-page ac-page-top">
        <div className="ac-service-stack ac-luna-doc">
          <header className="ac-service-head">
            <span className="ac-service-kicker">{meta?.kicker ?? "Luna"}</span>
            <h1 className="ac-service-title">{meta?.title ?? "Luna"}</h1>
            {meta?.lede ? (
              <p className="ac-service-lede ac-service-lede--last">{meta.lede}</p>
            ) : null}
          </header>
          <article className="ac-luna-doc-body">{children}</article>
          <DocNav current={slug} />
        </div>
      </div>
    </SiteChrome>
  );
}

function CampSteps() {
  return (
    <>
      <h2>Every climber, first</h2>
      <ol>
        <li>
          Install{" "}
          <a href={MARKETPLACE} rel="noreferrer">
            Luna Foundry Multiagent
          </a>{" "}
          in VS Code or Cursor.
        </li>
        <li>Open the project folder that is this climb.</li>
        <li>
          Command Palette → <strong>Luna: Setup Unified Workspace</strong> →
          Yes, Unify Now → new terminal.
        </li>
      </ol>
    </>
  );
}

export function LunaDocPage({ slug }: { slug: string }) {
  if (slug === "grok-build") {
    return (
      <TrailShell slug={slug}>
        <CampSteps />
        <h2>Then this ridge</h2>
        <ol>
          <li>
            <strong>Install / Verify Grok CLI</strong>, then{" "}
            <strong>Install Luna Plugin for Grok</strong>.
          </li>
          <li>
            Open <strong>Grok Build (bash)</strong> on the left (TUI) and{" "}
            <strong>Grok (bash)</strong> on the right (shell). Join terminals.
          </li>
          <li>
            One climb: Constitution → Clarify → Waypoint → Workforce. Proof
            in the shell. No secrets in the TUI.
          </li>
        </ol>
        <p>
          Wish or stuck?{" "}
          <Link to="/start">Send a Climb Note</Link> — that is how we hear
          you. GitHub is private; do not file issues there.
        </p>
      </TrailShell>
    );
  }

  if (slug === "copilot") {
    return (
      <TrailShell slug={slug}>
        <CampSteps />
        <h2>Then this ridge</h2>
        <ol>
          <li>Open Copilot Chat. Pick agent Constitution or Luna.</li>
          <li>
            Same four beats in Chat. Terminal only for proof.
          </li>
          <li>No secrets in Chat. Skip ADO unless you ask for it.</li>
        </ol>
        <p>
          Wish or stuck? <Link to="/start">Send a Climb Note</Link>.
        </p>
      </TrailShell>
    );
  }

  if (slug === "cursor") {
    return (
      <TrailShell slug={slug}>
        <CampSteps />
        <h2>Then this ridge</h2>
        <ol>
          <li>Setup writes `.cursorrules` and the shared pack.</li>
          <li>Use Cursor Agent / Composer with Luna’s four beats.</li>
          <li>Privacy mode on for non-public code.</li>
        </ol>
        <p>
          Wish or stuck? <Link to="/start">Send a Climb Note</Link>.
        </p>
      </TrailShell>
    );
  }

  if (slug === "claude") {
    return (
      <TrailShell slug={slug}>
        <CampSteps />
        <h2>Then this ridge</h2>
        <ol>
          <li>Same pack through project files and instructions.</li>
          <li>Claude Pro. Attach only the paths you need.</li>
          <li>Ban secrets in project instructions.</li>
        </ol>
        <p>
          Wish or stuck? <Link to="/start">Send a Climb Note</Link>.
        </p>
      </TrailShell>
    );
  }

  if (slug === "security") {
    return (
      <TrailShell slug={slug}>
        <ol>
          <li>
            <strong>No secrets</strong> in chat, prompts, skills, or git.
          </li>
          <li>
            <strong>Classify</strong> before you paste. Client data needs an
            approved host.
          </li>
          <li>
            <strong>You steer.</strong> Base Camp → Route → Waypoint → Summit
            with proof.
          </li>
        </ol>
        <p>
          If something leaks: rotate credentials. Tell your security contact
          when client data is involved.
        </p>
      </TrailShell>
    );
  }

  if (slug === "support") {
    return (
      <TrailShell slug={slug}>
        <p>
          This pack is free. Help and wishes go through{" "}
          <Link to="/start">Send a Climb Note</Link> on this site. The git
          repo is private. You do not need GitHub.
        </p>
        <p>
          Paid workshops and custom skills: use the same form. Sponsor:{" "}
          acornsoft.ai.
        </p>
      </TrailShell>
    );
  }

  return (
    <TrailShell slug="support">
      <p>
        That trail is not on this site.{" "}
        <Link to="/luna">Back to Luna help</Link>.
      </p>
    </TrailShell>
  );
}
