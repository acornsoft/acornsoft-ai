import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroWords } from "./data";

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % heroWords.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      id="home"
      className="relative isolate flex min-h-[100dvh] items-end overflow-hidden pb-16 pt-28 md:items-center md:pb-24 md:pt-24"
    >
      <div className="absolute inset-0 -z-20">
        <img
          src="/hero.jpg"
          alt=""
          className="h-full w-full object-cover object-[center_35%]"
          width={1920}
          height={1080}
          fetchPriority="high"
        />
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(105deg, color-mix(in oklab, var(--color-bg) 78%, transparent) 0%, color-mix(in oklab, var(--color-bg) 40%, transparent) 52%, color-mix(in oklab, var(--color-bg) 22%, transparent) 100%), linear-gradient(180deg, color-mix(in oklab, var(--color-bg) 40%, transparent) 0%, transparent 38%, color-mix(in oklab, var(--color-bg) 50%, transparent) 80%, var(--color-bg) 100%)",
          }}
        />
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--color-bg) 35%, transparent) 0%, color-mix(in oklab, var(--color-bg) 15%, transparent) 30%, color-mix(in oklab, var(--color-bg) 55%, transparent) 62%, var(--color-bg) 100%)",
          }}
        />
      </div>

      <div className="container-site relative z-10 w-full">
        <div className="max-w-2xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-bg/55 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-muted backdrop-blur-sm">
            New York · AI-first organization

          </p>
          <h1 className="heading-display text-[clamp(2.4rem,6vw,4.25rem)] text-fg text-balance">
            We are{" "}
            <span className="relative inline-block min-w-[8ch] text-primary">
              <span
                key={heroWords[index]}
                className="inline-block animate-in fade-in slide-in-from-bottom-1 duration-500"
              >
                {heroWords[index]}
              </span>
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted md:text-lg leading-relaxed">
            Acornsoft builds production AI software—from strategy and prototypes
            to systems your team can trust at scale. Small starts. Strong roots.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <a href="#contact">
                Talk with us
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#work">See selected work</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
