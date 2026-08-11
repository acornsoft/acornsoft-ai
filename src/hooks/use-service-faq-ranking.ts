import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { serviceFaqs, type ServiceFaq } from "@/components/site/service-data";
import {
  listServiceFaqClicks,
  recordServiceFaqClick,
} from "@/lib/service-faq/actions";
import {
  bumpClick,
  clicksToMap,
  rankServiceFaqs,
  type ClickMap,
} from "@/lib/service-faq/ranking";
import { track } from "@/lib/analytics/client";

/** Min ms between counted opens of the same FAQ (blocks double-fire). */
const OPEN_COOLDOWN_MS = 1500;

/**
 * Service FAQ interest ranking + analytics:
 * - Load server click totals on mount
 * - On details open → count + re-sort + analytics event
 * - Default order keeps “What is a Climb Note?” first when tied
 */
export function useServiceFaqRanking() {
  const [clickMap, setClickMap] = useState<ClickMap>({});
  const [ready, setReady] = useState(false);
  const lastOpenAt = useRef<Record<string, number>>({});
  const inFlight = useRef<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await listServiceFaqClicks();
        if (!cancelled) setClickMap(clicksToMap(rows));
      } catch {
        /* default order only */
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const rankedFaqs = useMemo(
    () => rankServiceFaqs(serviceFaqs, clickMap),
    [clickMap],
  );

  const trackFaqOpen = useCallback(async (faq: ServiceFaq) => {
    const now = Date.now();
    const last = lastOpenAt.current[faq.id] ?? 0;
    if (now - last < OPEN_COOLDOWN_MS) return;
    if (inFlight.current.has(faq.id)) return;

    lastOpenAt.current[faq.id] = now;
    inFlight.current.add(faq.id);

    let prior = 0;
    setClickMap((prev) => {
      prior = prev[faq.id] ?? 0;
      return bumpClick(prev, faq.id);
    });

    track("faq_open", {
      faq_id: faq.id,
      faq_q: faq.q,
      default_order: faq.defaultOrder,
      prior_clicks: prior,
    });

    try {
      const res = await recordServiceFaqClick({ data: { faqId: faq.id } });
      if (res?.faqId === faq.id && typeof res.clicks === "number") {
        setClickMap((prev) => ({
          ...prev,
          [faq.id]: Math.max(prev[faq.id] ?? 0, res.clicks),
        }));
      }
    } catch {
      /* keep optimistic bump */
    } finally {
      inFlight.current.delete(faq.id);
    }
  }, []);

  const onFaqToggle = useCallback(
    (faq: ServiceFaq, e: React.SyntheticEvent<HTMLDetailsElement>) => {
      if (!e.currentTarget.open) return;
      void trackFaqOpen(faq);
    },
    [trackFaqOpen],
  );

  return { rankedFaqs, clickMap, onFaqToggle, ready };
}
