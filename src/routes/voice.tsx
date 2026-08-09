import { createFileRoute } from "@tanstack/react-router";
import { VoicePage } from "@/components/site/voice-page";

export const Route = createFileRoute("/voice")({
  component: VoicePage,
  head: () => ({
    meta: [
      { title: "Voice · Luna (Ara) as your Sherpa — Acornsoft" },
      {
        name: "description",
        content:
          "Voice-first Acornsoft: talk on Grok Voice with Luna (Ara) as your Sherpa — one voice — for Climb Notes™ for your problem or business goal. Built for everyone — not only developers.",
      },
    ],
  }),
});
