import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/logo-DJM2TaXM.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Official Acornsoft logo (green tree + gold ACORNSOFT wordmark).
* Sizing is controlled by CSS (responsive clamp) — keep width/height intrinsic.
*/
function Logo({ className, variant = "wordmark", title = "Acornsoft" }) {
	if (variant === "mark") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: "/logo-mark.png",
		alt: title,
		className,
		width: 48,
		height: 48,
		decoding: "async"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: "/Acornsoft-logo.png",
		alt: title,
		className,
		width: 246,
		height: 57,
		decoding: "async",
		sizes: "(max-width: 380px) 120px, (max-width: 767px) 42vw, (max-width: 1200px) 18vw, 260px"
	});
}
//#endregion
export { Logo as t };
