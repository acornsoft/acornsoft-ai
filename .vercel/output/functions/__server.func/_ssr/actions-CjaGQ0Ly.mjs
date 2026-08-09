import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-BhPGP31R.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/actions-CjaGQ0Ly.js
var getClimbNotesAccess_createServerFn_handler = createServerRpc({
	id: "efcea5e11398266e21ed45e59ac4ab78cf01266b4295f7686bda6c4ddde96d0b",
	name: "getClimbNotesAccess",
	filename: "src/lib/climb-notes/actions.ts"
}, (opts) => getClimbNotesAccess.__executeServer(opts));
var getClimbNotesAccess = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getClimbNotesAccess_createServerFn_handler, async ({ context }) => {
	const { assertClimbNotesOwner } = await import("./owner.server-vwLgDOQH.mjs");
	const { getSessionUser } = await import("./verify.server-CkjR2gyT.mjs").then((n) => n.t).then((n) => n.n);
	try {
		const owner = await assertClimbNotesOwner(context.userId);
		const session = await getSessionUser();
		return {
			signedIn: true,
			isOwner: true,
			handle: owner.handle,
			displayName: session?.email ?? owner.handle
		};
	} catch {
		return {
			signedIn: true,
			isOwner: false,
			handle: null,
			displayName: null
		};
	}
});
var listPublishedClimbNotes_createServerFn_handler = createServerRpc({
	id: "60421b9274a2bd4b9115e8f7d76ffacb8ab053e23d485f936ea2702cefa2c0ec",
	name: "listPublishedClimbNotes",
	filename: "src/lib/climb-notes/actions.ts"
}, (opts) => listPublishedClimbNotes.__executeServer(opts));
var listPublishedClimbNotes = createServerFn({ method: "GET" }).handler(listPublishedClimbNotes_createServerFn_handler, async () => {
	const { listClimbNotesFromDb } = await import("./store.server-DN_-NGa-.mjs");
	return listClimbNotesFromDb({ publishedOnly: true });
});
var listAllClimbNotesPublic_createServerFn_handler = createServerRpc({
	id: "d137f7a31193db0a03420d1eacde7bac04eab54aa8a28e9a1f174d6ad56d4268",
	name: "listAllClimbNotesPublic",
	filename: "src/lib/climb-notes/actions.ts"
}, (opts) => listAllClimbNotesPublic.__executeServer(opts));
var listAllClimbNotesPublic = createServerFn({ method: "GET" }).handler(listAllClimbNotesPublic_createServerFn_handler, async () => {
	const { listClimbNotesFromDb } = await import("./store.server-DN_-NGa-.mjs");
	return listClimbNotesFromDb({ publishedOnly: false });
});
var listClimbNotesForEditor_createServerFn_handler = createServerRpc({
	id: "ba5de35fa2c9d207dbfb88c7e81fe0c4087dfa6c4428386ecbe2cea791decfac",
	name: "listClimbNotesForEditor",
	filename: "src/lib/climb-notes/actions.ts"
}, (opts) => listClimbNotesForEditor.__executeServer(opts));
var listClimbNotesForEditor = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listClimbNotesForEditor_createServerFn_handler, async ({ context }) => {
	const { assertClimbNotesOwner } = await import("./owner.server-vwLgDOQH.mjs");
	await assertClimbNotesOwner(context.userId);
	const { listClimbNotesFromDb } = await import("./store.server-DN_-NGa-.mjs");
	return listClimbNotesFromDb({ publishedOnly: false });
});
var saveClimbNoteAction_createServerFn_handler = createServerRpc({
	id: "a01550a269060fa6e6ced5673df71991261b89f4e2ab07d9bf7a560f73ad0750",
	name: "saveClimbNoteAction",
	filename: "src/lib/climb-notes/actions.ts"
}, (opts) => saveClimbNoteAction.__executeServer(opts));
var saveClimbNoteAction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(saveClimbNoteAction_createServerFn_handler, async ({ context, data }) => {
	const { assertClimbNotesOwner } = await import("./owner.server-vwLgDOQH.mjs");
	const owner = await assertClimbNotesOwner(context.userId);
	const { saveClimbNote } = await import("./store.server-DN_-NGa-.mjs");
	return saveClimbNote(data, context.userId, owner.handle);
});
var transitionClimbNoteAction_createServerFn_handler = createServerRpc({
	id: "3f5063c5ffc089c9bb5cc15757890c472f7f9ed0892447adec116562a9b10780",
	name: "transitionClimbNoteAction",
	filename: "src/lib/climb-notes/actions.ts"
}, (opts) => transitionClimbNoteAction.__executeServer(opts));
var transitionClimbNoteAction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(transitionClimbNoteAction_createServerFn_handler, async ({ context, data }) => {
	const { assertClimbNotesOwner } = await import("./owner.server-vwLgDOQH.mjs");
	const owner = await assertClimbNotesOwner(context.userId);
	const { transitionClimbNote } = await import("./store.server-DN_-NGa-.mjs");
	return transitionClimbNote(data.id, data.action, owner.handle, data.note);
});
var deleteClimbNoteAction_createServerFn_handler = createServerRpc({
	id: "8355b895fa145f4148037c40067882bdfa72d5ca3bc3fa19c54d7fdf7611bd79",
	name: "deleteClimbNoteAction",
	filename: "src/lib/climb-notes/actions.ts"
}, (opts) => deleteClimbNoteAction.__executeServer(opts));
var deleteClimbNoteAction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(deleteClimbNoteAction_createServerFn_handler, async ({ context, data }) => {
	const { assertClimbNotesOwner } = await import("./owner.server-vwLgDOQH.mjs");
	await assertClimbNotesOwner(context.userId);
	const { deleteClimbNote } = await import("./store.server-DN_-NGa-.mjs");
	await deleteClimbNote(data.id);
	return { ok: true };
});
//#endregion
export { deleteClimbNoteAction_createServerFn_handler, getClimbNotesAccess_createServerFn_handler, listAllClimbNotesPublic_createServerFn_handler, listClimbNotesForEditor_createServerFn_handler, listPublishedClimbNotes_createServerFn_handler, saveClimbNoteAction_createServerFn_handler, transitionClimbNoteAction_createServerFn_handler };
