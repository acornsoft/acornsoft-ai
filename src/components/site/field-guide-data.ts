/** Field Guide recipes — short, repeatable climbs. */

export type RecipeTool = "none" | "grok" | "build" | "imagine" | "voice";

export type FieldRecipe = {
  id: string;
  number: string;
  title: string;
  when: string;
  steps: string[];
  doneWhen: string;
  tool: RecipeTool;
};

export const TOOL_LABEL: Record<RecipeTool, string> = {
  none: "Field",
  grok: "Grok Bot",
  build: "Grok Build",
  imagine: "Imagine",
  voice: "Grok Voice",
};

/** Short teach-in for the tool chips. Hover / focus / tap. */
export const TOOL_EXPLAIN: Record<
  RecipeTool,
  { kicker: string; what: string; how: string }
> = {
  none: {
    kicker: "Field",
    what: "Just the four answers. No agent yet.",
    how: "Base Camp, Route, Waypoint, Summit. You and whoever builds it start here — before anyone opens a tool.",
  },
  grok: {
    kicker: "Grok Bot",
    what: "Grok Bot finds the stuff.",
    how: "You hand it your write-up. It finds papers, codes, what’s on hand. You check the list. Then the other agents have something to work with.",
  },
  build: {
    kicker: "Grok Build",
    what: "Grok Build makes a page you can open.",
    how: "It uses all four answers. You get something running you can try this week.",
  },
  imagine: {
    kicker: "Imagine",
    what: "Imagine shows what we will build — before we build it.",
    how: "A short video from the Climb Note. The client watches, then sends the next note: keep this, change that. Refine the clip. Open Build only after they can see the measure on screen.",
  },
  voice: {
    kicker: "Grok Voice",
    what: "Grok Voice is who you talk to.",
    how: "Luna is the Sherpa. She walks with you, follows the write-up, and Gnomah remembers the climb. You can ask with your hands full.",
  },
};

export const TOOL_LEGEND: RecipeTool[] = [
  "none",
  "grok",
  "build",
  "imagine",
  "voice",
];

export const fieldRecipes: FieldRecipe[] = [
  {
    id: "name-the-problem",
    number: "01",
    title: "Name Base Camp",
    when: "Before a demo, a thread, or a tool.",
    steps: [
      "Write who you are on this trip, and whether you are fit to leave.",
      "Name the gear, the weather, and the rules of the mountain.",
      "If you cannot name that, you are not ready to climb.",
    ],
    doneWhen: "A stranger can read the sentence and know if the climb can start.",
    tool: "none",
  },
  {
    id: "set-the-measure",
    number: "02",
    title: "Set the route",
    when: "You have Base Camp and no summit yet.",
    steps: [
      "Write one summit objective.",
      "Write clear success marks a stranger can check.",
      "Write what you are not climbing today.",
    ],
    doneWhen: "You can fail the climb in public. No vibe checks.",
    tool: "none",
  },
  {
    id: "cut-the-slice",
    number: "03",
    title: "Hold or go",
    when: "The work is a pile of tools and no path.",
    steps: [
      "Check the map. Stop. Look around.",
      "Recover if needed.",
      "Decide: hold or go.",
    ],
    doneWhen: "The rope team knows whether to move.",
    tool: "none",
  },
  {
    id: "write-the-note",
    number: "04",
    title: "Write the Climb Note",
    when: "The four beats exist. They are not yet one trail.",
    steps: [
      "Base Camp. Route. Waypoint. Summit — in that order.",
      "Short sentences. One idea each.",
      "Strike any line that repeats Base Camp as a description.",
    ],
    doneWhen: "Someone else can run the same climb without you.",
    tool: "none",
  },
  {
    id: "bot-the-note",
    number: "05",
    title: "Give Grok Bot the Climb Note",
    when: "The note is written. The pile still needs hunting.",
    steps: [
      "Hand Bot the entire Climb Note.",
      "Let it hunt: papers, codes, what’s on hand.",
      "You confirm. The agent does not decide alone.",
    ],
    doneWhen: "The pile is a list you can act on.",
    tool: "grok",
  },
  {
    id: "build-the-slice",
    number: "06",
    title: "Give Grok Build the whole Climb Note",
    when: "The note is written. The next step is software, a site, or a working artifact.",
    steps: [
      "Hand Build the entire Climb Note — Base Camp, Route, Waypoint, Summit.",
      "Do not feed it the step alone.",
      "Ask for one small step that can fail safely.",
    ],
    doneWhen: "There is a running thing you can measure.",
    tool: "build",
  },
  {
    id: "see-it",
    number: "07",
    title: "Show it before you build it",
    when: "The next step is software, but they haven’t seen it yet.",
    steps: [
      "From the Climb Note, Imagine a short video of the thing they will use — not the code.",
      "Hand the clip back. They watch. They send the next Climb Note: what to keep, what to change.",
      "Refine the video from that note. Do not open Build until they can point at the clip and name the measure.",
    ],
    doneWhen: "They have seen what we will build, and the next note is the brief for Build.",
    tool: "imagine",
  },
  {
    id: "talk-the-climb",
    number: "08",
    title: "Use Grok Voice as the character you talk to",
    when: "The solution should have a manner someone will talk to.",
    steps: [
      "Give the aide a personality someone will talk to.",
      "Keep it on the Climb Note — same four beats, spoken in character.",
      "Write the summit evidence after they have heard it.",
    ],
    doneWhen: "The aide has a personality. The note still holds the trail.",
    tool: "voice",
  },
  {
    id: "log-and-publish",
    number: "09",
    title: "Log the lesson. Publish only then.",
    when: "The step ran. You know what moved.",
    steps: [
      "Write what stuck and what changed.",
      "Approve, then publish. Drafts stay in the studio.",
      "X is a short cite. The long form stays on this site.",
    ],
    doneWhen: "The trail is public and the next climber can follow it.",
    tool: "none",
  },
];
