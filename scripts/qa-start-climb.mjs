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

  const headline = (await page.locator("h1.ac-service-title").innerText())
    .replace(/\s+/g, " ")
    .trim();
  const routeDisabled = await page.locator("#ac-start-measure").isDisabled();
  const waypointDisabled = await page.locator("#ac-start-slice").isDisabled();
  const ctaDisabled = await page.locator('button[type="submit"]').isDisabled();
  const startHere = await page.locator(".ac-start-start-badge").innerText();
  const trail = await page.locator(".ac-start-trail-map").count();
  const summitField = await page.locator("#ac-start-lesson").count();
  const accent = await page.locator(".ac-start-headline-accent").innerText();
  const climbLine = await page.locator(".ac-start-headline-climb").innerText();
  const glass = await page.locator(".ac-start-glass").count();
  const sla = await page.locator(".ac-start-fine").innerText();

  if (headline !== "One problem. One climb. Ready to start.") {
    throw new Error(`Headline mismatch: ${headline}`);
  }
  if (climbLine.trim() !== "One climb.") {
    throw new Error(`One climb line missing: ${climbLine}`);
  }
  if (accent.trim() !== "Ready to start.") {
    throw new Error(`Dual-tone last sentence missing: ${accent}`);
  }
  if (startHere.trim().toLowerCase() !== "start here") {
    throw new Error(`Missing Start here badge: ${startHere}`);
  }
  if (!glass) throw new Error("Glass form card missing");
  if (!/24 hours/i.test(sla)) throw new Error("24-hour response line missing");
  if (!routeDisabled || !waypointDisabled) {
    throw new Error("Route/Waypoint should start locked");
  }
  if (!ctaDisabled) throw new Error("CTA should start disabled");
  if (!trail) throw new Error("Trail map missing on desktop");
  if (summitField) throw new Error("Summit should not be an intake field");

  const talkLabels = await page
    .locator(".ac-start-move--talk .ac-start-move-label")
    .allInnerTexts();
  if (
    talkLabels.map((s) => s.trim().toLowerCase()).join(",") !== "summit,descent"
  ) {
    throw new Error(`Talk-track order ${talkLabels.join(" → ")}`);
  }

  const unlocks = await page.locator(".ac-start-unlock").allInnerTexts();
  if (!unlocks.some((t) => /Define the path/i.test(t))) {
    throw new Error("Locked Route should say Define the path.");
  }
  if (!unlocks.some((t) => /Unlocks after Route/i.test(t))) {
    throw new Error("Waypoint lock should say Unlocks after Route (sequential)");
  }

  const chipIds = await page
    .locator(".ac-start-trail-chips [data-station]")
    .evaluateAll((els) => els.map((el) => el.getAttribute("data-station")));
  const expectedChips = [
    "basecamp",
    "route",
    "waypoint",
    "summit",
    "descent",
  ];
  if (chipIds.join(",") !== expectedChips.join(",")) {
    throw new Error(`Chip order ${chipIds.join(" → ")}`);
  }

  const peak = await page.evaluate(() => {
    const read = (id) => {
      const g = document.querySelector(
        `svg.ac-start-trail-map [data-station="${id}"]`,
      );
      const t = g?.getAttribute("transform") || "";
      const m = /translate\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/.exec(t);
      return m ? { x: Number(m[1]), y: Number(m[2]) } : null;
    };
    return {
      basecamp: read("basecamp"),
      route: read("route"),
      waypoint: read("waypoint"),
      descent: read("descent"),
      summit: read("summit"),
      start: read("start"),
    };
  });
  if (!peak.summit || !peak.descent || !peak.basecamp) {
    throw new Error("Trail stations missing transform");
  }
  if (peak.start) throw new Error("Start here must not be a trail station");
  if (
    !(
      peak.summit.y < peak.waypoint.y &&
      peak.waypoint.y < peak.route.y &&
      peak.route.y < peak.basecamp.y
    )
  ) {
    throw new Error(`Climb path order failed: ${JSON.stringify(peak)}`);
  }
  if (!(peak.summit.y < peak.descent.y && peak.descent.x > peak.summit.x)) {
    throw new Error(
      `Descent must sit on the downslope (lower and right of Summit): ${JSON.stringify(peak)}`,
    );
  }

  const hero = await page.evaluate(() => {
    const photo = document.querySelector(".ac-global-hero-photo");
    const wash = document.querySelector(".ac-global-hero-wash");
    const pageEl = document.querySelector(".ac-start-climb");
    const trail = document.querySelector(".ac-start-trail");
    const photoCs = photo ? getComputedStyle(photo) : null;
    const washCs = wash ? getComputedStyle(wash) : null;
    const pageCs = pageEl ? getComputedStyle(pageEl) : null;
    const trailCs = trail ? getComputedStyle(trail) : null;
    return {
      photoOpacity: photoCs ? Number(photoCs.opacity) : 0,
      photoImage: photoCs?.backgroundImage || "",
      washColor: washCs?.backgroundColor || "",
      washImage: washCs?.backgroundImage || "",
      pageBg: pageCs?.backgroundColor || "",
      trailBg: trailCs?.backgroundColor || "",
    };
  });
  if (!/hero\.jpg/.test(hero.photoImage)) {
    throw new Error("Site hero photo is missing");
  }
  if (hero.photoOpacity < 0.35) {
    throw new Error(`Hero photo dimmed out (opacity ${hero.photoOpacity})`);
  }
  if (/rgb\(7,\s*7,\s*8\)|rgb\(0,\s*0,\s*0\)/.test(hero.washColor) && hero.washImage === "none") {
    throw new Error("Hero wash is a solid night sky");
  }
  if (!/transparent|rgba\(0,\s*0,\s*0,\s*0\)/.test(hero.pageBg)) {
    throw new Error(`Start page must not paint a solid ground: ${hero.pageBg}`);
  }
  if (!/transparent|rgba\(0,\s*0,\s*0,\s*0\)/.test(hero.trailBg)) {
    throw new Error(`Trail must float over the hero: ${hero.trailBg}`);
  }

  await page.locator(".ac-start-trail").screenshot({
    path: `${outDir}/start-climb-trail-peak.png`,
  });
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
  const mapVisible = await page.locator(".ac-start-trail-map").evaluate((el) => {
    return window.getComputedStyle(el).display !== "none";
  });
  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth + 2;
  });
  if (!chips || !mapVisible) {
    throw new Error("Mobile should keep chips and a compact trail map");
  }
  if (overflow) throw new Error("Mobile has horizontal overflow");
  await page.screenshot({
    path: `${outDir}/start-climb-mobile-top.png`,
    fullPage: false,
  });
  await page.screenshot({
    path: `${outDir}/start-climb-mobile-ready.png`,
    fullPage: true,
  });

  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, 0));
  const remembered = await page.locator(".ac-start-remembered").innerText();
  if (!remembered.includes("Welcome back")) {
    throw new Error(`Expected welcome back, got: ${remembered}`);
  }
  const nameVal = await page.locator("#ac-start-name").inputValue();
  if (nameVal !== "David") throw new Error("Name was not remembered");
  const problemVal = await page.locator("#ac-start-problem").inputValue();
  if (problemVal) throw new Error("Note body must not persist");

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
        hero,
        screenshots: [
          "start-climb-trail-peak.png",
          "start-climb-desktop-locked.png",
          "start-climb-desktop-route-open.png",
          "start-climb-desktop-ready.png",
          "start-climb-mobile-top.png",
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
