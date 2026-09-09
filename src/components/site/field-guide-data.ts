/** Field Guide — four-step operating method. */

export type RecipeTool = "none" | "any" | "grok" | "build" | "imagine" | "voice";

export type FieldRecipe = {
  id: string;
  number: string;
  title: string;
  when: string;
  steps: string[];
  doneWhen: string;
  tool: RecipeTool;
  crew?: boolean;
  summit?: boolean;
};

export const TOOL_LABEL: Record<RecipeTool, string> = {
  none: "Plan only",
  any: "Optional tools",
  grok: "Grok Bot",
  build: "Grok Build",
  imagine: "Imagine",
  voice: "Grok Voice",
};

export const TOOL_EXPLAIN: Record<
  RecipeTool,
  { kicker: string; what: string; how: string }
> = {
  none: {
    kicker: "Plan only",
    what: "Write the plan before using a tool.",
    how: "Complete the note first.",
  },
  any: {
    kicker: "Optional tools",
    what: "Use only the tools required to meet the objective.",
    how: "None of the tools are required.",
  },
  grok: {
    kicker: "Grok Bot",
    what: "Research and collect sources.",
    how: "Provide the Climb Note. Review the results.",
  },
  build: {
    kicker: "Grok Build",
    what: "Produce a working page or application.",
    how: "Provide the full Climb Note.",
  },
  imagine: {
    kicker: "Imagine",
    what: "Preview the result before development.",
    how: "Review the preview, then proceed.",
  },
  voice: {
    kicker: "Grok Voice",
    what: "Discuss the plan in conversation.",
    how: "Work from the same Climb Note.",
  },
};

export const TOOL_LEGEND: RecipeTool[] = [
  "none",
  "grok",
  "build",
  "imagine",
  "voice",
];

export const BUILD_CREW: RecipeTool[] = [
  "voice",
  "build",
  "grok",
  "imagine",
];

export type WorkforceLayer = {
  id: Exclude<RecipeTool, "none" | "any">;
  depth: number;
  verb: string;
  title: string;
  line: string;
  how: string;
  recipeId: string;
};

export const WORKFORCE_LAYERS: WorkforceLayer[] = [
  {
    id: "voice",
    depth: 1,
    verb: "Discuss",
    title: "Grok Voice",
    line: "Discuss the plan.",
    how: "Work from the Climb Note in conversation.",
    recipeId: "talk-the-climb",
  },
  {
    id: "build",
    depth: 2,
    verb: "Produce",
    title: "Grok Build",
    line: "Produce a working page.",
    how: "Provide the full Climb Note.",
    recipeId: "build-the-slice",
  },
  {
    id: "grok",
    depth: 3,
    verb: "Research",
    title: "Grok Bot",
    line: "Research and collect sources.",
    how: "Provide the Climb Note. Review the results.",
    recipeId: "bot-the-note",
  },
  {
    id: "imagine",
    depth: 4,
    verb: "Preview",
    title: "Imagine",
    line: "Preview before you build.",
    how: "Review the preview, then decide.",
    recipeId: "see-it",
  },
];

export const fieldRecipes: FieldRecipe[] = [
  {
    id: "name-the-problem",
    number: "01",
    title: "Base Camp",
    when: "Confirm the work can begin.",
    steps: [
      "Identify who is involved.",
      "State current conditions, constraints, and risks.",
    ],
    doneWhen: "A reader can tell whether the work can start.",
    tool: "none",
  },
  {
    id: "set-the-measure",
    number: "02",
    title: "Route",
    when: "Define success.",
    steps: [
      "State one objective.",
      "State how it will be verified, and what is out of scope.",
    ],
    doneWhen: "Success and failure are both observable.",
    tool: "none",
  },
  {
    id: "cut-the-slice",
    number: "03",
    title: "Waypoint",
    when: "Decide whether to proceed.",
    steps: [
      "Review the plan.",
      "Proceed or wait.",
    ],
    doneWhen: "The decision is recorded.",
    tool: "none",
  },
  {
    id: "write-the-note",
    number: "04",
    title: "Execution",
    when: "Complete the work. Use Grok tools only if they are required.",
    steps: [],
    doneWhen: "The success criteria from step 02 are met.",
    tool: "any",
    crew: true,
  },
];
