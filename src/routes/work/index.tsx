import { createFileRoute } from "@tanstack/react-router";
import { WorksPage } from "@/components/site/works-page";

export const Route = createFileRoute("/work/")({
  component: WorksPage,
  head: () => ({
    meta: [
      { title: "Works · Acornsoft" },
      {
        name: "description",
        content:
          "Developed solutions from Acornsoft. Signed in to view until an item is promoted public.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});
