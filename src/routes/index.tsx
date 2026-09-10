import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonPage } from "@/components/site/coming-soon-page";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Acornsoft — Coming soon" },
      {
        name: "description",
        content: "Acornsoft is getting ready. The public site is not announced yet.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function HomePage() {
  return <ComingSoonPage />;
}
