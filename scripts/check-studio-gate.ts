/**
 * Same-origin path checks for sign-in return URLs.
 * Run: node --experimental-strip-types scripts/check-studio-gate.ts
 */
import assert from "node:assert/strict";
import {
  authOffAllowsOwner,
  destinationForSignIn,
  isSafeAppPath,
} from "../src/lib/auth/studio-gate.server.ts";

const slashTab = "/\t/evil.com";

assert.equal(isSafeAppPath(slashTab), false);
assert.equal(destinationForSignIn({ redirect: slashTab }), "/");
assert.equal(destinationForSignIn({ redirect: "//evil.com" }), "/");
assert.equal(destinationForSignIn({ redirect: "/\\evil.com" }), "/");
assert.equal(destinationForSignIn({ redirect: "/%2f%2fevil.com" }), "/");
assert.equal(destinationForSignIn({ redirect: "/%5Cevil.com" }), "/");
assert.equal(destinationForSignIn({ redirect: "/climb-notes" }), "/climb-notes");
assert.equal(destinationForSignIn({ redirect: "/about?x=1" }), "/about?x=1");
assert.equal(destinationForSignIn({ next: "studio" }), "/studio");
assert.equal(destinationForSignIn({}), "/studio");
assert.equal(destinationForSignIn({ next: "other" }), "/");

const previous = process.env.NODE_ENV;
process.env.NODE_ENV = "production";
assert.equal(authOffAllowsOwner(), false);
process.env.NODE_ENV = "development";
assert.equal(authOffAllowsOwner(), true);
process.env.NODE_ENV = "test";
assert.equal(authOffAllowsOwner(), false);
if (previous === undefined) delete process.env.NODE_ENV;
else process.env.NODE_ENV = previous;

console.log("studio gate checks ok");
