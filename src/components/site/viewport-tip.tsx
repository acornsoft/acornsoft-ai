import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

const PAD = 12;

function clampTip(anchor: HTMLElement, tip: HTMLElement) {
  const ar = anchor.getBoundingClientRect();
  const maxW = Math.min(280, window.innerWidth - PAD * 2);
  tip.style.setProperty("--tip-max", `${maxW}px`);
  const tw = Math.min(maxW, tip.offsetWidth || maxW);
  const th = tip.offsetHeight;
  let left = ar.left;
  if (left + tw > window.innerWidth - PAD) {
    left = window.innerWidth - PAD - tw;
  }
  if (left < PAD) left = PAD;
  let top = ar.bottom + 8;
  if (top + th > window.innerHeight - PAD) {
    top = ar.top - th - 8;
  }
  if (top < PAD) top = PAD;
  tip.style.setProperty("--tip-top", `${Math.round(top)}px`);
  tip.style.setProperty("--tip-left", `${Math.round(left)}px`);
}

type ViewportTipProps = {
  className: string;
  tipClassName: string;
  label: ReactNode;
  children: ReactNode;
  tipId?: string;
  role?: string;
  selected?: boolean;
  onActivate?: () => void;
};

/** Hover popup, clamped to the window. Touch tap still toggles. */
export function ViewportTip({
  className,
  tipClassName,
  label,
  children,
  tipId,
  role,
  selected,
  onActivate,
}: ViewportTipProps) {
  const autoId = useId();
  const id = tipId ?? autoId;
  const btnRef = useRef<HTMLButtonElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);
  const pointer = useRef<"mouse" | "touch" | "pen" | "">("mouse");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const place = useCallback(() => {
    const btn = btnRef.current;
    const tip = tipRef.current;
    if (!btn || !tip) return;
    clampTip(btn, tip);
  }, []);

  useLayoutEffect(() => {
    if (open) place();
  }, [open, children, place]);

  useEffect(() => {
    if (!open) return;
    const onWin = () => place();
    window.addEventListener("resize", onWin);
    window.addEventListener("scroll", onWin, true);
    return () => {
      window.removeEventListener("resize", onWin);
      window.removeEventListener("scroll", onWin, true);
    };
  }, [open, place]);

  return (
    <button
      ref={btnRef}
      type="button"
      className={className}
      role={role}
      aria-describedby={id}
      aria-selected={selected}
      onMouseEnter={() => {
        pointer.current = "mouse";
        setOpen(true);
      }}
      onMouseLeave={() => setOpen(false)}
      onPointerEnter={(e) => {
        pointer.current = e.pointerType;
        if (e.pointerType !== "touch") setOpen(true);
      }}
      onPointerLeave={() => {
        if (pointer.current !== "touch") setOpen(false);
      }}
      onBlur={() => setOpen(false)}
      onClick={() => {
        onActivate?.();
        if (pointer.current === "touch") setOpen((v) => !v);
      }}
    >
      {label}
      {mounted
        ? createPortal(
            <span
              ref={tipRef}
              id={id}
              role="tooltip"
              className={`ac-viewport-tip ${tipClassName}${open ? " is-open" : ""}`}
            >
              {children}
            </span>,
            document.body,
          )
        : null}
    </button>
  );
}
