import { createFileRoute } from "@tanstack/react-router";
import { ClimbNotesPage } from "@/components/site/climb-notes-page";

export const Route = createFileRoute("/climb-notes")({
  component: ClimbNotesPage,
  head: () => ({
    meta: [
      { title: "Climb Notes™ — Acornsoft Studio Journal" },
      {
        name: "description",
        content:
          "Climb Notes™ is Acornsoft’s studio journal—how we scope, ship, and harden production AI. Separate from Canopy, our Grok / xAI radar.",
      },
    ],
  }),
});
