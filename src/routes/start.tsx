import { createFileRoute } from "@tanstack/react-router";
import { StartClimbPage } from "@/components/site/start-climb-page";

export const Route = createFileRoute("/start")({
  component: StartClimbPage,
  head: () => ({
    meta: [
      { title: "Tell us what’s stuck — Acornsoft" },
      {
        name: "description",
        content:
          "Four short answers. No code. We turn it into something you can use.",
      },
    ],
  }),
});
