/** Canopy radar data — newest first; includes ecosystem and Build notes */

import {
  climbNotes,
  isClimbNoteOnCanopy,
  climbNoteCanopySortKey,
  climbNoteCanopyDisplayDate,

  climbNoteXActionUrl,
  climbNoteDetailUrl,
} from "./climb-notes-data";
import { buildWorkXComposeUrl } from "@/lib/work-x";


export type TimelineKind =
  | "origin"
  | "milestone"
  | "product"
  | "feednote"
  | "changelog";

/** Who owns the entry on the shared spine */
export type TimelineActor =
  | "xai"
  | "build"
  | "acornsoft"
  | "tesla"
  | "spacex"
  | "research"
  | "signal";

/**
 * Grok product surface on Canopy — Imaging (Imagine), Voice, Grok, Grok Build.
 * Distinct from actor (who said it); surfaces are the product rail filters.
 */
export type TimelineSurface = "grok" | "imagine" | "voice" | "build";

export const SURFACE_LABEL: Record<TimelineSurface, string> = {
  grok: "Grok",
  imagine: "Imagine",
  voice: "Voice",
  build: "Grok Build",
};

export type TimelineEntry = {
  id: string;
  date: string;
  /** ISO-ish for sorting (desc = most recent first) */
  sortKey: string;
  title: string;
  body: string;
  kind: TimelineKind;
  actor: TimelineActor;
  /** Grok stack product surface when applicable */
  surface?: TimelineSurface;
  source?: string;
  href?: string;
  /** Optional X action (compose/schedule or live post) for Climb Notes */
  xHref?: string;
  xLabel?: string;
  xId?: string;
  bullets?: string[];
  version?: string;
  /** Highlight on Canopy (Advanced Development research) */
  standout?: boolean;
  /** From scheduled X API pull */
  live?: boolean;
  /** Canopy org sub-lane (e.g. Climb Notes journal entries) */
  lane?: "climb-notes";
};

/** Canonical history — always included; must start at formation of xAI */
export const originTimeline: TimelineEntry[] = [
  {
    id: "xai-founded",
    date: "March 9, 2023",
    sortKey: "2023-03-09",
    title: "xAI is founded",
    body: "Elon Musk incorporates xAI in Nevada. Mission: understand the true nature of the universe.",
    kind: "origin",
    actor: "xai",
    source: "xAI",
    href: "https://x.ai/",
  },
  {
    id: "xai-announced",
    date: "July 12, 2023",
    sortKey: "2023-07-12",
    title: "xAI publicly announced",
    body: "Musk announces xAI. Team includes researchers from DeepMind, OpenAI, Google Brain, Microsoft, Tesla, and University of Toronto.",
    kind: "origin",
    actor: "xai",
    source: "xAI",
    href: "https://x.ai/",
  },
  {
    id: "grok-1",
    date: "November 2023",
    sortKey: "2023-11-04",
    title: "Grok arrives on X",
    body: "Grok launches for X Premium Plus users—modeled after the Hitchhiker’s Guide, with real-time access to the X platform.",
    kind: "product",
    actor: "xai",
    surface: "grok",
    source: "xAI",
  },
  {
    id: "grok-1-open",
    date: "March 2024",
    sortKey: "2024-03-17",
    title: "Grok-1 open weights",
    body: "xAI open-sources Grok-1 base model weights and architecture under Apache 2.0.",
    kind: "milestone",
    actor: "xai",
    surface: "grok",
    source: "xAI",
  },
  {
    id: "grok-1.5",
    date: "March 28, 2024",
    sortKey: "2024-03-28",
    title: "Grok-1.5",
    body: "Improved reasoning and long-context capabilities. Followed by Grok-1.5V multimodal.",
    kind: "product",
    actor: "xai",
    surface: "grok",
    source: "xAI",
  },
  {
    id: "grok-2",
    date: "August 13, 2024",
    sortKey: "2024-08-13",
    title: "Grok-2 family",
    body: "Grok-2 and Grok-2 mini with stronger reasoning and image generation.",
    kind: "product",
    actor: "xai",
    surface: "grok",
    source: "xAI",
  },
  {
    id: "colossus",
    date: "2024–2025",
    sortKey: "2024-09-01",
    title: "Colossus training cluster",
    body: "xAI builds one of the world’s largest graphics processing unit training clusters to accelerate next-generation models.",
    kind: "milestone",
    actor: "xai",
    source: "xAI",
  },
  {
    id: "optimus-gen",
    date: "October 2024",
    sortKey: "2024-10-11",
    title: "Tesla Optimus progress",
    body: "Tesla continues public demos of Optimus humanoid robots for general-purpose work—relevant to future Grok and autonomy integration discussions.",
    kind: "milestone",
    actor: "tesla",
    source: "Tesla",
    href: "https://www.tesla.com/AI",
  },
  {
    id: "grok-3",
    date: "February 2025",
    sortKey: "2025-02-17",
    title: "Grok-3",
    body: "Major capability jump across reasoning, coding, and real-time knowledge.",
    kind: "product",
    actor: "xai",
    surface: "grok",
    source: "xAI",
  },
  {
    id: "x-acquisition",
    date: "March 2025",
    sortKey: "2025-03-28",
    title: "X joins xAI structure",
    body: "All-stock combination of X and xAI announced, unifying the real-time information network with the model stack.",
    kind: "milestone",
    actor: "xai",
    source: "xAI",
  },
  {
    id: "spacex-acquires-xai",
    date: "February 2, 2026",
    sortKey: "2026-02-02",
    title: "SpaceX acquires xAI and X group",
    body: "Space Exploration Technologies Corporation acquires the combined xAI and X entity in an all-stock transaction, positioning artificial intelligence as part of the SpaceX family of companies.",
    kind: "milestone",
    actor: "spacex",
    source: "SpaceX",
    href: "https://www.spacex.com/",
  },
  {
    id: "spacexai-rebrand-may",
    date: "May 2026",
    sortKey: "2026-05-15",
    title: "SpaceXAI branding direction",
    body: "Public statements describe folding xAI branding toward SpaceXAI, with Grok and X operating under the SpaceX artificial intelligence umbrella.",
    kind: "milestone",
    actor: "spacex",
    source: "SpaceXAI",
    href: "https://x.ai/",
  },
  {
    id: "grok-4",
    date: "2025–2026",
    sortKey: "2025-11-01",
    title: "Grok-4 era",
    body: "Continued frontier releases: Grok-4 line, voice, build, and imagine capabilities expand across products.",
    kind: "product",
    actor: "xai",
    source: "SpaceXAI",
  },
  {
    id: "optimus-grok-direction",
    date: "2025–2026",
    sortKey: "2025-07-10",
    title: "Grok and Optimus direction",
    body: "Public commentary from Elon Musk describes plans to combine Grok-class models with Tesla Optimus humanoid robots for onboard intelligence.",
    kind: "milestone",
    actor: "tesla",
    source: "Tesla / public remarks",
    href: "https://www.tesla.com/AI",
  },
  {
    id: "voice-agent-builder",
    date: "July 1, 2026",
    sortKey: "2026-07-01T15:33:21Z",
    title: "Voice Agent Builder",
    body: "No-code platform for human-like voice agents on Grok Voice—telephony, tools, guardrails, observability.",
    kind: "product",
    actor: "xai",
    surface: "voice",
    source: "@SpaceXAI",
    href: "https://x.com/SpaceXAI/status/2072342803787702422",
    xId: "2072342803787702422",
  },
  {
    id: "spacexai-rebrand",
    date: "July 6, 2026",
    sortKey: "2026-07-06T19:29:04Z",
    title: "Official account is SpaceXAI",
    body: "Official account rebrands to SpaceXAI, reflecting the tighter coupling of the model company and the X network under SpaceX.",
    kind: "milestone",
    actor: "spacex",
    source: "@SpaceXAI",
    href: "https://x.com/SpaceXAI/status/2074214064746832060",
    xId: "2074214064746832060",
  },
];

/**
 * Daily Grok Build command line interface changelogs (granular release notes).
 */
export const grokBuildChangelogs: TimelineEntry[] = [
  {
    id: "gb-workflows-0723",
    date: "July 23, 2026",
    sortKey: "2026-07-23T16:00:00Z",
    version: "Workflows",
    title: "Command line · Workflows parallel agents",
    body: "Reusable orchestration scripts divide large work across parallel agents, verify outputs, return consolidated results.",
    kind: "changelog",
    actor: "build",
    source: "Grok Build signal",
    href: "https://x.com/SweetNameDomain/status/2082937168650215562",
    bullets: [
      "Feature: Workflows for multi-agent background runs",
      "Feature: Verify outputs and consolidate results",
      "Signal: Parallel agent orchestration for large assignments",
    ],
  },
  {
    id: "gb-0.2.117",
    date: "July 30, 2026",
    sortKey: "2026-07-30T19:51:26Z",
    version: "v0.2.117",
    title: "Command line · transport layer security roots, subagent stop, faster resize",
    body: "Faster long fullscreen sessions, cleaner subagent stop behavior, enterprise custom transport layer security roots.",
    kind: "changelog",
    actor: "build",
    source: "Grok Build Changelog",
    href: "https://x.com/XFreeze/status/2082917000385274009",
    xId: "2082917000385274009",
    bullets: [
      "Feature: GROK_EXTRA_CA_BUNDLE environment variable for custom transport layer security root certificates",
      "Performance: Terminal resize much faster on long fullscreen conversations",
      "Fix: Stop terminates all background subagents from prior turns",
      "Fix: kill_task reports missing tasks correctly over agent control protocol",
      "Fix: get_task_output no longer waits full timeout for finished agent control protocol tasks",
      "Fix: usage and billing interface hidden for enterprise authentication setups",
      "Fix: Plan approval no longer starts Build on Enter without notes in revise mode",
    ],
  },
  {
    id: "gb-0.2.116",
    date: "July 30, 2026",
    sortKey: "2026-07-30T04:47:23Z",
    version: "v0.2.116",
    title: "Command line · streaming-json, undo, token refresh",
    body: "Headless streaming with tool calls, undo alias, smarter slash-command mode support, reliable token refresh after sleep.",
    kind: "changelog",
    actor: "build",
    source: "Grok Build Changelog",
    href: "https://x.com/XFreeze/status/2082689490657927463",
    xId: "2082689490657927463",
    bullets: [
      "Feature: Headless streaming-json includes tool calls, results, and usage",
      "Feature: undo restores files and chat to an earlier turn (same as rewind)",
      "Feature: Slash commands hidden or refused in minimal or fullscreen by declared support",
      "Fix: No more forced re-logins after laptop sleep or network hiccups",
      "Fix: Suppressed history-load warnings on draft conversations",
      "Fix: Settings enum pickers keep selection until Enter",
      "Fix: Deep-linked settings close modal on Escape or Enter",
    ],
  },
  {
    id: "gb-0.2.115",
    date: "July 29, 2026",
    sortKey: "2026-07-29T20:09:00Z",
    version: "v0.2.115",
    title: "Command line · prompt caching and reliability",
    body: "Reliability pass and prompt caching for long conversations (lower repeated billing).",
    kind: "changelog",
    actor: "build",
    source: "Grok Build Changelog",
    href: "https://x.com/XFreeze/status/2082559032821465563",
    xId: "2082559032821465563",
    bullets: [
      "Performance: Improved prompt caching for long conversations",
      "Fix: Chat history corruption and duplicate tool results",
      "Fix: Infinite redirect loops in embedded previews when cookies are blocked",
      "Fix: External authentication provider commands work on Windows",
      "Fix: Language server crashes and missing C Sharp diagnostics",
    ],
  },
  {
    id: "gb-0.2.114",
    date: "July 29, 2026",
    sortKey: "2026-07-29T13:08:43Z",
    version: "v0.2.114",
    title: "Command line · delete and startup reliability",
    body: "Session delete command and stronger startup reliability on constrained hosts.",
    kind: "changelog",
    actor: "build",
    source: "Grok Build Changelog",
    href: "https://x.com/XFreeze/status/2082453266160353716",
    xId: "2082453266160353716",
    bullets: [
      "Feature: delete removes current session history after confirmation",
      "Fix: No crash on startup when the host has no free threads",
    ],
  },
  {
    id: "gb-0.2.112",
    date: "July 25, 2026",
    sortKey: "2026-07-25T01:37:48Z",
    version: "v0.2.112",
    title: "Command line · tutorial, workflows, doctor, resume",
    body: "Guided tutorial, search tool overrides, live workflow progress, failed-run resume, wide reliability pass.",
    kind: "changelog",
    actor: "build",
    source: "Grok Build Changelog",
    href: "https://x.com/XFreeze/status/2080829838970290395",
    xId: "2080829838970290395",
    bullets: [
      "Breaking: Command line version policy splits soft floors and ceilings versus hard startup requirements",
      "Feature: tutorial — opt-in nine-topic onboarding tour",
      "Feature: tool overrides for date cutoffs and domain allowlists on search tools",
      "Feature: Live workflow overlay with per-agent progress; resume failed runs",
      "Feature: Hooks definable in config.toml; resume by title or identifier",
      "Fix: File attachments on resume; real exit codes for background shells",
      "Fix: Web search defaults to grok-4.5; voice dictation Enter reliability",
    ],
  },
];

/** SpaceX public announcements (identification only) */
export const spacexNotes: TimelineEntry[] = [
  {
    id: "sx-starship-ocean-float",
    date: "July 29, 2026",
    sortKey: "2026-07-29T05:39:52Z",
    title: "Starship still floating in the ocean",
    body: "Musk shares imagery of Starship remaining afloat after flight test recovery operations in the ocean.",
    kind: "feednote",
    actor: "spacex",
    source: "@elonmusk",
    href: "https://x.com/elonmusk/status/2082340308680135085",
    xId: "2082340308680135085",
  },
  {
    id: "sx-starship-recover-ship",
    date: "July 28, 2026",
    sortKey: "2026-07-28T23:17:49Z",
    title: "Ship out to recover Starship",
    body: "Musk: SpaceX is sending a ship to recover Starship after the recovery team gathers ocean imagery.",
    kind: "feednote",
    actor: "spacex",
    source: "@elonmusk",
    href: "https://x.com/elonmusk/status/2082244164197183805",
    xId: "2082244164197183805",
  },
  {
    id: "sx-starship-ch4-cost",
    date: "July 29, 2026",
    sortKey: "2026-07-29T23:40:54Z",
    title: "Starship cost-to-orbit path",
    body: "Musk on reusability and local liquid methane and oxygen production: path toward well below one hundred dollars per kilogram to orbit.",
    kind: "feednote",
    actor: "spacex",
    source: "@elonmusk",
    href: "https://x.com/elonmusk/status/2082612362226639328",
    xId: "2082612362226639328",
  },
  {
    id: "sx-nrol-95-launch",
    date: "July 30, 2026",
    sortKey: "2026-07-30T10:14:06Z",
    title: "Falcon 9 launches NROL-95",
    body: "SpaceX: Falcon 9 launches NROL-95 to orbit from pad 40 in Florida.",
    kind: "feednote",
    actor: "spacex",
    source: "@SpaceX",
    href: "https://x.com/SpaceX/status/2082771710818869482",
    xId: "2082771710818869482",
  },
  {
    id: "sx-nrol-95-lz2",
    date: "July 30, 2026",
    sortKey: "2026-07-30T07:20:08Z",
    title: "Falcon 9 first stage lands on Landing Zone 2",
    body: "SpaceX: first stage returns to Landing Zone 2 on the NROL-95 mission.",
    kind: "feednote",
    actor: "spacex",
    source: "@SpaceX",
    href: "https://x.com/SpaceX/status/2082727931244417170",
    xId: "2082727931244417170",
  },
  {
    id: "sx-nrol-95-watch",
    date: "July 30, 2026",
    sortKey: "2026-07-30T06:59:15Z",
    title: "Live coverage · NROL-95",
    body: "SpaceX invites watchers to Falcon 9 launch of the NROL-95 mission from Florida.",
    kind: "feednote",
    actor: "spacex",
    source: "@SpaceX",
    href: "https://x.com/SpaceX/status/2082722674732626193",
    xId: "2082722674732626193",
  },
  {
    id: "sx-thought-starship",
    date: "July 31, 2026",
    sortKey: "2026-07-31T04:23:28Z",
    title: "Starship visual double-take",
    body: "Musk: thought that was Starship for a second—Starship remains top-of-mind cultural signal.",
    kind: "feednote",
    actor: "spacex",
    source: "@elonmusk",
    href: "https://x.com/elonmusk/status/2083045860691116247",
    xId: "2083045860691116247",
  },
  {
    id: "sx-starship-13",
    date: "July 24, 2026",
    sortKey: "2026-07-24T19:41:55Z",
    title: "Starship thirteenth flight test window",
    body: "SpaceX announced track for Starship’s thirteenth flight test with a ninety-minute launch window and live coverage.",
    kind: "feednote",
    actor: "spacex",
    source: "@SpaceX",
    href: "https://x.com/SpaceX/status/2080740277782749472",
    xId: "2080740277782749472",
  },
  {
    id: "sx-starlink-cal",
    date: "July 25, 2026",
    sortKey: "2026-07-25T15:41:36Z",
    title: "Falcon 9 launches Starlink from California",
    body: "SpaceX Falcon 9 launched twenty-four Starlink satellites to orbit from California.",
    kind: "feednote",
    actor: "spacex",
    source: "@SpaceX",
    href: "https://x.com/SpaceX/status/2081042187584741573",
    xId: "2081042187584741573",
  },
  {
    id: "sx-nrol95",
    date: "July 28, 2026",
    sortKey: "2026-07-28T18:03:01Z",
    title: "Falcon 9 vertical for National Reconnaissance Office mission",
    body: "Falcon 9 vertical at pad forty in Florida ahead of the National Reconnaissance Office and United States Space Force Space Systems Command NROL-95 mission.",
    kind: "feednote",
    actor: "spacex",
    source: "@SpaceX",
    href: "https://x.com/SpaceX/status/2082164942862516225",
    xId: "2082164942862516225",
  },
  {
    id: "sx-ussf-missions",
    date: "July 29, 2026",
    sortKey: "2026-07-29T00:20:26Z",
    title: "Eighteen more United States Space Force missions",
    body: "SpaceX: Falcon 9 to launch eighteen more missions for the United States Space Force by September 2027 from Vandenberg Space Force Base.",
    kind: "feednote",
    actor: "spacex",
    source: "@SpaceX",
    href: "https://x.com/SpaceX/status/2082622310075302209",
    xId: "2082622310075302209",
  },
  {
    id: "sx-nrol95-go",
    date: "July 30, 2026",
    sortKey: "2026-07-30T06:32:38Z",
    title: "NROL-95 propellant load",
    body: "SpaceX reported systems looking good and propellant load beginning for NROL-95 from Florida.",
    kind: "feednote",
    actor: "spacex",
    source: "@SpaceX",
    href: "https://x.com/SpaceX/status/2082715974642335953",
    xId: "2082715974642335953",
  },
];

/** Tesla and Optimus-related public milestones (identification only) */
export const teslaNotes: TimelineEntry[] = [
  {
    id: "ts-10m-vehicles",
    date: "July 30, 2026",
    sortKey: "2026-07-30T05:59:32Z",
    title: "Ten millionth Tesla manufactured",
    body: "Tesla: produced the ten millionth vehicle globally at Fremont. Six years after the one millionth at the same plant.",
    kind: "milestone",
    actor: "tesla",
    source: "@Tesla",
    href: "https://x.com/Tesla/status/2082707648148099363",
    xId: "2082707648148099363",
  },
  {
    id: "ts-10m-elon",
    date: "July 30, 2026",
    sortKey: "2026-07-30T06:17:39Z",
    title: "Congratulations to the Tesla team",
    body: "Musk congratulates the team on ten million vehicles manufactured—scale signal for factory and software stack.",
    kind: "feednote",
    actor: "tesla",
    source: "@elonmusk",
    href: "https://x.com/elonmusk/status/2082712206169256279",
    xId: "2082712206169256279",
  },
  {
    id: "ts-dooring",
    date: "July 31, 2026",
    sortKey: "2026-07-31T00:34:25Z",
    title: "Dooring protection standard",
    body: "Tesla: dooring protection comes standard—vehicles resist first door open if something approaches in the blind spot.",
    kind: "product",
    actor: "tesla",
    source: "@Tesla",
    href: "https://x.com/Tesla/status/2082988217830425074",
    xId: "2082988217830425074",
  },
  {
    id: "ts-supercharger-renewables",
    date: "July 30, 2026",
    sortKey: "2026-07-30T02:53:19Z",
    title: "Renewables for Supercharger network",
    body: "Musk: part of Tesla’s push for renewable energy supply to the Supercharger network.",
    kind: "feednote",
    actor: "tesla",
    source: "@elonmusk",
    href: "https://x.com/elonmusk/status/2082660782429643127",
    xId: "2082660782429643127",
  },
  {
    id: "tesla-ai-day-legacy",
    date: "2021–2024",
    sortKey: "2022-09-30",
    title: "Tesla Artificial Intelligence and Optimus program",
    body: "Tesla Artificial Intelligence Day and follow-on events introduced Optimus as a general-purpose humanoid robot platform built on Tesla autonomy and manufacturing.",
    kind: "origin",
    actor: "tesla",
    source: "Tesla",
    href: "https://www.tesla.com/AI",
  },
  {
    id: "tesla-fsd-stack",
    date: "2024–2026",
    sortKey: "2024-06-01",
    title: "Tesla Full Self-Driving stack advances",
    body: "Ongoing Tesla Full Self-Driving supervised software releases and Dojo or cluster training narratives that inform Optimus and vehicle intelligence.",
    kind: "milestone",
    actor: "tesla",
    source: "Tesla",
    href: "https://www.tesla.com/AI",
  },
  {
    id: "tesla-optimus-factory",
    date: "2025–2026",
    sortKey: "2025-10-01",
    title: "Optimus factory and deployment path",
    body: "Tesla continues communicating Optimus manufacturing and internal deployment goals for repetitive factory and logistics work.",
    kind: "product",
    actor: "tesla",
    source: "Tesla",
    href: "https://www.tesla.com/AI",
  },
  {
    id: "tesla-optimus-grok",
    date: "July 2025",
    sortKey: "2025-07-10T12:00:00Z",
    title: "Optimus and Grok integration intent",
    body: "Public remarks describe intent to bring Grok-class models into Optimus for richer human-robot interaction and task understanding. Not an Acornsoft product claim.",
    kind: "milestone",
    actor: "tesla",
    source: "Public remarks",
    href: "https://www.tesla.com/AI",
  },
];

/** Curated X feednotes from official or team posts */
export const xFeednotes: TimelineEntry[] = [
  {
    id: "feed-imagine-upgrade-0731",
    date: "July 31, 2026",
    sortKey: "2026-07-31T05:54:34Z",
    title: "Imagine upgrade",
    body: "Elon Musk amplifies a major Grok Imagine Templates upgrade: photo edit, restyle, smart resize, background remover, emoji creator, merch maker, and more presets.",
    kind: "feednote",
    actor: "xai",
    surface: "imagine",
    source: "@elonmusk",
    href: "https://x.com/elonmusk/status/2083068786731553123",
    xId: "2083068786731553123",
  },
  {
    id: "feed-imagine-video-0731",
    date: "July 31, 2026",
    sortKey: "2026-07-31T03:25:52Z",
    title: "Grok Imagine in the wild",
    body: "Short-form Imagine demos continue to dominate the product surface—Musk reposts fresh Grok Imagine creative output.",
    kind: "feednote",
    actor: "xai",
    surface: "imagine",
    source: "@elonmusk",
    href: "https://x.com/elonmusk/status/2083031362756313410",
    xId: "2083031362756313410",
  },
  {
    id: "feed-46-significant",
    date: "July 30, 2026",
    sortKey: "2026-07-30T04:05:46Z",
    title: "Grok 4.6 called a significant improvement",
    body: "After praise for Grok 4.5 high fast, Musk states Grok 4.6 is a significant improvement—model cadence remains the headline signal.",
    kind: "feednote",
    actor: "xai",
    surface: "grok",
    source: "@elonmusk",
    href: "https://x.com/elonmusk/status/2082679015161069831",
    xId: "2082679015161069831",
  },
  {
    id: "feed-imagine-0730-video",
    date: "July 30, 2026",
    sortKey: "2026-07-30T02:35:16Z",
    title: "Grok Imagine creative pulse",
    body: "Another high-engagement Imagine share from Musk—image and video generation remains the public-facing product drumbeat.",
    kind: "feednote",
    actor: "xai",
    surface: "imagine",
    source: "@elonmusk",
    href: "https://x.com/elonmusk/status/2082656239780266487",
    xId: "2082656239780266487",
  },
  {
    id: "feed-build-community-remote",
    date: "July 31, 2026",
    sortKey: "2026-07-31T09:27:30Z",
    title: "Community · remote control for Grok 4.5 and Build",
    body: "Builders ship remote control layers over Grok Build command line and Voice Think Fast—parallel sessions, dictation, model selector ready for Grok 4.6.",
    kind: "feednote",
    actor: "xai",
    source: "@PawelHuryn",
    href: "https://x.com/PawelHuryn/status/2083122371720815014",
    xId: "2083122371720815014",
  },
  {
    id: "feed-build-zero-edit-video",
    date: "July 31, 2026",
    sortKey: "2026-07-31T10:40:36Z",
    title: "Community · Grok Build end-to-end video pipeline",
    body: "Creators report frame analysis, Imagine stills, video render, and audio laydown through Grok Build with almost no manual editing—agentic creative loops.",
    kind: "feednote",
    actor: "xai",
    source: "@kenn_ronin",
    href: "https://x.com/kenn_ronin/status/2083140767279648957",
    xId: "2083140767279648957",
  },
  {
    id: "feed-build-cli-content",
    date: "July 31, 2026",
    sortKey: "2026-07-31T10:03:25Z",
    title: "Community · Grok Build command line for video content",
    body: "Builders compare Imagine limits to Grok Build command line for longer prompted video sequences—toolchain over chat.",
    kind: "feednote",
    actor: "xai",
    source: "@ikyukuu",
    href: "https://x.com/ikyukuu/status/2083131409498329260",
    xId: "2083131409498329260",
  },
  {
    id: "feed-build-0.2.117-noticed",
    date: "July 31, 2026",
    sortKey: "2026-07-31T11:48:05Z",
    title: "Community · Build 0.2.117 day-after notes",
    body: "Practitioners call out stop killing subagents, undo as rewind, and streaming-json tool calls—daily changelog is the Grok Build pulse.",
    kind: "feednote",
    actor: "xai",
    source: "@bradshannon",
    href: "https://x.com/bradshannon/status/2083157750507340280",
    xId: "2083157750507340280",
  },
  {
    id: "feed-imagine-emoji-gif",
    date: "July 31, 2026",
    sortKey: "2026-07-31T12:01:43Z",
    title: "Community · Imagine emoji templates into Grok Build GIFs",
    body: "Users chain new Imagine emoji templates into Grok Build GIF workflows—product surface is creative tooling, not only chat.",
    kind: "feednote",
    actor: "xai",
    surface: "imagine",
    source: "@princess414141",
    href: "https://x.com/princess414141/status/2083161180298678412",
    xId: "2083161180298678412",
  },
  {
    id: "feed-build-workflows-agents",
    date: "July 23, 2026",
    sortKey: "2026-07-23T18:00:00Z",
    title: "Grok Build Workflows for parallel agents",
    body: "Reports of Workflows dividing large assignments across parallel agents, background runs, verification, and consolidated results—orchestration layer matures.",
    kind: "milestone",
    actor: "xai",
    source: "X signal",
    href: "https://x.com/SweetNameDomain/status/2082937168650215562",
    xId: "2082937168650215562",
  },
  {
    id: "feed-build-open-harness",
    date: "July 15, 2026",
    sortKey: "2026-07-15T18:00:00Z",
    title: "Grok Build agent harness local-first",
    body: "Open-sourcing narrative around the agent harness: context assembly, tool dispatch, extensions, subagents, agent loop—local inference path.",
    kind: "milestone",
    actor: "xai",
    source: "X signal",
    href: "https://x.com/SweetNameDomain/status/2082937168650215562",
    xId: "2082937168650215562",
  },
  {
    id: "feed-build-web-ios-android",
    date: "July 29, 2026",
    sortKey: "2026-07-29T02:42:48Z",
    title: "Grok Build publish to web, iOS, and Android",
    body: "Signals that Grok Build can publish apps from one prompt across web and mobile targets—platform move from chat to deploy.",
    kind: "product",
    actor: "xai",
    source: "@xWatchlist_",
    href: "https://x.com/xWatchlist_/status/2082295750843912234",
    xId: "2082295750843912234",
  },
  {
    id: "feed-build-cli-launch",
    date: "July 25, 2026",
    sortKey: "2026-07-25T22:30:01Z",
    title: "Grok Build as command line tool",
    body: "Public framing: SpaceXAI shipping developer tools—not only chatbots. Race moves from models to toolchains.",
    kind: "product",
    actor: "xai",
    source: "@AskMichaelTaiwo",
    href: "https://x.com/AskMichaelTaiwo/status/2081144971818942504",
    xId: "2081144971818942504",
  },
  {
    id: "feed-build-progress-month",
    date: "June 14, 2026",
    sortKey: "2026-06-14T22:21:27Z",
    title: "Grok Build month of velocity",
    body: "Community roundup: continuous features, plugin marketplace, dedicated Build model, Composer integration—native AI development ecosystem narrative.",
    kind: "milestone",
    actor: "xai",
    source: "@XFreeze",
    href: "https://x.com/XFreeze/status/2066284913020821953",
    xId: "2066284913020821953",
  },
  {
    id: "feed-laurenbench-45",
    date: "July 29, 2026",
    sortKey: "2026-07-29T14:23:42Z",
    title: "Grok 4.5 on LaurenBench agents",
    body: "Third-party agent bench reports Grok 4.5 leading conversation, tool use, memory, and safety categories—Musk amplifies path to Grok 4.6.",
    kind: "feednote",
    actor: "xai",
    source: "@cb_doge",
    href: "https://x.com/cb_doge/status/2082472135910473976",
    xId: "2082472135910473976",
  },
  {
    id: "feed-voice-aa-index",
    date: "July 29, 2026",
    sortKey: "2026-07-29T18:09:36Z",
    title: "Voice Think Fast 2.0 on Artificial Analysis",
    body: "Independent speech-to-speech index: Think Fast 2.0 High near top of index, first on Tau Voice agentic, sub-second time to first audio.",
    kind: "feednote",
    actor: "xai",
    surface: "voice",
    source: "@ArtificialAnlys",
    href: "https://x.com/ArtificialAnlys/status/2082528987272957960",
    xId: "2082528987272957960",
  },
  {
    id: "feed-46-week",
    date: "July 30, 2026",
    sortKey: "2026-07-30T05:59:08Z",
    title: "Grok 4.6 on the horizon",
    body: "After Grok 4.5 leads agent benchmarks, Musk notes Grok 4.6 arrives in about a week.",
    kind: "feednote",
    actor: "xai",
    source: "@elonmusk",
    href: "https://x.com/elonmusk/status/2082707547203518569",
    xId: "2082707547203518569",
  },
  {
    id: "feed-build-update-elon",
    date: "July 30, 2026",
    sortKey: "2026-07-30T05:50:34Z",
    title: "Grok Build update signal",
    body: "Musk amplifies the Grok Build release notes stream—daily command line interface velocity continues.",
    kind: "feednote",
    actor: "xai",
    source: "@elonmusk",
    href: "https://x.com/elonmusk/status/2082705390358212687",
    xId: "2082705390358212687",
  },
  {
    id: "feed-voice-agentic",
    date: "July 29, 2026",
    sortKey: "2026-07-29T20:12:25Z",
    title: "Grok Voice agentic performance",
    body: "Musk: Grok Voice is number one in agentic performance after Think Fast 2.0 release.",
    kind: "feednote",
    actor: "xai",
    surface: "voice",
    source: "@elonmusk",
    href: "https://x.com/elonmusk/status/2082559894264430870",
    xId: "2082559894264430870",
  },
  {
    id: "feed-voice-fast-2",
    date: "July 29, 2026",
    sortKey: "2026-07-29T18:10:46Z",
    title: "Grok Voice Think Fast 2.0",
    body: "SpaceXAI announces next-generation voice model—better intelligence, transcription, and conversation.",
    kind: "feednote",
    actor: "xai",
    surface: "voice",
    source: "@SpaceXAI",
    href: "https://x.com/SpaceXAI/status/2082529280341553209",
    xId: "2082529280341553209",
  },
  {
    id: "feed-grok-build-railway",
    date: "July 2, 2026",
    sortKey: "2026-07-02T17:46:06Z",
    title: "Grok Build in Railway sandboxes",
    body: "Grok Build is installed in Railway sandboxes for agentic coding in the cloud.",
    kind: "feednote",
    actor: "xai",
    source: "@SpaceXAI",
    href: "https://x.com/SpaceXAI/status/2072738598663946648",
    xId: "2072738598663946648",
  },
  {
    id: "feed-mongodb-plugin",
    date: "June 24, 2026",
    sortKey: "2026-06-24T15:47:49Z",
    title: "MongoDB plugin for Grok Build",
    body: "Official MongoDB plugin: query data, optimize indexes, and manage databases from Grok Build.",
    kind: "feednote",
    actor: "xai",
    source: "@SpaceXAI",
    href: "https://x.com/SpaceXAI/status/2069809728088350789",
    xId: "2069809728088350789",
  },
  {
    id: "feed-firecrawl",
    date: "June 23, 2026",
    sortKey: "2026-06-23T21:42:36Z",
    title: "Firecrawl in Grok Build marketplace",
    body: "Agents can search, scrape, and interact with the web via the Firecrawl plugin.",
    kind: "feednote",
    actor: "xai",
    source: "@SpaceXAI",
    href: "https://x.com/SpaceXAI/status/2069536627349962987",
    xId: "2069536627349962987",
  },
];

/**
 * Advanced Development research — Acornsoft standout track.
 * Highlighted on Canopy; sourced from @acornsoftai on X where applicable.
 */
export const advancedDevelopmentNotes: TimelineEntry[] = [
  {
    id: "adr-color-filters",
    date: "July 31, 2026",
    sortKey: "2026-07-31T13:00:02Z",
    title: "Advanced Development · color system and filters",
    body: "Research in the open: how color systems and filters work in the Unofficial COVID Report—literacy tools built with Grok Build.",
    kind: "feednote",
    actor: "research",
    standout: true,
    source: "@acornsoftai",
    href: "https://x.com/acornsoftai/status/2083175856415870996",
    xId: "2083175856415870996",
  },
  {
    id: "adr-first-tool",
    date: "July 30, 2026",
    sortKey: "2026-07-30T23:00:02Z",
    title: "Advanced Development · first small usable tool",
    body: "First small, usable tool under Acornsoft, built with Grok, Grok Build, Imagine, and Voice. More coming. The record is the boss.",
    kind: "feednote",
    actor: "research",
    standout: true,
    source: "@acornsoftai",
    href: "https://x.com/acornsoftai/status/2082964462156533835",
    xId: "2082964462156533835",
  },
  {
    id: "adr-archive-reading",
    date: "July 30, 2026",
    sortKey: "2026-07-30T18:00:00Z",
    title: "Advanced Development · archive as reading tool",
    body: "Research question: can an archive be a reading tool, not a narrative? Jump by year, filter by theme, search. Claims next to sources.",
    kind: "feednote",
    actor: "research",
    standout: true,
    source: "@acornsoftai",
    href: "https://x.com/acornsoftai/status/2082888958141145230",
    xId: "2082888958141145230",
  },
  {
    id: "adr-primary-docs",
    date: "July 29, 2026",
    sortKey: "2026-07-29T23:30:00Z",
    title: "Advanced Development · primary documents, color-coded",
    body: "One hundred ninety-three filterable entries. Green matches the record, yellow missing context, red conflicts. Built end-to-end with Grok Build.",
    kind: "feednote",
    actor: "research",
    standout: true,
    source: "@acornsoftai",
    href: "https://x.com/acornsoftai/status/2082609618505904335",
    xId: "2082609618505904335",
  },
  {
    id: "adr-article",
    date: "July 29, 2026",
    sortKey: "2026-07-29T18:19:58Z",
    title: "Advanced Development · long-form on X",
    body: "Long-form note on Advanced Development work with Grok and Grok Build—published as an X article for open review.",
    kind: "feednote",
    actor: "research",
    standout: true,
    source: "@acornsoftai",
    href: "https://x.com/acornsoftai/status/2082531594959495530",
    xId: "2082531594959495530",
  },
  {
    id: "adr-unofficial-covid",
    date: "July 29, 2026",
    sortKey: "2026-07-29T17:55:15Z",
    title: "Advanced Development · Unofficial COVID Report",
    body: "Live research app contribution: interactive primary-document report. Built to be opened and explored.",
    kind: "product",
    actor: "research",
    standout: true,
    source: "@acornsoftai",
    href: "https://x.com/acornsoftai/status/2082525374588530732",
    xId: "2082525374588530732",
  },
  {
    id: "adr-charter",
    date: "July 2026",
    sortKey: "2026-07-20T12:00:00Z",
    title: "Advanced Development research track opens",
    body: "Acornsoft formalizes Advanced Development: first-principles research in public, small usable tools, failure written down, evidence over narrative. Outputs surface on Canopy and on X via @acornsoftai.",
    kind: "milestone",
    actor: "research",
    standout: true,
    source: "Acornsoft",
  },
];

/** Acornsoft lane — studio posts + shipped work on the Canopy spine */
export const acornsoftNotes: TimelineEntry[] = [
  {
    id: "as-studio-note",
    date: "July 2026",
    sortKey: "2026-07-15T12:00:00Z",
    title: "Studio lane on Canopy",
    body: "Acornsoft studio signals share the spine with Advanced Development research. Research standouts use the Advanced Development filter and gold standout cards.",
    kind: "milestone",
    actor: "acornsoft",
    source: "Acornsoft",
  },
  {
    id: "as-work-dropshipping",
    date: "Commerce · shipped",
    sortKey: "2025-11-01T12:00:00Z",
    title: "Dropshipping site — shipped",
    body: "Built and launched a full dropshipping storefront: product catalog, cart and checkout, and the operational wiring to fulfill orders. Live paths customers could complete.",
    kind: "product",
    actor: "acornsoft",
    source: "Work · Acornsoft",
    href: "https://blaszyk.us/",
    xHref: buildWorkXComposeUrl({
      id: "dropshipping",
      title: "Dropshipping site — shipped",
      blurb:
        "Full storefront: catalog, cart, checkout, fulfillment wiring. Production commerce, not a mock.",
      siteUrl: "https://blaszyk.us/",
      tags: ["#Acornsoft", "#BuildInPublic", "#Commerce"],
    }),
    xLabel: "Schedule on X →",
    standout: true,
    bullets: [
      "Catalog → cart → checkout path",
      "Fulfillment-ready operations wiring",
      "Production storefront, not a mock",
    ],
  },
  {
    id: "as-work-sals-barbershop",
    date: "Local business · shipped",
    sortKey: "2025-10-15T12:00:00Z",
    title: "Sal’s Barbershop — web presence",
    body: "Designed and shipped the web presence for Sal’s Barbershop so neighbors could find services, hours, and how to book without phone tag. Small-business site with a clear job: get people into the chair.",
    kind: "product",
    actor: "acornsoft",
    source: "Work · Acornsoft",
    href: "https://blaszyk.us/",
    xHref: buildWorkXComposeUrl({
      id: "sals-barbershop",
      title: "Sal’s Barbershop — web presence",
      blurb:
        "Local barbershop site: services, hours, contact — get people into the chair without phone tag.",
      siteUrl: "https://blaszyk.us/",
      tags: ["#Acornsoft", "#BuildInPublic", "#SmallBusiness"],
    }),
    xLabel: "Schedule on X →",
    standout: true,
    bullets: [
      "Services and hours that read in seconds",
      "Contact path built for walk-ins and regulars",
      "Local business, production ready",
    ],
  },
  {
    id: "as-work-unofficial-covid-report",
    date: "Public information · shipped",
    sortKey: "2025-10-01T12:00:00Z",
    title: "Unofficial COVID Report — launched",
    body: "Built the Unofficial COVID Report: an independent site that collected and presented pandemic signals in plain language when official updates lagged. Fast publishing, readable layout, focus on what people needed to know next.",
    kind: "product",
    actor: "acornsoft",
    source: "Work · Acornsoft",
    href: "https://unofficial-covid-report.acornsoft.ai/",
    xHref: buildWorkXComposeUrl({
      id: "unofficial-covid-report",
      title: "Unofficial COVID Report — launched",
      blurb:
        "Independent plain-language COVID signals when official channels lagged. Educational reporting surface.",
      siteUrl: "https://unofficial-covid-report.acornsoft.ai/",
      tags: ["#Acornsoft", "#BuildInPublic", "#OpenData"],
    }),
    xLabel: "Schedule on X →",
    standout: true,
    bullets: [
      "Independent reporting surface",
      "Plain-language updates under pressure",
      "Ship when the news cycle would not wait",
    ],
  },
];


/** Infer Grok stack surface from actor, kind, and copy. */
export function inferTimelineSurface(
  entry: Pick<
    TimelineEntry,
    "title" | "body" | "actor" | "kind" | "source" | "surface"
  >,
): TimelineSurface | undefined {
  if (entry.surface) return entry.surface;
  if (entry.actor === "build" || entry.kind === "changelog") return "build";

  const t = `${entry.title} ${entry.body} ${entry.source ?? ""}`.toLowerCase();
  const scores: Record<TimelineSurface, number> = {
    build: 0,
    imagine: 0,
    voice: 0,
    grok: 0,
  };

  if (
    /grok build|build changelog|command line|subagent|workflows parallel|agent harness|streaming-json/.test(
      t,
    )
  ) {
    scores.build += 4;
  }
  if (
    /imagine|imaging|image gen|photo edit|restyle|background remover|emoji creator|merch maker/.test(
      t,
    )
  ) {
    scores.imagine += 4;
  }
  if (
    /\bvoice\b|think fast|speech-to-speech|tau voice|voice agent|dictation/.test(
      t,
    )
  ) {
    scores.voice += 4;
  }
  if (
    /grok[\s-]?[0-9]|grok arrives|grok-1|grok-2|grok-3|grok-4|model cadence|\bgrok\b/.test(
      t,
    )
  ) {
    scores.grok += 2;
  }

  // Prefer product-specific hits over generic "Grok" mentions
  const ranked = (Object.keys(scores) as TimelineSurface[]).sort(
    (a, b) => scores[b] - scores[a],
  );
  const top = ranked[0];
  if (scores[top] <= 0) return undefined;
  // If build and imagine both high (Imagine→Build chains), keep both signals but
  // pick the higher score; ties break to more specific product order.
  if (scores[ranked[0]] === scores[ranked[1]] && scores[ranked[0]] > 0) {
    const order: TimelineSurface[] = ["build", "imagine", "voice", "grok"];
    return order.find((s) => scores[s] === scores[ranked[0]]);
  }
  return top;
}

export function withInferredSurface(entry: TimelineEntry): TimelineEntry {
  const surface = inferTimelineSurface(entry);
  return surface ? { ...entry, surface } : entry;
}


/** Product surface anchors — Grok stack rails on Canopy */
export const grokStackAnchors: TimelineEntry[] = [
  {
    id: "product-grok-surface",
    date: "November 2023",
    sortKey: "2023-11-04T12:00:00Z",
    title: "Grok · product surface",
    body: "Grok is the conversational model surface—reasoning, real-time X context, and model cadence from Grok-1 through the Grok-4 line.",
    kind: "product",
    actor: "xai",
    surface: "grok",
    source: "xAI",
    href: "https://x.ai/",
  },
  {
    id: "product-imagine-surface",
    date: "2024–2026",
    sortKey: "2024-08-13T14:00:00Z",
    title: "Imagine · imaging surface",
    body: "Grok Imagine is the imaging and creative surface—image and video generation, templates, photo edit, restyle, and public creative demos.",
    kind: "product",
    actor: "xai",
    surface: "imagine",
    source: "xAI",
    href: "https://x.ai/",
  },
  {
    id: "product-voice-surface",
    date: "2025–2026",
    sortKey: "2025-06-01T12:00:00Z",
    title: "Voice · speech surface",
    body: "Grok Voice is the speech and agentic voice surface—Think Fast models, speech-to-speech, and Voice Agent Builder tooling.",
    kind: "product",
    actor: "xai",
    surface: "voice",
    source: "xAI",
    href: "https://grok.x.ai/",
  },
  {
    id: "product-build-surface",
    date: "2025–2026",
    sortKey: "2025-09-01T12:00:00Z",
    title: "Grok Build · builder surface",
    body: "Grok Build is the agentic coding and app-builder surface—command line, workflows, plugins, publish targets, and daily changelogs.",
    kind: "product",
    actor: "build",
    surface: "build",
    source: "Grok Build",
  },
];

/**
 * Official Grok / Build / Imagine / Voice launches that weekly X search
 * will drop after 7 days. These stay on Canopy.
 */
export const stackLaunches: TimelineEntry[] = [
  {
    id: "launch-grok-46",
    date: "August 12, 2026",
    sortKey: "2026-08-12T15:32:11Z",
    title: "Grok 4.6 is out",
    body: "Frontier intelligence at the same price as 4.5. Live in Grok Build, Cursor, Grok Bot, and the API. Double included usage in Cursor and Grok Build for the first week.",
    kind: "milestone",
    actor: "xai",
    surface: "grok",
    source: "@SpaceXAI",
    href: "https://x.ai/news/grok-4-6",
    xId: "2087562800982077492",
    standout: true,
  },
  {
    id: "launch-imagine-edit-0808",
    date: "August 8, 2026",
    sortKey: "2026-08-08T18:00:00Z",
    title: "Imagine image editing — major upgrade",
    body: "Elon: major upgrade to Grok Imagine image editing. Professional usefulness, consumer fun, and ease of use are the stated focus.",
    kind: "product",
    actor: "xai",
    surface: "imagine",
    source: "@elonmusk",
    href: "https://x.com/elonmusk/status/2086127247077843282",
    xId: "2086127247077843282",

  },
  {
    id: "launch-voice-connectors",
    date: "August 5, 2026",
    sortKey: "2026-08-05T19:18:48Z",
    title: "Voice Mode · connectors",
    body: "Connectors are live in Voice Mode. Ask Grok about email, meetings, or any existing connector by talking.",
    kind: "product",
    actor: "xai",
    surface: "voice",
    source: "@grok",
    href: "https://x.com/grok/status/2085083115488260175",
    xId: "2085083115488260175",
    standout: true,
  },
  {
    id: "launch-imagine-video-15",
    date: "August 1, 2026",
    sortKey: "2026-08-01T00:46:21Z",
    title: "Imagine Video 1.5 · text-to-video, 1080p, references",
    body: "Imagine Video 1.5 adds text-to-video, image and voice references, and native 1080p. Rolling out on web, apps, and the Imagine API.",
    kind: "product",
    actor: "xai",
    surface: "imagine",
    source: "@grok",
    href: "https://x.ai/news/grok-imagine-video-1-5-references",
    xId: "2083353607370416632",
    standout: true,
  },
  {
    id: "launch-grok-build-0801",
    date: "August 1, 2026",
    sortKey: "2026-08-01T04:16:02Z",
    title: "Grok Build · x.ai/build",
    body: "Elon: Grok Build can do almost anything you can think of. Official builder surface at x.ai/build.",
    kind: "product",
    actor: "build",
    surface: "build",
    source: "@elonmusk",
    href: "https://x.ai/build",
    xId: "2083406375955177911",
    standout: true,
  },
];

/** Tool-builder signals we keep on the radar even between live pulls. */
export const signalNotes: TimelineEntry[] = [
  {
    id: "dr-dsa-explorer",
    date: "August 28, 2026",
    sortKey: "2026-08-28T07:58:17Z",
    title: "DSA Explorer ships",
    body: "@DataRepublican put a year’s research on one map: org, person, project — walk the ties. USASpending and nonprofit graphs were the warm-up. This is the tool-builder on fire. DataRepublican v2.0 is next.",
    kind: "product",
    actor: "signal",
    standout: true,
    source: "@DataRepublican",
    href: "https://datarepublican.com/dsa-explorer/",
  },
  {
    id: "dr-unelected",
    date: "August 28, 2026",
    sortKey: "2026-08-28T07:58:18Z",
    title: "Unelected — October 13",
    body: "Jennica Pounds and Joshua Lisec. The book behind the maps. Passage Press.",
    kind: "milestone",
    actor: "signal",
    source: "@DataRepublican",
    href: "https://www.amazon.com/Unelected-Jennica-Pounds/dp/B0GGYQNWHJ",
  },
];

/** Newest first (desc by sortKey). History still includes founding day. */

export function buildRadarTimeline(): TimelineEntry[] {
  const map = new Map<string, TimelineEntry>();
  for (const e of [
    ...originTimeline,
    ...grokStackAnchors,
    ...stackLaunches,
    ...xFeednotes,

    ...grokBuildChangelogs,
    ...acornsoftNotes,
    ...advancedDevelopmentNotes,
    ...spacexNotes,
    ...teslaNotes,
    ...signalNotes,
    ...climbNotesTimelineEntries(),
  ]) {
    map.set(e.id, withInferredSurface(e));
  }
  return [...map.values()].sort((a, b) => b.sortKey.localeCompare(a.sortKey));
}

/** Published Climb Notes opted into Canopy (Climb Notes lane). */
function climbNotesTimelineEntries(): TimelineEntry[] {
  return climbNotes
    .filter((n) => isClimbNoteOnCanopy(n))
    .map((n): TimelineEntry => {
      const body = [n.problem, n.measure, n.slice, n.lesson]
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      const x = climbNoteXActionUrl(n);
      return {
        id: `climb-note-${n.id}`,
        date: climbNoteCanopyDisplayDate(n),
        sortKey: climbNoteCanopySortKey(n),

        title: `Climb Note ${n.number} · ${n.title}`,
        body: body.length > 420 ? `${body.slice(0, 417)}…` : body,
        kind: "product",
        actor: "acornsoft",
        lane: "climb-notes",
        source: "Climb Notes",
        href: climbNoteDetailUrl(n),
        xHref: x.href,
        xLabel: x.kind === "live" ? "Open on X →" : "Schedule on X →",
      };
    });
}
