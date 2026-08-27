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
          "Eight recipes. Climb Notes™ are the crossover from non-technical to technical: Problem, Measure, Pitch, Lesson. Then Grok Build, Imagine, and Voice.",
      },
    ],
  }),
});
