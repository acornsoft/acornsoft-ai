/**
 * Acornsoft developed solutions — HQ catalog SoT.
 *
 * Visibility (flip per item; default signed-in):
 *   public     — anyone
 *   signed-in  — any authenticated visitor (current default)
 *   owner      — Gnomah / @acornsoftai only
 *
 * Live URLs only. Never private git. Never blaszyk.us (silent work record).
 * Luna Foundry Multiagent is the field kit, not a catalog demo.
 */

export type WorkVisibility = "public" | "signed-in" | "owner";

export type WorkEntry = {
  id: string;
  title: string;
  kicker: string;
  lede: string;
  ridge: string;
  visibility: WorkVisibility;
  /** Public host when one exists. Omit until the work has its own URL. */
  href?: string;
};

export const WORKS: WorkEntry[] = [
  {
    id: "unofficial-covid-report",
    title: "Unofficial COVID Report",
    kicker: "Report",
    lede: "Independent timeline of claims next to the record, origin to now, in plain language.",
    ridge: "Grok Build",
    visibility: "signed-in",
    href: "https://unofficial-covid-report.acornsoft.ai/",
  },
  {
    id: "blaze-the-barber",
    title: "Blaze the Barber",
    kicker: "Storefront",
    lede: "Voice-first barbershop storefront — catalog, cart, and a climb from note to shelf.",
    ridge: "Grok Build",
    visibility: "signed-in",
  },
  {
    id: "sals-barbershop",
    title: "Sal’s Barbershop",
    kicker: "Local site",
    lede: "Services, hours, and contact so neighbors can find the chair without phone tag.",
    ridge: "Grok Build",
    visibility: "signed-in",
  },
  {
    id: "gnomah-golf",
    title: "Gnomah Golf",
    kicker: "League app",
    lede: "Voice-first live scoring for weekly golf leagues — course, group, board.",
    ridge: "Custom .NET",
    visibility: "signed-in",
  },
  {
    id: "blaze-dropship",
    title: "Dropshipping storefront",
    kicker: "Commerce",
    lede: "Catalog, cart, checkout, and fulfillment wiring. Earlier export; Blaze is the current storefront SoT.",
    ridge: "Grok Build",
    visibility: "signed-in",
  },
];

export function worksVisibleTo(viewer: {
  signedIn: boolean;
  owner?: boolean;
}): WorkEntry[] {
  return WORKS.filter((w) => {
    if (w.visibility === "public") return true;
    if (w.visibility === "signed-in") return viewer.signedIn;
    return Boolean(viewer.owner);
  });
}
