import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import type { AnalyticsEventName, AnalyticsProps } from "./types";

/**
 * Browser Application Insights.
 * Instrumentation key is a client-side key (visible in the browser by design).
 * Prefer VITE_APPINSIGHTS_CONNECTION_STRING or VITE_APPINSIGHTS_INSTRUMENTATION_KEY.
 */

const DEFAULT_INSTRUMENTATION_KEY = "5f8c893f-868d-4bad-b9b8-9d86b36b4f0d";

function env(name: string): string | undefined {
  try {
    const v = (import.meta as ImportMeta & { env?: Record<string, string> }).env?.[
      name
    ];
    return typeof v === "string" && v.trim() ? v.trim() : undefined;
  } catch {
    return undefined;
  }
}

function resolveConfig(): { connectionString?: string; instrumentationKey?: string } {
  const cs = env("VITE_APPINSIGHTS_CONNECTION_STRING");
  if (cs) return { connectionString: cs };
  const key =
    env("VITE_APPINSIGHTS_INSTRUMENTATION_KEY") || DEFAULT_INSTRUMENTATION_KEY;
  // Modern SDK prefers connection string
  return {
    connectionString: `InstrumentationKey=${key}`,
    instrumentationKey: key,
  };
}

let appInsights: ApplicationInsights | null = null;
let initAttempted = false;

export function getAppInsights(): ApplicationInsights | null {
  if (typeof window === "undefined") return null;
  if (initAttempted) return appInsights;
  initAttempted = true;

  try {
    const cfg = resolveConfig();
    const ai = new ApplicationInsights({
      config: {
        connectionString: cfg.connectionString,
        instrumentationKey: cfg.instrumentationKey,
        enableAutoRouteTracking: true,
        enableCorsCorrelation: false,
        enableRequestHeaderTracking: false,
        enableResponseHeaderTracking: false,
        disableFetchTracking: false,
        disableAjaxTracking: false,
        autoTrackPageVisitTime: true,
        // Privacy: keep cookies for session correlation only
        isCookieUseDisabled: false,
        isStorageUseDisabled: false,
      },
    });
    ai.loadAppInsights();
    ai.addTelemetryInitializer((envelope) => {
      const tags = envelope.tags ?? {};
      // Mark product surface
      tags["ai.cloud.role"] = "acornsoft-web";
      envelope.tags = tags;
      return true;
    });
    appInsights = ai;
  } catch {
    appInsights = null;
  }
  return appInsights;
}

/** Ensure AI is loaded (call early on client). */
export function initAppInsights(): void {
  getAppInsights();
}

export function trackAppInsightsEvent(
  event: AnalyticsEventName,
  props?: AnalyticsProps,
  path?: string,
  sessionId?: string,
): void {
  const ai = getAppInsights();
  if (!ai) return;

  const clean: Record<string, string> = {
    path: path ?? "",
    session_id: sessionId ?? "",
  };
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (v == null) continue;
      clean[k] = String(v);
    }
  }

  try {
    ai.trackEvent({ name: event }, clean);
  } catch {
    /* never block UI */
  }
}

export function trackAppInsightsPageView(
  name?: string,
  props?: AnalyticsProps,
): void {
  const ai = getAppInsights();
  if (!ai) return;
  try {
    const properties: Record<string, string> = {};
    if (props) {
      for (const [k, v] of Object.entries(props)) {
        if (v == null) continue;
        properties[k] = String(v);
      }
    }
    ai.trackPageView({
      name: name ?? document.title,
      uri: window.location.href,
      properties,
    });
  } catch {
    /* ignore */
  }
}
