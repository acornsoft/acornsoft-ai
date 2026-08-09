import { createFileRoute } from "@tanstack/react-router";
import { GnomahEditorPage } from "@/components/site/gnomah-editor";

export const Route = createFileRoute("/gnomah")({
  component: GnomahEditorPage,
  head: () => ({
    meta: [
      { title: "Gnomah — Climb Notes Editor · Acornsoft" },
      {
        name: "description",
        content:
          "Gnomah is the owner-only Climb Notes editor for Acornsoft. Sign in with X as @acornsoftai.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});
