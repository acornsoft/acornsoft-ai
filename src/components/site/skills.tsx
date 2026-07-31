import { skills } from "./data";

export function Skills() {
  return (
    <section className="border-y border-border bg-bg-elevated/60 section-pad">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
            Capabilities
          </p>
          <h2 className="heading-section mt-3 text-3xl text-fg md:text-4xl text-balance">
            Depth where it matters
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            We combine product craft with serious engineering—so the models,
            data, and interfaces move forward together instead of in parallel
            silos.
          </p>
        </div>
        <div className="lg:col-span-7 grid gap-6 sm:grid-cols-2">
          {skills.map((skill) => (
            <div key={skill.name}>
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <span className="text-sm font-medium text-fg">{skill.name}</span>
                <span className="font-mono text-xs tabular-nums text-muted">
                  {skill.level}%
                </span>
              </div>
              <div
                className="h-1.5 overflow-hidden rounded-full bg-bg-subtle"
                role="progressbar"
                aria-valuenow={skill.level}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={skill.name}
              >
                <div
                  className="h-full rounded-full bg-primary/85 transition-[width] duration-700 ease-out"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
