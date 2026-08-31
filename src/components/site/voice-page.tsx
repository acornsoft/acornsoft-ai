import { Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "./site-chrome";
import { ClimbNotesMark } from "./climb-notes-mark";
import {
  LunaVoiceDock,
  VoiceFirstPatternLegend,
} from "./voice-first-patterns";
import {
  VOICE_NAME,
  VOICE_LABEL,
  VOICE_URL,
  SHERPA_LINE,
  useVoiceVisible,
} from "./voice-access";
import { LUNA_SHERPA, LUNA_SHERPA_PLAIN, PLATFORM } from "./messaging";

/**
 * Voice-first destination — only for signed-in visitors.
 * Logged out: minimal gate (no Luna dock, no Grok Voice CTA).
 */
export function VoicePage() {
  const { visible, isPending, signedIn } = useVoiceVisible();

  return (
    <div className="template-color-1 spybody ac-inbio ac-hero-stage ac-voice-page">
      <SiteHeader loginRedirect="/voice" />

      <main className="main-page-wrapper ac-page-hero-main ac-voice-page-main">
        <section className="ac-voice-page-hero ac-page-top">
          <div className="container">
            <p className="ac-voice-page-eyebrow">Voice-first · Acornsoft</p>
            <h1 className="ac-voice-page-title">{SHERPA_LINE}</h1>

            {isPending ? (
              <p className="ac-voice-page-lede">Checking sign-in…</p>
            ) : !signedIn ? (
              <>
                <p className="ac-voice-page-lede">
                  {LUNA_SHERPA} {PLATFORM} Sign in with X to walk with her
                  on Grok Voice — she follows your{" "}
                  <ClimbNotesMark />.
                </p>
                <div className="ac-voice-page-cta">
                  <Link
                    className="rn-btn ac-btn-maroon"
                    to="/login"
                    search={{ redirect: "/voice" }}
                  >
                    <span>Sign in to use Voice</span>
                  </Link>
                  <Link className="rn-btn ac-btn-outline" to="/climb-notes">
                    <span>Open Climb Notes</span>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="ac-voice-page-lede">
                  {LUNA_SHERPA_PLAIN}{" "}
                  <strong>Luna and Ara are one and the same</strong> on{" "}
                  <strong>{VOICE_LABEL}</strong>. {PLATFORM} Describe what’s
                  stuck in plain language; she guides you from your{" "}
                  <ClimbNotesMark />.
                </p>
                <div className="ac-voice-page-cta">
                  <a
                    className="rn-btn ac-btn-maroon"
                    href={VOICE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Open Grok Voice · {VOICE_NAME}</span>
                  </a>
                  <a className="rn-btn ac-btn-outline" href="#luna-dock">
                    <span>Try the on-site guide</span>
                  </a>
                  <Link
                    className="rn-btn ac-btn-outline"
                    to="/work/$slug"
                    params={{ slug: "acadence" }}
                  >
                    <span>Acadence 90/10 desk</span>
                  </Link>
                  <Link className="rn-btn ac-btn-outline" to="/climb-notes">
                    <span>Open Climb Notes</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        {visible ? (
          <section className="ac-voice-page-body">
            <div className="container">
              <VoiceFirstPatternLegend />
              <div id="luna-dock">
                <LunaVoiceDock />
              </div>
              <aside className="ac-voice-desk-card">
                <p className="ac-voice-desk-kicker">Client desk</p>
                <h2 className="ac-voice-desk-title">Acadence 90/10</h2>
                <p className="ac-voice-desk-lede">
                  Spoken lead desk for Mike Strelick and team. Ready, mail,
                  hold, sent. Nine lines. Captions on. Does not send.
                </p>
                <Link
                  className="rn-btn ac-btn-maroon"
                  to="/work/$slug"
                  params={{ slug: "acadence" }}
                >
                  <span>Open the spoken desk</span>
                </Link>
              </aside>
              <p className="ac-voice-page-next">
                Prefer reading first?{" "}
                <Link to="/climb-notes">Browse the journal</Link>
                {" · "}
                <Link to="/canopy">See Canopy</Link>
                {" · "}
                <Link to="/work">Works</Link>
                {" · "}
                <Link to="/service">Services</Link>
              </p>
            </div>
          </section>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
