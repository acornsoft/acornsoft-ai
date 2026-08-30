import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { allowPublicClick } from "@/lib/access/click-rate-limit";
import { isServiceFaqId } from "./ranking";

export type FaqClickRow = { faqId: string; clicks: number };

async function ensureFaqClicksTable(): Promise<void> {
  const sql = await getSql();
  await sql`
    create table if not exists service_faq_clicks (
      faq_id text primary key,
      clicks integer not null default 0,
      updated_at timestamptz not null default now()
    )
  `;
}

/** Public: read click ranks for service FAQs. */
export const listServiceFaqClicks = createServerFn({ method: "GET" }).handler(
  async (): Promise<FaqClickRow[]> => {
    try {
      await ensureFaqClicksTable();
      const sql = await getSql();
      const rows = await sql<{ faq_id: string; clicks: number }>`
        select faq_id, clicks from service_faq_clicks
        order by clicks desc, faq_id asc
      `;
      return rows
        .filter((r) => isServiceFaqId(r.faq_id))
        .map((r) => ({
          faqId: r.faq_id,
          clicks: Math.max(0, Number(r.clicks) || 0),
        }));
    } catch {
      return [];
    }
  },
);

/**
 * Public: record one open on a FAQ.
 * Only allowlisted ids. Returns authoritative count after increment.
 */
export const recordServiceFaqClick = createServerFn({ method: "POST" })
  .validator((data: { faqId: string }) => {
    const faqId = String(data?.faqId ?? "")
      .trim()
      .slice(0, 80);
    if (!faqId || !isServiceFaqId(faqId)) {
      throw new Error("Invalid faqId");
    }
    return { faqId };
  })
  .handler(async ({ data }): Promise<{ faqId: string; clicks: number }> => {
    const { faqId } = data;
    await ensureFaqClicksTable();
    const sql = await getSql();
    if (!allowPublicClick()) {
      try {
        const existing = await sql<{ clicks: number }>`
          select clicks from service_faq_clicks where faq_id = ${faqId} limit 1
        `;
        return {
          faqId,
          clicks: Math.max(0, Number(existing[0]?.clicks) || 0),
        };
      } catch {
        return { faqId, clicks: 0 };
      }
    }
    await sql`
      insert into service_faq_clicks (faq_id, clicks, updated_at)
      values (${faqId}, 1, now())
      on conflict (faq_id) do update set
        clicks = service_faq_clicks.clicks + 1,
        updated_at = now()
    `;
    const rows = await sql<{ clicks: number }>`
      select clicks from service_faq_clicks where faq_id = ${faqId} limit 1
    `;
    return {
      faqId,
      clicks: Math.max(1, Number(rows[0]?.clicks) || 1),
    };
  });
