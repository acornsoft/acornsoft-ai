/** Top-level primary nav — same on every page (Gnomah is auth-gated in the header). */
export const primaryNav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/service", label: "Service" },
  { to: "/climb-notes", label: "Climb Notes" },
  { to: "/canopy", label: "Canopy" },
] as const;

/** Footer ethos links — Voice is intentionally omitted (sign-in only surface). */
export const footerNav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/service", label: "Service" },
  { to: "/climb-notes", label: "Climb Notes", climbMark: true },
  { to: "/canopy", label: "Canopy" },
  { to: "/corporate", label: "Corporate" },
] as const;

export type PrimaryNavItem = (typeof primaryNav)[number];
