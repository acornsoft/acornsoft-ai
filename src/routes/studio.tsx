import { createFileRoute, redirect } from "@tanstack/react-router";
import { StudioEditorPage } from "@/components/site/gnomah-editor";
import { gateStudioRoute, STUDIO_NEXT } from "@/lib/auth/studio-gate";

function noteSearchParam(raw: unknown): string | number | undefined {
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string" && raw) return raw;
  return undefined;
}

export const Route = createFileRoute("/studio")({
  validateSearch: (s: Record<string, unknown>): { note?: string | number } => {
    const note = noteSearchParam(s.note);
    return note === undefined ? {} : { note };
  },
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
  component: StudioEditorPage,
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
