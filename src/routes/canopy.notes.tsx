import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { listCanopyNotes } from "@/lib/canopy-notes/actions";
import { canopyNoteHeaders } from "@/lib/canopy-notes/http-headers";
import { CanopyNotesShell } from "@/lib/canopy-notes/shell";
import { CanopyNotesBody } from "@/lib/canopy-notes/view";

export const Route = createFileRoute("/canopy/notes")({
  staleTime: 0,
  headers: () => canopyNoteHeaders(),
  loader: () => listCanopyNotes(),
  component: NotesLayout,
  head: () => ({
    meta: [
      { title: "Notes — Acornsoft" },
      {
        name: "description",
        content: "Notes for this account.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function NotesLayout() {
  const data = Route.useLoaderData();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isIndex = pathname === "/canopy/notes" || pathname === "/canopy/notes/";
  if (!isIndex) return <Outlet />;
  return (
    <CanopyNotesShell>
      <CanopyNotesBody signedIn={data.signedIn} notes={data.notes} />
    </CanopyNotesShell>
  );
}
