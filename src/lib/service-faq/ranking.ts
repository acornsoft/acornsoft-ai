import { serviceFaqs, type ServiceFaq } from "@/components/site/service-data";

/** Known FAQ ids — server only accepts these for click writes. */
export const SERVICE_FAQ_IDS = new Set(serviceFaqs.map((f) => f.id));

export function isServiceFaqId(id: string): boolean {
  return SERVICE_FAQ_IDS.has(id);
}

export type ClickMap = Record<string, number>;

/**
 * Rank FAQs: higher click count first.
 * Ties → defaultOrder (What is a Climb Note? = 0 first).
 */
export function rankServiceFaqs(
  faqs: readonly ServiceFaq[],
  clicks: ClickMap,
): ServiceFaq[] {
  return [...faqs].sort((a, b) => {
    const ca = clicks[a.id] ?? 0;
    const cb = clicks[b.id] ?? 0;
    if (cb !== ca) return cb - ca;
    return a.defaultOrder - b.defaultOrder;
  });
}

export function clicksToMap(
  rows: { faqId: string; clicks: number }[],
): ClickMap {
  const map: ClickMap = {};
  for (const r of rows) {
    if (!r.faqId) continue;
    map[r.faqId] = Math.max(0, Number(r.clicks) || 0);
  }
  return map;
}

/** Bump one id optimistically (client). */
export function bumpClick(map: ClickMap, faqId: string): ClickMap {
  return { ...map, [faqId]: (map[faqId] ?? 0) + 1 };
}
