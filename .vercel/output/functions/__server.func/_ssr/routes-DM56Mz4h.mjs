import { o as __toESM } from "../_runtime.mjs";
import { R as require_react, g as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as SiteHeader } from "./site-chrome-D2wQyRd1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DM56Mz4h.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var slideWords = [
	"Grok Build",
	"Imagine",
	"Voice",
	"Agents",
	"Skills",
	"Connectors"
];
function InbioPage() {
	const [slideIndex, setSlideIndex] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const id = window.setInterval(() => {
			setSlideIndex((i) => (i + 1) % slideWords.length);
		}, 3200);
		return () => window.clearInterval(id);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "template-color-1 spybody ac-inbio ac-hero-stage ac-home-shell",
		"data-spy": "scroll",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { loginRedirect: "/" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "main-page-wrapper",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				id: "home",
				className: "rn-slider-area ac-home-hero",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "slide slider-style-1 ac-hero-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "container",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "row justify-content-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-lg-11 col-12",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "content text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inner ac-hero-inner",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
												className: "title hero-title",
												children: "Building Production AI Solutions via Climb Notes™"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "hero-sub",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "hero-with",
													children: "with"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "cd-words-wrapper hero-slide",
													"aria-live": "polite",
													children: slideWords.map((word, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
														className: i === slideIndex ? "is-visible is-sliding" : "is-hidden",
														children: word.toUpperCase()
													}, word))
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "ac-hero-cta",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
													className: "rn-btn ac-btn-maroon",
													to: "/service",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Explore services" })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "description ac-hero-desc",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "ac-hero-desc-lead",
													children: ["For people who need more than a demo\xA0—", " "]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
													className: "ac-hero-desc-tag",
													to: "/service",
													children: "strategy, build, and reliable delivery."
												})]
											})
										]
									})
								})
							})
						})
					})
				})
			})
		})]
	});
}
function HomePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InbioPage, {});
}
//#endregion
export { HomePage as component };
