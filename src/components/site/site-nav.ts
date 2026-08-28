/** Top-level primary nav. Items with `authOnly` show only when signed in.
 *
 * Order is the climb, not the org chart:
 * Home (door) → journal → recipes → live radar → offer → who we are.
 * About sits last. Logo already returns Home.
 */
export const primaryNav = [
  { to: "/", label: "Home" },
  { to: "/climb-notes", label: "Climb Notes" },
  { to: "/field-guide", label: "Field Guide" },
  { to: "/canopy", label: "Canopy" },
  { to: "/service", label: "Services" },
  /** Studio map — rework later; signed-in only for now */
  { to: "/method", label: "Method", authOnly: true as const },
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
