/** Allowed analytics event names (keep the set small and intentional). */
export const ANALYTICS_EVENTS = [
  "page_view",
  "faq_open",
  "service_carousel_view",
  "service_carousel_nav",
  "service_card_select",
  "cta_click",

  "link_click",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];

export type AnalyticsProps = Record<
  string,
  string | number | boolean | null | undefined
>;

export type AnalyticsEventInput = {
  event: AnalyticsEventName;
  path?: string;
  sessionId?: string;
  props?: AnalyticsProps;
};

export function isAnalyticsEventName(v: string): v is AnalyticsEventName {
  return (ANALYTICS_EVENTS as readonly string[]).includes(v);
}
