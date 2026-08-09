import { o as __toESM } from "../_runtime.mjs";
import { R as require_react, g as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn } from "./client-Bm2YFrbd.mjs";
import { t as Logo } from "./logo-DJM2TaXM.mjs";
import { t as GROK_PROVIDERS } from "./server-ilFhfuWJ.mjs";
import { t as Route } from "./login-D31xP1MR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DHKV0Bxz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Official X mark (white on dark button). */
function XMarkIcon({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		className,
		viewBox: "0 0 24 24",
		width: "18",
		height: "18",
		"aria-hidden": true,
		focusable: "false",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"
		})
	});
}
function LoginPage() {
	const { redirect } = Route.useSearch();
	const safeRedirect = redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/gnomah";
	const forGnomah = safeRedirect === "/gnomah" || safeRedirect.startsWith("/gnomah?");
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const xProvider = GROK_PROVIDERS.find((p) => p.providerId === "grok-x");
	const googleProvider = GROK_PROVIDERS.find((p) => p.providerId === "grok-google");
	async function onSignIn(providerId) {
		setError(null);
		setBusy(providerId);
		try {
			await signIn(providerId, {
				callbackURL: safeRedirect,
				errorCallbackURL: `/login?redirect=${encodeURIComponent(safeRedirect)}`
			});
		} catch (e) {
			setError(e instanceof Error ? e.message : "Sign-in failed");
			setBusy(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "template-color-1 spybody ac-inbio ac-login-page",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "ac-login-backdrop",
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "ac-login-main",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ac-login-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ac-login-card-top",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "ac-login-logo",
								"aria-label": "Acornsoft home",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { className: "acornsoft-logo" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "ac-login-kicker",
								children: "Acornsoft account"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "ac-login-title",
								children: "Sign in"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "ac-login-lead",
								children: forGnomah ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Gnomah" }),
									" is the private Climb Notes studio (draft → approve → publish). Access is via",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "X credentials" }),
									" only for owner",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ac-login-handle",
										children: "@acornsoftai"
									}),
									"."
								] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									"Sign in with ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "X" }),
									" to unlock owner tools. Gnomah and Climb Notes publishing stay gated to",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ac-login-handle",
										children: "@acornsoftai"
									}),
									"."
								] })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ac-login-actions",
						children: [
							xProvider ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "ac-login-btn ac-login-btn-x",
								disabled: busy !== null,
								onClick: () => void onSignIn(xProvider.providerId),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ac-login-btn-icon",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(XMarkIcon, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ac-login-btn-label",
									children: busy === xProvider.providerId ? "Connecting to X…" : "Continue with X"
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "ac-login-muted",
								children: "X sign-in is not configured on this instance."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ac-login-gate-box",
								role: "note",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "ac-login-gate-title",
									children: "How Gnomah access works"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "ac-login-gate-list",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											"Choose ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Continue with X" }),
											" — OAuth only; we never store your X password."
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											"Server checks that the linked X identity is",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "@acornsoftai" }),
											" before any Climb Notes edit."
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											"After success you land in ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Gnomah" }),
											" (or return to Climb Notes). Gnomah appears in the top nav while signed in."
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Google can create a session for display tools, but it cannot open Gnomah." })
									]
								})]
							}),
							googleProvider ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ac-login-alt",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "ac-login-alt-label",
									children: "Other sign-in"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "ac-login-btn ac-login-btn-secondary",
									disabled: busy !== null,
									onClick: () => void onSignIn(googleProvider.providerId),
									children: busy === googleProvider.providerId ? "Connecting…" : "Continue with Google"
								})]
							}) : null
						]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "ac-login-error",
						role: "alert",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "ac-login-foot",
						"aria-label": "Related pages",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/climb-notes",
								children: "Climb Notes"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ac-login-foot-sep",
								"aria-hidden": true,
								children: "·"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								children: "Home"
							})
						]
					})
				]
			})
		})]
	});
}
//#endregion
export { LoginPage as component };
