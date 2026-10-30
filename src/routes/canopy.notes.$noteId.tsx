import { createFileRoute, notFound } from "@tanstack/react-router";
import { getCanopyNote } from "@/lib/canopy-notes/actions";
import { canopyNoteHeaders } from "@/lib/canopy-notes/http-headers";
import { CanopyNotesShell } from "@/lib/canopy-notes/shell";
import { CanopyNoteDetail, CanopyNotFound } from "@/lib/canopy-notes/view";

export const Route = createFileRoute("/canopy/notes/$noteId")({
  staleTime: 0,
  headers: () => canopyNoteHeaders(),
  loader: async ({ params }) => {
    const result = await getCanopyNote({ data: { noteId: params.noteId } });
    if (result.status === 404) throw notFound({ headers: canopyNoteHeaders() });
    return result.note;
  },
  component: NoteDetailRoute,
  notFoundComponent: NoteMissing,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.title
          ? `${loaderData.title} — Acornsoft`
          : "Not found — Acornsoft",
      },
      { name: "description", content: "A note for this account." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function NoteDetailRoute() {
  const note = Route.useLoaderData();
  return (
    <CanopyNotesShell>
      <CanopyNoteDetail note={note} />
    </CanopyNotesShell>
  );
}

function NoteMissing() {
  return (
    <CanopyNotesShell>
      <CanopyNotFound />
    </CanopyNotesShell>
  );
}
