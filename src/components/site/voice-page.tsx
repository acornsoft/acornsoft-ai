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
                  Voice with Luna (Ara) is available when you are signed in.
                  Sign in with X to open Grok Voice and the on-site guide for{" "}
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
                  A voice-first path into <ClimbNotesMark /> — for everyone
                  learning the mountaineering metaphor, not only developers.{" "}
                  <strong>Luna and Ara are one and the same</strong>: your Sherpa
                  on <strong>{VOICE_LABEL}</strong>. Describe a problem or
                  business goal in plain language; she guides you to the right
                  trail.
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
              <p className="ac-voice-page-next">
                Prefer reading first?{" "}
                <Link to="/climb-notes">Browse the journal</Link>
                {" · "}
                <Link to="/canopy">See Canopy</Link>
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
