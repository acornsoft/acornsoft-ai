export type LiveFeedActor =
  | "xai"
  | "build"
  | "acornsoft"
  | "tesla"
  | "spacex"
  | "research"
  | "signal";

export type LiveFeedKind =
  | "origin"
  | "milestone"
  | "product"
  | "feednote"
  | "changelog";

export type LiveFeedEntry = {
  id: string;
  date: string;
  sortKey: string;
  title: string;
  body: string;
  kind: LiveFeedKind;
  actor: LiveFeedActor;
  source?: string;
  href?: string;
  xId?: string;
  standout?: boolean;
  live?: true;
};

export type LiveFeedFile = {
  updatedAt: string;
  source: "x-api-v2" | "cache" | "empty" | "error";
  scheduleMinutes: number;
  entryCount: number;
  error?: string;
  /** When the next X API pull is allowed (weekly window). */
  nextPullAt?: string;
  entries: LiveFeedEntry[];
};
