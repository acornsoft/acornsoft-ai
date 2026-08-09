import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-BhPGP31R.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/voice-access-DBxRwOLK.js
/**
* Voice is only offered when the signed-in user has a linked X account.
* External Voice URL is public, but site CTAs stay gated to that identity.
*/
var getVoiceAccess_createServerFn_handler = createServerRpc({
	id: "173f781521e925d7a6d252b2969f72e90ccefa6e1628514f8c4a1a5c36e3fcef",
	name: "getVoiceAccess",
	filename: "src/lib/auth/voice-access.ts"
}, (opts) => getVoiceAccess.__executeServer(opts));
var getVoiceAccess = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getVoiceAccess_createServerFn_handler, async ({ context }) => {
	const { isXProvider } = await import("./owner.server-vwLgDOQH.mjs");
	const { authConfigured, DEV_USER_ID } = await import("./verify.server-CkjR2gyT.mjs").then((n) => n.t).then((n) => n.n);
	const { getSql } = await import("./db-cbgaf9gY.mjs").then((n) => n.t).then((n) => n.t);
	if (!authConfigured && context.userId === DEV_USER_ID) return {
		allowed: true,
		viaX: false
	};
	const viaX = (await (await getSql())`
      select "providerId" as "providerId"
      from account
      where "userId" = ${context.userId}
    `).some((a) => isXProvider(a.providerId));
	return {
		allowed: viaX,
		viaX
	};
});
//#endregion
export { getVoiceAccess_createServerFn_handler };
