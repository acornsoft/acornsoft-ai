/** Public Luna help on acornsoft.ai — same pack as the extension, never private GitHub. */
export const LUNA_HELP_ORIGIN = "https://www.acornsoft.ai";

export type LunaDoc = {
  slug: string;
  file: string;
  title: string;
  kicker: string;
  lede: string;
  hub?: boolean;
};

export const LUNA_DOCS: LunaDoc[] = [
  {
    slug: "grok-build",
    file: "01-grok-build.md",
    title: "Trail map: Grok Build",
    kicker: "Primary ridge",
    lede: "SuperGrok or X Premium+. Dual pane. One complete climb.",
  },
  {
    slug: "copilot",
    file: "02-github-copilot.md",
    title: "Trail map: GitHub Copilot",
    kicker: "Copilot ridge",
    lede: "Pro or company seat. Luna’s four agents in Copilot Chat.",
  },
  {
    slug: "cursor",
    file: "03-cursor.md",
    title: "Trail map: Cursor",
    kicker: "Cursor ridge",
    lede: "Pro with Agent. Same pack. Same four beats.",
  },
  {
    slug: "claude",
    file: "04-claude.md",
    title: "Trail map: Claude",
    kicker: "Claude ridge",
    lede: "Claude Pro. Same pack through project files.",
  },
  {
    slug: "security",
    file: "SECURITY-PRIVACY-ETHICS.md",
    title: "Security before client data",
    kicker: "Rules of the mountain",
    lede: "No secrets in chat. Human steers. Classify before you paste.",
  },
  {
    slug: "visual-guide",
    file: "VISUAL-GUIDE.md",
    title: "Visual guide",
    kicker: "Still images",
    lede: "What camp looks like after Setup.",
  },
  {
    slug: "grok-keys",
    file: "GROK-KEYBINDINGS-VS-CODE.md",
    title: "Grok keys in VS Code",
    kicker: "TUI chords",
    lede: "When Grok Build is focused, VS Code yields the keys.",
  },
  {
    slug: "surface",
    file: "SURFACE-REQUIREMENTS.md",
    title: "Surface requirements",
    kicker: "What Setup writes",
    lede: "Skills, agents, and shell pack on disk.",
  },
  {
    slug: "support",
    file: "SUPPORT.md",
    title: "Feedback and support",
    kicker: "Help",
    lede: "Send a Climb Note. No GitHub required.",
  },
  {
    slug: "operators",
    file: "OPERATOR-REFERENCE.md",
    title: "Operator reference",
    kicker: "Commands",
    lede: "Setup, terminals, and what each Luna command does.",
  },
  {
    slug: "tui",
    file: "TUI-UI-TEST-CASES.md",
    title: "TUI + UI test cases",
    kicker: "Prove the climb",
    lede: "Command wiring and one complete MacroFlow turn.",
  },
];

export const LUNA_HUB_FILE = "README.md";

const FILE_TO_HREF: Record<string, string> = {
  "01-grok-build.md": "/luna/grok-build",
  "02-github-copilot.md": "/luna/copilot",
  "03-cursor.md": "/luna/cursor",
  "04-claude.md": "/luna/claude",
  "SECURITY-PRIVACY-ETHICS.md": "/luna/security",
  "VISUAL-GUIDE.md": "/luna/visual-guide",
  "SURFACE-REQUIREMENTS.md": "/luna/surface",
  "GROK-KEYBINDINGS-VS-CODE.md": "/luna/grok-keys",
  "SUPPORT.md": "/luna/support",
  "OPERATOR-REFERENCE.md": "/luna/operators",
  "TUI-UI-TEST-CASES.md": "/luna/tui",
  "SCREEN-SHARE-COACH-01-GROK-BUILD.md": "/luna/grok-build",
  "README.md": "/luna",
};

export function lunaDocBySlug(slug: string): LunaDoc | undefined {
  return LUNA_DOCS.find((d) => d.slug === slug);
}

export function lunaHrefForOnboardingFile(name: string): string {
  return FILE_TO_HREF[name] ?? "/luna";
}

export function lunaDocUrl(slug: string): string {
  return `${LUNA_HELP_ORIGIN}/luna/${slug}`;
}
