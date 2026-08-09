import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as VoiceCta, t as SiteChrome } from "./site-chrome-D2wQyRd1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-Cmo8-svs.js
var import_jsx_runtime = require_jsx_runtime();
var aboutSections = [
	{
		id: "about-intro",
		label: "Who we are"
	},
	{
		id: "company-vision",
		label: "Company Vision"
	},
	{
		id: "first-principles",
		label: "First Principles"
	},
	{
		id: "core-beliefs",
		label: "Core Beliefs"
	},
	{
		id: "charter",
		label: "Charter"
	}
];
function AboutPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteChrome, {
		loginRedirect: "/about",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "ac-about-page ac-page-top",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ac-about-layout",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "ac-about-side",
						"aria-label": "About sections",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "ac-about-side-label",
							children: "On this page"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "ac-about-side-nav",
							children: aboutSections.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `#${s.id}`,
								children: s.label
							}, s.id))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ac-about-main",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
								className: "ac-about-block",
								id: "about-intro",
								"aria-labelledby": "about-intro-heading",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ac-about-intro-grid",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "ac-about-intro-media",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: "/hero.jpg",
											alt: "Acornsoft"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "ac-about-intro-copy",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "subtitle",
												children: "About"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
												className: "title",
												id: "about-intro-heading",
												children: "We Are Acornsoft"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "discription",
												children: "Acornsoft is a New York studio that builds production artificial intelligence systems via Climb Notes™. Our software has to work under real load, with real users, and under real rules."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "discription",
												children: "We start from first principles: keep what is true and measurable, drop what is not. Failure is how we succeed. We are always trying to improve. Small starts. Strong roots."
											})
										]
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
								className: "ac-about-block",
								id: "company-vision",
								"aria-labelledby": "company-vision-heading",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									className: "ac-vision-card",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "ac-vision-card-title",
											id: "company-vision-heading",
											children: "Company Vision"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Artificial intelligence should run like durable infrastructure—not a demo that breaks under traffic, audit, or edge cases. Acornsoft helps teams climb from prototype to production with Climb Notes: a clear problem, a clear metric, a thin slice that works, then make it strong." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "We aim for software people can open, trust, and own: small useful tools, humans in the loop where judgment matters, and systems that stay honest when things get messy." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "We aim at a multiplanetary future. That ambition runs in the same direction as Elon Musk’s work at SpaceX and the wider stack—without partnership or endorsement. We are independent builders. Tesla, SpaceX, X, and SpaceXAI marks stay theirs. We do not speak for them. We put energy into Climb Notes™ and tools that make hard problems real under load—on Earth first." })
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
								className: "ac-about-block",
								id: "first-principles",
								"aria-labelledby": "first-principles-heading",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									className: "ac-vision-card",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "ac-vision-card-title",
										id: "first-principles-heading",
										children: "First Principles Approach"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
										className: "ac-vision-list ac-vision-list-ordered",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Climb Notes™ are our energy." }), " The difference maker is not a model alone—it is the written climb: problem, measure, slice, lesson. That energy compounds. Tools without notes fade."] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Name the real constraints first." }), " Data, speed, cost, risk, and who is responsible—write those down before you pick a model."] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Drop what you cannot justify." }), " No process, vendor pitch, or architecture is sacred if it fails those constraints."] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Build the smallest system that can learn." }),
												" ",
												"Prefer something you can measure, fail safely, and improve in front of the team that owns it. Capture the climb in Climb Notes."
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Check assumptions again in production." }),
												" ",
												"Live systems change the problem. First principles is a loop, not a one-time slide. Update the note when reality moves."
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Treat failure as tuition." }), " A miss maps the real problem. Write it into Climb Notes™. We succeed by learning fast—not by pretending we never miss."] })
										]
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
								className: "ac-about-block",
								id: "core-beliefs",
								"aria-labelledby": "core-beliefs-heading",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									className: "ac-vision-card ac-vision-card-wide",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "ac-vision-card-title",
										id: "core-beliefs-heading",
										children: "Core Beliefs"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
										className: "ac-vision-list",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Failure is how we succeed." }), " We are always trying to improve. When a slice fails, we learn what production needs—then we climb again."] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Truth before theater." }), " Demos and scores are useful. What matters is how the system behaves under real load."] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "People stay accountable." }), " Automation is a tool with clear handoffs—not a way to drop ownership."] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Privacy and proper usage come first." }), " They shape the design. They are not patches after launch."] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "The record is the boss." }), " Put claims next to sources. Climb Notes™ and Our Work on Canopy favor evidence over story."] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Respect other brands." }), " Tesla, Optimus, SpaceX, X, Grok, Grok Build, and SpaceXAI are trademarks of their owners. We use tools. We do not speak for them."] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Small starts, strong roots." }), " One sharp workflow beats a vague platform promise."] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Mars-facing ambition, Earth-proven systems." }),
												" ",
												"We share the vision of a multiplanetary future with Elon Musk’s direction for SpaceX and the wider stack—while shipping software that works here and now."
											] })
										]
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
								className: "ac-about-block",
								id: "charter",
								"aria-labelledby": "charter-heading",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									className: "ac-vision-card ac-vision-card-charter",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "ac-vision-card-title",
											id: "charter-heading",
											children: "Acornsoft Charter"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "ac-charter-lede",
											children: "First principles. Few rules. Hold them when it is hard."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
											className: "ac-vision-list ac-vision-list-ordered ac-charter-list",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Define success before you build." }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Keep only what the problem requires." }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Make it safe, private, and operable—or refuse it." }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Write assumptions. Write failures. Improve the next slice." }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "People stay accountable. Machines do not own risk." }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Contact is Voice. No form theater." }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Name other brands honestly. Never claim their voice." }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "When evidence contradicts you, change." })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "ac-hero-cta",
											style: { marginTop: 20 },
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceCta, {
												className: "rn-btn",
												outline: true,
												label: "ACORNSOFT is OPEN"
											})
										})
									]
								})
							})
						]
					})]
				})
			})
		})
	});
}
var SplitComponent = AboutPage;
//#endregion
export { SplitComponent as component };
