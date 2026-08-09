import { navLinks } from "./data";
import { Logo } from "./logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-elevated/50">
      <div className="container-site py-12 md:py-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <a
              href="#home"
              className="inline-flex items-center text-fg no-underline"
            >
              <Logo className="h-5 text-fg" />
            </a>
            <p className="mt-4 max-w-xs text-sm text-muted leading-relaxed">
              Applied AI software for teams that need production systems, not
              just prototypes.
            </p>
          </div>
          <nav
            className="flex flex-wrap gap-x-5 gap-y-2"
            aria-label="Footer"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition-colors hover:text-fg"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-subtle">
            © {year} Acornsoft. All rights reserved.
          </p>
          <p className="text-xs text-subtle">New York · AI-first organization</p>

        </div>
      </div>
    </footer>
  );
}
