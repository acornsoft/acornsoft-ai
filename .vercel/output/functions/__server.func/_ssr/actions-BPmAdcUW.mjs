import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-BhPGP31R.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { ForbiddenOwnerError } from "./owner.server-vwLgDOQH.mjs";
import { clearOwnerSecret, getOwnerSecretStatus, setOwnerSecret, t as SECRET_X_API_BEARER } from "./store.server-B3qUBS8t.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/actions-BPmAdcUW.js
function mapError(err) {
	if (err instanceof ForbiddenOwnerError) throw err;
	if (err instanceof Error) throw err;
	throw new Error("Secret operation failed");
}
/** Owner-only: is X API Bearer configured? Never returns the secret. */
var getXApiBearerStatus_createServerFn_handler = createServerRpc({
	id: "81fb0976512525fa27716b2f96205a444f087498193595569d21032eaebbac92",
	name: "getXApiBearerStatus",
	filename: "src/lib/owner-secrets/actions.ts"
}, (opts) => getXApiBearerStatus.__executeServer(opts));
var getXApiBearerStatus = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getXApiBearerStatus_createServerFn_handler, async ({ context }) => {
	try {
		return await getOwnerSecretStatus(context.userId, SECRET_X_API_BEARER);
	} catch (e) {
		mapError(e);
	}
});
var setXApiBearerSecret_createServerFn_handler = createServerRpc({
	id: "c9869d159f97e97c2fe452feaf7065ed2c4112e0214875b3a9de42f15f797f99",
	name: "setXApiBearerSecret",
	filename: "src/lib/owner-secrets/actions.ts"
}, (opts) => setXApiBearerSecret.__executeServer(opts));
var setXApiBearerSecret = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(setXApiBearerSecret_createServerFn_handler, async ({ context, data }) => {
	try {
		const token = typeof data?.token === "string" ? data.token : "";
		return await setOwnerSecret(context.userId, SECRET_X_API_BEARER, token);
	} catch (e) {
		mapError(e);
	}
});
var clearXApiBearerSecret_createServerFn_handler = createServerRpc({
	id: "d1e2c98d66c5bf4f0e69fe1ba240601ae7652109b0ae78204729e8b21c40ea85",
	name: "clearXApiBearerSecret",
	filename: "src/lib/owner-secrets/actions.ts"
}, (opts) => clearXApiBearerSecret.__executeServer(opts));
var clearXApiBearerSecret = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(clearXApiBearerSecret_createServerFn_handler, async ({ context }) => {
	try {
		return await clearOwnerSecret(context.userId, SECRET_X_API_BEARER);
	} catch (e) {
		mapError(e);
	}
});
//#endregion
export { clearXApiBearerSecret_createServerFn_handler, getXApiBearerStatus_createServerFn_handler, setXApiBearerSecret_createServerFn_handler };
