import { createFileRoute } from "@tanstack/react-router";
import { MethodPage } from "@/components/site/method-page";

export const Route = createFileRoute("/method")({
  component: MethodPage,
  head: () => ({
    meta: [
      { title: "Method — Acornsoft" },
      {
        name: "description",
        content:
          "Acornsoft method: how services use Climb Notes, how to read and request notes, and short training with Voice, Imagine, and Grok Build.",
      },
    ],
  }),
});
