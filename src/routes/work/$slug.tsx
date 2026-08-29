import { createFileRoute, notFound } from "@tanstack/react-router";
import { WorkDetailPage } from "@/components/site/works-page";
import { workById } from "@/lib/works";

export const Route = createFileRoute("/work/$slug")({
  component: WorkSlugPage,
  loader: ({ params }) => {
    const item = workById(params.slug);
    if (!item) throw notFound();
    return item;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Works"} · Acornsoft` },
      {
        name: "description",
        content: loaderData?.lede ?? "Acornsoft developed solution.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function WorkSlugPage() {
  const { slug } = Route.useParams();
  return <WorkDetailPage slug={slug} />;
}
