import { createFileRoute } from "@tanstack/react-router";
import { LunaPage } from "@/components/site/luna-page";

export const Route = createFileRoute("/luna")({
  component: LunaPage,
  head: () => ({
    meta: [
      { title: "Luna Foundry Multiagent · Acornsoft" },
      {
        name: "description",
        content:
          "Luna is your Sherpa. Climb Notes are the trail. Onboarding lives here — same pack as the extension.",
      },
    ],
  }),
});
