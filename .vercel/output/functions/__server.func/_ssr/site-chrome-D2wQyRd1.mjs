import { o as __toESM } from "../_runtime.mjs";
import { R as require_react, g as Link, l as useRouterState, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, r as createServerFn, t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { i as signOut, t as authClient } from "./client-Bm2YFrbd.mjs";
import { t as authMiddleware } from "./middleware-BhPGP31R.mjs";
import { t as Logo } from "./logo-DJM2TaXM.mjs";
import { i as LogIn, r as LogOut } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-chrome-D2wQyRd1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled (default) -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Top-bar auth control — standard Log in / account chip.
* Sign-in lives on Climb Notes (and login → Gnomah). X is chosen on the login page.
*/
function SiteAuthSlot({ loginRedirect = "/gnomah", className = "" }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `ac-auth-slot ac-auth-slot-pending ${className}`.trim(),
		"aria-hidden": true
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/login",
		search: { redirect: loginRedirect },
		className: `ac-auth-slot ac-auth-signin ${className}`.trim(),
		"aria-label": "Log in",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, {
			className: "ac-auth-signin-icon",
			"aria-hidden": true,
			strokeWidth: 2.25
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "ac-auth-signin-label",
			children: "Log in"
		})]
	});
	const label = user.displayName ?? "Account";
	const handleLike = label && !label.includes(" ") && label.length <= 20 ? label.startsWith("@") ? label : `@${label}` : label;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `ac-auth-slot ac-auth-user ${className}`.trim(),
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "ac-auth-avatar",
				width: 28,
				height: 28
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ac-auth-avatar ac-auth-avatar-fallback",
				"aria-hidden": true,
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ac-auth-name",
				title: label,
				children: handleLike
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "ac-auth-signout",
				onClick: () => void signOut("/"),
				"aria-label": "Log out",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
					className: "ac-auth-signout-icon",
					"aria-hidden": true,
					strokeWidth: 2.25
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ac-auth-signout-label",
					children: "Log out"
				})]
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/**
* Voice is only offered when the signed-in user has a linked X account.
* External Voice URL is public, but site CTAs stay gated to that identity.
*/
var getVoiceAccess = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("173f781521e925d7a6d252b2969f72e90ccefa6e1628514f8c4a1a5c36e3fcef"));
/** Grok Voice entry point — only offered when signed in with X. */
var VOICE_URL = "https://grok.x.ai/";
/** Primary signed-in label for Voice / open state. */
var VOICE_OPEN_LABEL = "ACORNSOFT is OPEN";
function useVoiceAccessState() {
	const { user, isPending: sessionPending } = useCurrentUserState();
	const [allowed, setAllowed] = (0, import_react.useState)(false);
	const [checking, setChecking] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (sessionPending) return;
		if (!user) {
			setAllowed(false);
			setChecking(false);
			return;
		}
		if (user.isDevFallback) {
			setAllowed(true);
			setChecking(false);
			return;
		}
		let cancelled = false;
		setChecking(true);
		getVoiceAccess().then((r) => {
			if (!cancelled) setAllowed(Boolean(r.allowed));
		}).catch(() => {
			if (!cancelled) setAllowed(false);
		}).finally(() => {
			if (!cancelled) setChecking(false);
		});
		return () => {
			cancelled = true;
		};
	}, [user, sessionPending]);
	return {
		allowed,
		isPending: sessionPending || checking,
		signedIn: Boolean(user)
	};
}
/** External Voice control — renders nothing unless signed in with X. */
function VoiceLink({ className, children = VOICE_OPEN_LABEL, style, onClick }) {
	const { allowed, isPending } = useVoiceAccessState();
	if (isPending || !allowed) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		className,
		href: VOICE_URL,
		target: "_blank",
		rel: "noopener noreferrer",
		style,
		onClick,
		children
	});
}
/**
* Voice CTA — only when signed in with X.
* Signed out: renders nothing (no "Sign in for Voice" tease).
* Signed in: "ACORNSOFT is OPEN" → Voice.
*/
function VoiceCta({ className = "rn-btn", label = VOICE_OPEN_LABEL, outline = false }) {
	const { allowed, isPending } = useVoiceAccessState();
	const cls = outline ? `${className} ac-btn-outline` : className;
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `${cls} ac-voice-pending`,
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "…" })
	});
	if (!allowed) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		className: `${cls} ac-voice-open`.trim(),
		href: VOICE_URL,
		target: "_blank",
		rel: "noopener noreferrer",
		"aria-label": `${VOICE_OPEN_LABEL} — open Voice`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })
	});
}
/** Compact header control: "ACORNSOFT is OPEN" when X session allows Voice. */
function VoiceHeaderButton({ className = "rn-btn d-none d-md-inline-flex ac-voice-open" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceLink, {
		className,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: VOICE_OPEN_LABEL })
	});
}
/** Top-level primary nav — one route per menu item (multi-page IA). */
var primaryNav = [
	{
		to: "/",
		label: "Home"
	},
	{
		to: "/about",
		label: "About"
	},
	{
		to: "/service",
		label: "Service"
	},
	{
		to: "/climb-notes",
		label: "Climb Notes"
	},
	{
		to: "/canopy",
		label: "Canopy"
	}
];
function useActivePath() {
	return useRouterState({ select: (s) => s.location.pathname });
}
function isActivePath(pathname, to) {
	if (to === "/") return pathname === "/";
	return pathname === to || pathname.startsWith(`${to}/`);
}
/** Gnomah + Log in appear only on Climb Notes. */
function useIsClimbNotesPage() {
	const pathname = useActivePath();
	return pathname === "/climb-notes" || pathname.startsWith("/climb-notes/");
}
function NavLinks({ onNavigate, mobile = false, showGnomah = false }) {
	const pathname = useActivePath();
	const voice = useVoiceAccessState();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		primaryNav.map((item) => {
			const active = isActivePath(pathname, item.to);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "ac-nav-item",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					className: [
						"ac-nav-link",
						mobile ? "ac-nav-link--mobile" : "",
						active ? "is-active" : ""
					].filter(Boolean).join(" "),
					to: item.to,
					onClick: onNavigate,
					"aria-current": active ? "page" : void 0,
					children: item.label
				})
			}, item.to);
		}),
		showGnomah ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
			className: "ac-nav-item",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				className: [
					"ac-nav-link",
					mobile ? "ac-nav-link--mobile" : "",
					isActivePath(pathname, "/gnomah") ? "is-active" : ""
				].filter(Boolean).join(" "),
				to: "/gnomah",
				onClick: onNavigate,
				"aria-current": isActivePath(pathname, "/gnomah") ? "page" : void 0,
				children: "Gnomah"
			})
		}) : null,
		mobile && voice.allowed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
			className: "ac-nav-item",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceLink, {
				className: "ac-nav-link ac-nav-link--mobile ac-voice-open",
				onClick: onNavigate,
				children: "ACORNSOFT is OPEN"
			})
		}) : null
	] });
}
/**
* Shared sticky header + mobile drawer — same look on every page.
* Log in + Gnomah only render on Climb Notes.
*/
function SiteHeader({ loginRedirect = "/gnomah" }) {
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	const isClimbNotes = useIsClimbNotesPage();
	const { user, isPending } = useCurrentUserState();
	/** Gnomah nav: Climb Notes only, and only after sign-in. */
	const showGnomah = isClimbNotes && !isPending && !!user;
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrolled(window.scrollY > 12);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	(0, import_react.useEffect)(() => {
		document.body.style.overflow = menuOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [menuOpen]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: `ac-site-header${scrolled || menuOpen ? " is-scrolled" : ""}${menuOpen ? " is-menu-open" : ""}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ac-site-header-inner",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ac-site-brand",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "ac-site-logo",
						onClick: () => setMenuOpen(false),
						"aria-label": "Acornsoft home",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "ac-site-nav ac-site-nav--desktop",
					"aria-label": "Primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "ac-site-nav-list",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, { showGnomah })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ac-site-actions",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceHeaderButton, { className: "rn-btn ac-voice-open ac-site-voice-btn ac-site-voice-btn--desktop" }),
						isClimbNotes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteAuthSlot, { loginRedirect }) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "ac-menu-text ac-site-menu-btn",
							"aria-label": menuOpen ? "Close menu" : "Open menu",
							"aria-expanded": menuOpen,
							"aria-controls": "ac-mobile-panel",
							onClick: () => setMenuOpen((v) => !v),
							children: menuOpen ? "Close" : "Menu"
						})
					]
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: "ac-mobile-panel",
		className: `ac-mobile-panel${menuOpen ? " is-open" : ""}`,
		"aria-hidden": !menuOpen,
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Site menu",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "ac-mobile-panel-backdrop",
			"aria-label": "Close menu",
			tabIndex: menuOpen ? 0 : -1,
			onClick: () => setMenuOpen(false)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ac-mobile-panel-inner",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ac-mobile-panel-head",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						className: "ac-site-logo",
						to: "/",
						onClick: () => setMenuOpen(false),
						"aria-label": "Acornsoft home",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "ac-menu-text",
						onClick: () => setMenuOpen(false),
						children: "Close"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					"aria-label": "Mobile primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "ac-site-nav-list ac-site-nav-list--mobile",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, {
							mobile: true,
							showGnomah,
							onNavigate: () => setMenuOpen(false)
						})
					})
				}),
				isClimbNotes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ac-mobile-panel-foot",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteAuthSlot, { loginRedirect })
				}) : null
			]
		})]
	})] });
}
/** Page shell: shared header + main + footer. */
function SiteChrome({ children, loginRedirect = "/gnomah", mainClassName = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "template-color-1 spybody ac-inbio ac-hero-stage",
		"data-spy": "scroll",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { loginRedirect }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: `page-wrapper-two ac-hero-stage-main ${mainClassName}`.trim(),
			children
		})]
	});
}
//#endregion
export { createSsrRpc as a, VoiceLink as i, SiteHeader as n, useCurrentUserState as o, VoiceCta as r, useVoiceAccessState as s, SiteChrome as t };
