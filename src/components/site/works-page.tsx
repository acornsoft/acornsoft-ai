import { Link, Navigate } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteChrome } from "./site-chrome";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { worksVisibleTo, type WorkEntry } from "@/lib/works";

function WorkCard({ item, n, total }: { item: WorkEntry; n: number; total: number }) {
  const num = String(n).padStart(2, "0");
  const hostLabel = item.href
    ? item.href.replace(/^https:\/\//, "").replace(/\/$/, "")
    : null;

  return (
    <article className="ac-work-card">
      <header className="ac-work-card-top">
        <span className="ac-work-card-num">{num}</span>
        <span className="ac-work-card-kicker">{item.kicker}</span>
        <span className="ac-work-card-ridge">{item.ridge}</span>
      </header>
      <h2 className="ac-work-card-title">{item.title}</h2>
      <p className="ac-work-card-lede">{item.lede}</p>
      {item.href ? (
        <a
          className="ac-work-card-link"
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{hostLabel}</span>
          <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden />
        </a>
      ) : (
        <p className="ac-work-card-pending">Not on a public host yet.</p>
      )}
      <span className="ac-work-card-index">
        {num} / {String(total).padStart(2, "0")}
      </span>
    </article>
  );
}

export function WorksPage() {
  const { user, isPending } = useCurrentUserState();

  if (isPending && !user) {
    return (
      <SiteChrome loginRedirect="/work">
        <div className="ac-service-page ac-works-page ac-page-top">
          <p className="ac-works-status">Loading session…</p>
        </div>
      </SiteChrome>
    );
  }

  if (!user) {
    return <Navigate to="/login" search={{ redirect: "/work" }} />;
  }

  const items = worksVisibleTo({ signedIn: !!user, owner: false });

  return (
    <SiteChrome loginRedirect="/work">
      <div className="ac-service-page ac-works-page ac-page-top">
        <div className="ac-service-stack">
          <header className="ac-service-head">
            <span className="ac-service-kicker">Works</span>
            <h1 className="ac-service-title">Developed solutions</h1>
            <div className="ac-service-lede-box">
              <p className="ac-service-lede">
                Examples and products Acornsoft has built. Signed in for now.
                Each item can be promoted to public when the summit is ready.
              </p>
              <p className="ac-service-lede ac-service-lede--last">
                The kit is{" "}
                <Link to="/luna">Luna Foundry Multiagent</Link>
                . The work record is quiet on{" "}
                <a
                  href="https://blaszyk.us/"
                  target="_blank"
                  rel="noopener noreferrer me"
                >
                  blaszyk.us
                </a>
                .
              </p>
            </div>
          </header>

          {items.length === 0 ? (
            <p className="ac-works-status">No works in this view yet.</p>
          ) : (
            <div className="ac-works-grid" role="list">
              {items.map((item, i) => (
                <div key={item.id} role="listitem">
                  <WorkCard item={item} n={i + 1} total={items.length} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SiteChrome>
  );
}
