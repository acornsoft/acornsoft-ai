import { Link, Navigate, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteChrome } from "./site-chrome";
import { AcadenceDesk } from "./acadence-desk";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  workById,
  workOpenLabel,
  worksVisibleTo,
  type WorkEntry,
} from "@/lib/works";

function WorkGate({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (isPending && !user) {
    return (
      <SiteChrome loginRedirect={pathname || "/work"}>
        <div className="ac-service-page ac-works-page ac-page-top">
          <p className="ac-works-status">Loading session…</p>
        </div>
      </SiteChrome>
    );
  }

  if (!user) {
    return <Navigate to="/login" search={{ redirect: pathname || "/work" }} />;
  }

  return <>{children}</>;
}

function WorkSubnav({ current }: { current?: string }) {
  const { user } = useCurrentUserState();
  const items = worksVisibleTo({ signedIn: !!user, owner: false });
  return (
    <nav className="ac-works-subnav" aria-label="Works">
      {current ? (
        <Link to="/work">All works</Link>
      ) : (
        <span className="is-current">All works</span>
      )}
      {items.map((w) =>
        w.id === current ? (
          <span key={w.id} className="is-current">
            {w.title}
          </span>
        ) : (
          <Link key={w.id} to="/work/$slug" params={{ slug: w.id }}>
            {w.title}
          </Link>
        ),
      )}
    </nav>
  );
}

function WorkCard({ item, n, total }: { item: WorkEntry; n: number; total: number }) {
  const num = String(n).padStart(2, "0");
  return (
    <Link
      className="ac-work-card"
      to="/work/$slug"
      params={{ slug: item.id }}
    >
      <header className="ac-work-card-top">
        <span className="ac-work-card-num">{num}</span>
        <span className="ac-work-card-kicker">{item.kicker}</span>
        <span className="ac-work-card-ridge">{item.ridge}</span>
      </header>
      <h2 className="ac-work-card-title">{item.title}</h2>
      <p className="ac-work-card-lede">{item.lede}</p>
      {item.client ? (
        <p className="ac-work-card-client">{item.client}</p>
      ) : null}
      <span className="ac-work-card-link">{workOpenLabel(item)}</span>
      <span className="ac-work-card-index">
        {num} / {String(total).padStart(2, "0")}
      </span>
    </Link>
  );
}

export function WorksPage() {
  const { user } = useCurrentUserState();
  const items = worksVisibleTo({ signedIn: !!user, owner: false });

  return (
    <WorkGate>
      <SiteChrome loginRedirect="/work">
        <div className="ac-service-page ac-works-page ac-page-top">
          <div className="ac-service-stack">
            <header className="ac-service-head">
              <span className="ac-service-kicker">Works</span>
              <h1 className="ac-service-title">Developed solutions</h1>
              <div className="ac-service-lede-box">
                <p className="ac-service-lede">
                  Each card is a page on this site. Live hosts stay on their
                  own domain. Signed in for now; promote an item public when
                  the summit is ready.
                </p>
                <p className="ac-service-lede ac-service-lede--last">
                  The field kit is Luna Foundry Multiagent (help at{" "}
                  <Link to="/luna">/luna</Link>, not in the top nav). Quiet
                  work record:{" "}
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
            <WorkSubnav />
          </div>
        </div>
      </SiteChrome>
    </WorkGate>
  );
}

export function WorkDetailPage({ slug }: { slug: string }) {
  const { user } = useCurrentUserState();
  const item = workById(slug);
  const visible = item
    ? worksVisibleTo({ signedIn: !!user, owner: false }).some(
        (w) => w.id === item.id,
      )
    : false;

  return (
    <WorkGate>
      <SiteChrome loginRedirect={`/work/${slug}`}>
        <div className="ac-service-page ac-works-page ac-page-top">
          <div className="ac-service-stack ac-luna-doc">
            {!item || !visible ? (
              <p>
                That work is not in this view.{" "}
                <Link to="/work">Back to Works</Link>.
              </p>
            ) : (
              <>
                <header className="ac-service-head">
                  <span className="ac-service-kicker">
                    {item.kicker} · {item.ridge}
                    {item.client ? ` · ${item.client}` : ""}
                  </span>
                  <h1 className="ac-service-title">{item.title}</h1>
                  <p className="ac-service-lede ac-service-lede--last">
                    {item.lede}
                  </p>
                </header>
                <article className="ac-luna-doc-body">
                  {item.story.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                  {item.href ? (
                    <p>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Live site
                      </a>
                    </p>
                  ) : item.surface === "desk" ? null : (
                    <p>Not on a public host yet.</p>
                  )}
                </article>
                {item.surface === "desk" && item.id === "acadence" ? (
                  <AcadenceDesk />
                ) : null}
                <WorkSubnav current={item.id} />
              </>
            )}
          </div>
        </div>
      </SiteChrome>
    </WorkGate>
  );
}
