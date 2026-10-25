import { createFileRoute } from "@tanstack/react-router";
import { BOOKSHELF_COPY, BookshelfPage } from "@/components/site/bookshelf-page";

export const Route = createFileRoute("/bookshelf")({
  component: BookshelfPage,
  head: () => ({
    meta: [
      { title: "Bookshelf — Acornsoft" },
      {
        name: "description",
        content: BOOKSHELF_COPY.whatItIs,
      },
    ],
    links: [
      { rel: "stylesheet", href: "/inbio/bookworm.css?v=8" },
      { rel: "stylesheet", href: "/inbio/bookshelf.css?v=2" },
    ],
  }),
});
