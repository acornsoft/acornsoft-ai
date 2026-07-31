import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { testimonials } from "./data";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const item = testimonials[index];

  const prev = () =>
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setIndex((i) => (i + 1) % testimonials.length);

  return (
    <section className="section-pad">
      <div className="container-site">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
            Testimonials
          </p>
          <blockquote className="mt-8">
            <p
              key={item.name}
              className="heading-section text-xl text-fg md:text-2xl leading-snug text-balance animate-in fade-in duration-300"
            >
              &ldquo;{item.quote}&rdquo;
            </p>
            <footer className="mt-8">
              <cite className="not-italic">
                <span className="block text-sm font-medium text-fg">
                  {item.name}
                </span>
                <span className="mt-1 block text-sm text-muted">
                  {item.title}
                </span>
              </cite>
            </footer>
          </blockquote>

          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={prev}
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-bg-elevated text-fg transition-colors hover:border-border-strong"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-1.5" role="tablist" aria-label="Testimonials">
              {testimonials.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show testimonial from ${t.name}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-2 w-2 rounded-full transition-colors",
                    i === index ? "bg-primary" : "bg-border-strong",
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-bg-elevated text-fg transition-colors hover:border-border-strong"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
