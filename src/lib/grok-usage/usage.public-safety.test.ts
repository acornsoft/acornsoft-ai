import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { GrokUsageFile } from "./types";

const usagePath = resolve(process.cwd(), "public/grok-usage/usage.json");
const pagePath = resolve(process.cwd(), "src/components/site/grok-usage-page.tsx");
const scriptPath = resolve(process.cwd(), "scripts/build-grok-usage.mjs");

/** Names and private fields that must never appear in the public snapshot or page. */
const FORBIDDEN =
  /\b(Gnomah|MacroFlow|PAARS|Avanade|Accenture|ESL|Zubil)\b|\$\d|weekly limit|\bcredits?\b/i;

describe("public grok usage snapshot", () => {
  const raw = readFileSync(usagePath, "utf8");
  const usage = JSON.parse(raw) as GrokUsageFile;

  it("has the expected schema", () => {
    expect(typeof usage.updatedAt).toBe("string");
    expect(usage.updatedAt.length).toBeGreaterThan(0);
    expect(typeof usage.periodLabel).toBe("string");
    expect(Array.isArray(usage.byBot)).toBe(true);
    expect(usage.byBot.length).toBeGreaterThan(0);
    for (const bot of usage.byBot) {
      expect(typeof bot.label).toBe("string");
      expect(typeof bot.role).toBe("string");
      expect(typeof bot.share).toBe("number");
    }
    expect(typeof usage.byActivity.chats).toBe("number");
    expect(typeof usage.byActivity.routines).toBe("number");
    expect(typeof usage.byActivity.botToBot).toBe("number");
    expect(typeof usage.byActivity.group).toBe("number");
    expect(Array.isArray(usage.daily)).toBe(true);
    expect(usage.daily.length).toBeGreaterThan(0);
    for (const day of usage.daily) {
      expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(typeof day.total).toBe("number");
    }
    expect(typeof usage.counts.namedBots).toBe("number");
  });

  it("keeps work bots by name and folds the personal assistant", () => {
    const labels = usage.byBot.map((b) => b.label);
    expect(labels).toEqual(
      expect.arrayContaining([
        "William",
        "Zorst",
        "Optimus",
        "Bookworm",
        "Sunlight",
        "Ted",
        "Acadence",
        "Climb Notes",
        "Climb Notes Supervisor",
        "Archie",
        "Kyle",
        "Personal assistant",
      ]),
    );
    expect(labels).not.toContain("Zubil");
    expect(usage.counts.namedBots).toBe(
      usage.byBot.filter((b) => b.label !== "Personal assistant" && b.label !== "Other").length,
    );
  });

  it("contains no private or forbidden terms", () => {
    expect(raw).not.toMatch(FORBIDDEN);
    expect(readFileSync(pagePath, "utf8")).not.toMatch(FORBIDDEN);
    // The converter may mention forbidden names only as filters to strip them.
    const script = readFileSync(scriptPath, "utf8");
    const publicLiteral = script.match(/label:\s*"([^"]+)"/g) ?? [];
    for (const lit of publicLiteral) {
      expect(lit).not.toMatch(FORBIDDEN);
    }
  });
});
