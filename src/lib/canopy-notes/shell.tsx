import type { ReactNode } from "react";
import { SiteChrome } from "@/components/site/site-chrome";
import "./canopy-notes.css";

export function CanopyNotesShell({ children }: { children: ReactNode }) {
  return (
    <SiteChrome loginRedirect="/canopy/notes" mainClassName="ac-canopy-notes-page">
      {children}
    </SiteChrome>
  );
}
