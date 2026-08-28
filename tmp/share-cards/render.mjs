import { chromium } from "playwright";
import path from "node:path";
import { pathToFileURL } from "node:url";

const dir = path.dirname(new URL(import.meta.url).pathname);

async function shot(page, file, width, height, out) {
  const url = pathToFileURL(path.join(dir, file)).href;
  await page.setViewportSize({ width, height });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.waitForTimeout(120);
  await page.screenshot({
    path: out,
    type: "jpeg",
    quality: 88,
    clip: { x: 0, y: 0, width, height },
  });
}

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
await shot(
  page,
  "og.html",
  1200,
  630,
  "/workspace/public/og.jpg",
);
await shot(
  page,
  "banner.html",
  2400,
  528,
  "/workspace/public/x-banner.jpg",
);
await browser.close();
console.log("wrote public/og.jpg and public/x-banner.jpg");
