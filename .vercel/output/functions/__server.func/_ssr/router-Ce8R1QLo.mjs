import { o as __toESM } from "../_runtime.mjs";
import { M as redirect, R as require_react, c as HeadContent, d as createRouter, f as Outlet, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as auth } from "./server-ilFhfuWJ.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$13 } from "./login-D31xP1MR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Ce8R1QLo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
/**
* Fixed lower-right “scroll to top” (desktop only).
* Footer is not present — sits in the corner with no footer clearance.
*/
function ScrollToTop() {
	const [visible, setVisible] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const onScroll = () => {
			const y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
			setVisible(y > 320);
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	if (!visible) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "ac-scroll-top",
		"aria-label": "Scroll to top",
		title: "Scroll to top",
		style: {
			position: "fixed",
			right: 24,
			bottom: 24,
			left: "auto",
			top: "auto",
			zIndex: 1300
		},
		onClick: () => {
			window.scrollTo({
				top: 0,
				behavior: "smooth"
			});
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			width: "20",
			height: "20",
			viewBox: "0 0 24 24",
			fill: "none",
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M12 5l-7 7h4.5v7h5v-7H19l-7-7z",
				fill: "currentColor"
			})
		})
	});
}
var styles_default = "/assets/styles-BxZ3JfGm.css";
var inbioCss = [
	"/inbio/assets/css/vendor/bootstrap.min.css",
	"/inbio/assets/css/vendor/slick.css",
	"/inbio/assets/css/vendor/slick-theme.css",
	"/inbio/assets/css/vendor/aos.css",
	"/inbio/assets/css/plugins/feature.css",
	"/inbio/assets/css/style.css",
	"/inbio/acornsoft-overrides.css?v=scroll-right-1"
];
var Route$12 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Acornsoft — Building Production AI Solutions via Climb Notes" },
			{
				name: "description",
				content: "Acornsoft: Building Production AI Solutions via Climb Notes—on Grok Build, Imagine, Voice, Agents, Skills, and Connectors."
			},
			{
				name: "theme-color",
				content: "#502000"
			},
			{
				property: "og:title",
				content: "Acornsoft"
			},
			{
				property: "og:description",
				content: "Building Production AI Solutions via Climb Notes."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "icon",
				href: "/favicon.png",
				type: "image/png"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap"
			},
			...inbioCss.map((href) => ({
				rel: "stylesheet",
				href
			}))
		]
	}),
	component: RootComponent,
	shellComponent: RootDocument
});
function RootComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollToTop, {})] });
}
function RootDocument({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "template-color-1 spybody ac-has-global-hero",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ac-global-hero",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ac-global-hero-photo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ac-global-hero-wash" })]
				}),
				children,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
					position: "top-center",
					richColors: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$6 = () => import("./routes-DM56Mz4h.mjs");
var Route$11 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./about-Cmo8-svs.mjs");
var Route$10 = createFileRoute("/about")({
	component: lazyRouteComponent($$splitComponentImporter$5, "component"),
	head: () => ({ meta: [{ title: "About — Acornsoft" }, {
		name: "description",
		content: "Acornsoft is a New York studio building production AI via Climb Notes™—vision, first principles, and charter."
	}] })
});
var $$splitComponentImporter$4 = () => import("./canopy-D17x-yDo.mjs");
var Route$9 = createFileRoute("/canopy")({
	component: lazyRouteComponent($$splitComponentImporter$4, "component"),
	head: () => ({ meta: [{ title: "Canopy — Acornsoft Grok & xAI Radar" }, {
		name: "description",
		content: "Canopy is Acornsoft’s Grok and xAI radar—timeline from xAI’s founding through the latest X feednotes."
	}] })
});
var $$splitComponentImporter$3 = () => import("./climb-notes-BjfVTvEP.mjs");
var Route$8 = createFileRoute("/climb-notes")({
	component: lazyRouteComponent($$splitComponentImporter$3, "component"),
	head: () => ({ meta: [{ title: "Climb Notes™ — Acornsoft Studio Journal" }, {
		name: "description",
		content: "Climb Notes™ is Acornsoft’s studio journal—how we scope, ship, and harden production AI. Separate from Canopy, our Grok / xAI radar."
	}] })
});
var $$splitComponentImporter$2 = () => import("./corporate-D-zhfmKT.mjs");
var Route$7 = createFileRoute("/corporate")({
	component: lazyRouteComponent($$splitComponentImporter$2, "component"),
	head: () => ({ meta: [{ title: "Corporate — Acornsoft" }, {
		name: "description",
		content: "Acornsoft corporate ethos: Privacy, Policies, and Procedures in one place."
	}] })
});
var $$splitComponentImporter$1 = () => import("./gnomah-DhB-ANnM.mjs");
var Route$6 = createFileRoute("/gnomah")({
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	head: () => ({ meta: [
		{ title: "Gnomah — Climb Notes Editor · Acornsoft" },
		{
			name: "description",
			content: "Gnomah is the owner-only Climb Notes editor for Acornsoft. Sign in with X as @acornsoftai."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] })
});
var Route$5 = createFileRoute("/policies")({ beforeLoad: () => {
	throw redirect({
		to: "/corporate",
		hash: "policies"
	});
} });
var Route$4 = createFileRoute("/privacy")({ beforeLoad: () => {
	throw redirect({
		to: "/corporate",
		hash: "privacy"
	});
} });
var Route$3 = createFileRoute("/procedures")({ beforeLoad: () => {
	throw redirect({
		to: "/corporate",
		hash: "procedures"
	});
} });
var $$splitComponentImporter = () => import("./service-eNpWJlAI.mjs");
var Route$2 = createFileRoute("/service")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({ meta: [{ title: "Services — Acornsoft" }, {
		name: "description",
		content: "Acornsoft services: AI strategy, product build, model systems, trust and safety, automation, and delivery via Climb Notes™."
	}] })
});
var Route$1 = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
/**
* Canopy Radar interests — pure TS module (no JSON) so Nitro always bundles it.
* Priority: @acornsoftai → Grok Build → Imagine → Voice → Elon orgs.
*/
var interestsConfig = {
	scheduleMinutes: 60,
	maxResultsPerQuery: 25,
	subscriptions: [{
		id: "radar-acornsoftai",
		username: "acornsoftai",
		actor: "acornsoft",
		kind: "feednote",
		maxResults: 40,
		label: "Acornsoft Radar",
		standout: true
	}],
	queries: [
		{
			id: "grok-build",
			actor: "build",
			kind: "changelog",
			query: "(\"Grok Build\" OR GrokBuild) (from:elonmusk OR from:xai OR from:XFreeze OR from:SpaceXAI) (changelog OR release OR update OR CLI OR workflow OR plugin OR agent OR v0. OR publish)"
		},
		{
			id: "imagine",
			actor: "xai",
			kind: "feednote",
			query: "(from:elonmusk OR from:xai OR from:SpaceXAI) (\"Grok Imagine\" OR Imagine) (image OR video OR template OR edit OR restyle OR creative OR emoji OR merch OR render)"
		},
		{
			id: "voice",
			actor: "xai",
			kind: "feednote",
			query: "(from:elonmusk OR from:xai OR from:SpaceXAI) (\"Grok Voice\" OR \"Think Fast\" OR Voice) (agent OR speech OR audio OR dictation OR builder OR telephony OR Tau)"
		},
		{
			id: "org-xai",
			actor: "xai",
			kind: "feednote",
			query: "(from:elonmusk OR from:xai OR from:SpaceXAI) (Grok OR xAI OR SpaceXAI OR Colossus OR model)"
		},
		{
			id: "org-spacex",
			actor: "spacex",
			kind: "feednote",
			query: "(from:SpaceX OR from:elonmusk) (Starship OR Falcon OR Starlink OR launch OR recover OR Raptor OR Dragon)"
		},
		{
			id: "org-tesla",
			actor: "tesla",
			kind: "feednote",
			query: "(from:Tesla OR from:elonmusk OR from:Tesla_AI) (Optimus OR Tesla OR Supercharger OR FSD OR robotaxi OR Cybertruck OR energy)"
		}
	]
};
var DEFAULT_INTERESTS = interestsConfig;
function formatDate(iso) {
	try {
		return new Date(iso).toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
			timeZone: "UTC"
		});
	} catch {
		return iso.slice(0, 10);
	}
}
function titleFromText(text) {
	const clean = text.replace(/\s+/g, " ").trim();
	const first = clean.split(/(?<=[.!?])\s+/)[0] || clean;
	return first.length > 90 ? `${first.slice(0, 87)}…` : first;
}
function bodyFromText(text) {
	const clean = text.replace(/\s+/g, " ").trim();
	return clean.length > 320 ? `${clean.slice(0, 317)}…` : clean;
}
function mapTweet(tweet, users, interest) {
	const user = tweet.author_id ? users.get(tweet.author_id) : void 0;
	const username = user?.username ? `@${user.username}` : interest.id;
	const created = tweet.created_at || (/* @__PURE__ */ new Date()).toISOString();
	let actor = interest.actor;
	let kind = interest.kind;
	if (username.toLowerCase() === "@acornsoftai") {
		actor = "acornsoft";
		kind = "feednote";
	}
	return {
		id: `live-x-${tweet.id}`,
		date: formatDate(created),
		sortKey: created,
		title: titleFromText(tweet.text),
		body: bodyFromText(tweet.text),
		kind,
		actor,
		source: username,
		href: user?.username ? `https://x.com/${user.username}/status/${tweet.id}` : `https://x.com/i/web/status/${tweet.id}`,
		xId: tweet.id,
		live: true
	};
}
async function searchRecent(bearer, query, maxResults) {
	const url = new URL("https://api.x.com/2/tweets/search/recent");
	url.searchParams.set("query", `${query} -is:retweet lang:en`);
	url.searchParams.set("max_results", String(Math.min(Math.max(maxResults, 10), 100)));
	url.searchParams.set("tweet.fields", "created_at,author_id,lang");
	url.searchParams.set("expansions", "author_id");
	url.searchParams.set("user.fields", "username,name");
	const res = await fetch(url, { headers: { Authorization: `Bearer ${bearer}` } });
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`X API ${res.status}: ${text.slice(0, 240)}`);
	}
	const json = await res.json();
	return {
		tweets: json.data ?? [],
		users: json.includes?.users ?? []
	};
}
async function resolveUserId(bearer, username) {
	const url = new URL(`https://api.x.com/2/users/by/username/${encodeURIComponent(username)}`);
	const res = await fetch(url, { headers: { Authorization: `Bearer ${bearer}` } });
	if (!res.ok) throw new Error(`User lookup ${res.status}`);
	const json = await res.json();
	if (!json.data?.id) throw new Error(`User not found: @${username}`);
	return json.data.id;
}
async function userTimeline(bearer, userId, maxResults) {
	const url = new URL(`https://api.x.com/2/users/${userId}/tweets`);
	url.searchParams.set("max_results", String(Math.min(Math.max(maxResults, 5), 100)));
	url.searchParams.set("tweet.fields", "created_at,author_id,lang");
	url.searchParams.set("exclude", "retweets,replies");
	const res = await fetch(url, { headers: { Authorization: `Bearer ${bearer}` } });
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Timeline ${res.status}: ${text.slice(0, 200)}`);
	}
	return (await res.json()).data ?? [];
}
function getBearerTokenFromEnv() {
	return (process.env.X_BEARER_TOKEN || process.env.TWITTER_BEARER_TOKEN || process.env.X_API_BEARER)?.trim() || void 0;
}
/**
* Env first, then owner-encrypted preference (profile).
* Server-only; never expose the return value to clients.
*/
async function resolveBearerForFetch() {
	const env = getBearerTokenFromEnv();
	if (env) return {
		token: env,
		source: "env"
	};
	try {
		const { resolveXBearerForCanopy } = await import("./store.server-B3qUBS8t.mjs");
		return await resolveXBearerForCanopy();
	} catch {
		return { source: "none" };
	}
}
async function fetchLiveFeedFromX(interests = DEFAULT_INTERESTS) {
	const bearer = (await resolveBearerForFetch()).token;
	if (!bearer) return {
		updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		source: "empty",
		scheduleMinutes: interests.scheduleMinutes,
		entryCount: 0,
		error: "Missing X API Bearer. Owner: sign in and save it under Gnomah → Private preferences, or set X_BEARER_TOKEN on the host.",
		entries: []
	};
	const byId = /* @__PURE__ */ new Map();
	const errors = [];
	for (const sub of interests.subscriptions ?? []) try {
		const username = sub.username.replace(/^@/, "");
		const userId = await resolveUserId(bearer, username);
		const tweets = await userTimeline(bearer, userId, sub.maxResults ?? interests.maxResultsPerQuery);
		const userMap = /* @__PURE__ */ new Map([[userId, {
			id: userId,
			username
		}]]);
		for (const tweet of tweets) {
			const entry = mapTweet(tweet, userMap, {
				id: sub.id,
				actor: sub.actor,
				kind: sub.kind,
				query: `from:${username}`
			});
			entry.standout = sub.standout ?? entry.standout;
			entry.source = `@${username}`;
			entry.href = `https://x.com/${username}/status/${tweet.id}`;
			byId.set(entry.id, entry);
		}
		await new Promise((r) => setTimeout(r, 350));
	} catch (e) {
		errors.push(`sub:${sub.username}: ${e instanceof Error ? e.message : String(e)}`);
	}
	for (const interest of interests.queries) try {
		const { tweets, users } = await searchRecent(bearer, interest.query, interests.maxResultsPerQuery);
		const userMap = new Map(users.map((u) => [u.id, u]));
		for (const tweet of tweets) {
			const entry = mapTweet(tweet, userMap, interest);
			byId.set(entry.id, entry);
		}
		await new Promise((r) => setTimeout(r, 350));
	} catch (e) {
		errors.push(`${interest.id}: ${e instanceof Error ? e.message : String(e)}`);
	}
	const entries = [...byId.values()].sort((a, b) => b.sortKey.localeCompare(a.sortKey));
	return {
		updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		source: errors.length && entries.length === 0 ? "error" : "x-api-v2",
		scheduleMinutes: interests.scheduleMinutes,
		entryCount: entries.length,
		error: errors.length ? errors.join(" | ") : void 0,
		entries
	};
}
/**
* Scheduled / manual live feed refresh.
*
* POST /api/canopy/refresh
* Authorization: Bearer <CRON_SECRET>   (required if CRON_SECRET is set)
*
* Returns LiveFeedFile JSON. When X_BEARER_TOKEN is set, pulls X recent search.
* Optional write to disk is only for long-lived hosts (local / VM); Vercel is
* read-mostly — prefer cron that writes public/canopy/live-feed.json via CI.
*/
var globalCache = globalThis;
var interests = interestsConfig;
function authorized(request) {
	const secret = process.env.CRON_SECRET?.trim();
	if (!secret) return true;
	const header = request.headers.get("authorization") || "";
	const token = header.startsWith("Bearer ") ? header.slice(7) : "";
	const alt = request.headers.get("x-cron-secret") || "";
	return token === secret || alt === secret;
}
async function handle(request) {
	if (request.method !== "POST" && request.method !== "GET") return new Response("Method not allowed", { status: 405 });
	if (!authorized(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
	const force = request.method === "POST" || new URL(request.url).searchParams.get("force") === "1";
	const scheduleMs = (interests.scheduleMinutes ?? 60) * 60 * 1e3;
	const cached = globalCache.__canopyLiveFeed__;
	if (!force && cached && Date.now() - cached.at < scheduleMs && cached.data.entries.length > 0) return Response.json({
		...cached.data,
		source: "cache"
	});
	const data = await fetchLiveFeedFromX(interests);
	globalCache.__canopyLiveFeed__ = {
		at: Date.now(),
		data
	};
	try {
		const { writeFile, mkdir } = await import("node:fs/promises");
		const { join } = await import("node:path");
		const out = join(process.cwd(), "public", "canopy", "live-feed.json");
		await mkdir(join(process.cwd(), "public", "canopy"), { recursive: true });
		await writeFile(out, JSON.stringify(data, null, 2) + "\n", "utf8");
	} catch {}
	return Response.json(data);
}
var Route = createFileRoute("/api/canopy/refresh")({ server: { handlers: {
	GET: async ({ request }) => handle(request),
	POST: async ({ request }) => handle(request)
} } });
var rootRouteChildren = {
	IndexRoute: Route$11.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$12
	}),
	AboutRoute: Route$10.update({
		id: "/about",
		path: "/about",
		getParentRoute: () => Route$12
	}),
	CanopyRoute: Route$9.update({
		id: "/canopy",
		path: "/canopy",
		getParentRoute: () => Route$12
	}),
	ClimbNotesRoute: Route$8.update({
		id: "/climb-notes",
		path: "/climb-notes",
		getParentRoute: () => Route$12
	}),
	CorporateRoute: Route$7.update({
		id: "/corporate",
		path: "/corporate",
		getParentRoute: () => Route$12
	}),
	GnomahRoute: Route$6.update({
		id: "/gnomah",
		path: "/gnomah",
		getParentRoute: () => Route$12
	}),
	LoginRoute: Route$13.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$12
	}),
	PoliciesRoute: Route$5.update({
		id: "/policies",
		path: "/policies",
		getParentRoute: () => Route$12
	}),
	PrivacyRoute: Route$4.update({
		id: "/privacy",
		path: "/privacy",
		getParentRoute: () => Route$12
	}),
	ProceduresRoute: Route$3.update({
		id: "/procedures",
		path: "/procedures",
		getParentRoute: () => Route$12
	}),
	ServiceRoute: Route$2.update({
		id: "/service",
		path: "/service",
		getParentRoute: () => Route$12
	}),
	ApiAuthSplatRoute: Route$1.update({
		id: "/api/auth/$",
		path: "/api/auth/$",
		getParentRoute: () => Route$12
	}),
	ApiCanopyRefreshRoute: Route.update({
		id: "/api/canopy/refresh",
		path: "/api/canopy/refresh",
		getParentRoute: () => Route$12
	})
};
var routeTree = Route$12._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: "intent"
	});
}
//#endregion
export { getRouter };
