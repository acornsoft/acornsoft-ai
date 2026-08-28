import { createFileRoute, notFound } from "@tanstack/react-router";
import { LunaDocPage } from "@/components/site/luna-doc-page";
import { LUNA_DOCS } from "@/lib/luna-docs";

export const Route = createFileRoute("/luna/$slug")({
  component: LunaSlugPage,
  loader: ({ params }) => {
    const doc = LUNA_DOCS.find((d) => d.slug === params.slug);
    if (!doc) throw notFound();
    return doc;
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.title ?? "Luna"} · Acornsoft`,
      },
      {
        name: "description",
        content: loaderData?.lede ?? "Luna Foundry Multiagent help.",
      },
    ],
  }),
});

function LunaSlugPage() {
  const { slug } = Route.useParams();
  return <LunaDocPage slug={slug} />;
}
