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
  grok: "Grok",
  build: "Grok Build",
  imagine: "Imagine",
  voice: "Voice",
};

/** Short teach-in for the tool chips. Hover / focus / tap. */
export const TOOL_EXPLAIN: Record<
  RecipeTool,
  { kicker: string; what: string; how: string }
> = {
  none: {
    kicker: "Field",
    what: "No Grok tool yet. Just the four moves.",
    how: "Shop owner and engineer use the same note. Current work and every future climb start here: Problem, Measure, Pitch, Lesson — before anyone opens a demo.",
  },
  grok: {
    kicker: "Grok",
    what: "Grok is the working partner on the Climb Note.",
    how: "Ask it from the whole note, not from a blank chat. The note is the brief.",
  },
  build: {
    kicker: "Grok Build",
    what: "Build consumes the entire Climb Note — not just the pitch.",
    how: "Problem, Measure, Pitch, and Lesson go in together. That is the brief for this site, Gnomah, and every future product: one vertical you can fail safely. The journal is the ~20× proof.",
  },
  imagine: {
    kicker: "Imagine",
    what: "Imagine is how we animate the solution.",
    how: "The note already named what moved. Imagine makes that move visible — motion someone can watch, now and on the next climb. A still is a frame. Animation is the pitch happening.",
  },
  voice: {
    kicker: "Voice",
    what: "Voice lends a voice to the solution.",
    how: "The Climb Note is the script. Voice lets the solution speak — shop owner and engineer hear the same four moves. Luna can still guide. The product itself gets a voice.",
  },
};

export const TOOL_LEGEND: RecipeTool[] = ["none", "build", "imagine", "voice"];

export const fieldRecipes: FieldRecipe[] = [
  {
    id: "name-the-problem",
    number: "01",
    title: "Name the problem",
    when: "Before a demo, a thread, or a tool.",
    steps: [
      "Write one sentence: what is stuck.",
      "Name who feels it.",
      "If you cannot name it, you are not ready to climb.",
    ],
    doneWhen: "A stranger can read the sentence and know what failed.",
    tool: "none",
  },
  {
    id: "set-the-measure",
    number: "02",
    title: "Set the measure",
    when: "You have a problem and no way to know if it moved.",
    steps: [
      "Pick one number or one observable change.",
      "Write the before state.",
      "Write what “moved” looks like in one line.",
    ],
    doneWhen: "You can fail the climb in public. No vibe checks.",
    tool: "none",
  },
  {
    id: "cut-the-slice",
    number: "03",
    title: "Take the next pitch",
    when: "The work is a raft of tools and no path.",
    steps: [
      "Take the next safe pitch that can change the measure.",
      "Leave the rest on the ground.",
      "If the pitch needs a committee, it is too big.",
    ],
    doneWhen: "One person can finish it in one sitting.",
    tool: "none",
  },
  {
    id: "write-the-note",
    number: "04",
    title: "Write the Climb Note",
    when: "The four moves exist. They are not yet one trail.",
    steps: [
      "Problem. Measure. Pitch. Lesson — in that order.",
      "Short sentences. One idea each.",
      "Strike any line that repeats the problem as a description.",
    ],
    doneWhen: "Someone else can run the same climb without you.",
    tool: "none",
  },
  {
    id: "build-the-slice",
    number: "05",
    title: "Give Grok Build the whole Climb Note",
    when: "The note is written. The pitch is software, a site, or a working artifact.",
    steps: [
      "Hand Build the entire Climb Note — Problem, Measure, Pitch, Lesson.",
      "Do not feed it the pitch alone.",
      "Ask for one vertical that can fail safely.",
    ],
    doneWhen: "There is a running thing you can measure, not a slide.",
    tool: "build",
  },
  {
    id: "see-it",
    number: "06",
    title: "Use Imagine to animate the solution",
    when: "The note needs to move — not just a still.",
    steps: [
      "Animate the solution so someone can watch the pitch happen.",
      "Generate once. Edit the part that is wrong.",
      "Keep the motion next to the measure, not instead of it.",
    ],
    doneWhen: "A person can watch it move and know the measure.",
    tool: "imagine",
  },
  {
    id: "talk-the-climb",
    number: "07",
    title: "Use Voice to lend a voice to the solution",
    when: "The solution should speak, not only sit on a page.",
    steps: [
      "Give the solution a voice someone can hear.",
      "Keep it on the Climb Note — same four moves, spoken.",
      "Write the lesson after they have heard it.",
    ],
    doneWhen: "The solution can speak. The note still holds the trail.",
    tool: "voice",
  },
  {
    id: "log-and-publish",
    number: "08",
    title: "Log the lesson. Publish only then.",
    when: "The pitch ran. You know what moved.",
    steps: [
      "Write what stuck and what changed.",
      "Approve, then publish. Drafts stay in the studio.",
      "X is a short cite. The long form stays on this site.",
    ],
    doneWhen: "The trail is public and the next climber can follow it.",
    tool: "none",
  },
];
