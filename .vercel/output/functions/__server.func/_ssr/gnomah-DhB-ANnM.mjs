import { o as __toESM } from "../_runtime.mjs";
import { R as require_react, g as Link, v as Navigate, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { i as signOut } from "./client-Bm2YFrbd.mjs";
import { t as authMiddleware } from "./middleware-BhPGP31R.mjs";
import { t as Logo } from "./logo-DJM2TaXM.mjs";
import { a as KeyRound, n as ShieldCheck, o as Eye, s as EyeOff, t as Trash2 } from "../_libs/lucide-react.mjs";
import { a as createSsrRpc, n as SiteHeader, o as useCurrentUserState } from "./site-chrome-D2wQyRd1.mjs";
import { c as listClimbNotesForEditor, d as transitionClimbNoteAction, i as deleteClimbNoteAction, t as CLIMB_NOTE_STATUS_LABEL, u as saveClimbNoteAction } from "./actions-CbpgsOpb.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gnomah-DhB-ANnM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Owner-only: is X API Bearer configured? Never returns the secret. */
var getXApiBearerStatus = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("81fb0976512525fa27716b2f96205a444f087498193595569d21032eaebbac92"));
/**
* Owner-only: save X API Bearer. Body is accepted once, encrypted, discarded.
* Response is status only (configured + last4) — never echoes the token.
*/
var setXApiBearerSecret = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("c9869d159f97e97c2fe452feaf7065ed2c4112e0214875b3a9de42f15f797f99"));
/** Owner-only: wipe stored Bearer. Irreversible. */
var clearXApiBearerSecret = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("d1e2c98d66c5bf4f0e69fe1ba240601ae7652109b0ae78204729e8b21c40ea85"));
/**
* Owner-only private preference: X API Bearer for Canopy Radar.
* Token is sent once over HTTPS to a server fn that encrypts it;
* the UI never receives it back (only configured + last4).
*/
function OwnerRadarPrefs() {
	const [status, setStatus] = (0, import_react.useState)(null);
	const [token, setToken] = (0, import_react.useState)("");
	const [show, setShow] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [denied, setDenied] = (0, import_react.useState)(false);
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	const refresh = (0, import_react.useCallback)(async () => {
		try {
			const s = await getXApiBearerStatus();
			setStatus(s);
			setDenied(false);
		} catch {
			setDenied(true);
			setStatus(null);
		} finally {
			setLoaded(true);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		refresh();
	}, [refresh]);
	if (!loaded) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "ac-owner-prefs",
		"aria-busy": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "ac-owner-prefs-muted",
			children: "Loading private preferences…"
		})
	});
	if (denied) return null;
	const onSave = async () => {
		if (!token.trim()) {
			toast.error("Paste your X App Bearer Token first.");
			return;
		}
		setBusy(true);
		try {
			const s = await setXApiBearerSecret({ data: { token } });
			setStatus(s);
			setToken("");
			setShow(false);
			toast.success("Bearer saved privately. Only you can manage it.");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not save token");
		} finally {
			setBusy(false);
		}
	};
	const onClear = async () => {
		if (!status?.configured) return;
		if (!window.confirm("Remove your private X API Bearer from this profile? Canopy live Radar will stop until you add it again (or set host env).")) return;
		setBusy(true);
		try {
			const s = await clearXApiBearerSecret();
			setStatus(s);
			toast.success("Private Bearer removed.");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not clear token");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "ac-owner-prefs",
		"aria-labelledby": "ac-owner-prefs-title",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ac-owner-prefs-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, {
					className: "ac-owner-prefs-icon",
					"aria-hidden": true,
					strokeWidth: 2
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "ac-owner-prefs-title",
					children: "Private preferences"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "X API Bearer for Canopy Radar. Encrypted at rest, never shown again after save, and never exposed to other visitors." })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "ac-owner-prefs-status",
				role: "status",
				children: status?.configured ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
					className: "ac-owner-prefs-ok",
					"aria-hidden": true,
					strokeWidth: 2
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"Configured · ends in ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["…", status.last4] }),
					status.updatedAt ? ` · updated ${new Date(status.updatedAt).toLocaleString()}` : ""
				] })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ac-owner-prefs-muted",
					children: "Not set — paste an App-only Bearer from the X Developer portal."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "ac-owner-prefs-label",
				htmlFor: "ac-x-bearer",
				children: "X App Bearer Token"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ac-owner-prefs-input-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "ac-x-bearer",
					className: "ac-owner-prefs-input",
					type: show ? "text" : "password",
					name: "x-api-bearer",
					autoComplete: "off",
					autoCorrect: "off",
					spellCheck: false,
					placeholder: status?.configured ? "Paste a new token to replace (current stays hidden)" : "AAAA… paste Bearer Token",
					value: token,
					onChange: (e) => setToken(e.target.value),
					disabled: busy
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "ac-owner-prefs-icon-btn",
					"aria-label": show ? "Hide token" : "Show token while typing",
					onClick: () => setShow((v) => !v),
					children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, {
						"aria-hidden": true,
						strokeWidth: 2,
						size: 16
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
						"aria-hidden": true,
						strokeWidth: 2,
						size: 16
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ac-owner-prefs-actions",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "rn-btn",
					disabled: busy || !token.trim(),
					onClick: () => void onSave(),
					children: busy ? "Saving…" : status?.configured ? "Replace token" : "Save privately"
				}), status?.configured ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "rn-btn ac-btn-outline ac-owner-prefs-clear",
					disabled: busy,
					onClick: () => void onClear(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
						size: 14,
						"aria-hidden": true
					}), "Remove"]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "ac-owner-prefs-notes",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Only @acornsoftai (owner, signed in with X) can set or clear this." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Stored encrypted with a server key — not readable from the browser or public APIs." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Used only server-side to run Canopy Radar queries." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						"Host env ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "X_BEARER_TOKEN" }),
						" still wins if set (ops override)."
					] })
				]
			})
		]
	});
}
var emptyForm = () => ({
	id: "",
	number: "",
	title: "",
	date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
	status: "draft",
	problem: "",
	measure: "",
	slice: "",
	lesson: "",
	tags: "climb-note",
	xUrl: ""
});
function noteToForm(n) {
	return {
		id: n.id,
		number: n.number,
		title: n.title,
		date: n.date,
		status: n.status,
		problem: n.problem,
		measure: n.measure,
		slice: n.slice,
		lesson: n.lesson,
		tags: (n.tags ?? []).join(", "),
		xUrl: n.xUrl ?? ""
	};
}
var ACTIONS = [
	{
		key: "submit",
		label: "Submit"
	},
	{
		key: "approve",
		label: "Approve"
	},
	{
		key: "reject",
		label: "Reject"
	},
	{
		key: "publish",
		label: "Publish"
	},
	{
		key: "unpublish",
		label: "Unpublish"
	},
	{
		key: "archive",
		label: "Archive"
	},
	{
		key: "restore",
		label: "Restore"
	}
];
var STATUS_FILTERS = [
	{
		key: "all",
		label: "All"
	},
	{
		key: "draft",
		label: "Draft"
	},
	{
		key: "pending",
		label: "Pending"
	},
	{
		key: "approved",
		label: "Approved"
	},
	{
		key: "published",
		label: "Published"
	},
	{
		key: "archived",
		label: "Archived"
	}
];
function GnomahEditorPage() {
	const { user, isPending } = useCurrentUserState();
	const [notes, setNotes] = (0, import_react.useState)([]);
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(emptyForm());
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [forbidden, setForbidden] = (0, import_react.useState)(false);
	const [forbidMsg, setForbidMsg] = (0, import_react.useState)(null);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const load = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setForbidden(false);
		setForbidMsg(null);
		try {
			const list = await listClimbNotesForEditor();
			setNotes(list);
			setSelectedId((prev) => {
				if (prev && list.some((n) => n.id === prev)) return prev;
				return list[0]?.id ?? null;
			});
			setForm((prev) => {
				const hit = list.find((n) => n.id === prev.id) || list.find((n) => n.id === selectedId) || list[0];
				return hit ? noteToForm(hit) : prev.id ? prev : emptyForm();
			});
		} catch (e) {
			const msg = e instanceof Error ? e.message : String(e);
			if (msg.toLowerCase().includes("owner") || msg.toLowerCase().includes("forbidden") || msg.includes("403") || msg.toLowerCase().includes("sign in with x") || msg.toLowerCase().includes("cannot open")) {
				setForbidden(true);
				setForbidMsg(msg);
			} else if (!msg.includes("Unauthorized")) toast.error(msg || "Could not load Climb Notes");
			setNotes([]);
		} finally {
			setLoading(false);
		}
	}, [selectedId]);
	(0, import_react.useEffect)(() => {
		if (isPending) return;
		if (!user && true) return;
		load();
	}, [user, isPending]);
	const filtered = (0, import_react.useMemo)(() => {
		if (filter === "all") return notes;
		return notes.filter((n) => n.status === filter);
	}, [notes, filter]);
	function selectNote(n) {
		setSelectedId(n.id);
		setForm(noteToForm(n));
	}
	function newNote() {
		const nextNum = notes.map((n) => parseInt(n.number, 10)).filter((x) => !Number.isNaN(x)).reduce((a, b) => Math.max(a, b), 0) + 1;
		const id = `cn-${String(nextNum).padStart(3, "0")}`;
		setSelectedId(null);
		setForm({
			...emptyForm(),
			id,
			number: String(nextNum).padStart(3, "0"),
			title: ""
		});
	}
	async function onSave() {
		setSaving(true);
		try {
			const saved = await saveClimbNoteAction({ data: {
				id: form.id || void 0,
				number: form.number,
				title: form.title,
				date: form.date,
				status: form.status,
				problem: form.problem,
				measure: form.measure,
				slice: form.slice,
				lesson: form.lesson,
				tags: form.tags.split(/[,]+/).map((t) => t.trim()).filter(Boolean),
				xUrl: form.xUrl || null
			} });
			toast.success(`Saved Climb Note ${saved.number}`);
			setSelectedId(saved.id);
			setForm(noteToForm(saved));
			setNotes(await listClimbNotesForEditor());
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Save failed");
		} finally {
			setSaving(false);
		}
	}
	async function onTransition(action) {
		if (!form.id) {
			toast.message("Save the note first");
			return;
		}
		setSaving(true);
		try {
			const updated = await transitionClimbNoteAction({ data: {
				id: form.id,
				action
			} });
			toast.success(`${CLIMB_NOTE_STATUS_LABEL[updated.status]} · Climb Note ${updated.number}`);
			setForm(noteToForm(updated));
			setNotes(await listClimbNotesForEditor());
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Action failed");
		} finally {
			setSaving(false);
		}
	}
	async function onDelete() {
		if (!form.id) return;
		if (!window.confirm(`Delete Climb Note ${form.number}? This cannot be undone.`)) return;
		setSaving(true);
		try {
			await deleteClimbNoteAction({ data: { id: form.id } });
			toast.success("Deleted");
			setSelectedId(null);
			setForm(emptyForm());
			setNotes(await listClimbNotesForEditor());
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Delete failed");
		} finally {
			setSaving(false);
		}
	}
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "ac-gnomah ac-gnomah-loading",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Loading session…" })
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/login",
		search: { redirect: "/gnomah" }
	});
	if (forbidden) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "template-color-1 spybody ac-inbio ac-gnomah ac-hero-stage",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ac-gnomah-gate",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { className: "acornsoft-logo" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "ac-login-kicker",
					children: "Gnomah"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Owner only" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"Climb Notes may only be edited when signed in with X as",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "@acornsoftai" }),
					". You are signed in",
					user?.displayName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						" ",
						"as ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: user.displayName })
					] }) : null,
					", but this account is not authorized for Gnomah."
				] }),
				forbidMsg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "ac-gnomah-gate-detail ac-gnomah-muted",
					children: forbidMsg
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ac-hero-cta ac-gnomah-gate-actions",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "rn-btn",
						onClick: () => void signOut("/login?redirect=/gnomah"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sign out and use X" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						className: "rn-btn ac-btn-outline",
						to: "/climb-notes",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Public Climb Notes" })
					})]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "template-color-1 spybody ac-inbio ac-gnomah ac-hero-stage",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { loginRedirect: "/gnomah" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "ac-gnomah-main",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container ac-gnomah-hero",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "title",
						children: "Gnomah"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "description",
						children: [
							"Owner studio for Climb Notes—accessed with your X session as",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "@acornsoftai" }),
							". Draft, approve, publish, archive, or pull notes back from the public journal. Radar bearer tokens stay on this page (owner profile only)."
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "container",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OwnerRadarPrefs, {})
				}),
				loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ac-gnomah-loading",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Loading Climb Notes…" })
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ac-gnomah-shell",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "ac-gnomah-rail",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ac-gnomah-rail-head",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Library" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "ac-gnomah-new",
									onClick: newNote,
									children: "New"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "ac-gnomah-filters",
								role: "tablist",
								children: STATUS_FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: filter === f.key ? "ac-gnomah-new is-active" : "ac-gnomah-new",
									style: filter === f.key ? void 0 : {
										background: "transparent",
										borderColor: "rgba(255,255,255,0.15)",
										color: "#c4cfde"
									},
									onClick: () => setFilter(f.key),
									children: f.label
								}, f.key))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "ac-gnomah-list",
								children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "ac-gnomah-muted",
									children: "No notes in this view."
								}) : filtered.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: `ac-gnomah-list-item${n.id === selectedId || n.id === form.id ? " is-active" : ""}`,
									onClick: () => selectNote(n),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "ac-gnomah-list-num",
										children: [
											n.number,
											" · ",
											CLIMB_NOTE_STATUS_LABEL[n.status]
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ac-gnomah-list-title",
										children: n.title
									})]
								}) }, n.id))
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "ac-gnomah-editor",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ac-gnomah-toolbar",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "rn-btn ac-gnomah-action",
									disabled: saving,
									onClick: () => void onSave(),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: saving ? "Saving…" : "Save" })
								}),
								ACTIONS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "rn-btn ac-btn-outline ac-gnomah-action",
									disabled: saving,
									onClick: () => void onTransition(a.key),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: a.label })
								}, a.key)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "ac-gnomah-danger",
									disabled: saving || !form.id,
									onClick: () => void onDelete(),
									children: "Delete"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "ac-gnomah-form",
							onSubmit: (e) => {
								e.preventDefault();
								onSave();
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ac-gnomah-row",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Number", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: form.number,
											onChange: (e) => setForm((f) => ({
												...f,
												number: e.target.value
											})),
											required: true
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Date", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "date",
											value: form.date,
											onChange: (e) => setForm((f) => ({
												...f,
												date: e.target.value
											})),
											required: true
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Status", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: CLIMB_NOTE_STATUS_LABEL[form.status],
											readOnly: true
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "ac-gnomah-grow",
											children: ["Tags", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: form.tags,
												onChange: (e) => setForm((f) => ({
													...f,
													tags: e.target.value
												}))
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "ac-gnomah-full",
									children: ["Title", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: form.title,
										onChange: (e) => setForm((f) => ({
											...f,
											title: e.target.value
										})),
										required: true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "ac-gnomah-full",
									children: ["Problem", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										rows: 4,
										value: form.problem,
										onChange: (e) => setForm((f) => ({
											...f,
											problem: e.target.value
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "ac-gnomah-full",
									children: ["Measure", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										rows: 4,
										value: form.measure,
										onChange: (e) => setForm((f) => ({
											...f,
											measure: e.target.value
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "ac-gnomah-full",
									children: ["Slice", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										rows: 4,
										value: form.slice,
										onChange: (e) => setForm((f) => ({
											...f,
											slice: e.target.value
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "ac-gnomah-full",
									children: ["Lesson", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										rows: 4,
										value: form.lesson,
										onChange: (e) => setForm((f) => ({
											...f,
											lesson: e.target.value
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "ac-gnomah-full",
									children: ["X citation URL", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: form.xUrl,
										onChange: (e) => setForm((f) => ({
											...f,
											xUrl: e.target.value
										})),
										placeholder: "https://x.com/…"
									})]
								})
							]
						})]
					})]
				})
			]
		})]
	});
}
var SplitComponent = GnomahEditorPage;
//#endregion
export { SplitComponent as component };
