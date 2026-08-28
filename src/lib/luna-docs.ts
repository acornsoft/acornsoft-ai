/** Public Luna help on acornsoft.ai — never private GitHub. */
export const LUNA_HELP_ORIGIN = "https://www.acornsoft.ai";

export type LunaDoc = {
  slug: string;
  title: string;
  kicker: string;
  lede: string;
};

export const LUNA_DOCS: LunaDoc[] = [
  {
    slug: "grok-build",
    title: "Trail map: Grok Build",
    kicker: "Primary ridge",
    lede: "SuperGrok or X Premium+. Dual pane. One complete climb.",
  },
  {
    slug: "copilot",
    title: "Trail map: GitHub Copilot",
    kicker: "Copilot ridge",
    lede: "Pro or company seat. Luna’s four agents in Copilot Chat.",
  },
  {
    slug: "cursor",
    title: "Trail map: Cursor",
    kicker: "Cursor ridge",
    lede: "Pro with Agent. Same pack. Same four beats.",
  },
  {
    slug: "claude",
    title: "Trail map: Claude",
    kicker: "Claude ridge",
    lede: "Claude Pro. Same pack through project files.",
  },
  {
    slug: "security",
    title: "Security before client data",
    kicker: "Rules of the mountain",
    lede: "No secrets in chat. Human steers. Classify before you paste.",
  },
  {
    slug: "support",
    title: "Feedback and support",
    kicker: "Help",
    lede: "Send a Climb Note. No GitHub required.",
  },
];

export function lunaDocUrl(slug: string): string {
  return `${LUNA_HELP_ORIGIN}/luna/${slug}`;
}
