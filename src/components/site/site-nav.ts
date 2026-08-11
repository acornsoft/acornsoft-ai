/** Top-level primary nav. Items with `authOnly` show only when signed in. */
export const primaryNav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/service", label: "Service" },
  /** Studio map — rework later; signed-in only for now */
  { to: "/method", label: "Method", authOnly: true as const },
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
