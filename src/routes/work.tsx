import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { gateWorkRoute } from "@/lib/auth/studio-gate";

export const Route = createFileRoute("/work")({
  beforeLoad: async ({ location }) => {
    const gate = await gateWorkRoute({ data: { pathname: location.pathname } });
    switch (gate.reason) {
      case "owner":
        return;
      case "anon":
        throw redirect({
          to: "/login",
          search: { redirect: gate.redirectTo },
        });
      case "denied":
        throw redirect({ to: "/" });
      default: {
        const _exhaustive: never = gate.reason;
        return _exhaustive;
      }
    }
  },
  component: () => <Outlet />,
});
