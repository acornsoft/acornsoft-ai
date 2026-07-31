import { createFileRoute } from "@tanstack/react-router";
import { CanopyPage } from "@/components/site/canopy-page";

export const Route = createFileRoute("/canopy")({
  component: CanopyPage,
  head: () => ({
    meta: [
      { title: "Canopy — Acornsoft Grok & xAI Radar" },
      {
        name: "description",
        content:
          "Canopy is Acornsoft’s Grok and xAI radar—timeline from xAI’s founding through the latest X feednotes.",
      },
    ],
  }),
});
