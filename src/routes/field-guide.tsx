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
          "Eight short recipes for the Mountaineering approach: name the problem, measure, pitch, write the Climb Note, then use Grok Build, Imagine, and Voice.",
      },
    ],
  }),
});
