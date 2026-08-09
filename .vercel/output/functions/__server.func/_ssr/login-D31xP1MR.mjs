import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-D31xP1MR.js
var $$splitComponentImporter = () => import("./login-DHKV0Bxz.mjs");
var Route = createFileRoute("/login")({
	validateSearch: (s) => ({ redirect: typeof s.redirect === "string" ? s.redirect : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({ meta: [{ title: "Sign in — Acornsoft" }, {
		name: "description",
		content: "Sign in to Acornsoft with X. Gnomah Climb Notes editing is reserved for the owner."
	}] })
});
//#endregion
export { Route as t };
