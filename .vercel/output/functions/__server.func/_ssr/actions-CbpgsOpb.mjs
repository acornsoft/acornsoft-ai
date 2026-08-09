import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-BhPGP31R.mjs";
import { a as createSsrRpc } from "./site-chrome-D2wQyRd1.mjs";
import { n as _001_Advanced_Development_default, r as _002_Climb_Notes_Publish_Gate_default, t as README_default } from "./README-C0Usd4p6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/actions-CbpgsOpb.js
var _publish_registry_default = {
	version: 1,
	description: "SharePoint-style publish control for Climb Notes. Registry status wins over frontmatter. Public site shows only published. Studio view shows every note.",
	notes: {
		"cn-001": {
			"status": "published",
			"version": 1,
			"submittedAt": "2026-07-31T12:00:00.000Z",
			"submittedBy": "acornsoft",
			"approvedAt": "2026-07-31T12:05:00.000Z",
			"approvedBy": "acornsoft",
			"publishedAt": "2026-07-31T12:10:00.000Z",
			"unpublishedAt": null,
			"approvalNote": "First Climb Note — Advanced Development energy.",
			"history": [
				{
					"at": "2026-07-31T12:00:00.000Z",
					"action": "submit",
					"by": "acornsoft",
					"note": "Ready for review"
				},
				{
					"at": "2026-07-31T12:05:00.000Z",
					"action": "approve",
					"by": "acornsoft",
					"note": "Approved for public journal"
				},
				{
					"at": "2026-07-31T12:10:00.000Z",
					"action": "publish",
					"by": "acornsoft",
					"note": "Live on Climb Notes"
				}
			]
		},
		"cn-002": {
			"status": "approved",
			"version": 1,
			"submittedAt": "2026-07-31T14:50:35.452Z",
			"submittedBy": "acornsoft",
			"approvedAt": "2026-07-31T14:50:35.484Z",
			"approvedBy": "acornsoft",
			"publishedAt": null,
			"unpublishedAt": null,
			"approvalNote": "Process note approved",
			"history": [{
				"at": "2026-07-31T14:50:35.452Z",
				"action": "submit",
				"by": "acornsoft",
				"note": "Ready for review"
			}, {
				"at": "2026-07-31T14:50:35.484Z",
				"action": "approve",
				"by": "acornsoft",
				"note": "Process note approved"
			}]
		}
	}
};
var STATUSES = [
	"draft",
	"pending",
	"approved",
	"published",
	"archived"
];
var CLIMB_NOTE_STATUS_LABEL = {
	draft: "Draft",
	pending: "Pending approval",
	approved: "Approved",
	published: "Published",
	archived: "Archived"
};
function isPublicClimbNoteStatus(status) {
	return status === "published";
}
var noteModules = /* #__PURE__ */ Object.assign({
	"../../../content/climb-notes/001 Advanced Development.md": _001_Advanced_Development_default,
	"../../../content/climb-notes/002 Climb Notes Publish Gate.md": _002_Climb_Notes_Publish_Gate_default,
	"../../../content/climb-notes/README.md": README_default
});
var publishRegistry = _publish_registry_default;
function asStatus(value) {
	if (typeof value !== "string") return void 0;
	const v = value.trim().toLowerCase();
	return STATUSES.includes(v) ? v : void 0;
}
function parseFrontmatter(raw) {
	const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (!m) return {
		data: {},
		body: raw.trim()
	};
	const data = {};
	let currentList = null;
	for (const line of m[1].split(/\r?\n/)) {
		const listItem = line.match(/^\s+-\s+(.+)$/);
		if (listItem && currentList) {
			const arr = Array.isArray(data[currentList]) ? data[currentList] : [];
			arr.push(listItem[1].trim().replace(/^["']|["']$/g, ""));
			data[currentList] = arr;
			continue;
		}
		const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
		if (!kv) continue;
		const key = kv[1];
		const rawVal = kv[2].trim();
		if (rawVal === "" || rawVal === "null" || rawVal === "~") {
			data[key] = void 0;
			currentList = key === "tags" ? "tags" : null;
			if (key === "tags") data.tags = [];
			continue;
		}
		currentList = null;
		data[key] = rawVal.replace(/^["']|["']$/g, "");
	}
	return {
		data,
		body: m[2].trim()
	};
}
function section(body, heading) {
	const re = new RegExp(`##\\s+${heading}\\s*\\r?\\n([\\s\\S]*?)(?=\\r?\\n##\\s+|$)`, "i");
	const hit = body.match(re);
	return hit ? hit[1].trim() : "";
}
function resolvePublish(id, frontmatterStatus) {
	const entry = publishRegistry.notes?.[id];
	return {
		status: asStatus(entry?.status) ?? frontmatterStatus ?? "draft",
		version: entry?.version,
		submittedAt: entry?.submittedAt,
		submittedBy: entry?.submittedBy,
		approvedAt: entry?.approvedAt,
		approvedBy: entry?.approvedBy,
		publishedAt: entry?.publishedAt,
		unpublishedAt: entry?.unpublishedAt,
		approvalNote: entry?.approvalNote,
		history: entry?.history
	};
}
function parseNote(path, raw) {
	if (/README\.md$/i.test(path)) return null;
	if (/_publish-registry/i.test(path)) return null;
	const { data, body } = parseFrontmatter(raw);
	const id = String(data.id ?? "").trim();
	if (!id) return null;
	const tags = Array.isArray(data.tags) ? data.tags : void 0;
	const xUrl = typeof data.xUrl === "string" && data.xUrl.length > 0 ? data.xUrl : void 0;
	const frontmatterStatus = asStatus(data.status);
	const pub = resolvePublish(id, frontmatterStatus);
	return {
		id,
		number: String(data.number ?? "").replace(/"/g, ""),
		title: String(data.title ?? "Untitled"),
		date: String(data.date ?? ""),
		problem: section(body, "Problem"),
		measure: section(body, "Measure"),
		slice: section(body, "Slice"),
		lesson: section(body, "Lesson"),
		status: pub.status,
		frontmatterStatus,
		version: pub.version,
		submittedAt: pub.submittedAt,
		submittedBy: pub.submittedBy,
		approvedAt: pub.approvedAt,
		approvedBy: pub.approvedBy,
		publishedAt: pub.publishedAt,
		unpublishedAt: pub.unpublishedAt,
		approvalNote: pub.approvalNote,
		history: pub.history,
		xUrl,
		tags: tags?.length ? tags : void 0,
		sourceFile: path.split("/").pop()
	};
}
var climbNotes = Object.entries(noteModules).map(([path, raw]) => parseNote(path, raw)).filter((n) => n !== null).sort((a, b) => b.number.localeCompare(a.number));
climbNotes.filter((n) => isPublicClimbNoteStatus(n.status));
function countByStatus(notes = climbNotes) {
	const counts = {
		all: notes.length,
		draft: 0,
		pending: 0,
		approved: 0,
		published: 0,
		archived: 0
	};
	for (const n of notes) counts[n.status] += 1;
	return counts;
}
function formatClimbNoteCiteForX(note, siteOrigin = "https://acornsoft.ai") {
	const oneLine = note.lesson.length > 180 ? `${note.lesson.slice(0, 177)}…` : note.lesson;
	return `Climb Note ${note.number} · ${note.title}

${oneLine}

Full note (stored on site):
${siteOrigin}/climb-notes#${note.id}
`;
}
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("efcea5e11398266e21ed45e59ac4ab78cf01266b4295f7686bda6c4ddde96d0b"));
/** Public: published notes only (no auth). */
var listPublishedClimbNotes = createServerFn({ method: "GET" }).handler(createSsrRpc("60421b9274a2bd4b9115e8f7d76ffacb8ab053e23d485f936ea2702cefa2c0ec"));
/** Public-ish: all notes for studio view on the journal page (read). */
var listAllClimbNotesPublic = createServerFn({ method: "GET" }).handler(createSsrRpc("d137f7a31193db0a03420d1eacde7bac04eab54aa8a28e9a1f174d6ad56d4268"));
/** Owner: full library for Gnomah editor. */
var listClimbNotesForEditor = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("ba5de35fa2c9d207dbfb88c7e81fe0c4087dfa6c4428386ecbe2cea791decfac"));
var saveClimbNoteAction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("a01550a269060fa6e6ced5673df71991261b89f4e2ab07d9bf7a560f73ad0750"));
var transitionClimbNoteAction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("3f5063c5ffc089c9bb5cc15757890c472f7f9ed0892447adec116562a9b10780"));
var deleteClimbNoteAction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("8355b895fa145f4148037c40067882bdfa72d5ca3bc3fa19c54d7fdf7611bd79"));
//#endregion
export { formatClimbNoteCiteForX as a, listClimbNotesForEditor as c, transitionClimbNoteAction as d, deleteClimbNoteAction as i, listPublishedClimbNotes as l, climbNotes as n, isPublicClimbNoteStatus as o, countByStatus as r, listAllClimbNotesPublic as s, CLIMB_NOTE_STATUS_LABEL as t, saveClimbNoteAction as u };
