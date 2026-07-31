import { team } from "./data";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Team() {
  return (
    <section id="team" className="section-pad">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
            Team
          </p>
          <h2 className="heading-section mt-3 text-3xl text-fg md:text-4xl text-balance">
            People behind the systems
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            A small senior team of product, engineering, design, and research—
            built to embed with yours.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <article
              key={member.name}
              className="surface-card rounded-xl p-6 text-center"
            >
              <div
                aria-hidden
                className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full border border-border bg-bg-subtle font-medium tracking-tight text-fg"
              >
                {initials(member.name)}
              </div>
              <h3 className="text-base font-medium text-fg">{member.name}</h3>
              <p className="mt-1 text-sm text-accent">{member.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {member.bio}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
