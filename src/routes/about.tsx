import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/site/about-page";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — Acornsoft" },
      {
        name: "description",
        content:
          "Acornsoft is a New York–based AI-first organization building production AI via Climb Notes™—vision, first principles, and charter.",
      },
    ],
  }),
});
