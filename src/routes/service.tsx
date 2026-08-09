import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/site/service-page";

export const Route = createFileRoute("/service")({
  component: ServicePage,
  head: () => ({
    meta: [
      { title: "Services — Acornsoft" },
      {
        name: "description",
        content:
          "Acornsoft services: artificial intelligence strategy, product build, model systems, trust and safety, automation, and delivery via Climb Notes™.",
      },
    ],
  }),
});
