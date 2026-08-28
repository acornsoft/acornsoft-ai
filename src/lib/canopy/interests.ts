/**
 * Canopy Radar interests — pure TS module (no JSON) so Nitro always bundles it.
 * Cadence: one X API pull per week (scheduleMinutes = 10080).
 * Priority: @acornsoftai → @DataRepublican → Grok Build → Imagine → Voice → Elon orgs.
 */
export const interestsConfig = {
  scheduleMinutes: 10080,
  maxResultsPerQuery: 25,
  subscriptions: [
    {
      id: "radar-acornsoftai",
      username: "acornsoftai",
      actor: "acornsoft" as const,
      kind: "feednote" as const,
      maxResults: 40,
      label: "Acornsoft Radar",
      standout: true,
    },
    {
      id: "radar-datarepublican",
      username: "DataRepublican",
      actor: "signal" as const,
      kind: "feednote" as const,
      maxResults: 30,
      label: "DataRepublican",
      standout: true,
    },
  ],
  queries: [
    {
      id: "grok-build",
      actor: "build" as const,
      kind: "changelog" as const,
      query:
        '("Grok Build" OR GrokBuild) (from:elonmusk OR from:xai OR from:grok OR from:XFreeze OR from:SpaceXAI) (changelog OR release OR update OR CLI OR workflow OR plugin OR agent OR v0. OR v1. OR publish)',
    },
    {
      id: "imagine",
      actor: "xai" as const,
      kind: "feednote" as const,
      query:
        '(from:elonmusk OR from:xai OR from:grok OR from:SpaceXAI) ("Grok Imagine" OR Imagine) (image OR video OR template OR edit OR restyle OR creative OR 1080p OR reference OR render)',
    },
    {
      id: "voice",
      actor: "xai" as const,
      kind: "feednote" as const,
      query:
        '(from:elonmusk OR from:xai OR from:grok OR from:SpaceXAI) ("Grok Voice" OR "Think Fast" OR "Voice Mode" OR Voice) (agent OR speech OR audio OR connector OR dictation OR builder OR telephony OR Tau)',
    },
    {
      id: "org-xai",
      actor: "xai" as const,
      kind: "feednote" as const,
      query:
        "(from:elonmusk OR from:xai OR from:grok OR from:SpaceXAI) (Grok OR xAI OR SpaceXAI OR Colossus OR model)",

    },
    {
      id: "org-spacex",
      actor: "spacex" as const,
      kind: "feednote" as const,
      query:
        "(from:SpaceX OR from:elonmusk) (Starship OR Falcon OR Starlink OR launch OR recover OR Raptor OR Dragon)",
    },
    {
      id: "org-tesla",
      actor: "tesla" as const,
      kind: "feednote" as const,
      query:
        "(from:Tesla OR from:elonmusk OR from:Tesla_AI) (Optimus OR Tesla OR Supercharger OR FSD OR robotaxi OR Cybertruck OR energy)",
    },
  ],
};

export default interestsConfig;
