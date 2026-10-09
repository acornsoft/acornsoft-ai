import { createFileRoute, redirect } from "@tanstack/react-router";
import { GnomahEditorPage } from "@/components/site/gnomah-editor";
import { gateStudioRoute, STUDIO_NEXT } from "@/lib/auth/studio-gate";

export const Route = createFileRoute("/studio")({
  validateSearch: (s: Record<string, unknown>): { note?: string } => ({
    note: typeof s.note === "string" && s.note ? s.note : undefined,
  }),
  beforeLoad: async () => {
    const gate = await gateStudioRoute();
    switch (gate.reason) {
      case "owner":
        return;
      case "anon":
        throw redirect({ to: "/login", search: { next: STUDIO_NEXT } });
      case "denied":
        throw redirect({ to: "/" });
      default: {
        const _exhaustive: never = gate.reason;
        return _exhaustive;
      }
    }
  },
  component: GnomahEditorPage,
  head: () => ({
    meta: [
      { title: "Studio — Climb Notes Editor · Acornsoft" },
      {
        name: "description",
        content:
          "Owner-only Climb Notes editor for Acornsoft. Sign in with X as @acornsoftai.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});
