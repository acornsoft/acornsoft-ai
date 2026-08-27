import { PERSONAL_SITE, dualSiteNote } from "@/lib/site-links";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

type Variant = "card" | "inline" | "footer";

/**
 * Links this Acornsoft surface to the personal work bio on blaszyk.us.
 * Hidden until a visitor is signed in (no flash while session loads).
 */
export function PersonalSiteBridge({
  variant = "card",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  const { user } = useCurrentUserState();
  if (!user) return null;

  if (variant === "footer") {
    return (
      <a
        className={className || undefined}
        href={PERSONAL_SITE.workBio}
        target="_blank"
        rel="noopener noreferrer me"
        title="Personal work biography"
      >
        {PERSONAL_SITE.label}
      </a>
    );
  }

  if (variant === "inline") {
    return (
      <a
        className={className || "ac-personal-inline"}
        href={PERSONAL_SITE.workBio}
        target="_blank"
        rel="noopener noreferrer me"
      >
        Personal work bio on {PERSONAL_SITE.label}
      </a>
    );
  }

  return (
    <aside
      className={`ac-personal-bridge ${className}`.trim()}
      aria-labelledby="personal-site-bridge-heading"
    >
      <p className="ac-personal-bridge-kicker">Also</p>
      <h2 className="ac-personal-bridge-title" id="personal-site-bridge-heading">
        {PERSONAL_SITE.ownerName}
      </h2>
      <p className="ac-personal-bridge-role">
        {PERSONAL_SITE.ownerTitle}, Acornsoft · personal work biography
      </p>
      <p className="ac-personal-bridge-copy">{dualSiteNote}</p>
      <a
        className="rn-btn ac-btn-maroon ac-personal-bridge-cta"
        href={PERSONAL_SITE.workBio}
        target="_blank"
        rel="noopener noreferrer me"
      >
        <span>Open {PERSONAL_SITE.label}</span>
      </a>
    </aside>
  );
}
