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
 * honey-reef-yonder-fleet is the Grok export of this HQ app, not a second site.
 */

export type WorkVisibility = "public" | "signed-in" | "owner";

export type WorkSurface = "page" | "desk";

export type WorkEntry = {
  id: string;
  title: string;
  kicker: string;
  lede: string;
  ridge: string;
  visibility: WorkVisibility;
  /** Short page body on /work/$id. */
  story: string[];
  /** Public host when one exists. Omit until the work has its own URL. */
  href?: string;
  /** How the catalog card opens. Desk = spoken queue on this site. */
  surface?: WorkSurface;
  /** Named client when the work is for someone else. */
  client?: string;
};

export const WORKS: WorkEntry[] = [
  {
    id: "acadence",
    title: "Acadence 90/10 desk",
    kicker: "Voice desk",
    lede: "Spoken 90/10 lead desk for Mike Strelick and the Acadence team — ready, mail, hold, sent. Nine lines at a time.",
    ridge: "Custom .NET",
    visibility: "signed-in",
    surface: "desk",
    client: "Acadence · Mike Strelick",
    story: [
      "Mike asked for a current list of the right schools and the right people, so he could talk instead of hunting an outdated spreadsheet.",
      "The desk loads Federal Student Aid workbooks into one store, scores proprietary schools on the 90/10 rule, and speaks a reviewed pack: school, inbox or paper, percent.",
      "Mike receives the pack. Mark and Tony review. This page speaks the queue. It does not send mail to colleges.",
    ],
  },
  {
    id: "unofficial-covid-report",
    title: "Unofficial COVID Report",
    kicker: "Report",
    lede: "Independent timeline of claims next to the record, origin to now, in plain language.",
    ridge: "Grok Build",
    visibility: "signed-in",
    href: "https://unofficial-covid-report.acornsoft.ai/",
    story: [
      "A public timeline of claims next to the record — origin to now — so a reader can see what was said, when, and what the documents show.",
      "Built on Grok Build. Lives on its own host. This page is the catalog entry; the report is the summit.",
    ],
  },
  {
    id: "bymorgan",
    title: "By Morgan",
    kicker: "Local site",
    lede: "Holistic residential cleaning for Darien Center — callback desk, ten local services, a journal for neighbors.",
    ridge: "Grok Build",
    visibility: "signed-in",
    story: [
      "A cleaner house and a calmer home. Wells, septic, mud season, cottages by the park. Ten local services.",
      "Four fields and a callback, not a shopping cart. Not live on a public Acornsoft host yet.",
    ],
  },
  {
    id: "blaze-the-barber",
    title: "Blaze the Barber",
    kicker: "Storefront",
    lede: "Voice-first barbershop storefront — catalog, cart, and a climb from note to shelf.",
    ridge: "Grok Build",
    visibility: "signed-in",
    story: [
      "A storefront a barber can run: catalog, cart, and a path from a Climb Note to something on the shelf.",
      "Voice-first. Not live on a public host yet.",
    ],
  },
  {
    id: "sals-barbershop",
    title: "Sal’s Barbershop",
    kicker: "Local site",
    lede: "Services, hours, and contact so neighbors can find the chair without phone tag.",
    ridge: "Grok Build",
    visibility: "signed-in",
    story: [
      "A small local site: services, hours, contact. Neighbors should not need a phone tree to find the chair.",
      "Not live on a public host yet.",
    ],
  },
  {
    id: "gnomah-golf",
    title: "Gnomah Golf",
    kicker: "League app",
    lede: "Voice-first live scoring for weekly golf leagues — course, group, board.",
    ridge: "Custom .NET",
    visibility: "signed-in",
    story: [
      "Weekly league scoring: course, group, live board. Voice-first so a round does not wait on a clipboard.",
      "Custom .NET. Not on a public Acornsoft host.",
    ],
  },
  {
    id: "doge-reviews",
    title: "Doge Reviews",
    kicker: "Public site",
    lede: "A transparency site for DOGE — community review, moderation, and a recommendation Sherpa.",
    ridge: "Custom .NET",
    visibility: "signed-in",
    story: [
      "A site for complete transparency to the American public. Reviews, moderation, and a Sherpa that points people to what is worth reading.",
      "Custom .NET, clean architecture. Not on a public Acornsoft host yet.",
    ],
  },
  {
    id: "bocce-club-pizza",
    title: "Bocce Club Pizza",
    kicker: "Prototype",
    lede: "Light Sherpa prototype — ordering and a social guide for a neighborhood pizza club.",
    ridge: "Sherpa",
    visibility: "signed-in",
    story: [
      "A fun first Sherpa: order a pie, walk a guest through the club, keep the table moving.",
      "Prototype. Not on a public host.",
    ],
  },
  {
    id: "luna-contact-center",
    title: "Luna Contact Center",
    kicker: "Contact center",
    lede: "D365 contact center utilities — form field analysis, search ring, keyboard macros — for enterprise desks.",
    ridge: "Luna MacroFlow",
    visibility: "signed-in",
    story: [
      "Debugging helpers and shared web resources for Dynamics 365 Contact Center implementations.",
      "Field kit for the desk, not a public marketing site.",
    ],
  },
  {
    id: "gotham-gaars",
    title: "Gotham GAARS",
    kicker: "Field app",
    lede: "Gotham Arrest Arraignment Recording System — arrest through arraignment, citation, and warrant. New York City spine.",
    ridge: "Power Apps",
    visibility: "signed-in",
    story: [
      "Analysis and a Power Apps canvas for arrest through arraignment, summary citation, and arrest warrant.",
      "Major-city policing model. Not a public host.",
    ],
  },
  {
    id: "blaze-dropship",
    title: "Dropshipping storefront",
    kicker: "Commerce",
    lede: "Catalog, cart, checkout, and fulfillment wiring. Earlier export; Blaze is the current storefront SoT.",
    ridge: "Grok Build",
    visibility: "signed-in",
    story: [
      "Catalog, cart, checkout, fulfillment wiring. An earlier export.",
      "Blaze the Barber is the current storefront source of truth.",
    ],
  },
];

export function workById(id: string): WorkEntry | undefined {
  return WORKS.find((w) => w.id === id);
}

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

export function workOpenLabel(item: WorkEntry): string {
  return item.surface === "desk" ? "Open desk" : "Open page";
}
