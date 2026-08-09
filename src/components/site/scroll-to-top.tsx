import { useEffect, useState } from "react";

/**
 * Fixed lower-right “scroll to top” (desktop only).
 * Footer is not present — sits in the corner with no footer clearance.
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      setVisible(y > 320);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      className="ac-scroll-top"
      aria-label="Scroll to top"
      title="Scroll to top"
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        left: "auto",
        top: "auto",
        zIndex: 1300,
      }}
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 5l-7 7h4.5v7h5v-7H19l-7-7z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}
