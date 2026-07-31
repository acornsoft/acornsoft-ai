import { stats } from "./data";
import { useCountUp } from "./use-count-up";

function Stat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const n = useCountUp(value);
  return (
    <div className="surface-card rounded-xl p-5 md:p-6">
      <p className="font-mono text-3xl font-medium tabular-nums tracking-tight text-fg md:text-4xl">
        {n}
        <span className="text-accent">{suffix}</span>
      </p>
      <p className="mt-2 text-sm text-muted">{label}</p>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="section-pad">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
              About
            </p>
            <h2 className="heading-section mt-3 text-3xl text-fg md:text-4xl text-balance">
              From acorn to system of record
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-5 text-muted leading-relaxed">
            <p>
              Acornsoft is a New York–based applied AI studio. We partner with
              product and operations teams who need more than a demo—teams who
              need software that holds up under real load, real users, and real
              compliance constraints.
            </p>
            <p>
              Our approach is deliberately practical: pick a sharp problem,
              measure what good looks like, ship a thin vertical slice, then
              harden it. The result is AI that earns its place in the workflow,
              not another experiment that gathers dust.
            </p>
            <a
              href="#services"
              className="inline-flex text-sm font-medium text-fg underline-offset-4 hover:underline"
            >
              Explore how we work
            </a>
          </div>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
