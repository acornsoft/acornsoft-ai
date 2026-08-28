import { createFileRoute } from "@tanstack/react-router";
import { FieldGuidePage } from "@/components/site/field-guide-page";

export const Route = createFileRoute("/field-guide")({
  component: FieldGuidePage,
  head: () => ({
    meta: [
      { title: "Field Guide — Recipes for the climb · Acornsoft" },
      {
        name: "description",
        content:
          "Nine short how-tos. Write down what’s stuck. Agents find, build, show, and talk you through it.",
      },
    ],
  }),
});
