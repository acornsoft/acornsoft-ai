import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/docs/onboarding")({
  beforeLoad: () => {
    throw redirect({ to: "/luna" });
  },
});
