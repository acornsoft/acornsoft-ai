import { Link } from "@tanstack/react-router";
import { SiteChrome } from "./site-chrome";
import { LUNA_HUB_FILE } from "@/lib/luna-docs";
import { loadLunaMarkdown, lunaMarkdownToHtml } from "@/lib/luna-markdown";

export function LunaPage() {
  const html = lunaMarkdownToHtml(loadLunaMarkdown(LUNA_HUB_FILE));
  return (
    <SiteChrome loginRedirect="/luna">
      <div className="ac-service-page ac-luna-page ac-page-top">
        <div className="ac-service-stack ac-luna-doc">
          <header className="ac-service-head">
            <span className="ac-service-kicker">Luna Foundry Multiagent</span>
          </header>
          <article
            className="ac-luna-doc-body"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <p className="ac-luna-more">
            <Link to="/start">Send a Climb Note</Link>
            {" · "}
            <Link to="/field-guide">Field guide</Link>
          </p>
        </div>
      </div>
    </SiteChrome>
  );
}
