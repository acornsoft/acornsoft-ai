/** Method hub: Services ↔ Climb Notes ↔ contribute ↔ training */

export type ServiceClimbLink = {
  service: string;
  role: string;
};

export type WorkflowStep = {
  n: number;
  title: string;
  body: string;
};

export type ContributeRow = {
  who: string;
  action: string;
  how: string;
};

export type TrainingModule = {
  id: string;
  track: "voice" | "imagine" | "build";
  trackLabel: string;
  title: string;
  time: string;
  goal: string;
  doneWhen: string;
  steps: string[];
  href?: string;
};

export const methodObjects = [
  {
    name: "Service",
    blurb: "An offer — how Acornsoft helps on your mountain.",
    where: "/service",
  },
  {
    name: "Climb Note",
    blurb: "One finished climb: Problem → Measure → Pitch → Lesson.",
    where: "/climb-notes",
  },
  {
    name: "Field Guide",
    blurb: "Eight recipes. The lingua franca for the climb.",
    where: "/field-guide",
  },
  {
    name: "Training module",

    blurb: "Short practice with Voice, Imagine, or Grok Build.",
    where: "#training",
  },
  {
    name: "X post",
    blurb: "Short cite only. Full detail stays on acornsoft.ai.",
    where: "/canopy",
  },
] as const;

export const serviceClimbLinks: ServiceClimbLink[] = [
  {
    service: "Learn the Climb",
    role: "Read public notes; practice the four steps; Voice with Luna.",
  },
  {
    service: "AI Strategy",
    role: "Notes capture ranked problems, measures, and the chosen slice.",
  },
  {
    service: "Product Build",
    role: "Each shippable vertical leaves a Climb Note.",
  },
  {
    service: "Model Systems",
    role: "Eval, guardrails, and ops lessons are written as notes.",
  },
  {
    service: "Trust and Safety",
    role: "Checkpoints and fallbacks recorded as measure + lesson.",
  },
  {
    service: "Automation",
    role: "Agent boundaries and escalations written as slice + lesson.",
  },
  {
    service: "Delivery with Climb Notes",
    role: "Notes are the delivery record — not optional theater.",
  },
];

export const useExistingSteps: WorkflowStep[] = [
  {
    n: 1,
    title: "Open the journal",
    body: "Start at Climb Notes (public) or Canopy (public radar).",
  },
  {
    n: 2,
    title: "Read in order",
    body: "Problem → Measure → Slice → Lesson. One climb, not a tool catalog.",
  },
  {
    n: 3,
    title: "Carry the lesson",
    body: "Reuse the lesson on your next climb — same path or a new one.",
  },
  {
    n: 4,
    title: "Share the short cite",
    body: "X is optional: hook + link. Detail stays on the site.",
  },
  {
    n: 5,
    title: "Walk it with Luna",
    body: "Optional: Voice — say the four steps out loud with your Sherpa.",
  },
];

export const contributeRows: ContributeRow[] = [
  {
    who: "Anyone",
    action: "Read",
    how: "Public journal and Canopy",
  },
  {
    who: "Anyone",
    action: "Request new or update",
    how: "What’s stuck · who it helps · new or update · note id if update",
  },
  {
    who: "Studio owner",
    action: "Draft / edit",
    how: "Gnomah or vault markdown (four headings)",
  },
  {
    who: "Studio owner",
    action: "Publish",
    how: "Registry: draft → pending → approved → published",
  },
  {
    who: "Studio owner",
    action: "Canopy + X",
    how: "onCanopy / canopyAt; X cite only after published",
  },
];

export const trainingModules: TrainingModule[] = [
  {
    id: "voice-01",
    track: "voice",
    trackLabel: "Voice",
    title: "Say the problem",
    time: "~5 min",
    goal: "State a clearly defined problem in one breath — not a tool list.",
    doneWhen: "One sentence names a person and a stuck outcome.",
    steps: [
      "Open Voice. Ask Luna to help name what’s stuck — not the tools.",
      "Answer in plain words. Avoid product names first.",
      "Repeat until Luna restates your problem in one short sentence.",
      "Write that sentence as Problem on a draft Climb Note.",
    ],
    href: "/voice",
  },
  {
    id: "voice-02",
    track: "voice",
    trackLabel: "Voice",
    title: "Four steps out loud",
    time: "~10 min",
    goal: "Say Problem, Measure, Slice, Lesson without notes.",
    doneWhen: "You can list the four steps and one plain phrase for each.",
    steps: [
      "Pick Climb Note 000 (or any public note).",
      "Ask Luna to quiz you on the four steps in order.",
      "Answer out loud. Fix weak steps.",
      "Apply the same four steps to your problem from module 01.",
    ],
    href: "/voice",
  },
  {
    id: "imagine-01",
    track: "imagine",
    trackLabel: "Imagine",
    title: "Trail map card",
    time: "~10 min",
    goal: "One image that teaches the four steps at a glance.",
    doneWhen: "A stranger can name the four steps from the image alone.",
    steps: [
      "Prompt Imagine for a simple four-station trail: Problem, Measure, Slice, Lesson.",
      "Keep text large. Dark background. One accent. No clutter.",
      "Save for service pages, training, or social stills.",
      "Caption: “How a Climb Note runs.” Link back to the site.",
    ],
  },
  {
    id: "imagine-02",
    track: "imagine",
    trackLabel: "Imagine",
    title: "Service to climb",
    time: "~10 min",
    goal: "Show how a service leaves a Climb Note.",
    doneWhen: "The link between paid work and the written trail is obvious.",
    steps: [
      "Pick one service (e.g. Product Build).",
      "Two-panel image: service action → Climb Note P/M/S/L.",
      "Title: “Every climb leaves a trail.”",
      "Use on site long-form; on X only as a still + link.",
    ],
  },
  {
    id: "build-01",
    track: "build",
    trackLabel: "Grok Build",
    title: "Thin slice",
    time: "One focused session",
    goal: "Ship a small vertical that a user can try — not a deck.",
    doneWhen: "Happy path runs; raw notes for a Climb Note exist.",
    steps: [
      "Write Problem and Measure first (Voice modules help).",
      "In Build, implement only the Slice that proves the measure.",
      "Stop when a stranger can click the happy path.",
      "Draft Lesson: what you reuse next time.",
    ],
  },
  {
    id: "build-02",
    track: "build",
    trackLabel: "Grok Build",
    title: "Leave a Climb Note",
    time: "~20 min after a slice",
    goal: "No free solo — the trail outlives the session.",
    doneWhen: "A Climb Note has all four headings filled.",
    steps: [
      "Open the Climb Note template.",
      "Fill Problem, Measure, Slice, Lesson in plain language.",
      "Studio path: draft → submit → approve → publish when ready.",
      "Optional: short X cite linking to acornsoft.ai.",
    ],
    href: "/climb-notes",
  },
];

export const requestBlurb =
  "Request a new Climb Note or an update: name what’s stuck, who it helps, which service (if any), and whether this is new or an update (include note id). Studio reviews before anything goes public.";
