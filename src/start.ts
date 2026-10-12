import {
  createCsrfMiddleware,
  createMiddleware,
  createStart,
} from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";

/**
 * Same CSRF gate the default start entry installs. A custom start entry
 * replaces that default, so this has to stay.
 */
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

/**
 * Legacy studio URLs are redirected here, before the router canonicalizes
 * trailing slashes and search params. That canonical hop would otherwise
 * put the old path in Location.
 */
const legacyStudioMiddleware = createMiddleware({ type: "request" }).server(
  async ({ next, pathname, request }) => {
    const { legacyStudioDestination } = await import(
      "./lib/auth/studio-gate.server"
    );
    const dest = await legacyStudioDestination(pathname, request.url);
    if (dest) return redirect({ href: dest });
    return next();
  },
);

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware, legacyStudioMiddleware],
}));
