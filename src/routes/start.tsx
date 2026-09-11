import { createFileRoute } from "@tanstack/react-router";
import { StartClimbPage } from "@/components/site/start-climb-page";

export const Route = createFileRoute("/start")({
  component: StartClimbPage,
  head: () => ({
    meta: [
      { title: "Send a Note — Acornsoft" },
      {
        name: "description",
        content:
          "One problem. One climb. Ready to start. Where you stand, the one job, and whether to go.",
      },
    ],
  }),
});
