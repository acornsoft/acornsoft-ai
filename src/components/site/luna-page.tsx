import { Link } from "@tanstack/react-router";
import { SiteChrome } from "./site-chrome";
import { ClimbNotesMark } from "./climb-notes-mark";
import { LUNA_DOCS } from "@/lib/luna-docs";

const TRAILS = LUNA_DOCS.filter((d) =>
  ["grok-build", "copilot", "cursor", "claude"].includes(d.slug),
);

export function LunaPage() {
  return (
    <SiteChrome loginRedirect="/luna">
      <div className="ac-service-page ac-luna-page ac-page-top">
        <div className="ac-service-stack">
          <header className="ac-service-head">
            <span className="ac-service-kicker">Luna Foundry Multiagent</span>
            <h1 className="ac-service-title">
              Luna is your Sherpa. <ClimbNotesMark /> is the trail.
            </h1>
            <div className="ac-service-lede-box">
              <p className="ac-service-lede">
                Help lives here, on acornsoft.ai. You do not need a GitHub
                login. Install the extension; open a trail on this site.
              </p>
              <p className="ac-service-lede ac-service-lede--last">
                Public beats: Base Camp, Route, Waypoint, Summit. On the
                rope team those map to Constitution, Clarify, Waypoint,
                Workforce.
              </p>
            </div>
          </header>

          <ol className="ac-luna-beats">
            <li>
              <strong>Base Camp</strong>
              Are we fit to leave? Gear, weather, rules, who we are.
            </li>
            <li>
              <strong>Route</strong>
              One summit. Success marks. What we are not climbing today.
            </li>
            <li>
              <strong>Waypoint</strong>
              Check the map. Recover if needed. Hold or go.
            </li>
            <li>
              <strong>Summit</strong>
              Build, prove, bring evidence home.
            </li>
          </ol>

          <section className="ac-luna-trails">
            <h2>Pick your ridge</h2>
            <p>
              Setup is the same for every climber: install → open this
              climb’s folder → <strong>Luna: Setup Unified Workspace</strong>{" "}
              → Yes, Unify Now → new terminal. Then only your trail.
            </p>
            <ul>
              {TRAILS.map((t) => (
                <li key={t.slug}>
                  <Link to="/luna/$slug" params={{ slug: t.slug }}>
                    {t.title.replace("Trail map: ", "")}
                  </Link>
                  <span>{t.lede}</span>
                </li>
              ))}
            </ul>
            <p className="ac-luna-more">
              <Link to="/luna/$slug" params={{ slug: "security" }}>
                Security before client data
              </Link>
              {" · "}
              <Link to="/luna/$slug" params={{ slug: "support" }}>
                Feedback
              </Link>
              {" · "}
              <Link to="/start">Send a Climb Note</Link>
              {" · "}
              <Link to="/field-guide">Field guide</Link>
            </p>
          </section>
        </div>
      </div>
    </SiteChrome>
  );
}
