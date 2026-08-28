import { Link } from "@tanstack/react-router";
import { SiteChrome } from "./site-chrome";
import { LUNA_DOCS, lunaDocBySlug } from "@/lib/luna-docs";
import { loadLunaMarkdown, lunaMarkdownToHtml } from "@/lib/luna-markdown";

function DocNav({ current }: { current: string }) {
  const trails = LUNA_DOCS.filter((d) =>
    ["grok-build", "copilot", "cursor", "claude"].includes(d.slug),
  );
  return (
    <p className="ac-luna-more">
      <Link to="/luna">All trails</Link>
      {trails.map((d) => (
        <span key={d.slug}>
          {" · "}
          {d.slug === current ? (
            d.title.replace("Trail map: ", "")
          ) : (
            <Link to="/luna/$slug" params={{ slug: d.slug }}>
              {d.title.replace("Trail map: ", "")}
            </Link>
          )}
        </span>
      ))}
      {" · "}
      <Link to="/start">Send a Climb Note</Link>
    </p>
  );
}

export function LunaDocPage({ slug }: { slug: string }) {
  const meta = lunaDocBySlug(slug);
  const md = meta ? loadLunaMarkdown(meta.file).replace(/^#\s+[^\n]+\n+/, "") : "";
  const html = md ? lunaMarkdownToHtml(md) : "";

  return (
    <SiteChrome loginRedirect={`/luna/${slug}`}>
      <div className="ac-service-page ac-luna-page ac-page-top">
        <div className="ac-service-stack ac-luna-doc">
          <header className="ac-service-head">
            <span className="ac-service-kicker">{meta?.kicker ?? "Luna"}</span>
            <h1 className="ac-service-title">{meta?.title ?? "Luna"}</h1>
          </header>
          {html ? (
            <article
              className="ac-luna-doc-body"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <p>
              That trail is not on this site.{" "}
              <Link to="/luna">Back to Luna help</Link>.
            </p>
          )}
          <DocNav current={slug} />
        </div>
      </div>
    </SiteChrome>
  );
}
