/**
 * X API v2 recent search → Canopy live feed entries.
 * Requires X_BEARER_TOKEN (App-only Bearer). Runs on a schedule or on-demand.
 *
 * Cost note: recent search is billed per X API plan. Default schedule is
 * hourly with capped results per interest query — keep queries tight.
 */

import type { LiveFeedActor, LiveFeedEntry, LiveFeedFile, LiveFeedKind } from "./types";

export type InterestQuery = {
  id: string;
  actor: LiveFeedActor;
  kind: LiveFeedKind;
  query: string;
};

export type RadarSubscription = {
  id: string;
  username: string;
  actor: LiveFeedActor;
  kind: LiveFeedKind;
  maxResults?: number;
  standout?: boolean;
  label?: string;
};

export type InterestsConfig = {
  scheduleMinutes: number;
  maxResultsPerQuery: number;
  queries: InterestQuery[];
  subscriptions?: RadarSubscription[];
};

const DEFAULT_INTERESTS: InterestsConfig = {
  scheduleMinutes: 60,
  maxResultsPerQuery: 25,
  subscriptions: [
    {
      id: "radar-acornsoftai",
      username: "acornsoftai",
      actor: "acornsoft",
      kind: "feednote",
      maxResults: 40,
      standout: true,
    },
  ],
  queries: [
    {
      id: "xai-official",
      actor: "xai",
      kind: "feednote",
      query:
        "(from:elonmusk OR from:xai OR from:SpaceXAI) (Grok OR Imagine OR Voice OR Build OR xAI OR SpaceXAI)",
    },
    {
      id: "grok-build",
      actor: "build",
      kind: "changelog",
      query:
        '("Grok Build" OR GrokBuild) (from:XFreeze OR from:elonmusk OR from:xai)',
    },
    {
      id: "spacex",
      actor: "spacex",
      kind: "feednote",
      query:
        "(from:SpaceX OR from:elonmusk) (Starship OR Falcon OR Starlink OR launch)",
    },
    {
      id: "tesla",
      actor: "tesla",
      kind: "feednote",
      query:
        "(from:Tesla OR from:elonmusk) (Optimus OR Tesla OR Supercharger OR FSD)",
    },
    {
      id: "acornsoft",
      actor: "acornsoft",
      kind: "feednote",
      query: "from:acornsoftai",
    },
  ],
};

type XTweet = {
  id: string;
  text: string;
  created_at?: string;
  author_id?: string;
};

type XUser = { id: string; username: string; name?: string };

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return iso.slice(0, 10);
  }
}

function titleFromText(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  const first = clean.split(/(?<=[.!?])\s+/)[0] || clean;
  return first.length > 90 ? `${first.slice(0, 87)}…` : first;
}

function bodyFromText(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > 320 ? `${clean.slice(0, 317)}…` : clean;
}

function mapTweet(
  tweet: XTweet,
  users: Map<string, XUser>,
  interest: InterestQuery,
): LiveFeedEntry {
  const user = tweet.author_id ? users.get(tweet.author_id) : undefined;
  const username = user?.username ? `@${user.username}` : interest.id;
  const created = tweet.created_at || new Date().toISOString();
  let actor = interest.actor;
  let kind = interest.kind;
  if (username.toLowerCase() === "@acornsoftai") {
    actor = "acornsoft";
    kind = "feednote";
  }
  return {
    id: `live-x-${tweet.id}`,
    date: formatDate(created),
    sortKey: created,
    title: titleFromText(tweet.text),
    body: bodyFromText(tweet.text),
    kind,
    actor,
    source: username,
    href: user?.username
      ? `https://x.com/${user.username}/status/${tweet.id}`
      : `https://x.com/i/web/status/${tweet.id}`,
    xId: tweet.id,
    live: true,
  };
}

async function searchRecent(
  bearer: string,
  query: string,
  maxResults: number,
): Promise<{ tweets: XTweet[]; users: XUser[] }> {
  const url = new URL("https://api.x.com/2/tweets/search/recent");
  url.searchParams.set("query", `${query} -is:retweet lang:en`);
  url.searchParams.set("max_results", String(Math.min(Math.max(maxResults, 10), 100)));
  url.searchParams.set("tweet.fields", "created_at,author_id,lang");
  url.searchParams.set("expansions", "author_id");
  url.searchParams.set("user.fields", "username,name");

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`X API ${res.status}: ${text.slice(0, 240)}`);
  }
  const json = (await res.json()) as {
    data?: XTweet[];
    includes?: { users?: XUser[] };
  };
  return {
    tweets: json.data ?? [],
    users: json.includes?.users ?? [],
  };
}


async function resolveUserId(
  bearer: string,
  username: string,
): Promise<string> {
  const url = new URL(
    `https://api.x.com/2/users/by/username/${encodeURIComponent(username)}`,
  );
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
  if (!res.ok) {
    throw new Error(`User lookup ${res.status}`);
  }
  const json = (await res.json()) as { data?: { id: string } };
  if (!json.data?.id) throw new Error(`User not found: @${username}`);
  return json.data.id;
}

async function userTimeline(
  bearer: string,
  userId: string,
  maxResults: number,
): Promise<XTweet[]> {
  const url = new URL(`https://api.x.com/2/users/${userId}/tweets`);
  url.searchParams.set(
    "max_results",
    String(Math.min(Math.max(maxResults, 5), 100)),
  );
  url.searchParams.set("tweet.fields", "created_at,author_id,lang");
  url.searchParams.set("exclude", "retweets,replies");
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Timeline ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = (await res.json()) as { data?: XTweet[] };
  return json.data ?? [];
}

export function getBearerToken(): string | undefined {
  const t =
    process.env.X_BEARER_TOKEN ||
    process.env.TWITTER_BEARER_TOKEN ||
    process.env.X_API_BEARER;
  return t?.trim() || undefined;
}

export async function loadInterestsConfig(
  readFile?: (path: string) => Promise<string>,
): Promise<InterestsConfig> {
  try {
    if (readFile) {
      const raw = await readFile(
        new URL("../../../content/canopy/interests.json", import.meta.url)
          .pathname,
      );
      return { ...DEFAULT_INTERESTS, ...JSON.parse(raw) };
    }
  } catch {
    /* use default */
  }
  return DEFAULT_INTERESTS;
}

export async function fetchLiveFeedFromX(
  interests: InterestsConfig = DEFAULT_INTERESTS,
): Promise<LiveFeedFile> {
  const bearer = getBearerToken();
  if (!bearer) {
    return {
      updatedAt: new Date().toISOString(),
      source: "empty",
      scheduleMinutes: interests.scheduleMinutes,
      entryCount: 0,
      error:
        "Missing X_BEARER_TOKEN. Add an X API App-only Bearer token to enable scheduled live pull.",
      entries: [],
    };
  }

  const byId = new Map<string, LiveFeedEntry>();
  const errors: string[] = [];

  for (const sub of interests.subscriptions ?? []) {
    try {
      const username = sub.username.replace(/^@/, "");
      const userId = await resolveUserId(bearer, username);
      const tweets = await userTimeline(
        bearer,
        userId,
        sub.maxResults ?? interests.maxResultsPerQuery,
      );
      const userMap = new Map<string, XUser>([
        [userId, { id: userId, username }],
      ]);
      for (const tweet of tweets) {
        const entry = mapTweet(tweet, userMap, {
          id: sub.id,
          actor: sub.actor,
          kind: sub.kind,
          query: `from:${username}`,
        });
        entry.standout = sub.standout ?? entry.standout;
        entry.source = `@${username}`;
        entry.href = `https://x.com/${username}/status/${tweet.id}`;
        byId.set(entry.id, entry);
      }
      await new Promise((r) => setTimeout(r, 350));
    } catch (e) {
      errors.push(
        `sub:${sub.username}: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }

  for (const interest of interests.queries) {
    try {
      const { tweets, users } = await searchRecent(
        bearer,
        interest.query,
        interests.maxResultsPerQuery,
      );
      const userMap = new Map(users.map((u) => [u.id, u]));
      for (const tweet of tweets) {
        const entry = mapTweet(tweet, userMap, interest);
        byId.set(entry.id, entry);
      }
      // gentle pacing between queries
      await new Promise((r) => setTimeout(r, 350));
    } catch (e) {
      errors.push(`${interest.id}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  const entries = [...byId.values()].sort((a, b) =>
    b.sortKey.localeCompare(a.sortKey),
  );

  return {
    updatedAt: new Date().toISOString(),
    source: errors.length && entries.length === 0 ? "error" : "x-api-v2",
    scheduleMinutes: interests.scheduleMinutes,
    entryCount: entries.length,
    error: errors.length ? errors.join(" | ") : undefined,
    entries,
  };
}
