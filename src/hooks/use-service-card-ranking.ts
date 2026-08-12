import { useCallback, useEffect, useRef, useState } from "react";
import { baselineServices, type ServiceItem } from "@/components/site/service-data";
import {
  listServiceCardClicks,
  recordServiceCardClick,
} from "@/lib/service-catalog/actions";
import {
  bumpClick,
  clicksToMap,
  loadLocalClicks,
  rankBaselineServices,
  saveLocalClicks,
  type ClickMap,
} from "@/lib/service-catalog/ranking";
import { track } from "@/lib/analytics/client";

const OPEN_COOLDOWN_MS = 1500;

export function useServiceCardRanking() {
  const [clickMap, setClickMap] = useState<ClickMap>(() => loadLocalClicks());
  const [display] = useState<ServiceItem[]>(() =>
    rankBaselineServices(baselineServices, loadLocalClicks()),
  );

  const lastAt = useRef<Record<string, number>>({});
  const inFlight = useRef<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await listServiceCardClicks();
        if (cancelled) return;
        const server = clicksToMap(rows);
        setClickMap((local) => {
          const merged: ClickMap = { ...local };
          for (const [id, n] of Object.entries(server)) {
            merged[id] = Math.max(merged[id] ?? 0, n);
          }
          saveLocalClicks(merged);
          return merged;
        });
      } catch {
        /* counters stay local */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const recordFlip = useCallback(async (item: ServiceItem) => {
    const now = Date.now();
    if (now - (lastAt.current[item.id] ?? 0) < OPEN_COOLDOWN_MS) return;
    if (inFlight.current.has(item.id)) return;
    lastAt.current[item.id] = now;
    inFlight.current.add(item.id);

    setClickMap((prev) => {
      const next = bumpClick(prev, item.id);
      saveLocalClicks(next);
      return next;
    });

    track("service_card_select", {
      service_id: item.id,
      service: item.title,
      assistance: item.assistance,
      via: "flip",
    });

    try {
      const res = await recordServiceCardClick({
        data: { serviceId: item.id },
      });
      if (res?.serviceId === item.id && typeof res.clicks === "number") {
        setClickMap((prev) => {
          const next = {
            ...prev,
            [item.id]: Math.max(prev[item.id] ?? 0, res.clicks),
          };
          saveLocalClicks(next);
          return next;
        });
      }
    } catch {
      /* keep optimistic */
    } finally {
      inFlight.current.delete(item.id);
    }
  }, []);

  return { display, clickMap, recordFlip };
}
