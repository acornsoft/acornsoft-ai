import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "./logo";
import { SiteAuthSlot } from "./site-auth-slot";
import {
  VoiceHeaderButton,
  VoiceLink,
  useVoiceAccessState,
} from "./voice-access";
import { primaryNav } from "./site-nav";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { SiteFooter } from "./site-footer";

function useActivePath() {
  return useRouterState({ select: (s) => s.location.pathname });
}

function isActivePath(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

function pageTitle(pathname: string): string {
  if (pathname === "/") return "Home";
  if (pathname.startsWith("/about")) return "About";
  if (pathname.startsWith("/service")) return "Service";
  if (pathname.startsWith("/climb-notes")) return "Climb Notes";
  if (pathname.startsWith("/voice")) return "Voice";
  if (pathname.startsWith("/canopy")) return "Canopy";
  if (pathname.startsWith("/gnomah")) return "Gnomah";
  if (pathname.startsWith("/corporate")) return "Corporate";
  if (pathname.startsWith("/login")) return "Sign in";
  return "Acornsoft";
}

function NavLinks({
  onNavigate,
  mobile = false,
  showGnomah = false,
}: {
  onNavigate?: () => void;
  mobile?: boolean;
  showGnomah?: boolean;
}) {
  const pathname = useActivePath();
  const voice = useVoiceAccessState();

  return (
    <>
      {primaryNav.map((item) => {
        const active = isActivePath(pathname, item.to);
        const className = [
          "ac-nav-link",
          mobile ? "ac-nav-link--mobile" : "",
          active ? "is-active" : "",
        ]
          .filter(Boolean)
          .join(" ");
        return (
          <li key={item.to} className="ac-nav-item">
            <Link
              className={className}
              to={item.to}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
      {showGnomah ? (
        <li className="ac-nav-item">
          <Link
            className={[
              "ac-nav-link",
              mobile ? "ac-nav-link--mobile" : "",
              isActivePath(pathname, "/gnomah") ? "is-active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            to="/gnomah"
            onClick={onNavigate}
            aria-current={
              isActivePath(pathname, "/gnomah") ? "page" : undefined
            }
          >
            Gnomah
          </Link>
        </li>
      ) : null}
      {mobile && voice.allowed ? (
        <li className="ac-nav-item">
          <VoiceLink
            className="ac-nav-link ac-nav-link--mobile ac-voice-open"
            onClick={onNavigate}
          >
            ACORNSOFT is OPEN
          </VoiceLink>
        </li>
      ) : null}
    </>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className={`ac-menu-icon${open ? " is-open" : ""}`} aria-hidden>
      <span />
      <span />
      <span />
    </span>
  );
}

/**
 * Shared sticky header + mobile full-screen menu.
 * Primary links same on every page; Gnomah only when signed in.
 * Mobile: logo hidden — page title + Log in + menu control.
 */
export function SiteHeader({
  loginRedirect = "/gnomah",
}: {
  loginRedirect?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useActivePath();
  const { user, isPending } = useCurrentUserState();
  const showGnomah = !isPending && !!user;
  const title = pageTitle(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`ac-site-header${scrolled || menuOpen ? " is-scrolled" : ""}${menuOpen ? " is-menu-open" : ""}`}
      >
        <div className="ac-site-header-inner">
          <div className="ac-site-brand">
            <Link
              to="/"
              className="ac-site-logo"
              onClick={() => setMenuOpen(false)}
              aria-label="Acornsoft home"
            >
              <Logo />
            </Link>
            {/* Mobile: text brand / page context (logo hidden in CSS) */}
            <Link
              to="/"
              className="ac-site-mobile-brand"
              onClick={() => setMenuOpen(false)}
              aria-label="Acornsoft home"
            >
              <span className="ac-site-mobile-wordmark">Acornsoft</span>
              <span className="ac-site-mobile-page">{title}</span>
            </Link>
          </div>

          <nav className="ac-site-nav ac-site-nav--desktop" aria-label="Primary">
            <ul className="ac-site-nav-list">
              <NavLinks showGnomah={showGnomah} />
            </ul>
          </nav>

          <div className="ac-site-actions">
            <VoiceHeaderButton className="rn-btn ac-voice-open ac-site-voice-btn ac-site-voice-btn--desktop" />
            <SiteAuthSlot loginRedirect={loginRedirect} />
            <button
              type="button"
              className="ac-site-menu-btn"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="ac-mobile-panel"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <MenuIcon open={menuOpen} />
              <span className="ac-site-menu-btn-label">
                {menuOpen ? "Close" : "Menu"}
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="ac-mobile-panel"
        className={`ac-mobile-panel${menuOpen ? " is-open" : ""}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <button
          type="button"
          className="ac-mobile-panel-backdrop"
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
        />
        <div className="ac-mobile-panel-inner">
          <div className="ac-mobile-panel-head">
            <p className="ac-mobile-panel-kicker">Navigate</p>
            <button
              type="button"
              className="ac-mobile-close"
              onClick={() => setMenuOpen(false)}
            >
              Close
            </button>
          </div>
          <nav aria-label="Mobile primary">
            <ul className="ac-site-nav-list ac-site-nav-list--mobile">
              <NavLinks
                mobile
                showGnomah={showGnomah}
                onNavigate={() => setMenuOpen(false)}
              />
            </ul>
          </nav>
          <div className="ac-mobile-panel-foot">
            <SiteAuthSlot loginRedirect={loginRedirect} />
          </div>
        </div>
      </div>
    </>
  );
}

export { SiteFooter };

/** Page shell: shared header + main + footer. */
export function SiteChrome({
  children,
  loginRedirect = "/gnomah",
  mainClassName = "",
}: {
  children: ReactNode;
  loginRedirect?: string;
  mainClassName?: string;
}) {
  return (
    <div
      className="template-color-1 spybody ac-inbio ac-hero-stage"
      data-spy="scroll"
    >
      <SiteHeader loginRedirect={loginRedirect} />
      <main
        className={`page-wrapper-two ac-hero-stage-main ${mainClassName}`.trim()}
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
