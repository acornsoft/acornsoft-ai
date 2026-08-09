import { o as __toESM } from "../_runtime.mjs";
import { R as require_react, g as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as SiteHeader, o as useCurrentUserState } from "./site-chrome-D2wQyRd1.mjs";
import { a as formatClimbNoteCiteForX, l as listPublishedClimbNotes, n as climbNotes, o as isPublicClimbNoteStatus, r as countByStatus, s as listAllClimbNotesPublic, t as CLIMB_NOTE_STATUS_LABEL } from "./actions-CbpgsOpb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/climb-notes-BjfVTvEP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Climb Notes™ wordmark — Acornsoft trademark claim (™).
*/
function ClimbNotesMark({ className = "", large = false, as = "span" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(as, {
		className: `cn-wordmark${large ? " cn-wordmark-lg" : ""}${className ? ` ${className}` : ""}`,
		children: [
			"Climb",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "cn-hyphen",
				children: "-"
			}),
			"Notes",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sup", {
				className: "cn-tm",
				title: "Climb Notes is a trademark of Acornsoft",
				children: "™"
			})
		]
	});
}
var X_ACORNSOFT = "https://x.com/acornsoftai";
var STUDIO_FILTERS = [
	{
		key: "all",
		label: "All"
	},
	{
		key: "published",
		label: "Published"
	},
	{
		key: "pending",
		label: "Pending approval"
	},
	{
		key: "approved",
		label: "Approved"
	},
	{
		key: "draft",
		label: "Draft"
	},
	{
		key: "archived",
		label: "Archived"
	}
];
function statusClass(status) {
	return `ac-cn-badge ac-cn-badge-${status}`;
}
function NoteCard({ note, studio }) {
	const citeText = formatClimbNoteCiteForX(note);
	const isPublic = isPublicClimbNoteStatus(note.status);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: [
			"ac-cn-entry",
			`is-${note.status}`,
			note.xUrl ? "has-x" : "",
			!isPublic ? "is-not-public" : ""
		].filter(Boolean).join(" "),
		id: note.id,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "ac-cn-entry-head",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ac-cn-num",
						children: ["Climb Note ", note.number]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: statusClass(note.status),
						children: CLIMB_NOTE_STATUS_LABEL[note.status]
					}),
					isPublic ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ac-cn-badge ac-cn-badge-stored",
						children: "Live on site"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ac-cn-badge ac-cn-badge-hidden",
						children: "Not public"
					}),
					note.xUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ac-cn-badge ac-cn-badge-x",
						children: "Cited on X"
					}) : null,
					note.version ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ac-cn-badge ac-cn-badge-ver",
						children: ["v", note.version]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
						dateTime: note.date,
						children: note.date
					}),
					note.sourceFile ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ac-cn-source",
						title: "Obsidian file",
						children: note.sourceFile
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "ac-cn-entry-title",
				children: note.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ac-cn-fields",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Problem" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: note.problem })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Measure" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: note.measure })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Slice" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: note.slice })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Lesson" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: note.lesson })] })
				]
			}),
			studio ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ac-cn-approval",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "ac-cn-approval-title",
						children: "Publish control"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "ac-cn-approval-grid",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Submitted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: note.submittedAt ? `${note.submittedAt.slice(0, 10)} · ${note.submittedBy || "—"}` : "—" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Approved" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: note.approvedAt ? `${note.approvedAt.slice(0, 10)} · ${note.approvedBy || "—"}` : "—" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Published" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: note.publishedAt ? note.publishedAt.slice(0, 10) : "—" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Unpublished" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: note.unpublishedAt ? note.unpublishedAt.slice(0, 10) : "—" })] })
						]
					}),
					note.approvalNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "ac-cn-approval-note",
						children: note.approvalNote
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "ac-cn-cli-hint",
						children: [
							"Edit and publish in ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/gnomah",
								children: "Gnomah"
							}),
							"."
						]
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "ac-cn-entry-foot",
				children: [note.xUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "rn-btn",
					href: note.xUrl,
					target: "_blank",
					rel: "noopener noreferrer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "X citation" })
				}) : null, isPublic ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: "ac-cn-x-template",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: "Optional: cite this note on X" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "ac-cn-x-hint",
							style: { marginTop: 10 },
							children: "The full note already lives here. On X, post a short pointer—not a second full copy. Only publish on X after the note is Published here."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "ac-cn-x-pre",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: citeText })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "ac-note-link",
							href: X_ACORNSOFT,
							target: "_blank",
							rel: "noopener noreferrer",
							children: "Open @acornsoftai →"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "ac-cn-x-hint",
					children: "Draft and pending notes stay off the public journal and should not be cited on X until Published."
				})]
			})
		]
	});
}
function ClimbNotesPage() {
	const { user, isPending } = useCurrentUserState();
	const signedIn = !isPending && !!user;
	const [mode, setMode] = (0, import_react.useState)("public");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [notes, setNotes] = (0, import_react.useState)(climbNotes);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			try {
				const live = mode === "public" ? await listPublishedClimbNotes() : await listAllClimbNotesPublic();
				if (!cancelled && live.length) setNotes(live);
			} catch {}
		})();
		return () => {
			cancelled = true;
		};
	}, [mode]);
	const counts = (0, import_react.useMemo)(() => countByStatus(notes), [notes]);
	const visible = (0, import_react.useMemo)(() => {
		if (mode === "public") return notes.filter((n) => isPublicClimbNoteStatus(n.status));
		if (filter === "all") return notes;
		return notes.filter((n) => n.status === filter);
	}, [
		notes,
		mode,
		filter
	]);
	const publishedCount = counts.published;
	const studioCount = counts.all;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "template-color-1 spybody ac-inbio ac-climb-notes ac-hero-stage",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { loginRedirect: "/gnomah" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "main-page-wrapper cn-page ac-page-hero-main",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "cn-hero rn-section-gap ac-page-top",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "container",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "row",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-lg-10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "section-title text-left",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "subtitle",
										children: "Studio energy"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "title cn-page-title",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClimbNotesMark, { large: true })
									})]
								})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "row mt--30",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-lg-12",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ac-cn-mode-bar ac-cn-mode-bar--compact-right",
									role: "tablist",
									"aria-label": "Climb Notes view",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										role: "tab",
										"aria-selected": mode === "public",
										className: `ac-cn-mode-btn${mode === "public" ? " is-active" : ""}`,
										onClick: () => setMode("public"),
										children: ["Public journal", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "ac-cn-mode-count",
											children: [
												"(",
												publishedCount,
												")"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										role: "tab",
										"aria-selected": mode === "studio",
										className: `ac-cn-mode-btn${mode === "studio" ? " is-active" : ""}`,
										onClick: () => setMode("studio"),
										children: ["Studio library", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "ac-cn-mode-count",
											children: [
												"(",
												studioCount,
												")"
											]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
									className: "ac-cn-gnomah-panel",
									"aria-labelledby": "ac-cn-gnomah-heading",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "ac-cn-gnomah-panel-inner",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
												id: "ac-cn-gnomah-heading",
												className: "ac-cn-gnomah-title",
												children: "Gnomah + X access"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "ac-cn-gnomah-text",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Gnomah" }), " is Acornsoft’s private Climb Notes studio—draft, approve, publish, archive, and pull notes back from the public journal. It is not a public editor."]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
												className: "ac-cn-gnomah-list",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
														"Sign in only happens on Climb Notes (top bar",
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Log in" }),
														")."
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
														"Access uses your ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "X account" }),
														". Owner gate is",
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
															href: X_ACORNSOFT,
															target: "_blank",
															rel: "noopener noreferrer",
															children: "@acornsoftai"
														}),
														"—server-checked on every edit."
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
														"After a successful X sign-in, ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Gnomah" }),
														" appears in the top nav. Open it to edit notes and manage Radar credentials."
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Other identities (e.g. Google) may sign in for display but cannot open Gnomah." })
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "ac-cn-gnomah-actions",
												children: [
													!isPending && !signedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
														className: "rn-btn ac-btn-maroon",
														to: "/login",
														search: { redirect: "/gnomah" },
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sign in with X" })
													}) : null,
													signedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
														className: "rn-btn ac-btn-maroon",
														to: "/gnomah",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open Gnomah" })
													}) : null,
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
														className: "rn-btn ac-btn-outline",
														href: X_ACORNSOFT,
														target: "_blank",
														rel: "noopener noreferrer",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "@acornsoftai on X" })
													})
												]
											}),
											signedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "ac-cn-gnomah-status",
												children: [
													"Signed in as",
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: user?.displayName?.startsWith("@") ? user.displayName : user?.displayName ? `@${user.displayName}` : "your account" }),
													". If Gnomah is blocked, sign out and continue with X as @acornsoftai."
												]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "ac-cn-gnomah-status",
												children: [
													"Not signed in. Use ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Log in" }),
													" in the top bar or ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Sign in with X" }),
													" below to start the owner path to Gnomah."
												]
											})
										]
									})
								})]
							})
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "rn-section-gap",
					id: "notes",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "container",
						children: [mode === "studio" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "ac-cn-filter-row",
							"aria-label": "Filter by status",
							children: STUDIO_FILTERS.map((f) => {
								const n = f.key === "all" ? counts.all : counts[f.key];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: `ac-cn-filter-pill${filter === f.key ? " is-active" : ""}`,
									onClick: () => setFilter(f.key),
									children: [f.label, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"(",
										n,
										")"
									] })]
								}, f.key);
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "ac-cn-public-banner",
							children: [
								"Showing published notes only (",
								publishedCount,
								"). Open Studio library for drafts and non-public statuses."
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "row",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-lg-12",
								children: visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "ac-cn-empty",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: mode === "public" ? "No published Climb Notes yet." : "No notes match this filter." })
								}) : visible.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoteCard, {
									note,
									studio: mode === "studio"
								}, note.id))
							})
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "rn-section-gap cn-cta-band",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "container text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "title",
								children: "Radar lives on Canopy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "description",
								children: "Climb Notes™ hold the journal on this site. Canopy is the live signal layer."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "ac-hero-cta",
								style: { marginTop: 24 },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									className: "rn-btn",
									to: "/canopy",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open Canopy" })
								})
							})
						]
					})
				})
			]
		})]
	});
}
var SplitComponent = ClimbNotesPage;
//#endregion
export { SplitComponent as component };
