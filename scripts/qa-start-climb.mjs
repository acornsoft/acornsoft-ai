import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const base = process.argv[2] || "http://127.0.0.1:8080";
const outDir = "/workspace/screenshots";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on("pageerror", (err) => errors.push(String(err)));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  await page.goto(`${base}/start`, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(600);

  const headline = await page.locator("h1.ac-service-title").innerText();
  const routeDisabled = await page.locator("#ac-start-measure").isDisabled();
  const waypointDisabled = await page.locator("#ac-start-slice").isDisabled();
  const ctaDisabled = await page.locator('button[type="submit"]').isDisabled();
  const startHere = await page.locator(".ac-start-start-badge").innerText();
  const trail = await page.locator(".ac-start-trail-map").count();
  const summitField = await page.locator("#ac-start-lesson").count();

  if (headline.trim() !== "One problem. One climb. Ready to start.") {
    throw new Error(`Headline mismatch: ${headline}`);
  }
  if (startHere.trim().toLowerCase() !== "start here") {
    throw new Error(`Missing Start here badge: ${startHere}`);
  }
  if (!routeDisabled || !waypointDisabled) {
    throw new Error("Route/Waypoint should start locked");
  }
  if (!ctaDisabled) throw new Error("CTA should start disabled");
  if (!trail) throw new Error("Trail map missing on desktop");
  if (summitField) throw new Error("Summit should not be an intake field");

  await page.screenshot({
    path: `${outDir}/start-climb-desktop-locked.png`,
    fullPage: true,
  });

  await page.fill("#ac-start-name", "David");
  await page.fill("#ac-start-email", "david@example.com");
  await page.fill(
    "#ac-start-problem",
    "We’re taking bookings by phone; nothing can go down on weekends.",
  );
  await page.waitForTimeout(200);

  const routeAfterBase = await page.locator("#ac-start-measure").isDisabled();
  const waypointAfterBase = await page.locator("#ac-start-slice").isDisabled();
  if (routeAfterBase) throw new Error("Route should unlock after Base Camp");
  if (!waypointAfterBase) throw new Error("Waypoint should stay locked until Route");

  await page.screenshot({
    path: `${outDir}/start-climb-desktop-route-open.png`,
    fullPage: true,
  });

  await page.fill(
    "#ac-start-measure",
    "Online booking for existing clients. Not: new marketing site.",
  );
  await page.waitForTimeout(200);
  const waypointAfterRoute = await page.locator("#ac-start-slice").isDisabled();
  if (waypointAfterRoute) throw new Error("Waypoint should unlock after Route");

  await page.fill(
    "#ac-start-slice",
    "Go — need this before holiday season.",
  );
  await page.waitForTimeout(200);
  const ctaReady = await page.locator('button[type="submit"]').isDisabled();
  if (ctaReady) throw new Error("CTA should enable when identity + three beats filled");

  await page.screenshot({
    path: `${outDir}/start-climb-desktop-ready.png`,
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  const chips = await page.locator(".ac-start-trail-chips").evaluate((el) => {
    return window.getComputedStyle(el).display !== "none";
  });
  const mapHidden = await page.locator(".ac-start-trail-map").evaluate((el) => {
    return window.getComputedStyle(el).display === "none";
  });
  if (!chips || !mapHidden) {
    throw new Error("Mobile should show chips and hide the tall trail map");
  }
  await page.screenshot({
    path: `${outDir}/start-climb-mobile-top.png`,
    fullPage: false,
  });
  await page.screenshot({
    path: `${outDir}/start-climb-mobile-ready.png`,
    fullPage: true,
  });

  // Remembered identity
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, 0));
  const remembered = await page.locator(".ac-start-remembered").innerText();
  if (!remembered.includes("Welcome back")) {
    throw new Error(`Expected welcome back, got: ${remembered}`);
  }
  const nameVal = await page.locator("#ac-start-name").inputValue();
  if (nameVal !== "David") throw new Error("Name was not remembered");

  await page.locator("#ac-start-name").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.screenshot({
    path: `${outDir}/start-climb-welcome-back.png`,
    fullPage: false,
  });

  await page.click(".ac-start-not-you");
  await page.waitForTimeout(200);
  const nameCleared = await page.locator("#ac-start-name").inputValue();
  if (nameCleared !== "") throw new Error("Not you should clear name");
  const welcomeGone = await page.locator(".ac-start-remembered").count();
  if (welcomeGone) throw new Error("Welcome banner should hide after Not you");

  console.log(
    JSON.stringify(
      {
        ok: true,
        errors,
        screenshots: [
          "start-climb-desktop-locked.png",
          "start-climb-desktop-route-open.png",
          "start-climb-desktop-ready.png",
          "start-climb-mobile-ready.png",
          "start-climb-welcome-back.png",
        ],
      },
      null,
      2,
    ),
  );
  if (errors.length) process.exit(2);
} catch (err) {
  console.error(JSON.stringify({ ok: false, error: String(err?.message || err), errors }, null, 2));
  process.exit(1);
} finally {
  await browser.close();
}
