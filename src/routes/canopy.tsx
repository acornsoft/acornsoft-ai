import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { CanopyPage } from "@/components/site/canopy-page";

/**
 * `/canopy` stays the radar page. File routes under `/canopy/notes` nest here,
 * so this module outlets those paths and leaves the radar component untouched.
 */
export const Route = createFileRoute("/canopy")({
  component: CanopyRoute,
  head: () => ({
    meta: [
      { title: "Canopy — Acornsoft Grok & xAI Radar" },
      {
        name: "description",
        content:
          "Canopy is Acornsoft’s Grok and xAI radar—timeline from xAI’s founding through the latest X feednotes.",
      },
    ],
  }),
});

function CanopyRoute() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/canopy" || pathname === "/canopy/") return <CanopyPage />;
  return <Outlet />;
}
