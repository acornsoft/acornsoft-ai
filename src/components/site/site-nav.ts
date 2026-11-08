/** Public header stays Canopy and About. The owner sees the full menu. */
export const SHOW_PRIMARY_NAV: boolean = false;

/** What a signed-out visitor sees. */
export const publicNav = [
  { to: "/canopy", label: "Canopy" },
  { to: "/about", label: "About" },
] as const;

/** Full menu. `ownerOnly` items appear only for @acornsoftai. */
export const primaryNav = [
  { to: "/climb-notes", label: "Climb Notes" },
  { to: "/field-guide", label: "Field Guide" },
  { to: "/canopy", label: "Canopy" },
  { to: "/work", label: "Works", ownerOnly: true },
  { to: "/gnomah", label: "Gnomah", ownerOnly: true },
  { to: "/service", label: "Services" },
  { to: "/method", label: "Method", ownerOnly: true },
  { to: "/about", label: "About" },
] as const;

/** Footer ethos links — Voice is intentionally omitted (sign-in only surface). */
export const footerNav = [
  { to: "/", label: "Home" },
  { to: "/climb-notes", label: "Climb Notes", climbMark: true },
  { to: "/field-guide", label: "Field Guide" },
  { to: "/canopy", label: "Canopy" },
  { to: "/service", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/corporate", label: "Corporate" },
] as const;

export type PrimaryNavItem = (typeof primaryNav)[number];
