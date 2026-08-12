import { baselineServices, type ServiceItem } from "@/components/site/service-data";

export const BASELINE_SERVICE_IDS = new Set(baselineServices.map((s) => s.id));

export function isBaselineServiceId(id: string): boolean {
  return BASELINE_SERVICE_IDS.has(id);
}

export type ClickMap = Record<string, number>;

/** Higher clicks first. Ties keep baseline order (Learn the Climb first). */
export function rankBaselineServices(
  items: readonly ServiceItem[],
  clicks: ClickMap,
): ServiceItem[] {
  return [...items].sort((a, b) => {
    const ca = clicks[a.id] ?? 0;
    const cb = clicks[b.id] ?? 0;
    if (cb !== ca) return cb - ca;
    return items.indexOf(a) - items.indexOf(b);
  });
}

export function clicksToMap(
  rows: { serviceId: string; clicks: number }[],
): ClickMap {
  const map: ClickMap = {};
  for (const r of rows) {
    if (!r.serviceId) continue;
    map[r.serviceId] = Math.max(0, Number(r.clicks) || 0);
  }
  return map;
}

export function bumpClick(map: ClickMap, serviceId: string): ClickMap {
  return { ...map, [serviceId]: (map[serviceId] ?? 0) + 1 };
}

const LS_KEY = "ac-svc-card-clicks";

export function loadLocalClicks(): ClickMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ClickMap;
    const map: ClickMap = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (isBaselineServiceId(k)) map[k] = Math.max(0, Number(v) || 0);
    }
    return map;
  } catch {
    return {};
  }
}

export function saveLocalClicks(map: ClickMap): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(map));
  } catch {
    /* quota / private mode */
  }
}
