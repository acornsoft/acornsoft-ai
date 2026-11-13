import { createFileRoute } from "@tanstack/react-router";
import { GrokUsagePage } from "@/components/site/grok-usage-page";

export const Route = createFileRoute("/grok")({
  component: GrokUsagePage,
  head: () => ({
    meta: [
      { title: "How Acornsoft AI uses Grok — Acornsoft" },
      {
        name: "description",
        content:
          "A public dashboard of how Acornsoft’s Grok Bot workforce spends its time — share by bot and daily mix of chats, routines, bot-to-bot, and group work.",
      },
    ],
  }),
});
