import { o as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as SiteHeader } from "./site-chrome-D2wQyRd1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/canopy-D17x-yDo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SURFACE_LABEL = {
	grok: "Grok",
	imagine: "Imagine",
	voice: "Voice",
	build: "Grok Build"
};
/** Canonical history — always included; must start at formation of xAI */
var originTimeline = [
	{
		id: "xai-founded",
		date: "March 9, 2023",
		sortKey: "2023-03-09",
		title: "xAI is founded",
		body: "Elon Musk incorporates xAI in Nevada. Mission: understand the true nature of the universe.",
		kind: "origin",
		actor: "xai",
		source: "xAI",
		href: "https://x.ai/"
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
		href: "https://x.ai/"
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
		source: "xAI"
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
		source: "xAI"
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
		source: "xAI"
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
		source: "xAI"
	},
	{
		id: "colossus",
		date: "2024–2025",
		sortKey: "2024-09-01",
		title: "Colossus training cluster",
		body: "xAI builds one of the world’s largest graphics processing unit training clusters to accelerate next-generation models.",
		kind: "milestone",
		actor: "xai",
		source: "xAI"
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
		href: "https://www.tesla.com/AI"
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
		source: "xAI"
	},
	{
		id: "x-acquisition",
		date: "March 2025",
		sortKey: "2025-03-28",
		title: "X joins xAI structure",
		body: "All-stock combination of X and xAI announced, unifying the real-time information network with the model stack.",
		kind: "milestone",
		actor: "xai",
		source: "xAI"
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
		href: "https://www.spacex.com/"
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
		href: "https://x.ai/"
	},
	{
		id: "grok-4",
		date: "2025–2026",
		sortKey: "2025-11-01",
		title: "Grok-4 era",
		body: "Continued frontier releases: Grok-4 line, voice, build, and imagine capabilities expand across products.",
		kind: "product",
		actor: "xai",
		source: "SpaceXAI"
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
		href: "https://www.tesla.com/AI"
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
		xId: "2072342803787702422"
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
		xId: "2074214064746832060"
	}
];
/**
* Daily Grok Build command line interface changelogs (granular release notes).
*/
var grokBuildChangelogs = [
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
			"Signal: Parallel agent orchestration for large assignments"
		]
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
			"Fix: Plan approval no longer starts Build on Enter without notes in revise mode"
		]
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
			"Fix: Deep-linked settings close modal on Escape or Enter"
		]
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
			"Fix: Language server crashes and missing C Sharp diagnostics"
		]
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
		bullets: ["Feature: delete removes current session history after confirmation", "Fix: No crash on startup when the host has no free threads"]
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
			"Fix: Web search defaults to grok-4.5; voice dictation Enter reliability"
		]
	}
];
/** SpaceX public announcements (identification only) */
var spacexNotes = [
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
		xId: "2082340308680135085"
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
		xId: "2082244164197183805"
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
		xId: "2082612362226639328"
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
		xId: "2082771710818869482"
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
		xId: "2082727931244417170"
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
		xId: "2082722674732626193"
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
		xId: "2083045860691116247"
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
		xId: "2080740277782749472"
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
		xId: "2081042187584741573"
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
		xId: "2082164942862516225"
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
		xId: "2082622310075302209"
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
		xId: "2082715974642335953"
	}
];
/** Tesla and Optimus-related public milestones (identification only) */
var teslaNotes = [
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
		xId: "2082707648148099363"
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
		xId: "2082712206169256279"
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
		xId: "2082988217830425074"
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
		xId: "2082660782429643127"
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
		href: "https://www.tesla.com/AI"
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
		href: "https://www.tesla.com/AI"
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
		href: "https://www.tesla.com/AI"
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
		href: "https://www.tesla.com/AI"
	}
];
/** Curated X feednotes from official or team posts */
var xFeednotes = [
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
		xId: "2083068786731553123"
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
		xId: "2083031362756313410"
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
		xId: "2082679015161069831"
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
		xId: "2082656239780266487"
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
		xId: "2083122371720815014"
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
		xId: "2083140767279648957"
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
		xId: "2083131409498329260"
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
		xId: "2083157750507340280"
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
		xId: "2083161180298678412"
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
		xId: "2082937168650215562"
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
		xId: "2082937168650215562"
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
		xId: "2082295750843912234"
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
		xId: "2081144971818942504"
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
		xId: "2066284913020821953"
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
		xId: "2082472135910473976"
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
		xId: "2082528987272957960"
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
		xId: "2082707547203518569"
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
		xId: "2082705390358212687"
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
		xId: "2082559894264430870"
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
		xId: "2082529280341553209"
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
		xId: "2072738598663946648"
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
		xId: "2069809728088350789"
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
		xId: "2069536627349962987"
	}
];
/**
* Advanced Development research — Acornsoft standout track.
* Highlighted on Canopy; sourced from @acornsoftai on X where applicable.
*/
var advancedDevelopmentNotes = [
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
		xId: "2083175856415870996"
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
		xId: "2082964462156533835"
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
		xId: "2082888958141145230"
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
		xId: "2082609618505904335"
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
		xId: "2082531594959495530"
	},
	{
		id: "adr-unofficial-covid",
		date: "July 29, 2026",
		sortKey: "2026-07-29T17:55:15Z",
		title: "Advanced Development · Unofficial COVID Report",
		body: "Live research app contribution: interactive primary-document report. Built to be opened and explored—not a slide deck.",
		kind: "product",
		actor: "research",
		standout: true,
		source: "@acornsoftai",
		href: "https://x.com/acornsoftai/status/2082525374588530732",
		xId: "2082525374588530732"
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
		source: "Acornsoft"
	}
];
/** Acornsoft lane — studio posts (non-research) about Grok and Grok Build work */
var acornsoftNotes = [{
	id: "as-studio-note",
	date: "July 2026",
	sortKey: "2026-07-15T12:00:00Z",
	title: "Studio lane on Canopy",
	body: "Acornsoft studio signals share the spine with Advanced Development research. Research standouts use the Advanced Development filter and gold standout cards.",
	kind: "milestone",
	actor: "acornsoft",
	source: "Acornsoft"
}];
/** Infer Grok stack surface from actor, kind, and copy. */
function inferTimelineSurface(entry) {
	if (entry.surface) return entry.surface;
	if (entry.actor === "build" || entry.kind === "changelog") return "build";
	const t = `${entry.title} ${entry.body} ${entry.source ?? ""}`.toLowerCase();
	const scores = {
		build: 0,
		imagine: 0,
		voice: 0,
		grok: 0
	};
	if (/grok build|build changelog|command line|subagent|workflows parallel|agent harness|streaming-json/.test(t)) scores.build += 4;
	if (/imagine|imaging|image gen|photo edit|restyle|background remover|emoji creator|merch maker/.test(t)) scores.imagine += 4;
	if (/\bvoice\b|think fast|speech-to-speech|tau voice|voice agent|dictation/.test(t)) scores.voice += 4;
	if (/grok[\s-]?[0-9]|grok arrives|grok-1|grok-2|grok-3|grok-4|model cadence|\bgrok\b/.test(t)) scores.grok += 2;
	const ranked = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
	const top = ranked[0];
	if (scores[top] <= 0) return void 0;
	if (scores[ranked[0]] === scores[ranked[1]] && scores[ranked[0]] > 0) return [
		"build",
		"imagine",
		"voice",
		"grok"
	].find((s) => scores[s] === scores[ranked[0]]);
	return top;
}
function withInferredSurface(entry) {
	const surface = inferTimelineSurface(entry);
	return surface ? {
		...entry,
		surface
	} : entry;
}
/** Product surface anchors — Grok stack rails on Canopy */
var grokStackAnchors = [
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
		href: "https://x.ai/"
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
		href: "https://x.ai/"
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
		href: "https://grok.x.ai/"
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
		source: "Grok Build"
	}
];
/** Newest first (desc by sortKey). History still includes founding day. */
function buildRadarTimeline() {
	const map = /* @__PURE__ */ new Map();
	for (const e of [
		...originTimeline,
		...grokStackAnchors,
		...xFeednotes,
		...grokBuildChangelogs,
		...acornsoftNotes,
		...advancedDevelopmentNotes,
		...spacexNotes,
		...teslaNotes
	]) map.set(e.id, withInferredSurface(e));
	return [...map.values()].sort((a, b) => b.sortKey.localeCompare(a.sortKey));
}
var kindLabel = {
	origin: "Origin",
	milestone: "Milestone",
	product: "Product",
	feednote: "X Feednote",
	changelog: "Build Changelog"
};
var actorLabel = {
	xai: "SpaceXAI",
	build: "Grok Build",
	acornsoft: "Our Work",
	tesla: "Tesla",
	spacex: "SpaceX",
	research: "Advanced Development"
};
function kindClass(kind) {
	return `cn-kind cn-kind-${kind}`;
}
/** Density size — vary by kind + body weight for a richer mix */
/** Callout size — mostly varied; only standout/origin forced large */
/** Stable hash so layout does not jump every render */
function stableRand(seed) {
	let h = 2166136261;
	for (let i = 0; i < seed.length; i++) {
		h ^= seed.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return (h >>> 0) / 4294967296;
}
/** Continuous asymmetric layout metrics (stable per entry id) */
function calloutLayout(entry) {
	const rW = stableRand(`w-${entry.id}`);
	const rI = stableRand(`inset-${entry.id}`);
	const rN = stableRand(`nudge-${entry.id}`);
	const rG = stableRand(`gap-${entry.id}`);
	const wide = entry.standout || entry.kind === "origin" || entry.kind === "milestone" && rW > .72;
	let w = 48 + Math.floor(rW * 52);
	if (entry.standout || entry.kind === "origin") w = 88 + Math.floor(rW * 12);
	else if (entry.kind === "changelog") w = 48 + Math.floor(rW * 28);
	else if (entry.kind === "product") w = 60 + Math.floor(rW * 36);
	const inset = wide ? 0 : Math.floor(rI * 52);
	const nudge = -14 + Math.floor(rN * 52);
	const gap = 8 + Math.floor(rG * 28);
	let size = "md";
	if (w < 58) size = "sm";
	else if (w < 72) size = "md";
	else if (w < 88) size = "lg";
	else size = "xl";
	if (wide) size = "xl";
	return {
		size,
		w,
		inset,
		nudge,
		gap,
		wide
	};
}
function matchesFilter(entry, filter) {
	if (filter === "all") return true;
	if (filter.startsWith("kind:")) return entry.kind === filter.slice(5);
	if (filter.startsWith("actor:")) return entry.actor === filter.slice(6);
	if (filter.startsWith("surface:")) return entry.surface === filter.slice(8);
	return true;
}
/**
* Filter pills:
* Grok stack (Grok · Imagine · Voice · Grok Build) then org lanes.
*/
function buildFilterOptions(items) {
	const actorCounts = /* @__PURE__ */ new Map();
	const surfaceCounts = /* @__PURE__ */ new Map();
	let changelog = 0;
	for (const item of items) {
		actorCounts.set(item.actor, (actorCounts.get(item.actor) ?? 0) + 1);
		if (item.surface) surfaceCounts.set(item.surface, (surfaceCounts.get(item.surface) ?? 0) + 1);
		if (item.kind === "changelog") changelog += 1;
	}
	const stack = [
		[
			"grok",
			"Grok",
			"grok"
		],
		[
			"imagine",
			"Imagine",
			"imagine"
		],
		[
			"voice",
			"Voice",
			"voice"
		],
		[
			"build",
			"Grok Build",
			"build"
		]
	].map(([surface, label, tone]) => ({
		key: `surface:${surface}`,
		label,
		count: surfaceCounts.get(surface) ?? 0,
		tone,
		group: "stack"
	}));
	return [
		{
			key: "all",
			label: "All",
			count: items.length,
			tone: "default"
		},
		...stack,
		{
			key: "actor:research",
			label: "Advanced Development",
			count: actorCounts.get("research") ?? 0,
			tone: "acornsoft",
			group: "org"
		},
		{
			key: "actor:acornsoft",
			label: "Our Work",
			count: actorCounts.get("acornsoft") ?? 0,
			tone: "acornsoft",
			group: "org"
		},
		{
			key: "kind:changelog",
			label: "Build notes",
			count: changelog,
			tone: "build",
			group: "org"
		},
		{
			key: "actor:xai",
			label: "SpaceXAI",
			count: actorCounts.get("xai") ?? 0,
			tone: "xai",
			group: "org"
		},
		{
			key: "actor:tesla",
			label: "Tesla",
			count: actorCounts.get("tesla") ?? 0,
			tone: "default",
			group: "org"
		},
		{
			key: "actor:spacex",
			label: "SpaceX",
			count: actorCounts.get("spacex") ?? 0,
			tone: "default",
			group: "org"
		}
	];
}
function filterTone(filter) {
	if (filter === "surface:grok") return "grok";
	if (filter === "surface:imagine") return "imagine";
	if (filter === "surface:voice") return "voice";
	if (filter === "surface:build" || filter === "actor:build" || filter === "kind:changelog") return "build";
	if (filter === "actor:acornsoft" || filter === "actor:research") return "acornsoft";
	if (filter === "actor:xai") return "xai";
	return "default";
}
function blipStyle(entry, index, total) {
	const [a0, a1] = {
		xai: [200, 270],
		build: [270, 320],
		spacex: [320, 400],
		acornsoft: [20, 70],
		research: [70, 120],
		tesla: [120, 170]
	}[entry.actor];
	let deg = a0 + (a1 - a0) * (.15 + (total <= 1 ? .5 : index / Math.max(total - 1, 1)) * .7);
	if (deg >= 360) deg -= 360;
	const r = {
		changelog: .48,
		feednote: .56,
		product: .64,
		milestone: .72,
		origin: .8
	}[entry.kind] ?? .5;
	const rad = (deg - 90) * Math.PI / 180;
	return {
		left: `${50 + Math.cos(rad) * r * 50}%`,
		top: `${50 + Math.sin(rad) * r * 50}%`
	};
}
function CanopyPage() {
	const curated = (0, import_react.useMemo)(() => buildRadarTimeline(), []);
	const [liveEntries, setLiveEntries] = (0, import_react.useState)([]);
	const [liveMeta, setLiveMeta] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const toTimeline = (e) => withInferredSurface({
			id: e.id,
			date: e.date,
			sortKey: e.sortKey,
			title: e.title,
			body: e.body,
			kind: e.kind,
			actor: e.actor,
			source: e.source,
			href: e.href,
			xId: e.xId,
			standout: e.standout,
			live: e.live ?? true
		});
		async function loadLive() {
			try {
				const res = await fetch("/canopy/live-feed.json", { cache: "no-store" });
				if (res.ok) {
					const data = await res.json();
					if (!cancelled) {
						setLiveMeta({
							updatedAt: data.updatedAt,
							source: data.source,
							error: data.error
						});
						setLiveEntries((data.entries || []).map(toTimeline));
					}
				}
			} catch {}
			try {
				const res = await fetch("/api/canopy/refresh", { cache: "no-store" });
				if (res.ok) {
					const data = await res.json();
					if (!cancelled && data.entries?.length) {
						setLiveMeta({
							updatedAt: data.updatedAt,
							source: data.source,
							error: data.error
						});
						setLiveEntries(data.entries.map(toTimeline));
					}
				}
			} catch {}
		}
		loadLive();
		const id = window.setInterval(loadLive, 900 * 1e3);
		return () => {
			cancelled = true;
			window.clearInterval(id);
		};
	}, []);
	const items = (0, import_react.useMemo)(() => {
		const byId = /* @__PURE__ */ new Map();
		for (const e of curated) byId.set(e.id, e);
		for (const e of liveEntries) {
			if (e.xId) {
				for (const [k, v] of byId) if (v.xId && v.xId === e.xId) byId.delete(k);
			}
			byId.set(e.id, e);
		}
		return [...byId.values()].sort((a, b) => b.sortKey.localeCompare(a.sortKey));
	}, [curated, liveEntries]);
	const filterOptions = (0, import_react.useMemo)(() => buildFilterOptions(items), [items]);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [activeId, setActiveId] = (0, import_react.useState)(items[0]?.id ?? "");
	/** Set only by radar blip / user pick — scrolls the matching timeline card into view. */
	const [focusId, setFocusId] = (0, import_react.useState)(null);
	const [pulse, setPulse] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!filterOptions.some((o) => o.key === filter)) setFilter("all");
	}, [filterOptions, filter]);
	const visible = (0, import_react.useMemo)(() => items.filter((i) => matchesFilter(i, filter)), [filter, items]);
	const activeFilterLabel = filterOptions.find((o) => o.key === filter)?.label ?? "All";
	(0, import_react.useMemo)(() => {
		const c = {
			xai: 0,
			build: 0,
			acornsoft: 0,
			tesla: 0,
			spacex: 0,
			research: 0
		};
		for (const i of items) c[i.actor] += 1;
		return c;
	}, [items]);
	const radarBlips = (0, import_react.useMemo)(() => {
		const pool = visible.slice(0, 18);
		const byActor = {
			xai: [],
			build: [],
			acornsoft: [],
			tesla: [],
			spacex: [],
			research: []
		};
		for (const e of pool) byActor[e.actor].push(e);
		return pool.map((entry) => {
			const siblings = byActor[entry.actor];
			return {
				entry,
				style: blipStyle(entry, siblings.indexOf(entry), siblings.length)
			};
		});
	}, [visible]);
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => setPulse((p) => p + 1), 2200);
		return () => window.clearInterval(id);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!visible.length) return;
		const hot = visible.filter((i) => i.standout || i.actor === "research" || i.kind === "feednote" || i.kind === "changelog" || i.actor === "acornsoft");
		const pool = hot.length ? hot : visible;
		setActiveId(pool[pulse % pool.length].id);
	}, [pulse, visible]);
	const tone = filterTone(filter);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "template-color-1 spybody ac-inbio ac-canopy ac-hero-stage",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { loginRedirect: "/gnomah" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "main-page-wrapper cn-page canopy-page",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "cn-canopy-shell ac-hero-stage-panel",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "container cn-canopy-shell-inner",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row cn-canopy-workspace",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-lg-9 col-md-7 col-12 cn-timeline-col",
							id: "timeline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cn-active-filter-bar",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "cn-active-filter-label",
										children: "Showing"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "cn-active-filter-value",
										children: [
											activeFilterLabel,
											" (",
											visible.length,
											")"
										]
									}),
									liveMeta.updatedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "cn-live-meta",
										title: liveMeta.error || liveMeta.source || "live",
										children: [
											"Live",
											" ",
											liveEntries.length ? `· ${liveEntries.length} pulled` : "· waiting for X token"
										]
									}) : null
								]
							}), visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "cn-empty",
								children: "No signals for this filter."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimelineFeed, {
								items: visible,
								activeId,
								focusId,
								onSelect: (id) => {
									setActiveId(id);
									setFocusId(id);
								},
								onFocused: () => setFocusId(null),
								pageSize: 18
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
							className: "col-lg-3 col-md-5 col-12 cn-radar-col",
							"aria-label": "Canopy filters",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cn-radar-sticky cn-filter-always",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `cn-radar cn-radar-sm cn-radar-live cn-radar-tone-${tone}`,
										role: "group",
										"aria-label": "Radar filter",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cn-radar-ring r1" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cn-radar-ring r2" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cn-radar-ring r3" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cn-radar-sweep" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												className: "cn-radar-core",
												"aria-label": `Show all signals (${items.length})`,
												onClick: () => setFilter("all"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "cn-radar-core-count",
													children: visible.length
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "cn-radar-core-label",
													children: filter === "all" ? "ALL" : activeFilterLabel.slice(0, 8).toUpperCase()
												})]
											}),
											radarBlips.map(({ entry, style }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: `cn-radar-blip cn-blip-${entry.actor}${entry.id === activeId ? " is-ping" : ""}`,
												style,
												title: entry.title,
												"aria-label": `${entry.title} — ${actorLabel[entry.actor]}`,
												onClick: () => {
													setFilter("all");
													setActiveId(entry.id);
													setFocusId(entry.id);
												}
											}, entry.id))
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "cn-radar-meta",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "cn-radar-caption",
											children: [
												activeFilterLabel,
												" (",
												visible.length,
												")"
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "cn-filters cn-filter-pills",
										role: "toolbar",
										"aria-label": "Timeline filters",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "cn-filters-kicker",
												children: "Grok stack"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "cn-pill-row cn-pill-row-stack",
												children: filterOptions.filter((o) => o.key === "all" || o.group === "stack").map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													"data-filter": opt.key,
													"aria-pressed": filter === opt.key,
													className: [
														"cn-pill",
														filter === opt.key ? "active" : "",
														opt.count === 0 ? "is-empty" : "",
														`cn-pill-${opt.tone}`
													].filter(Boolean).join(" "),
													onClick: () => setFilter(opt.key),
													children: [
														opt.label,
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "cn-filter-count",
															children: [
																"(",
																opt.count,
																")"
															]
														})
													]
												}, opt.key))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "cn-filters-kicker cn-filters-kicker-org",
												children: "Org lanes"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "cn-pill-row",
												children: filterOptions.filter((o) => o.group === "org").map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													"data-filter": opt.key,
													"aria-pressed": filter === opt.key,
													className: [
														"cn-pill",
														filter === opt.key ? "active" : "",
														opt.count === 0 ? "is-empty" : "",
														`cn-pill-${opt.tone}`
													].filter(Boolean).join(" "),
													onClick: () => setFilter(opt.key),
													children: [
														opt.label,
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "cn-filter-count",
															children: [
																"(",
																opt.count,
																")"
															]
														})
													]
												}, opt.key))
											})
										]
									})
								]
							})
						})]
					})
				})
			})
		})]
	});
}
/**
* Assign left/right by chronological order only — not by actor or filter.
* Rhythm: often 1+1, sometimes 2–3 on one side and 1–3 on the other.
*/
function assignVisualSides(entries) {
	const out = [];
	let i = 0;
	let batch = 0;
	while (i < entries.length) {
		const r = stableRand(`batch-${batch}-${entries[i]?.id ?? i}`);
		batch += 1;
		let nLeft = 1;
		let nRight = 1;
		if (r < .5) {
			nLeft = 1;
			nRight = 1;
		} else if (r < .8) {
			nLeft = 2 + Math.floor(stableRand(`nl-${batch}`) * 2);
			nRight = 1 + Math.floor(stableRand(`nr-${batch}`) * 3);
		} else {
			nLeft = 1 + Math.floor(stableRand(`nl2-${batch}`) * 3);
			nRight = 2 + Math.floor(stableRand(`nr2-${batch}`) * 2);
		}
		const order = stableRand(`flip-${batch}`) >= .5 ? [...Array.from({ length: nLeft }, () => "left"), ...Array.from({ length: nRight }, () => "right")] : [...Array.from({ length: nRight }, () => "right"), ...Array.from({ length: nLeft }, () => "left")];
		for (const side of order) {
			if (i >= entries.length) break;
			out.push({
				entry: entries[i++],
				side
			});
		}
	}
	return out;
}
function packVisualLanes(entries) {
	const assigned = assignVisualSides(entries);
	const rows = [];
	let i = 0;
	let rowIndex = 0;
	while (i < assigned.length) {
		const cur = assigned[i];
		if (calloutLayout(cur.entry).wide) {
			rows.push({
				key: `wide-${cur.entry.id}`,
				flip: false,
				wide: cur.entry
			});
			i += 1;
			rowIndex += 1;
			continue;
		}
		const next = assigned[i + 1];
		const nextWide = next ? calloutLayout(next.entry).wide : false;
		const flip = stableRand(`flip-row-${rowIndex}-${cur.entry.id}`) > .5;
		if (next && !nextWide && cur.side === "left" && next.side === "right") {
			rows.push({
				left: cur.entry,
				right: next.entry,
				key: `row-${cur.entry.id}-${next.entry.id}`,
				flip
			});
			i += 2;
			rowIndex += 1;
		} else if (cur.side === "left") {
			rows.push({
				left: cur.entry,
				key: `row-l-${cur.entry.id}`,
				flip
			});
			i += 1;
			rowIndex += 1;
		} else {
			rows.push({
				right: cur.entry,
				key: `row-r-${cur.entry.id}`,
				flip
			});
			i += 1;
			rowIndex += 1;
		}
	}
	return rows;
}
function TimelineFeed({ items, activeId, focusId, onSelect, onFocused, pageSize = 18 }) {
	const [limit, setLimit] = (0, import_react.useState)(pageSize);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const sentinelRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		setLimit(pageSize);
		setLoading(false);
	}, [items, pageSize]);
	(0, import_react.useEffect)(() => {
		const id = focusId || activeId;
		if (!id) return;
		const idx = items.findIndex((i) => i.id === id);
		if (idx < 0) return;
		if (idx >= limit) setLimit(Math.min(items.length, idx + 1));
	}, [
		focusId,
		activeId,
		items,
		limit
	]);
	(0, import_react.useEffect)(() => {
		if (!focusId) return;
		const idx = items.findIndex((i) => i.id === focusId);
		if (idx < 0) return;
		if (idx >= limit) return;
		const el = document.getElementById(`cn-entry-${focusId}`);
		if (!el) return;
		el.scrollIntoView({
			behavior: "smooth",
			block: "center"
		});
		el.classList.add("is-radar-focus");
		const t = window.setTimeout(() => {
			el.classList.remove("is-radar-focus");
			onFocused?.();
		}, 1600);
		return () => window.clearTimeout(t);
	}, [
		focusId,
		limit,
		items,
		onFocused
	]);
	const loaded = (0, import_react.useMemo)(() => items.slice(0, limit), [items, limit]);
	const hasMore = limit < items.length;
	const loadMore = () => {
		if (!hasMore || loading) return;
		setLoading(true);
		window.setTimeout(() => {
			setLimit((n) => Math.min(n + pageSize, items.length));
			setLoading(false);
		}, 80);
	};
	(0, import_react.useEffect)(() => {
		const el = sentinelRef.current;
		if (!el || !hasMore) return;
		const obs = new IntersectionObserver((entries) => {
			if (entries.some((e) => e.isIntersecting)) loadMore();
		}, {
			root: null,
			rootMargin: "280px 0px",
			threshold: 0
		});
		obs.observe(el);
		return () => obs.disconnect();
	}, [
		hasMore,
		loading,
		limit,
		items.length
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "cn-timeline-stack cn-feed cn-feed-infinite",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cn-timeline cn-lanes cn-timeline-feed",
				role: "list",
				"aria-label": "Timeline signals",
				"aria-busy": loading,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "cn-spine",
					"aria-hidden": "true"
				}), packVisualLanes(loaded).map((row, index) => row.wide ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "cn-feed-wide",
					role: "listitem",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimelineCard, {
						entry: row.wide,
						side: "left",
						index,
						active: row.wide.id === activeId,
						onSelect: () => onSelect(row.wide.id),
						wide: true
					})
				}, row.key) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `cn-feed-pair${row.flip ? " is-flip" : ""}`,
					role: "presentation",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "cn-feed-pair-left",
						role: "listitem",
						children: row.left ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimelineCard, {
							entry: row.left,
							side: "left",
							index,
							active: row.left.id === activeId,
							onSelect: () => onSelect(row.left.id)
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "cn-feed-spacer",
							"aria-hidden": "true"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "cn-feed-pair-right",
						role: "listitem",
						children: row.right ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimelineCard, {
							entry: row.right,
							side: "right",
							index,
							active: row.right.id === activeId,
							onSelect: () => onSelect(row.right.id)
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "cn-feed-spacer",
							"aria-hidden": "true"
						})
					})]
				}, row.key))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: sentinelRef,
				className: "cn-feed-sentinel",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cn-feed-controls cn-feed-controls-infinite",
				"aria-live": "polite",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "cn-feed-status",
					children: [
						"Showing ",
						loaded.length,
						" of ",
						items.length,
						hasMore ? " · scroll for more" : " · end of feed"
					]
				}), hasMore ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "cn-feed-btn",
					onClick: loadMore,
					disabled: loading,
					children: loading ? "Loading…" : "Load more"
				}) : null]
			})
		]
	});
}
function TimelineCard({ entry, side, index, active, onSelect, wide = false }) {
	const layout = calloutLayout(entry);
	const isWide = wide || layout.wide;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		id: `cn-entry-${entry.id}`,
		className: `cn-card cn-${side} cn-actor-${entry.actor} cn-kind-card-${entry.kind} cn-size-${layout.size} cn-asym${entry.surface ? ` cn-surface-card-${entry.surface}` : ""}${isWide ? " cn-wide-interrupt" : ""}${entry.standout ? " cn-standout" : ""}${entry.live ? " cn-is-live" : ""}${active ? " is-active" : ""}`,
		"data-entry-id": entry.id,
		"data-actor": entry.actor,
		"data-kind": entry.kind,
		"data-surface": entry.surface ?? "",
		"data-size": layout.size,
		"data-wide": isWide ? "1" : "0",
		style: {
			animationDelay: `${Math.min(index, 12) * .04}s`,
			["--w"]: isWide ? 100 : layout.w,
			["--inset"]: `${isWide ? 0 : layout.inset}px`,
			["--nudge"]: `${isWide ? 8 : layout.nudge}px`,
			["--gap"]: `${layout.gap}px`,
			zIndex: isWide ? 80 : 10 + Math.floor(layout.w / 5)
		},
		onClick: onSelect,
		onKeyDown: (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onSelect();
			}
		},
		role: "button",
		tabIndex: 0,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "cn-node",
			"aria-hidden": "true"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "cn-card-inner",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "cn-card-meta",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
							dateTime: entry.sortKey,
							children: entry.date
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: kindClass(entry.kind),
							children: kindLabel[entry.kind]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `cn-actor-tag cn-actor-tag-${entry.actor}`,
							children: actorLabel[entry.actor]
						}),
						entry.surface ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `cn-surface-badge cn-surface-${entry.surface}`,
							children: SURFACE_LABEL[entry.surface]
						}) : null,
						entry.standout ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "cn-standout-badge",
							children: "Standout"
						}) : null,
						entry.live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "cn-live-badge",
							children: "Live"
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "cn-card-title",
					children: [entry.version ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "cn-version",
						children: entry.version
					}), " "] }) : null, entry.title]
				}),
				entry.kind === "changelog" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "cn-card-body cn-quick-lede",
					children: entry.body
				}), entry.bullets && entry.bullets.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "cn-bullets cn-quick-hits",
					children: [entry.bullets.slice(0, 3).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: b.replace(/^(Feature|Perf|Fix):\s*/i, "") }, b)), entry.bullets.length > 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "cn-more",
						children: [
							"+",
							entry.bullets.length - 3,
							" more in source"
						]
					}) : null]
				}) : null] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "cn-card-body",
					children: entry.body
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "cn-card-foot",
					children: [entry.source ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "cn-source",
						children: entry.source
					}) : null, entry.href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: entry.href,
						target: "_blank",
						rel: "noopener noreferrer",
						onClick: (e) => e.stopPropagation(),
						children: entry.kind === "changelog" ? "Changelog source →" : "Open on X →"
					}) : null]
				})
			]
		})]
	});
}
var SplitComponent = CanopyPage;
//#endregion
export { SplitComponent as component };
