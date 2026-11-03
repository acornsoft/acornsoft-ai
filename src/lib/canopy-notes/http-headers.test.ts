import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { canopyNoteHeaders, responseIsCacheHit } from "./http-headers";

describe("private note cache headers", () => {
  it("marks note responses private and unstorable", () => {
    const headers = canopyNoteHeaders();
    expect(headers["Cache-Control"]).toBe("private, no-store");
    expect(headers["CDN-Cache-Control"]).toBe("no-store");
    expect(headers["Vercel-CDN-Cache-Control"]).toBe("no-store");
    expect(headers["Cache-Control"]).not.toMatch(/public|max-age|s-maxage/i);
    expect(responseIsCacheHit(new Headers(headers))).toBe(false);
  });

  it("treats CDN hit markers and a positive age as a cache hit", () => {
    expect(responseIsCacheHit(new Headers({ "x-vercel-cache": "HIT" }))).toBe(true);
    expect(responseIsCacheHit(new Headers({ "x-vercel-cache": "hit" }))).toBe(true);
    expect(responseIsCacheHit(new Headers({ "cf-cache-status": "HIT" }))).toBe(true);
    expect(responseIsCacheHit(new Headers({ "x-cache": "Hit from cloud" }))).toBe(true);
    expect(responseIsCacheHit(new Headers({ age: "1" }))).toBe(true);
  });

  it("does not treat a miss, a zero age, or absent headers as a hit", () => {
    expect(responseIsCacheHit(new Headers({ "x-vercel-cache": "MISS" }))).toBe(false);
    expect(responseIsCacheHit(new Headers({ "cf-cache-status": "DYNAMIC" }))).toBe(false);
    expect(responseIsCacheHit(new Headers({ "x-cache": "MISS" }))).toBe(false);
    expect(responseIsCacheHit(new Headers({ age: "0" }))).toBe(false);
    expect(responseIsCacheHit(new Headers({ age: "" }))).toBe(false);
    expect(responseIsCacheHit(new Headers())).toBe(false);
  });

  it("is what the note routes send", () => {
    const list = readFileSync(join(process.cwd(), "src/routes/canopy.notes.tsx"), "utf8");
    const detail = readFileSync(
      join(process.cwd(), "src/routes/canopy.notes.$noteId.tsx"),
      "utf8",
    );
    for (const source of [list, detail]) {
      expect(source).toContain("canopyNoteHeaders()");
      expect(source).toContain("staleTime: 0");
    }
  });
});
