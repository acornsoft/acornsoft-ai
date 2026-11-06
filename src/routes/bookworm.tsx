import { createFileRoute } from "@tanstack/react-router";
import { BookwormPage } from "@/components/site/bookworm-page";

export const Route = createFileRoute("/bookworm")({
  component: BookwormPage,
  head: () => ({
    meta: [
      { title: "Bookworm — Acornsoft" },
      {
        name: "description",
        content:
          "Bookworm turns X bookmarks into a searchable, tagged library and a daily habit of revisiting what you saved.",
      },
    ],
    links: [{ rel: "stylesheet", href: "/inbio/bookworm.css?v=9" }],
  }),
});
