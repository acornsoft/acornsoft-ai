import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { portfolio, portfolioFilters } from "./data";

export function Work() {
  const [filter, setFilter] =
    useState<(typeof portfolioFilters)[number]>("All");

  const items = useMemo(() => {
    if (filter === "All") return portfolio;
    return portfolio.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <section id="work" className="section-pad border-t border-border bg-bg-elevated/40">
      <div className="container-site">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
              Work
            </p>
            <h2 className="heading-section mt-3 text-3xl text-fg md:text-4xl text-balance">
              Selected engagements
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              A sample of products and systems we have designed and shipped with
              clients across ops, finance, and product teams.
            </p>
          </div>
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Filter portfolio"
          >
            {portfolioFilters.map((f) => (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  "h-10 rounded-full border px-4 text-sm transition-colors duration-150",
                  filter === f
                    ? "border-primary bg-primary text-primary-fg"
                    : "border-border bg-bg text-muted hover:text-fg hover:border-border-strong",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="surface-card group flex flex-col rounded-xl p-6 transition-[border-color] duration-200 hover:border-border-strong"
            >
              <div className="mb-8 flex items-start justify-between gap-3">
                <span className="rounded-full border border-border bg-bg-subtle px-2.5 py-1 text-xs font-medium text-muted">
                  {item.category}
                </span>
                <ArrowUpRight className="h-4 w-4 text-subtle transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
              </div>
              <h3 className="text-lg font-medium tracking-tight text-fg">
                {item.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {item.summary}
              </p>
              <a
                href="#contact"
                className="mt-5 inline-flex text-sm font-medium text-fg underline-offset-4 hover:underline"
              >
                Discuss a similar project
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
