import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import {
  isAnalyticsEventName,
  type AnalyticsEventInput,
  type AnalyticsProps,
} from "./types";

const MAX_PROP_KEYS = 24;
const MAX_PROP_STR = 200;
const MAX_PATH = 300;
const MAX_SESSION = 64;

function sanitizeProps(raw: AnalyticsProps | undefined): Record<string, unknown> {
  if (!raw || typeof raw !== "object") return {};
  const out: Record<string, unknown> = {};
  let n = 0;
  for (const [k, v] of Object.entries(raw)) {
    if (n >= MAX_PROP_KEYS) break;
    const key = String(k).slice(0, 40);
    if (!key) continue;
    if (v == null) {
      out[key] = null;
    } else if (typeof v === "boolean" || typeof v === "number") {
      if (typeof v === "number" && !Number.isFinite(v)) continue;
      out[key] = v;
    } else {
      out[key] = String(v).slice(0, MAX_PROP_STR);
    }
    n += 1;
  }
  return out;
}

async function ensureAnalyticsTable(): Promise<void> {
  const sql = await getSql();
  await sql`
    create table if not exists analytics_events (
      id bigserial primary key,
      event_name text not null,
      path text,
      session_id text,
      props jsonb not null default '{}'::jsonb,
      created_at timestamptz not null default now()
    )
  `;
}

/**
 * Public: append one analytics event (no auth).
 * Soft-fails on storage errors so product UI never blocks.
 */
export const logAnalyticsEvent = createServerFn({ method: "POST" })
  .validator((data: AnalyticsEventInput) => {
    const event = String(data?.event ?? "").trim();
    if (!isAnalyticsEventName(event)) {
      throw new Error("Invalid event");
    }
    return {
      event: event as AnalyticsEventInput["event"],
      path:
        typeof data?.path === "string"
          ? data.path.trim().slice(0, MAX_PATH)
          : undefined,
      sessionId:
        typeof data?.sessionId === "string"
          ? data.sessionId.trim().slice(0, MAX_SESSION)
          : undefined,
      props: data?.props,
    };
  })
  .handler(
    async ({
      data,
    }): Promise<{ ok: true } | { ok: false; reason: string }> => {
      try {
        await ensureAnalyticsTable();
        const sql = await getSql();
        const props = sanitizeProps(data.props);
        await sql`
          insert into analytics_events (event_name, path, session_id, props)
          values (
            ${data.event},
            ${data.path ?? null},
            ${data.sessionId ?? null},
            ${JSON.stringify(props)}::jsonb
          )
        `;
        return { ok: true };
      } catch {
        return { ok: false, reason: "log failed" };
      }
    },
  );

/** Owner-only: recent events (capped). Not a public listing. */
export const listRecentAnalyticsEvents = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data?: { limit?: number }) => ({
    limit: Math.min(100, Math.max(1, Number(data?.limit) || 40)),
  }))
  .handler(async ({ context, data }) => {
    const { assertClimbNotesOwner } = await import(
      "@/lib/climb-notes/owner.server"
    );
    await assertClimbNotesOwner(context.userId);
    try {
      await ensureAnalyticsTable();
      const sql = await getSql();
      const rows = await sql<{
        id: number;
        event_name: string;
        path: string | null;
        session_id: string | null;
        props: unknown;
        created_at: string;
      }>`
        select id, event_name, path, session_id, props, created_at
        from analytics_events
        order by created_at desc
        limit ${data.limit}
      `;
      return rows.map((r) => ({
        id: Number(r.id),
        event: r.event_name,
        path: r.path,
        sessionId: r.session_id,
        props: r.props ?? {},
        createdAt: r.created_at,
      }));
    } catch {
      return [];
    }
  });
