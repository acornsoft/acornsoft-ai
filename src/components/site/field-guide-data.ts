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
    title: "Use Grok Build on the pitch",
    when: "The pitch is software, a site, or a working artifact.",
    steps: [
      "Give Build the problem and the measure first.",
      "Ask for one vertical that can fail safely.",
      "Do not start with a demo. Start with the note.",
    ],
    doneWhen: "There is a running thing you can measure, not a slide.",
    tool: "build",
  },
  {
    id: "see-it",
    number: "06",
    title: "Use Imagine when you must see it",
    when: "Words are not enough to judge the pitch.",
    steps: [
      "Describe the thing, not the mood.",
      "Generate once. Edit the part that is wrong.",
      "Keep the image next to the measure, not instead of it.",
    ],
    doneWhen: "A person can point at the picture and the measure together.",
    tool: "imagine",
  },
  {
    id: "talk-the-climb",
    number: "07",
    title: "Use Voice when your hands are on the work",
    when: "Typing would stop the climb.",
    steps: [
      "Say the problem out loud.",
      "Ask Luna for the next step, not a speech.",
      "Write the lesson after you hang up.",
    ],
    doneWhen: "The climb moved. The note is updated.",
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
