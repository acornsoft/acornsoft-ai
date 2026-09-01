/**
 * Locked marketing lines. Repeat these. Do not invent a second story.
 *
 * Climb Notes are the same four beats for a shop owner and an engineer.
 * Grok-based tools run the step. The journal is the proof.
 *
 * Public mountain beats (Luna Foundry Multiagent). Same four names
 * on the site, the notes, and the extension. Do not name MacroFlow,
 * Constitution, Clarify, or Workforce on public surfaces.
 *
 * Orwell on public copy: short words, active voice, cut. No “not X, it’s Y.”
 * Mountain beats are product, not decoration.
 */

export const FOUR_MOVES = "Base Camp, Route, Waypoint, Summit";

/** Display spine. DB keys stay problem/measure/slice/lesson. */
export const CLIMB_BEATS = [
  {
    key: "problem" as const,
    n: 1 as const,
    label: "Base Camp",
    plain: "Are we fit to leave?",
    hint: "Gear, weather, rules of the mountain, who we are on this trip.",
    stage: "Gear · weather · who we are",
  },
  {
    key: "measure" as const,
    n: 2 as const,
    label: "Route",
    plain: "One summit objective",
    hint: "Clear success marks. What we are not climbing today.",
    stage: "Success marks · not today",
  },
  {
    key: "slice" as const,
    n: 3 as const,
    label: "Waypoint",
    plain: "Check the map",
    hint: "Stop, look around, recover if needed, then decide: hold or go.",
    stage: "Hold or go",
  },
  {
    key: "lesson" as const,
    n: 4 as const,
    label: "Summit",
    plain: "Build, prove, evidence home",
    hint: "The rope team builds, proves, and brings evidence home.",
    stage: "Evidence home",
  },
] as const;

export const CROSSOVER =
  "Climb Notes™ are the same four beats for a shop owner and an engineer.";

export const CROSSOVER_SHORT =
  "Same four beats on both sides of the table.";

export const GNOMAH_BRAIN =
  "The journal holds the climbs so the next step starts from a trail.";

export const LUNA_SHERPA =
  "Luna is our voice Sherpa. Climb Notes drive her.";

export const PLATFORM =
  "Acornsoft builds with voice and agents.";

export const LUNA_SHERPA_PLAIN =
  "Luna is your Sherpa. She walks with you. Your write-up is what she follows.";

/** Public, non-technical. Use these on home / start / Field Guide / Services. */
export const PUBLIC_NEED = "Start with what’s bugging you.";

export const PUBLIC_AGENTS =
  "Write it down in four answers. Then we put agents on it: one finds the stuff, one builds a page you can open, one shows you how it works, and one you can talk to.";

export const ZERO_TO_ONE_PLAIN =
  "Tell us what’s stuck. We’ll build something you can use.";

export const LIGHTSPEED_PLAIN =
  "Write down what’s stuck. We turn it over to an agent who can fix it.";

/** Landing stamp. Repeat on every home slide. */
export const LIGHTSPEED =
  "Climb Notes™ are how we build with AI, fast.";

export const TWENTY_X =
  "We use that trail to aim for about twenty times a normal build cycle. The journal is the proof.";

/** 0→1: a layperson writes a Climb Note; we turn it into software. */
export const ZERO_TO_ONE =
  "Write your problem as a Climb Note. Send it to Acornsoft. We build your software.";
