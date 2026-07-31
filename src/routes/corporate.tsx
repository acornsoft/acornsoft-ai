import { createFileRoute } from "@tanstack/react-router";
import { CorporatePage } from "@/components/site/corporate-page";

export const Route = createFileRoute("/corporate")({
  component: CorporatePage,
  head: () => ({
    meta: [
      { title: "Corporate — Acornsoft" },
      {
        name: "description",
        content:
          "Acornsoft corporate ethos: Privacy, Policies, and Procedures in one place.",
      },
    ],
  }),
});
