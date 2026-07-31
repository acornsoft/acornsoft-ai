/**
 * Climb Notes™ wordmark — Acornsoft trademark claim (™).
 */
export function ClimbNotesMark({
  className = "",
  large = false,
  as = "span",
}: {
  className?: string;
  large?: boolean;
  as?: "span" | "strong";
}) {
  const Tag = as;
  return (
    <Tag
      className={`cn-wordmark${large ? " cn-wordmark-lg" : ""}${className ? ` ${className}` : ""}`}
    >
      Climb<span className="cn-hyphen">-</span>Notes
      <sup className="cn-tm" title="Climb Notes is a trademark of Acornsoft">
        ™
      </sup>
    </Tag>
  );
}

/** Plain text form for titles / meta where HTML is not available */
export const CLIMB_NOTES_TM = "Climb Notes™";
