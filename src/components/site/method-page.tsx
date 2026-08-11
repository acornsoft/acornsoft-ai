import { Link } from "@tanstack/react-router";
import { SiteHeader } from "./site-chrome";
import { VoiceWhenSignedIn } from "./voice-access";
import {
  contributeRows,
  methodObjects,
  requestBlurb,
  serviceClimbLinks,
  trainingModules,
  useExistingSteps,
  type TrainingModule,
} from "./method-data";

function TrackBadge({ track }: { track: TrainingModule["track"] }) {
  const label =
    track === "voice" ? "Voice" : track === "imagine" ? "Imagine" : "Build";
  return (
    <span className={`ac-method-track ac-method-track--${track}`}>{label}</span>
  );
}

export function MethodPage() {
  const byTrack = {
    voice: trainingModules.filter((m) => m.track === "voice"),
    imagine: trainingModules.filter((m) => m.track === "imagine"),
    build: trainingModules.filter((m) => m.track === "build"),
  };

  return (
    <div className="template-color-1 spybody ac-inbio ac-method-page ac-hero-stage">
      <SiteHeader loginRedirect="/gnomah" />

      <main className="main-page-wrapper ac-page-hero-main">
        <section className="rn-section-gap ac-page-top ac-method-hero">
          <div className="container">
            <div className="row">
              <div className="col-lg-10">
                <div className="section-title text-left">
                  <span className="subtitle">One map</span>
                  <h1 className="title">Method</h1>
                  <p className="description ac-method-lead">
                    Services are how we help. Climb Notes are the trail. Training
                    is how you learn the climb with Voice, Imagine, and Grok
                    Build. Long-form lives on this site. X is a short cite with a
                    link back.
                  </p>
                </div>
                <div className="ac-method-cta-row">
                  <Link className="rn-btn ac-btn-maroon" to="/service">
                    <span>Services</span>
                  </Link>
                  <Link className="rn-btn" to="/climb-notes">
                    <span>Climb Notes</span>
                  </Link>
                  <a className="rn-btn" href="#training">
                    <span>Training</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Objects */}
        <section className="rn-section-gap ac-method-section" id="objects">
          <div className="container">
            <h2 className="ac-method-h2">Do not mix the objects</h2>
            <div className="ac-method-object-grid">
              {methodObjects.map((o) => (
                <article key={o.name} className="ac-method-object-card">
                  <h3>{o.name}</h3>
                  <p>{o.blurb}</p>
                  {o.where.startsWith("#") ? (
                    <a className="ac-method-link" href={o.where}>
                      Jump
                    </a>
                  ) : (
                    <Link className="ac-method-link" to={o.where}>
                      Open
                    </Link>
                  )}
                </article>
              ))}
            </div>
            <p className="ac-method-note">
              <strong>Climb Note 000</strong> is the origin trail. All later notes
              build on that pattern.
            </p>
          </div>
        </section>

        {/* Services ↔ Climb Notes */}
        <section className="rn-section-gap ac-method-section" id="services">
          <div className="container">
            <h2 className="ac-method-h2">How services use Climb Notes</h2>
            <p className="ac-method-sub">
              Every paid climb ends with a Climb Note — or an update to an
              existing one. No free solo.
            </p>
            <ul className="ac-method-service-list">
              {serviceClimbLinks.map((row) => (
                <li key={row.service}>
                  <span className="ac-method-service-name">{row.service}</span>
                  <span className="ac-method-service-role">{row.role}</span>
                </li>
              ))}
            </ul>
            <Link className="rn-btn ac-btn-maroon ac-method-inline-btn" to="/service">
              <span>View service cards</span>
            </Link>
          </div>
        </section>

        {/* Use existing */}
        <section className="rn-section-gap ac-method-section" id="use">
          <div className="container">
            <h2 className="ac-method-h2">Use an existing Climb Note</h2>
            <ol className="ac-method-steps">
              {useExistingSteps.map((s) => (
                <li key={s.n}>
                  <span className="ac-method-step-n">{s.n}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Contribute */}
        <section className="rn-section-gap ac-method-section" id="contribute">
          <div className="container">
            <h2 className="ac-method-h2">Contribute, request, or update</h2>
            <div className="ac-method-table-wrap">
              <table className="ac-method-table">
                <thead>
                  <tr>
                    <th>Who</th>
                    <th>Action</th>
                    <th>How</th>
                  </tr>
                </thead>
                <tbody>
                  {contributeRows.map((r) => (
                    <tr key={`${r.who}-${r.action}`}>
                      <td>{r.who}</td>
                      <td>{r.action}</td>
                      <td>{r.how}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="ac-method-request">
              <h3>Request (public)</h3>
              <p>{requestBlurb}</p>
              <p className="ac-method-request-fields">
                Template: <em>what’s stuck</em> · <em>who it helps</em> ·{" "}
                <em>service (optional)</em> · <em>new or update</em> ·{" "}
                <em>note id if update</em>
              </p>
            </div>
          </div>
        </section>

        {/* Training */}
        <section className="rn-section-gap ac-method-section" id="training">
          <div className="container">
            <h2 className="ac-method-h2">Training packs</h2>
            <p className="ac-method-sub">
              Short modules. Goal → do this → done when. Three tools: Voice,
              Imagine, Grok Build.
            </p>

            {(
              [
                ["voice", "Voice + Luna", byTrack.voice],
                ["imagine", "Imagine", byTrack.imagine],
                ["build", "Grok Build", byTrack.build],
              ] as const
            ).map(([key, heading, mods]) => (
              <div key={key} className="ac-method-track-block">
                <h3 className="ac-method-h3">{heading}</h3>
                <div className="ac-method-train-grid">
                  {mods.map((m) => (
                    <article key={m.id} className="ac-method-train-card">
                      <div className="ac-method-train-top">
                        <TrackBadge track={m.track} />
                        <span className="ac-method-time">{m.time}</span>
                      </div>
                      <h4>{m.title}</h4>
                      <p className="ac-method-goal">{m.goal}</p>
                      <ol>
                        {m.steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                      <p className="ac-method-done">
                        <strong>Done when:</strong> {m.doneWhen}
                      </p>
                      {m.href ? (
                        m.href === "/voice" ? (
                          <VoiceWhenSignedIn>
                            <Link className="ac-method-link" to="/voice">
                              Open Voice
                            </Link>
                          </VoiceWhenSignedIn>
                        ) : (
                          <Link className="ac-method-link" to={m.href}>
                            Open
                          </Link>
                        )
                      ) : null}
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pipeline */}
        <section className="rn-section-gap ac-method-section ac-method-pipeline">
          <div className="container">
            <h2 className="ac-method-h2">Site + X pipeline</h2>
            <pre className="ac-method-flow" tabIndex={0}>
{`Write once on acornsoft.ai
  → Service card and/or Climb Note and/or training module
  → Optional Canopy when public
  → X: short cite + link only`}
            </pre>
            <div className="ac-method-cta-row">
              <Link className="rn-btn ac-btn-maroon" to="/climb-notes">
                <span>Open Climb Notes</span>
              </Link>
              <Link className="rn-btn" to="/canopy">
                <span>Open Canopy</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
