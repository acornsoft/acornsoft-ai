import { logAnalyticsEvent } from "./actions";
import {
  initAppInsights,
  trackAppInsightsEvent,
  trackAppInsightsPageView,
} from "./appinsights";
import type { AnalyticsEventName, AnalyticsProps } from "./types";

const SESSION_KEY = "ac_analytics_sid";

function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return `s_${Date.now().toString(36)}`;
  }
}

let bootstrapped = false;

/** Load Application Insights once on the client. */
export function bootstrapAnalytics(): void {
  if (typeof window === "undefined" || bootstrapped) return;
  bootstrapped = true;
  initAppInsights();
}

/**
 * Fire-and-forget product analytics event.
 * Dual-writes: Azure Application Insights + local analytics_events table.
 * Never throws to callers; safe in UI handlers.
 */
export function track(
  event: AnalyticsEventName,
  props?: AnalyticsProps,
  path?: string,
): void {
  if (typeof window === "undefined") return;
  bootstrapAnalytics();

  const resolvedPath =
    path ??
    `${window.location.pathname}${window.location.search}${window.location.hash || ""}`;
  const sessionId = getSessionId();

  // Azure Application Insights (access / product telemetry)
  trackAppInsightsEvent(event, props, resolvedPath, sessionId);

  // First-party append-only log (FAQ ranking support + audit)
  void logAnalyticsEvent({
    data: {
      event,
      path: resolvedPath,
      sessionId,
      props,
    },
  }).catch(() => {
    /* ignore */
  });
}

/** Log a page view once per mount (call from useEffect). */
export function trackPageView(extra?: AnalyticsProps): void {
  if (typeof window === "undefined") return;
  bootstrapAnalytics();
  trackAppInsightsPageView(
    typeof extra?.page === "string" ? String(extra.page) : undefined,
    extra,
  );
  track("page_view", extra);
}
