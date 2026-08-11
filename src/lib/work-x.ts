/**
 * X compose intent for Acornsoft work / portfolio ships.
 * Opens https://x.com/intent/post with text + site link (user posts or schedules).
 */

export type WorkShip = {
  id: string;
  title: string;
  blurb: string;
  siteUrl: string;
  tags?: string[];
};

export function buildWorkXComposeUrl(work: WorkShip): string {
  const title =
    work.title.length > 100 ? `${work.title.slice(0, 97)}…` : work.title;
  const blurb = work.blurb.replace(/\s+/g, " ").trim().slice(0, 140);
  const tags = (work.tags ?? ["#Acornsoft", "#BuildInPublic"])
    .slice(0, 4)
    .join(" ");
  const body = [
    title,
    "",
    blurb ? `${blurb}${work.blurb.length > 140 ? "…" : ""}` : null,
    "",
    `Site → ${work.siteUrl}`,
    tags,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const params = new URLSearchParams();
  params.set("text", body);
  return `https://x.com/intent/post?${params.toString()}`;
}

export function workXAction(work: WorkShip): {
  href: string;
  label: string;
  kind: "compose";
} {
  return {
    href: buildWorkXComposeUrl(work),
    label: "Schedule on X",
    kind: "compose",
  };
}
