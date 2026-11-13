/** Public Grok usage dashboard file: /grok-usage/usage.json */

export type GrokUsageBotShare = {
  label: string;
  role: string;
  share: number;
  approximate?: boolean;
};

export type GrokUsageActivity = {
  chats: number;
  routines: number;
  botToBot: number;
  group: number;
  approximate?: boolean;
};

export type GrokUsageDay = {
  date: string;
  total: number;
  chats: number;
  routines: number;
  botToBot: number;
  group: number;
  approximate?: boolean;
};

export type GrokUsageCounts = {
  namedBots: number;
  canopyFeedEntries?: number;
};

export type GrokUsageFile = {
  updatedAt: string;
  periodLabel: string;
  periodStart: string;
  periodEnd: string;
  byBot: GrokUsageBotShare[];
  byActivity: GrokUsageActivity;
  daily: GrokUsageDay[];
  counts: GrokUsageCounts;
};
