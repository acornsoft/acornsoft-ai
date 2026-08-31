import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { LunaPage } from "@/components/site/luna-page";

/**
 * Hub at /luna AND /luna/. Child trails (/luna/grok-build, …) render via Outlet.
 * A layout-only Outlet 404s on some production hosts when the index child is not matched.
 */
export const Route = createFileRoute("/luna")({
  component: LunaLayout,
  head: () => ({
    meta: [
      { title: "Luna Foundry Multiagent · Acornsoft" },
      {
        name: "description",
        content:
          "Luna is your Sherpa. Climb Notes are the trail. Onboarding lives here — same pack as the extension.",
      },
    ],
  }),
});

function LunaLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHub = pathname === "/luna" || pathname === "/luna/";
  if (isHub) return <LunaPage />;
  return <Outlet />;
}
