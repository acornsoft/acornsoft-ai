type LogoProps = {
  className?: string;
  /** Full wordmark lockup (default) or mark crop only */
  variant?: "wordmark" | "mark";
  title?: string;
};

/**
 * Official Acornsoft logo (green tree + gold ACORNSOFT wordmark).
 * Sizing is controlled by CSS (responsive clamp) — keep width/height intrinsic.
 */
export function Logo({
  className,
  variant = "wordmark",
  title = "Acornsoft",
}: LogoProps) {
  if (variant === "mark") {
    return (
      <img
        src="/logo-mark.png"
        alt={title}
        className={className}
        width={48}
        height={48}
        decoding="async"
      />
    );
  }

  return (
    <img
      src="/Acornsoft-logo.png"
      alt={title}
      className={className}
      width={246}
      height={57}
      decoding="async"
      sizes="(max-width: 380px) 120px, (max-width: 767px) 42vw, (max-width: 1200px) 18vw, 260px"
    />
  );
}
