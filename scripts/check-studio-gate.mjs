/**
 * Same-origin path checks for sign-in return URLs.
 * Run: npm run check:studio-gate
 * (plain ESM — works on Node 20, no type-stripping flag)
 */
import assert from "node:assert/strict";
import {
  authOffAllowsOwner,
  destinationForSignIn,
  isSafeAppPath,
  workReturnTarget,
} from "../src/lib/auth/studio-path.mjs";

const slashTab = "/\t/evil.com";

assert.equal(isSafeAppPath(slashTab), false);
assert.equal(destinationForSignIn({ redirect: slashTab }), "/");
assert.equal(destinationForSignIn({ redirect: "//evil.com" }), "/");
assert.equal(destinationForSignIn({ redirect: "/\\evil.com" }), "/");
assert.equal(destinationForSignIn({ redirect: "/%2f%2fevil.com" }), "/");
assert.equal(destinationForSignIn({ redirect: "/%5Cevil.com" }), "/");
assert.equal(destinationForSignIn({ redirect: "/login" }), "/");
assert.equal(destinationForSignIn({ redirect: "/login?redirect=%2Fwork" }), "/");
assert.equal(destinationForSignIn({ redirect: "/climb-notes" }), "/climb-notes");
assert.equal(destinationForSignIn({ redirect: "/about?x=1" }), "/about?x=1");
assert.equal(destinationForSignIn({ redirect: "/work" }), "/work");
assert.equal(destinationForSignIn({ redirect: "/work/acadence" }), "/work/acadence");
assert.equal(
  destinationForSignIn({ redirect: "/work/acadence?x=1" }),
  "/work/acadence?x=1",
);
assert.equal(workReturnTarget("/work/acadence", "?x=1"), "/work/acadence?x=1");
assert.equal(workReturnTarget("/work/acadence", "?x=1&y=2"), "/work/acadence?x=1&y=2");
assert.equal(workReturnTarget("/work", ""), "/work");
assert.equal(workReturnTarget("/work/acadence", "?x=%00"), "/work/acadence");
assert.equal(workReturnTarget("//evil.com", "?x=1"), "/work");
assert.equal(workReturnTarget("/work/../login", "?x=1"), "/work");
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
