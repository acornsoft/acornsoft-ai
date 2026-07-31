import { r as __toESM } from "../_runtime.mjs";
import { a as AccordionTrigger$1, i as AccordionItem$1, l as require_jsx_runtime, n as AccordionContent$1, r as AccordionHeader, s as Slot, t as Accordion$1, u as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as ArrowRight, a as Menu, c as Layers, d as ChevronLeft, f as ChevronDown, g as ArrowUpRight, h as Brain, i as Phone, l as CodeXml, m as ChartLine, n as Sparkles, o as MapPin, p as Check, r as ShieldCheck, s as Mail, t as X, u as ChevronRight } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Label$1 } from "../_libs/radix-ui__react-label.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D3ISqXUd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var navLinks = [
	{
		href: "#about",
		label: "About"
	},
	{
		href: "#services",
		label: "Services"
	},
	{
		href: "#work",
		label: "Work"
	},
	{
		href: "#team",
		label: "Team"
	},
	{
		href: "#pricing",
		label: "Pricing"
	},
	{
		href: "#contact",
		label: "Contact"
	}
];
var heroWords = [
	"Intelligent",
	"Reliable",
	"Practical"
];
var stats = [
	{
		value: 48,
		suffix: "+",
		label: "AI systems shipped"
	},
	{
		value: 12,
		suffix: "M",
		label: "Predictions served / mo"
	},
	{
		value: 96,
		suffix: "%",
		label: "Client retention"
	},
	{
		value: 3,
		suffix: "wks",
		label: "Avg. prototype cycle"
	}
];
var services = [
	{
		icon: Brain,
		title: "AI product strategy",
		description: "Find the highest-leverage use cases, define success metrics, and chart a path from pilot to production."
	},
	{
		icon: CodeXml,
		title: "Custom AI applications",
		description: "Full-stack systems that embed models into real workflows—APIs, UIs, and the glue that makes them reliable."
	},
	{
		icon: Layers,
		title: "Model engineering",
		description: "Retrieval, fine-tuning, evaluation harnesses, and guardrails so outputs stay accurate and on-brand."
	},
	{
		icon: Sparkles,
		title: "Automation & agents",
		description: "Multi-step agents that research, draft, and act—with human checkpoints where judgment still matters."
	},
	{
		icon: ChartLine,
		title: "Analytics & insight",
		description: "Turn unstructured data into dashboards and decisions your team can trust every Monday morning."
	},
	{
		icon: ShieldCheck,
		title: "Reliability & safety",
		description: "Monitoring, red-teaming, privacy reviews, and fallback paths so AI features earn production trust."
	}
];
var skills = [
	{
		name: "LLM applications",
		level: 94
	},
	{
		name: "Systems design",
		level: 90
	},
	{
		name: "Data pipelines",
		level: 86
	},
	{
		name: "Product design",
		level: 88
	},
	{
		name: "Evaluation & QA",
		level: 92
	},
	{
		name: "Cloud & DevOps",
		level: 85
	}
];
var portfolio = [
	{
		id: "atlas",
		title: "Atlas Research Desk",
		category: "Product",
		summary: "Internal research agent that cites sources and drafts briefs in minutes."
	},
	{
		id: "hearth",
		title: "Hearth Support Copilot",
		category: "Automation",
		summary: "Ticket triage and reply drafts that cut first-response time by half."
	},
	{
		id: "ledger",
		title: "Ledger Insights",
		category: "Analytics",
		summary: "Natural-language queries over finance data with auditable SQL underneath."
	},
	{
		id: "north",
		title: "Northbound Onboarding",
		category: "Product",
		summary: "Guided AI onboarding that personalizes setup for every new customer."
	},
	{
		id: "signal",
		title: "Signal Review",
		category: "Safety",
		summary: "Content moderation stack with human-in-the-loop escalation paths."
	},
	{
		id: "forge",
		title: "Forge Knowledge Base",
		category: "Automation",
		summary: "RAG system that keeps engineering docs answerable and up to date."
	}
];
var portfolioFilters = [
	"All",
	"Product",
	"Automation",
	"Analytics",
	"Safety"
];
var team = [
	{
		name: "Avery Chen",
		role: "Founder & CEO",
		bio: "Former product lead at two AI startups. Builds teams that ship."
	},
	{
		name: "Jordan Miles",
		role: "Head of Engineering",
		bio: "Distributed systems and model serving. Obsessed with latency and cost."
	},
	{
		name: "Samira Patel",
		role: "Design Director",
		bio: "Turns complex model behavior into interfaces people actually enjoy."
	},
	{
		name: "Noah Brooks",
		role: "Applied Research",
		bio: "Evaluation science and retrieval. Makes models measurable, not magical."
	}
];
var plans = [
	{
		name: "Spark",
		price: 4800,
		period: "project",
		description: "A focused sprint to validate one AI use case end to end.",
		features: [
			"Discovery workshop",
			"Working prototype",
			"Success metrics plan",
			"2 weeks of support"
		],
		highlighted: false
	},
	{
		name: "Growth",
		price: 12500,
		period: "month",
		description: "Embedded partnership to design, build, and ship production AI.",
		features: [
			"Dedicated pod",
			"Product + eng + design",
			"Eval & monitoring setup",
			"Weekly demos",
			"Priority support"
		],
		highlighted: true
	},
	{
		name: "Enterprise",
		price: null,
		period: "custom",
		description: "Multi-team programs, compliance review, and long-horizon roadmap.",
		features: [
			"Multiple workstreams",
			"Security & compliance",
			"On-call reliability",
			"Training for your team",
			"Custom SLAs"
		],
		highlighted: false
	}
];
var testimonials = [
	{
		quote: "AcornSoft turned a vague AI wishlist into a system our support team uses every day. Clear thinking, clean delivery.",
		name: "Elena Vargas",
		title: "VP Customer Ops, Northline"
	},
	{
		quote: "They treat evaluation as seriously as demos. Our board finally trusts the numbers behind the product.",
		name: "Marcus Hale",
		title: "CTO, Brightfield"
	},
	{
		quote: "Fast without being reckless. We shipped a research copilot in six weeks that still holds up a year later.",
		name: "Priya Nair",
		title: "Head of Product, Kite Labs"
	}
];
var faqs = [
	{
		q: "What kinds of AI projects do you take on?",
		a: "We focus on applied AI products—assistants, automation, analytics, and model-powered features that sit inside real business workflows. We skip pure research with no path to production."
	},
	{
		q: "How quickly can we start?",
		a: "Most engagements begin with a short discovery sprint. If scope is clear, we can usually staff a pod within two weeks."
	},
	{
		q: "Do you work with our existing stack?",
		a: "Yes. We integrate with the tools and clouds you already run—whether that is Python services, modern JS frontends, or enterprise data platforms."
	},
	{
		q: "How do you handle data privacy?",
		a: "We design for least privilege, isolate environments, and can operate under NDAs, DPAs, and industry-specific constraints. Your data never becomes our training corpus."
	}
];
var contactInfo = {
	email: "hello@acornsoft.ai",
	phone: "+1 (212) 555-0148",
	address: "New York, NY"
};
function useCountUp(target, duration = 1200) {
	const [value, setValue] = (0, import_react.useState)(0);
	const ref = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (ref.current) return;
		if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setValue(target);
			ref.current = true;
			return;
		}
		let frame = 0;
		const start = performance.now();
		const tick = (now) => {
			const t = Math.min(1, (now - start) / duration);
			const eased = 1 - Math.pow(1 - t, 3);
			setValue(Math.round(target * eased));
			if (t < 1) frame = requestAnimationFrame(tick);
			else ref.current = true;
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [target, duration]);
	return value;
}
function Stat({ value, suffix, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card rounded-xl p-5 md:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "font-mono text-3xl font-medium tabular-nums tracking-tight text-fg md:text-4xl",
			children: [useCountUp(value), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-accent",
				children: suffix
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: label
		})]
	});
}
function About() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "about",
		className: "section-pad",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-site",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-12 lg:grid-cols-12 lg:gap-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.16em] text-accent",
						children: "About"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "heading-section mt-3 text-3xl text-fg md:text-4xl text-balance",
						children: "From acorn to system of record"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-7 space-y-5 text-muted leading-relaxed",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "AcornSoft is a New York–based applied AI studio. We partner with product and operations teams who need more than a demo—teams who need software that holds up under real load, real users, and real compliance constraints." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Our approach is deliberately practical: pick a sharp problem, measure what good looks like, ship a thin vertical slice, then harden it. The result is AI that earns its place in the workflow, not another experiment that gathers dust." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#services",
							className: "inline-flex text-sm font-medium text-fg underline-offset-4 hover:underline",
							children: "Explore how we work"
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, { ...s }, s.label))
			})]
		})
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[opacity,transform,background-color,border-color,color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-fg hover:opacity-90",
			secondary: "bg-bg-subtle text-fg border border-border hover:bg-bg-elevated",
			outline: "border border-border-strong bg-transparent text-fg hover:bg-bg-subtle",
			ghost: "text-fg hover:bg-bg-subtle",
			link: "text-accent underline-offset-4 hover:underline"
		},
		size: {
			default: "h-11 px-5 py-2",
			sm: "h-9 rounded-md px-3.5 text-sm",
			lg: "h-12 rounded-lg px-7 text-base",
			icon: "h-10 w-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-md border border-border bg-bg-elevated px-3.5 py-2 text-sm text-fg placeholder:text-subtle transition-[border-color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-border-strong disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label$1, {
	ref,
	className: cn("text-sm font-medium text-fg leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className),
	...props
}));
Label.displayName = Label$1.displayName;
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[120px] w-full rounded-md border border-border bg-bg-elevated px-3.5 py-3 text-sm text-fg placeholder:text-subtle transition-[border-color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-border-strong disabled:cursor-not-allowed disabled:opacity-50 resize-y", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
function Contact() {
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const onSubmit = (e) => {
		e.preventDefault();
		const form = e.currentTarget;
		const data = new FormData(form);
		const name = String(data.get("name") ?? "").trim();
		const email = String(data.get("email") ?? "").trim();
		const message = String(data.get("message") ?? "").trim();
		if (!name || !email || !message) {
			toast.error("Please fill in name, email, and message.");
			return;
		}
		setSubmitting(true);
		window.setTimeout(() => {
			setSubmitting(false);
			form.reset();
			toast.success("Message sent. We will reply within one business day.");
		}, 600);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "contact",
		className: "section-pad border-t border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-site",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-2xl text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.16em] text-accent",
						children: "Contact"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "heading-section mt-3 text-3xl text-fg md:text-4xl text-balance",
						children: "Tell us what you are building"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-muted leading-relaxed",
						children: "Share a bit about your product or process. We will respond with honest fit, timing, and next steps."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 grid gap-8 lg:grid-cols-12 lg:gap-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "surface-card rounded-xl p-6 md:p-8 lg:col-span-7 space-y-5",
					noValidate: true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-5 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "name",
									children: "Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "name",
									name: "name",
									autoComplete: "name",
									placeholder: "Your name",
									required: true
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "email",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									name: "email",
									type: "email",
									autoComplete: "email",
									placeholder: "you@company.com",
									required: true
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "company",
								children: "Company"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "company",
								name: "company",
								autoComplete: "organization",
								placeholder: "Optional"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "message",
								children: "Message"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "message",
								name: "message",
								placeholder: "What problem are you trying to solve?",
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "lg",
							disabled: submitting,
							className: "w-full sm:w-auto",
							children: submitting ? "Sending…" : "Send message"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "lg:col-span-5 flex flex-col gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactCard, {
							icon: Mail,
							label: "Email",
							value: contactInfo.email,
							href: `mailto:${contactInfo.email}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactCard, {
							icon: Phone,
							label: "Phone",
							value: contactInfo.phone,
							href: `tel:${contactInfo.phone.replace(/\D/g, "")}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactCard, {
							icon: MapPin,
							label: "Office",
							value: contactInfo.address
						})
					]
				})]
			})]
		})
	});
}
function ContactCard({ icon: Icon, label, value, href }) {
	const content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-bg-subtle text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			className: "h-4.5 w-4.5 h-4 w-4",
			strokeWidth: 1.75
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs font-medium uppercase tracking-[0.12em] text-muted",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-1 text-sm font-medium text-fg",
		children: value
	})] })] });
	if (href) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href,
		className: "surface-card flex items-center gap-4 rounded-xl p-5 transition-[border-color] duration-150 hover:border-border-strong no-underline",
		children: content
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "surface-card flex items-center gap-4 rounded-xl p-5",
		children: content
	});
}
function Footer() {
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "border-t border-border bg-bg-elevated/50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-site py-12 md:py-14",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-8 md:flex-row md:items-start md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "#home",
					className: "flex items-center gap-2.5 text-fg no-underline",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": true,
						className: "grid h-8 w-8 place-items-center rounded-md border border-border-strong bg-bg-subtle text-sm font-semibold",
						children: "A"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[0.95rem] font-semibold tracking-tight",
						children: ["AcornSoft", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: ".ai"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-xs text-sm text-muted leading-relaxed",
					children: "Applied AI software for teams that need production systems, not just prototypes."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex flex-wrap gap-x-5 gap-y-2",
					"aria-label": "Footer",
					children: navLinks.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: link.href,
						className: "text-sm text-muted transition-colors hover:text-fg",
						children: link.label
					}, link.href))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-subtle",
					children: [
						"© ",
						year,
						" AcornSoft.ai. All rights reserved."
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-subtle",
					children: "New York · Built for clarity"
				})]
			})]
		})
	});
}
function Header() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrolled(window.scrollY > 12);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	(0, import_react.useEffect)(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: cn("fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-200", scrolled || open ? "border-b border-border bg-bg/90 backdrop-blur-md" : "border-b border-transparent bg-transparent"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-site flex h-16 items-center justify-between md:h-[4.25rem]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "#home",
					className: "flex items-center gap-2.5 text-fg no-underline",
					onClick: () => setOpen(false),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": true,
						className: "grid h-8 w-8 place-items-center rounded-md border border-border-strong bg-bg-subtle text-sm font-semibold tracking-tight",
						children: "A"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[0.95rem] font-semibold tracking-tight",
						children: ["AcornSoft", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: ".ai"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden items-center gap-1 md:flex",
					"aria-label": "Primary",
					children: [navLinks.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: link.href,
						className: "rounded-md px-3 py-2 text-sm text-muted transition-colors duration-150 hover:text-fg",
						children: link.label
					}, link.href)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						className: "ml-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#contact",
							children: "Start a project"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-bg-elevated text-fg md:hidden",
					"aria-label": open ? "Close menu" : "Open menu",
					"aria-expanded": open,
					onClick: () => setOpen((v) => !v),
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
				})
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border bg-bg md:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "container-site flex flex-col gap-1 py-4",
				"aria-label": "Mobile",
				children: [navLinks.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: link.href,
					className: "rounded-md px-3 py-3 text-base text-fg",
					onClick: () => setOpen(false),
					children: link.label
				}, link.href)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-2 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "#contact",
						onClick: () => setOpen(false),
						children: "Start a project"
					})
				})]
			})
		}) : null]
	});
}
function Hero() {
	const [index, setIndex] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const id = window.setInterval(() => {
			setIndex((i) => (i + 1) % heroWords.length);
		}, 2800);
		return () => window.clearInterval(id);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "home",
		className: "relative isolate flex min-h-[100dvh] items-end overflow-hidden pb-16 pt-28 md:items-center md:pb-24 md:pt-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-0 -z-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/hero.jpg",
					alt: "",
					className: "h-full w-full object-cover object-[center_35%]",
					width: 1920,
					height: 1080,
					fetchPriority: "high"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 hidden md:block",
					style: { background: "linear-gradient(105deg, color-mix(in oklab, var(--color-bg) 78%, transparent) 0%, color-mix(in oklab, var(--color-bg) 40%, transparent) 52%, color-mix(in oklab, var(--color-bg) 22%, transparent) 100%), linear-gradient(180deg, color-mix(in oklab, var(--color-bg) 40%, transparent) 0%, transparent 38%, color-mix(in oklab, var(--color-bg) 50%, transparent) 80%, var(--color-bg) 100%)" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 md:hidden",
					style: { background: "linear-gradient(180deg, color-mix(in oklab, var(--color-bg) 35%, transparent) 0%, color-mix(in oklab, var(--color-bg) 15%, transparent) 30%, color-mix(in oklab, var(--color-bg) 55%, transparent) 62%, var(--color-bg) 100%)" }
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-site relative z-10 w-full",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-bg/55 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-muted backdrop-blur-sm",
						children: "Applied AI studio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "heading-display text-[clamp(2.4rem,6vw,4.25rem)] text-fg text-balance",
						children: [
							"We are",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "relative inline-block min-w-[8ch] text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-block animate-in fade-in slide-in-from-bottom-1 duration-500",
									children: heroWords[index]
								}, heroWords[index])
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-xl text-base text-muted md:text-lg leading-relaxed",
						children: "AcornSoft builds production AI software—from strategy and prototypes to systems your team can trust at scale. Small starts. Strong roots."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col gap-3 sm:flex-row sm:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "#contact",
								children: ["Talk with us", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#work",
								children: "See selected work"
							})
						})]
					})
				]
			})
		})]
	});
}
function formatPrice(price) {
	if (price === null) return "Custom";
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0
	}).format(price);
}
function Pricing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "pricing",
		className: "section-pad border-t border-border bg-bg-elevated/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-site",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-2xl text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.16em] text-accent",
						children: "Pricing"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "heading-section mt-3 text-3xl text-fg md:text-4xl text-balance",
						children: "Clear plans. No mystery retainers."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-muted leading-relaxed",
						children: "Start small with a focused sprint, or embed a pod for ongoing delivery. Enterprise programs are scoped to your roadmap."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid gap-4 lg:grid-cols-3",
				children: plans.map((plan) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: cn("flex flex-col rounded-xl p-6 md:p-7", plan.highlighted ? "border border-primary/40 bg-bg-subtle shadow-soft" : "surface-card"),
					children: [
						plan.highlighted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-4 inline-flex w-fit rounded-full border border-border bg-bg px-2.5 py-1 text-xs font-medium text-fg",
							children: "Most popular"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-4 inline-flex h-[26px]",
							"aria-hidden": true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-medium text-fg",
							children: plan.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: plan.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-6 flex items-baseline gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-3xl font-medium tabular-nums tracking-tight text-fg",
								children: formatPrice(plan.price)
							}), plan.price !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm text-muted",
								children: ["/ ", plan.period]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted",
								children: plan.period
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-6 flex flex-1 flex-col gap-3",
							children: plan.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2.5 text-sm text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
									className: "mt-0.5 h-4 w-4 shrink-0 text-success",
									strokeWidth: 2
								}), f]
							}, f))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "mt-8 w-full",
							variant: plan.highlighted ? "default" : "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#contact",
								children: plan.price === null ? "Talk with us" : "Get started"
							})
						})
					]
				}, plan.name))
			})]
		})
	});
}
var Accordion = Accordion$1;
var AccordionItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionItem$1, {
	ref,
	className: cn("border-b border-border last:border-b-0", className),
	...props
}));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionHeader, {
	className: "flex",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionTrigger$1, {
		ref,
		className: cn("flex flex-1 items-center justify-between gap-4 py-5 text-left text-base font-medium text-fg transition-colors hover:text-primary outline-none [&[data-state=open]>svg]:rotate-180", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted transition-transform duration-200" })]
	})
}));
AccordionTrigger.displayName = AccordionTrigger$1.displayName;
var AccordionContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent$1, {
	ref,
	className: "overflow-hidden text-sm text-muted data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("pb-5 pt-0 leading-relaxed", className),
		children
	})
}));
AccordionContent.displayName = AccordionContent$1.displayName;
function Services() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "services",
		className: "section-pad",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-site",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-2xl text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-[0.16em] text-accent",
							children: "Services"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "heading-section mt-3 text-3xl text-fg md:text-4xl text-balance",
							children: "What we build with you"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-muted leading-relaxed",
							children: "Modular engagements that stack—from a sharp prototype to a full production program."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: services.map((service) => {
						const Icon = service.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "surface-card group rounded-xl p-6 transition-[border-color,background-color] duration-200 hover:border-border-strong",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-4 grid h-10 w-10 place-items-center rounded-lg border border-border bg-bg-subtle text-fg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										className: "h-5 w-5",
										strokeWidth: 1.75
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-lg font-medium tracking-tight text-fg",
									children: service.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-muted",
									children: service.description
								})
							]
						}, service.title);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-20 grid gap-10 lg:grid-cols-12 lg:gap-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-[0.16em] text-accent",
							children: "FAQ"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "heading-section mt-3 text-2xl text-fg md:text-3xl",
							children: "Common questions"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:col-span-8 surface-card rounded-xl px-5 md:px-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
							type: "single",
							collapsible: true,
							className: "w-full",
							children: faqs.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
								value: `faq-${i}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, { children: item.q }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, { children: item.a })]
							}, item.q))
						})
					})]
				})
			]
		})
	});
}
function Skills() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-y border-border bg-bg-elevated/60 section-pad",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-site grid gap-12 lg:grid-cols-12 lg:gap-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.16em] text-accent",
						children: "Capabilities"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "heading-section mt-3 text-3xl text-fg md:text-4xl text-balance",
						children: "Depth where it matters"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-muted leading-relaxed",
						children: "We combine product craft with serious engineering—so the models, data, and interfaces move forward together instead of in parallel silos."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-7 grid gap-6 sm:grid-cols-2",
				children: skills.map((skill) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-baseline justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium text-fg",
						children: skill.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-xs tabular-nums text-muted",
						children: [skill.level, "%"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1.5 overflow-hidden rounded-full bg-bg-subtle",
					role: "progressbar",
					"aria-valuenow": skill.level,
					"aria-valuemin": 0,
					"aria-valuemax": 100,
					"aria-label": skill.name,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full bg-primary/85 transition-[width] duration-700 ease-out",
						style: { width: `${skill.level}%` }
					})
				})] }, skill.name))
			})]
		})
	});
}
function initials(name) {
	return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}
function Team() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "team",
		className: "section-pad",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-site",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-2xl text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.16em] text-accent",
						children: "Team"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "heading-section mt-3 text-3xl text-fg md:text-4xl text-balance",
						children: "People behind the systems"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-muted leading-relaxed",
						children: "A small senior team of product, engineering, design, and research— built to embed with yours."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: team.map((member) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "surface-card rounded-xl p-6 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							"aria-hidden": true,
							className: "mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full border border-border bg-bg-subtle font-medium tracking-tight text-fg",
							children: initials(member.name)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-medium text-fg",
							children: member.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-accent",
							children: member.role
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-muted",
							children: member.bio
						})
					]
				}, member.name))
			})]
		})
	});
}
function Testimonials() {
	const [index, setIndex] = (0, import_react.useState)(0);
	const item = testimonials[index];
	const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
	const next = () => setIndex((i) => (i + 1) % testimonials.length);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "section-pad",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-site",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-3xl text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.16em] text-accent",
						children: "Testimonials"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
						className: "mt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "heading-section text-xl text-fg md:text-2xl leading-snug text-balance animate-in fade-in duration-300",
							children: [
								"“",
								item.quote,
								"”"
							]
						}, item.name), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
							className: "mt-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("cite", {
								className: "not-italic",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm font-medium text-fg",
									children: item.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 block text-sm text-muted",
									children: item.title
								})]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10 flex items-center justify-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: prev,
								className: "inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-bg-elevated text-fg transition-colors hover:border-border-strong",
								"aria-label": "Previous testimonial",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-1.5",
								role: "tablist",
								"aria-label": "Testimonials",
								children: testimonials.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									role: "tab",
									"aria-selected": i === index,
									"aria-label": `Show testimonial from ${t.name}`,
									onClick: () => setIndex(i),
									className: cn("h-2 w-2 rounded-full transition-colors", i === index ? "bg-primary" : "bg-border-strong")
								}, t.name))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: next,
								className: "inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-bg-elevated text-fg transition-colors hover:border-border-strong",
								"aria-label": "Next testimonial",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5" })
							})
						]
					})
				]
			})
		})
	});
}
function Work() {
	const [filter, setFilter] = (0, import_react.useState)("All");
	const items = (0, import_react.useMemo)(() => {
		if (filter === "All") return portfolio;
		return portfolio.filter((p) => p.category === filter);
	}, [filter]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "work",
		className: "section-pad border-t border-border bg-bg-elevated/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-site",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-[0.16em] text-accent",
							children: "Work"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "heading-section mt-3 text-3xl text-fg md:text-4xl text-balance",
							children: "Selected engagements"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-muted leading-relaxed",
							children: "A sample of products and systems we have designed and shipped with clients across ops, finance, and product teams."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					role: "tablist",
					"aria-label": "Filter portfolio",
					children: portfolioFilters.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": filter === f,
						onClick: () => setFilter(f),
						className: cn("h-10 rounded-full border px-4 text-sm transition-colors duration-150", filter === f ? "border-primary bg-primary text-primary-fg" : "border-border bg-bg text-muted hover:text-fg hover:border-border-strong"),
						children: f
					}, f))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "surface-card group flex flex-col rounded-xl p-6 transition-[border-color] duration-200 hover:border-border-strong",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-8 flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full border border-border bg-bg-subtle px-2.5 py-1 text-xs font-medium text-muted",
								children: item.category
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4 text-subtle transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-medium tracking-tight text-fg",
							children: item.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 flex-1 text-sm leading-relaxed text-muted",
							children: item.summary
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#contact",
							className: "mt-5 inline-flex text-sm font-medium text-fg underline-offset-4 hover:underline",
							children: "Discuss a similar project"
						})
					]
				}, item.id))
			})]
		})
	});
}
function HomePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(About, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skills, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Services, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Work, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Team, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pricing, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Testimonials, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contact, {})
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
	] });
}
//#endregion
export { HomePage as component };
