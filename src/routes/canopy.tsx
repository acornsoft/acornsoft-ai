import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { CanopyPage } from "@/components/site/canopy-page";

/** Share image: desktop screenshot of the Canopy page (1200×630). */
const CANOPY_OG_IMAGE = "https://www.acornsoft.ai/canopy/og-canopy.jpg";

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
      { property: "og:image", content: CANOPY_OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: CANOPY_OG_IMAGE },
    ],
  }),
});

function CanopyRoute() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/canopy" || pathname === "/canopy/") return <CanopyPage />;
  return <Outlet />;
}
