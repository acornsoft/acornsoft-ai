import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/procedures")({
  beforeLoad: () => {
    throw redirect({ to: "/corporate", hash: "procedures" });
  },
});
