import { createFileRoute, redirect } from "@tanstack/react-router";
import { lunaHrefForOnboardingFile } from "@/lib/luna-docs";

export const Route = createFileRoute("/docs/onboarding/$")({
  beforeLoad: ({ params }) => {
    const file = (params._splat || "").split("/").pop() || "README.md";
    const href = lunaHrefForOnboardingFile(file);
    throw redirect({ href });
  },
});
