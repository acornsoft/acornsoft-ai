import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { plans } from "./data";

function formatPrice(price: number | null) {
  if (price === null) return "Custom";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function Pricing() {
  return (
    <section id="pricing" className="section-pad border-t border-border bg-bg-elevated/40">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
            Pricing
          </p>
          <h2 className="heading-section mt-3 text-3xl text-fg md:text-4xl text-balance">
            Clear plans. No mystery retainers.
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Start small with a focused sprint, or embed a pod for ongoing
            delivery. Enterprise programs are scoped to your roadmap.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={cn(
                "flex flex-col rounded-xl p-6 md:p-7",
                plan.highlighted
                  ? "border border-primary/40 bg-bg-subtle shadow-soft"
                  : "surface-card",
              )}
            >
              {plan.highlighted ? (
                <span className="mb-4 inline-flex w-fit rounded-full border border-border bg-bg px-2.5 py-1 text-xs font-medium text-fg">
                  Most popular
                </span>
              ) : (
                <span className="mb-4 inline-flex h-[26px]" aria-hidden />
              )}
              <h3 className="text-lg font-medium text-fg">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted">{plan.description}</p>
              <p className="mt-6 flex items-baseline gap-1.5">
                <span className="font-mono text-3xl font-medium tabular-nums tracking-tight text-fg">
                  {formatPrice(plan.price)}
                </span>
                {plan.price !== null ? (
                  <span className="text-sm text-muted">/ {plan.period}</span>
                ) : (
                  <span className="text-sm text-muted">{plan.period}</span>
                )}
              </p>
              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-sm text-muted"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-success"
                      strokeWidth={2}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="mt-8 w-full"
                variant={plan.highlighted ? "default" : "outline"}
              >
                <a href="#contact">
                  {plan.price === null ? "Talk with us" : "Get started"}
                </a>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
