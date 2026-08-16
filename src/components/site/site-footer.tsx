import { Link } from "@tanstack/react-router";
import { PersonalSiteBridge } from "./personal-site-bridge";
import { SignedIn } from "@/lib/auth/gates";

/**
 * Fixed legal / ethos footer — quiet, centered, beats Inbio global link CSS.
 * blaszyk.us only appears once someone is signed in.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="ac-site-footer" role="contentinfo">
      <div className="ac-site-footer-inner">
        <nav className="ac-site-footer-nav" aria-label="Company ethos">
          <Link to="/privacy">Privacy</Link>
          <span className="ac-site-footer-pipe" aria-hidden="true">
            |
          </span>
          <Link to="/policies">Policies</Link>
          <span className="ac-site-footer-pipe" aria-hidden="true">
            |
          </span>
          <Link to="/procedures">Procedures</Link>
          <SignedIn>
            <span className="ac-site-footer-pipe" aria-hidden="true">
              |
            </span>
            <PersonalSiteBridge variant="footer" />
          </SignedIn>
        </nav>
        <p className="ac-site-footer-meta">
          {`© ${year} Acornsoft  ·  Multiplanetary ambition  ·  Independent builders`}
        </p>
      </div>
    </footer>
  );
}
