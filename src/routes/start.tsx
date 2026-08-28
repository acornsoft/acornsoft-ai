import { createFileRoute } from "@tanstack/react-router";
import { StartClimbPage } from "@/components/site/start-climb-page";

export const Route = createFileRoute("/start")({
  component: StartClimbPage,
  head: () => ({
    meta: [
      { title: "Send a Climb Note — Acornsoft" },
      {
        name: "description",
        content:
          "Craft your problem as a Climb Note. Send it to Acornsoft. We build your specific solution — real software, near real time.",
      },
    ],
  }),
});
