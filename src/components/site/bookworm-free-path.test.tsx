import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { BookwormFreePath } from "./bookworm-free-path";
import { BOOKWORM_FREE_PATH_COPY, BOOKWORM_STARTER } from "./bookworm-starter";

const hidden = { ...BOOKWORM_STARTER, isPublic: false };
const shown = { ...BOOKWORM_STARTER, isPublic: true };

test("free path is absent when the starter repo is not public", () => {
  assert.equal(BOOKWORM_STARTER.isPublic, false);
  assert.equal(renderToStaticMarkup(<BookwormFreePath />), "");
  assert.equal(renderToStaticMarkup(<BookwormFreePath starter={hidden} />), "");
});

test("free path links to the starter repo when it is public", () => {
  const html = renderToStaticMarkup(<BookwormFreePath starter={shown} />);
  assert.match(html, new RegExp(BOOKWORM_FREE_PATH_COPY.kicker));
  assert.match(html, new RegExp(BOOKWORM_FREE_PATH_COPY.heading));
  assert.match(html, new RegExp(BOOKWORM_FREE_PATH_COPY.body));
  assert.match(html, new RegExp(`href="${BOOKWORM_STARTER.url}"`));
  assert.equal(html.includes(BOOKWORM_STARTER.url), true);
  assert.doesNotMatch(html, /gnomah|macroflow|speckit/i);
  assert.doesNotMatch(html, /coming soon/i);
});
