import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { isBaselineServiceId } from "./ranking";

export type ServiceClickRow = { serviceId: string; clicks: number };

async function ensureTable(): Promise<void> {
  const sql = await getSql();
  await sql`
    create table if not exists service_card_clicks (
      service_id text primary key,
      clicks integer not null default 0,
      updated_at timestamptz not null default now()
    )
  `;
}

export const listServiceCardClicks = createServerFn({ method: "GET" }).handler(
  async (): Promise<ServiceClickRow[]> => {
    try {
      await ensureTable();
      const sql = await getSql();
      const rows = await sql<{ service_id: string; clicks: number }>`
        select service_id, clicks from service_card_clicks
        order by clicks desc, service_id asc
      `;
      return rows
        .filter((r) => isBaselineServiceId(r.service_id))
        .map((r) => ({
          serviceId: r.service_id,
          clicks: Math.max(0, Number(r.clicks) || 0),
        }));
    } catch {
      return [];
    }
  },
);

export const recordServiceCardClick = createServerFn({ method: "POST" })
  .validator((data: { serviceId: string }) => {
    const serviceId = String(data?.serviceId ?? "")
      .trim()
      .slice(0, 80);
    if (!serviceId || !isBaselineServiceId(serviceId)) {
      throw new Error("Invalid serviceId");
    }
    return { serviceId };
  })
  .handler(
    async ({ data }): Promise<{ serviceId: string; clicks: number }> => {
      const { serviceId } = data;
      await ensureTable();
      const sql = await getSql();
      await sql`
        insert into service_card_clicks (service_id, clicks, updated_at)
        values (${serviceId}, 1, now())
        on conflict (service_id) do update set
          clicks = service_card_clicks.clicks + 1,
          updated_at = now()
      `;
      const rows = await sql<{ clicks: number }>`
        select clicks from service_card_clicks
        where service_id = ${serviceId}
        limit 1
      `;
      return {
        serviceId,
        clicks: Math.max(1, Number(rows[0]?.clicks) || 1),
      };
    },
  );
