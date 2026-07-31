import { createFileRoute } from "@tanstack/react-router";
import { InbioPage } from "@/components/site/inbio-page";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return <InbioPage />;
}
