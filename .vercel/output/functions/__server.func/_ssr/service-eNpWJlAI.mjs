import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as VoiceCta, t as SiteChrome } from "./site-chrome-D2wQyRd1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/service-eNpWJlAI.js
var import_jsx_runtime = require_jsx_runtime();
var services = [
	{
		title: "AI Strategy",
		text: "Sharp use cases, clear metrics, path from pilot to production."
	},
	{
		title: "Product Build",
		text: "Full-stack artificial intelligence apps that fit real workflows and real users."
	},
	{
		title: "Model Systems",
		text: "Retrieval, evals, guardrails, and monitoring that hold up."
	},
	{
		title: "Trust and Safety",
		text: "Privacy, reliability, and human checkpoints where it matters."
	},
	{
		title: "Automation",
		text: "Agents and workflows with clear handoffs—not black boxes."
	},
	{
		title: "Delivery",
		text: "Climb Notes structure: capture, build, ship, measure."
	}
];
function ServicePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteChrome, {
		loginRedirect: "/service",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "ac-service-page ac-page-top",
			id: "service",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "ac-service-head",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ac-service-kicker",
								children: "Services"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "ac-service-title",
								children: "What we deliver"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "ac-service-lede-box",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "ac-service-lede",
									children: "Modular engagements—from a focused prototype to a full production program."
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "ac-service-grid",
						children: services.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "ac-service-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ac-service-card-top",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ac-service-index",
										"aria-hidden": "true",
										children: String(i + 1).padStart(2, "0")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ac-service-rule",
										"aria-hidden": "true"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "ac-service-card-title",
									children: f.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "ac-service-card-text",
									children: f.text
								})
							]
						}, f.title))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "ac-service-foot",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceCta, {
							className: "rn-btn",
							outline: true,
							label: "ACORNSOFT is OPEN"
						})
					})
				]
			})
		})
	});
}
var SplitComponent = ServicePage;
//#endregion
export { SplitComponent as component };
