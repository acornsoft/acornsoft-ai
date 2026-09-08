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
          "Three short answers. Summit stays blank until we look at the climb.",
      },
    ],
  }),
});
