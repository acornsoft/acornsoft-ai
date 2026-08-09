import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { ForbiddenOwnerError } from "@/lib/climb-notes/owner.server";
import {
  clearOwnerSecret,
  getOwnerSecretStatus,
  setOwnerSecret,
} from "./store.server";
import {
  SECRET_X_API_BEARER,
  type OwnerSecretStatus,
} from "./types";

function mapError(err: unknown): never {
  if (err instanceof ForbiddenOwnerError) {
    throw err;
  }
  if (err instanceof Error) throw err;
  throw new Error("Secret operation failed");
}

/** Owner-only: is X API Bearer configured? Never returns the secret. */
export const getXApiBearerStatus = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<OwnerSecretStatus> => {
    try {
      return await getOwnerSecretStatus(context.userId, SECRET_X_API_BEARER);
    } catch (e) {
      mapError(e);
    }
  });

/**
 * Owner-only: save X API Bearer. Body is accepted once, encrypted, discarded.
 * Response is status only (configured + last4) — never echoes the token.
 */
export const setXApiBearerSecret = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { token?: string }) => data)
  .handler(async ({ context, data }): Promise<OwnerSecretStatus> => {
    try {
      const token = typeof data?.token === "string" ? data.token : "";
      return await setOwnerSecret(
        context.userId,
        SECRET_X_API_BEARER,
        token,
      );
    } catch (e) {
      mapError(e);
    }
  });

/** Owner-only: wipe stored Bearer. Irreversible. */
export const clearXApiBearerSecret = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<OwnerSecretStatus> => {
    try {
      return await clearOwnerSecret(context.userId, SECRET_X_API_BEARER);
    } catch (e) {
      mapError(e);
    }
  });
