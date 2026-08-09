import { i as getSql } from "./db-cbgaf9gY.mjs";
import { n as _001_Advanced_Development_default, r as _002_Climb_Notes_Publish_Gate_default, t as README_default } from "./README-C0Usd4p6.mjs";
import fs from "node:fs";
import path from "node:path";
//#region node_modules/.nitro/vite/services/ssr/assets/store.server-DN_-NGa-.js
var _publish_registry_default = "{\n  \"version\": 1,\n  \"description\": \"SharePoint-style publish control for Climb Notes. Registry status wins over frontmatter. Public site shows only published. Studio view shows every note.\",\n  \"notes\": {\n    \"cn-001\": {\n      \"status\": \"published\",\n      \"version\": 1,\n      \"submittedAt\": \"2026-07-31T12:00:00.000Z\",\n      \"submittedBy\": \"acornsoft\",\n      \"approvedAt\": \"2026-07-31T12:05:00.000Z\",\n      \"approvedBy\": \"acornsoft\",\n      \"publishedAt\": \"2026-07-31T12:10:00.000Z\",\n      \"unpublishedAt\": null,\n      \"approvalNote\": \"First Climb Note — Advanced Development energy.\",\n      \"history\": [\n        {\n          \"at\": \"2026-07-31T12:00:00.000Z\",\n          \"action\": \"submit\",\n          \"by\": \"acornsoft\",\n          \"note\": \"Ready for review\"\n        },\n        {\n          \"at\": \"2026-07-31T12:05:00.000Z\",\n          \"action\": \"approve\",\n          \"by\": \"acornsoft\",\n          \"note\": \"Approved for public journal\"\n        },\n        {\n          \"at\": \"2026-07-31T12:10:00.000Z\",\n          \"action\": \"publish\",\n          \"by\": \"acornsoft\",\n          \"note\": \"Live on Climb Notes\"\n        }\n      ]\n    },\n    \"cn-002\": {\n      \"status\": \"approved\",\n      \"version\": 1,\n      \"submittedAt\": \"2026-07-31T14:50:35.452Z\",\n      \"submittedBy\": \"acornsoft\",\n      \"approvedAt\": \"2026-07-31T14:50:35.484Z\",\n      \"approvedBy\": \"acornsoft\",\n      \"publishedAt\": null,\n      \"unpublishedAt\": null,\n      \"approvalNote\": \"Process note approved\",\n      \"history\": [\n        {\n          \"at\": \"2026-07-31T14:50:35.452Z\",\n          \"action\": \"submit\",\n          \"by\": \"acornsoft\",\n          \"note\": \"Ready for review\"\n        },\n        {\n          \"at\": \"2026-07-31T14:50:35.484Z\",\n          \"action\": \"approve\",\n          \"by\": \"acornsoft\",\n          \"note\": \"Process note approved\"\n        }\n      ]\n    }\n  }\n}\n";
var STATUSES = [
	"draft",
	"pending",
	"approved",
	"published",
	"archived"
];
var NOTES_DIR = path.join(process.cwd(), "content", "climb-notes");
var REGISTRY_PATH = path.join(NOTES_DIR, "_publish-registry.json");
/** Build-time inlined notes for serverless. */
var BUNDLED_NOTE_MD = /* #__PURE__ */ Object.assign({
	"/content/climb-notes/001 Advanced Development.md": _001_Advanced_Development_default,
	"/content/climb-notes/002 Climb Notes Publish Gate.md": _002_Climb_Notes_Publish_Gate_default,
	"/content/climb-notes/README.md": README_default
});
var BUNDLED_REGISTRY = /* #__PURE__ */ Object.assign({ "/content/climb-notes/_publish-registry.json": _publish_registry_default });
function asStatus(v) {
	const s = (v ?? "draft").toLowerCase();
	return STATUSES.includes(s) ? s : "draft";
}
function parseJsonArray(raw, fallback) {
	if (!raw) return fallback;
	try {
		const v = JSON.parse(raw);
		return Array.isArray(v) ? v : fallback;
	} catch {
		return fallback;
	}
}
function rowToNote(row) {
	return {
		id: row.id,
		number: row.number,
		title: row.title,
		date: row.note_date,
		problem: row.problem,
		measure: row.measure,
		slice: row.slice,
		lesson: row.lesson,
		status: asStatus(row.status),
		version: row.version,
		submittedAt: row.submitted_at,
		submittedBy: row.submitted_by,
		approvedAt: row.approved_at,
		approvedBy: row.approved_by,
		publishedAt: row.published_at,
		unpublishedAt: row.unpublished_at,
		approvalNote: row.approval_note,
		history: parseJsonArray(row.history, []),
		xUrl: row.x_url || void 0,
		tags: parseJsonArray(row.tags, []),
		sourceFile: row.source_file || void 0
	};
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
function loadRegistry() {
	try {
		if (fs.existsSync(REGISTRY_PATH)) return JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8")).notes ?? {};
	} catch {}
	const bundled = Object.values(BUNDLED_REGISTRY)[0];
	if (bundled) try {
		return JSON.parse(bundled).notes ?? {};
	} catch {
		return {};
	}
	return {};
}
function noteFromMarkdown(file, raw, registry) {
	const { data, body } = parseFrontmatter(raw);
	const id = String(data.id ?? "").trim();
	if (!id) return null;
	const reg = registry[id];
	const fmStatus = asStatus(String(data.status ?? "draft"));
	const status = asStatus(reg?.status ?? fmStatus);
	const tags = Array.isArray(data.tags) ? data.tags : [];
	return {
		id,
		number: String(data.number ?? "").replace(/"/g, ""),
		title: String(data.title ?? "Untitled"),
		date: String(data.date ?? ""),
		problem: section(body, "Problem"),
		measure: section(body, "Measure"),
		slice: section(body, "Slice"),
		lesson: section(body, "Lesson"),
		status,
		version: reg?.version ?? 1,
		submittedAt: reg?.submittedAt ?? null,
		submittedBy: reg?.submittedBy ?? null,
		approvedAt: reg?.approvedAt ?? null,
		approvedBy: reg?.approvedBy ?? null,
		publishedAt: reg?.publishedAt ?? null,
		unpublishedAt: reg?.unpublishedAt ?? null,
		approvalNote: reg?.approvalNote ?? null,
		history: reg?.history ?? [],
		xUrl: typeof data.xUrl === "string" && data.xUrl.length > 0 ? data.xUrl : void 0,
		tags,
		sourceFile: file
	};
}
function readMarkdownSeeds() {
	const registry = loadRegistry();
	const notes = [];
	const seen = /* @__PURE__ */ new Set();
	if (fs.existsSync(NOTES_DIR)) try {
		const files = fs.readdirSync(NOTES_DIR).filter((n) => n.endsWith(".md") && n.toLowerCase() !== "readme.md" && !n.startsWith("_"));
		for (const file of files) {
			const note = noteFromMarkdown(file, fs.readFileSync(path.join(NOTES_DIR, file), "utf8"), registry);
			if (note) {
				notes.push(note);
				seen.add(note.id);
			}
		}
	} catch {}
	for (const [globPath, raw] of Object.entries(BUNDLED_NOTE_MD)) {
		const file = globPath.split("/").pop() ?? globPath;
		if (!file.endsWith(".md") || file.toLowerCase() === "readme.md" || file.startsWith("_")) continue;
		const note = noteFromMarkdown(file, raw, registry);
		if (note && !seen.has(note.id)) {
			notes.push(note);
			seen.add(note.id);
		}
	}
	return notes;
}
async function upsertNoteRow(note, ownerUserId) {
	await (await getSql())`
    insert into climb_notes (
      id, number, title, note_date, status,
      problem, measure, slice, lesson,
      tags, x_url, version,
      submitted_at, submitted_by, approved_at, approved_by,
      published_at, unpublished_at, approval_note, history,
      source_file, owner_user_id, updated_at
    ) values (
      ${note.id},
      ${note.number},
      ${note.title},
      ${note.date},
      ${note.status},
      ${note.problem},
      ${note.measure},
      ${note.slice},
      ${note.lesson},
      ${JSON.stringify(note.tags ?? [])},
      ${note.xUrl ?? null},
      ${note.version ?? 1},
      ${note.submittedAt ?? null},
      ${note.submittedBy ?? null},
      ${note.approvedAt ?? null},
      ${note.approvedBy ?? null},
      ${note.publishedAt ?? null},
      ${note.unpublishedAt ?? null},
      ${note.approvalNote ?? null},
      ${JSON.stringify(note.history ?? [])},
      ${note.sourceFile ?? null},
      ${ownerUserId ?? null},
      now()
    )
    on conflict (id) do update set
      number = excluded.number,
      title = excluded.title,
      note_date = excluded.note_date,
      status = excluded.status,
      problem = excluded.problem,
      measure = excluded.measure,
      slice = excluded.slice,
      lesson = excluded.lesson,
      tags = excluded.tags,
      x_url = excluded.x_url,
      version = excluded.version,
      submitted_at = excluded.submitted_at,
      submitted_by = excluded.submitted_by,
      approved_at = excluded.approved_at,
      approved_by = excluded.approved_by,
      published_at = excluded.published_at,
      unpublished_at = excluded.unpublished_at,
      approval_note = excluded.approval_note,
      history = excluded.history,
      source_file = excluded.source_file,
      owner_user_id = coalesce(excluded.owner_user_id, climb_notes.owner_user_id),
      updated_at = now()
  `;
}
/** Seed DB from markdown when empty (first boot). */
async function ensureClimbNotesSeeded() {
	if (((await (await getSql())`
    select count(*)::int as n from climb_notes
  `)[0]?.n ?? 0) > 0) return;
	const seeds = readMarkdownSeeds();
	for (const note of seeds) await upsertNoteRow(note);
}
async function listClimbNotesFromDb(opts) {
	await ensureClimbNotesSeeded();
	const sql = await getSql();
	return (opts?.publishedOnly ? await sql`
        select * from climb_notes
        where status = 'published'
        order by number desc
      ` : await sql`
        select * from climb_notes
        order by number desc
      `).map(rowToNote);
}
async function getClimbNoteFromDb(id) {
	await ensureClimbNotesSeeded();
	const rows = await (await getSql())`
    select * from climb_notes where id = ${id} limit 1
  `;
	return rows[0] ? rowToNote(rows[0]) : null;
}
function toMarkdown(note) {
	const tags = (note.tags ?? []).map((t) => `  - ${t}`).join("\n");
	return `---
id: ${note.id}
number: "${note.number}"
title: ${note.title}
date: ${note.date}
status: ${note.status}
tags:
${tags || "  - climb-note"}
xUrl: ${note.xUrl ?? ""}
---

## Problem

${note.problem}

## Measure

${note.measure}

## Slice

${note.slice}

## Lesson

${note.lesson}
`;
}
function writeMarkdownMirror(note) {
	try {
		fs.mkdirSync(NOTES_DIR, { recursive: true });
		const safeTitle = note.title.replace(/[^\w\s-]+/g, "").trim().replace(/\s+/g, " ");
		const fileName = note.sourceFile || `${note.number} ${safeTitle || "Climb Note"}.md`;
		const dest = path.join(NOTES_DIR, fileName);
		fs.writeFileSync(dest, toMarkdown({
			...note,
			sourceFile: fileName
		}));
		return fileName;
	} catch {
		return note.sourceFile ?? null;
	}
}
function writeRegistryFromDbNotes(notes) {
	try {
		const notesMap = {};
		for (const n of notes) notesMap[n.id] = {
			status: n.status,
			version: n.version ?? 1,
			submittedAt: n.submittedAt ?? null,
			submittedBy: n.submittedBy ?? null,
			approvedAt: n.approvedAt ?? null,
			approvedBy: n.approvedBy ?? null,
			publishedAt: n.publishedAt ?? null,
			unpublishedAt: n.unpublishedAt ?? null,
			approvalNote: n.approvalNote ?? null,
			history: n.history ?? []
		};
		const payload = {
			version: 1,
			description: "SharePoint-style publish control for Climb Notes. Managed by Gnomah editor and CLI.",
			notes: notesMap
		};
		fs.mkdirSync(NOTES_DIR, { recursive: true });
		fs.writeFileSync(REGISTRY_PATH, JSON.stringify(payload, null, 2) + "\n");
	} catch {}
}
async function saveClimbNote(input, ownerUserId, actorHandle) {
	await ensureClimbNotesSeeded();
	const id = (input.id?.trim() || `cn-${String(input.number).replace(/\D/g, "").padStart(3, "0")}`).toLowerCase();
	const existing = await getClimbNoteFromDb(id);
	const status = asStatus(input.status ?? existing?.status ?? "draft");
	const version = existing?.version ?? 1;
	const sourceFile = existing?.sourceFile || `${String(input.number).replace(/\D/g, "").padStart(3, "0")} ${input.title.trim() || "Climb Note"}.md`;
	const history = [...existing?.history ?? [], {
		at: (/* @__PURE__ */ new Date()).toISOString(),
		action: existing ? "save" : "create",
		by: actorHandle
	}];
	const note = {
		id,
		number: String(input.number).replace(/\D/g, "").padStart(3, "0") || "000",
		title: input.title.trim() || "Untitled",
		date: input.date || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		problem: input.problem ?? "",
		measure: input.measure ?? "",
		slice: input.slice ?? "",
		lesson: input.lesson ?? "",
		status,
		version,
		submittedAt: existing?.submittedAt ?? null,
		submittedBy: existing?.submittedBy ?? null,
		approvedAt: existing?.approvedAt ?? null,
		approvedBy: existing?.approvedBy ?? null,
		publishedAt: existing?.publishedAt ?? null,
		unpublishedAt: existing?.unpublishedAt ?? null,
		approvalNote: existing?.approvalNote ?? null,
		history,
		xUrl: input.xUrl || void 0,
		tags: input.tags?.length ? input.tags : existing?.tags ?? ["climb-note"],
		sourceFile
	};
	await upsertNoteRow(note, ownerUserId);
	const fileName = writeMarkdownMirror(note);
	if (fileName) {
		note.sourceFile = fileName;
		await (await getSql())`
      update climb_notes set source_file = ${fileName} where id = ${note.id}
    `;
	}
	writeRegistryFromDbNotes(await listClimbNotesFromDb());
	return await getClimbNoteFromDb(note.id) ?? note;
}
var TRANSITIONS = {
	submit: {
		from: ["draft", "approved"],
		to: "pending"
	},
	approve: {
		from: ["pending"],
		to: "approved"
	},
	reject: {
		from: ["pending", "approved"],
		to: "draft"
	},
	publish: {
		from: [
			"approved",
			"draft",
			"pending",
			"published"
		],
		to: "published"
	},
	unpublish: {
		from: ["published"],
		to: "draft"
	},
	archive: {
		from: [
			"draft",
			"pending",
			"approved",
			"published"
		],
		to: "archived"
	},
	restore: {
		from: ["archived"],
		to: "draft"
	}
};
async function transitionClimbNote(id, action, actorHandle, noteText) {
	await ensureClimbNotesSeeded();
	const existing = await getClimbNoteFromDb(id);
	if (!existing) throw new Error(`Climb Note ${id} not found`);
	const rule = TRANSITIONS[action];
	if (!rule) throw new Error(`Unknown action: ${action}`);
	if (!rule.from.includes(existing.status)) throw new Error(`Cannot ${action} from status "${existing.status}". Allowed from: ${rule.from.join(", ")}.`);
	const at = (/* @__PURE__ */ new Date()).toISOString();
	const next = rule.to;
	const history = [...existing.history ?? [], {
		at,
		action,
		by: actorHandle,
		note: noteText || void 0
	}];
	let version = existing.version ?? 1;
	let submittedAt = existing.submittedAt ?? null;
	let submittedBy = existing.submittedBy ?? null;
	let approvedAt = existing.approvedAt ?? null;
	let approvedBy = existing.approvedBy ?? null;
	let publishedAt = existing.publishedAt ?? null;
	let unpublishedAt = existing.unpublishedAt ?? null;
	let approvalNote = existing.approvalNote ?? null;
	if (action === "submit") {
		submittedAt = at;
		submittedBy = actorHandle;
	}
	if (action === "approve") {
		approvedAt = at;
		approvedBy = actorHandle;
		if (noteText) approvalNote = noteText;
	}
	if (action === "reject") {
		approvedAt = null;
		approvedBy = null;
	}
	if (action === "publish") {
		if (!approvedAt) {
			approvedAt = at;
			approvedBy = actorHandle;
		}
		publishedAt = at;
		unpublishedAt = null;
		if (existing.status !== "published") version = version + 1;
	}
	if (action === "unpublish") unpublishedAt = at;
	const updated = {
		...existing,
		status: next,
		version,
		submittedAt,
		submittedBy,
		approvedAt,
		approvedBy,
		publishedAt,
		unpublishedAt,
		approvalNote,
		history
	};
	await upsertNoteRow(updated);
	writeMarkdownMirror(updated);
	writeRegistryFromDbNotes(await listClimbNotesFromDb());
	return await getClimbNoteFromDb(id) ?? updated;
}
async function deleteClimbNote(id) {
	const sql = await getSql();
	const existing = await getClimbNoteFromDb(id);
	await sql`delete from climb_notes where id = ${id}`;
	if (existing?.sourceFile) try {
		const p = path.join(NOTES_DIR, existing.sourceFile);
		if (fs.existsSync(p)) fs.unlinkSync(p);
	} catch {}
	writeRegistryFromDbNotes(await listClimbNotesFromDb());
}
//#endregion
export { deleteClimbNote, listClimbNotesFromDb, saveClimbNote, transitionClimbNote };
