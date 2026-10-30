import { chromium, type Page } from "playwright";
import { describe, expect, it } from "vitest";

/**
 * Preview browser proof for two Google accounts.
 * Secrets stay in the environment. See docs/ops/canopy-access.md.
 * Missing names skip this file. They are not hard-coded.
 */
const REQUIRED_ENV = [
  "CANOPY_E2E_BASE_URL",
  "CANOPY_E2E_GOOGLE_A_EMAIL",
  "CANOPY_E2E_GOOGLE_A_PASSWORD",
  "CANOPY_E2E_GOOGLE_B_EMAIL",
  "CANOPY_E2E_GOOGLE_B_PASSWORD",
  "CANOPY_E2E_ALLOWLIST_NOTE_ID",
  "CANOPY_E2E_ACCOUNT_A_NOTE_ID",
  "CANOPY_E2E_ACCOUNT_B_NOTE_ID",
] as const;

function env(name: (typeof REQUIRED_ENV)[number]): string {
  return process.env[name]?.trim() ?? "";
}

function missingEnv(): string[] {
  return REQUIRED_ENV.filter((name) => env(name).length === 0);
}

async function signInWithGoogle(page: Page, email: string, secret: string): Promise<void> {
  const base = env("CANOPY_E2E_BASE_URL").replace(/\/$/, "");
  await page.goto(`${base}/login?redirect=${encodeURIComponent("/canopy/notes")}`, {
    waitUntil: "domcontentloaded",
  });
  const popupPromise = page.waitForEvent("popup", { timeout: 8000 }).catch(() => null);
  await page.getByRole("button", { name: "Continue with Google" }).click();
  const popup = await popupPromise;
  const target = popup ?? page;
  const emailBox = target.locator('input[type="email"]').first();
  await emailBox.waitFor({ state: "visible", timeout: 45000 });
  await emailBox.fill(email);
  const next = target.getByRole("button", { name: /^next$/i });
  if ((await next.count()) > 0) await next.first().click();
  const secretBox = target.locator('input[type="password"]').first();
  await secretBox.waitFor({ state: "visible", timeout: 45000 });
  await secretBox.fill(secret);
  const submit = target.getByRole("button", { name: /next|continue|sign in/i });
  await submit.first().click();
  await page.waitForURL((url) => url.pathname.startsWith("/canopy/notes"), {
    timeout: 90000,
  });
}

async function notePage(page: Page, noteId: string): Promise<{ status: number; text: string }> {
  const base = env("CANOPY_E2E_BASE_URL").replace(/\/$/, "");
  const response = await page.goto(`${base}/canopy/notes/${noteId}`, {
    waitUntil: "domcontentloaded",
  });
  const text = (await page.locator("body").innerText()).replace(/\s+/g, " ").trim();
  return { status: response?.status() ?? 0, text };
}

describe("canopy two-account Google login", () => {
  const missing = missingEnv();
  if (missing.length > 0) {
    it.skip(
      `signs in as A and as B on the preview (set ${missing.join(", ")})`,
      () => {},
    );
    return;
  }

  it(
    "signs in as A and as B and checks what each page shows",
    async () => {
      const base = env("CANOPY_E2E_BASE_URL").replace(/\/$/, "");
      const allow = env("CANOPY_E2E_ALLOWLIST_NOTE_ID");
      const mine = env("CANOPY_E2E_ACCOUNT_A_NOTE_ID");
      const theirs = env("CANOPY_E2E_ACCOUNT_B_NOTE_ID");
      const absent = "00000000-0000-4000-8000-000000000000";
      const browser = await chromium.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-dev-shm-usage"],
      });
      try {
        const contextA = await browser.newContext();
        const pageA = await contextA.newPage();
        await signInWithGoogle(pageA, env("CANOPY_E2E_GOOGLE_A_EMAIL"), env("CANOPY_E2E_GOOGLE_A_PASSWORD"));
        await pageA.goto(`${base}/canopy/notes`, { waitUntil: "domcontentloaded" });
        const listA = await pageA.content();
        expect(listA).toContain(allow);
        expect(listA).toContain(mine);
        expect(listA).not.toContain(theirs);
        const foreignA = await notePage(pageA, theirs);
        const missingA = await notePage(pageA, absent);
        expect(foreignA.status).toBe(404);
        expect(missingA.status).toBe(404);
        expect(foreignA.text).toContain("Not found");
        expect(foreignA.text).toBe(missingA.text);

        const contextB = await browser.newContext();
        const pageB = await contextB.newPage();
        await signInWithGoogle(pageB, env("CANOPY_E2E_GOOGLE_B_EMAIL"), env("CANOPY_E2E_GOOGLE_B_PASSWORD"));
        await pageB.goto(`${base}/canopy/notes`, { waitUntil: "domcontentloaded" });
        const listB = await pageB.content();
        expect(listB).toContain(allow);
        expect(listB).toContain(theirs);
        expect(listB).not.toContain(mine);
        const foreignB = await notePage(pageB, mine);
        const missingB = await notePage(pageB, absent);
        expect(foreignB.status).toBe(404);
        expect(missingB.status).toBe(404);
        expect(foreignB.text).toContain("Not found");
        expect(foreignB.text).toBe(missingB.text);
      } finally {
        await browser.close();
      }
    },
    180000,
  );
});
