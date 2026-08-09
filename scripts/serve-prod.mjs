#!/usr/bin/env node
/**
 * Local production preview for the Nitro Vercel output.
 * Serves `.vercel/output/static` first (same as Vercel filesystem routes),
 * then falls through to the serverless handler for SSR / API.
 *
 * Usage: node scripts/serve-prod.mjs [port]
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";
import { pathToFileURL } from "node:url";

const root = new URL("..", import.meta.url).pathname;
const staticDir = join(root, ".vercel", "output", "static");
const serverEntry = join(
  root,
  ".vercel",
  "output",
  "functions",
  "__server.func",
  "index.mjs",
);
const port = Number(process.argv[2] || process.env.PORT || 8090);
const host = process.env.HOST || "0.0.0.0";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json",
  ".wasm": "application/wasm",
  ".txt": "text/plain; charset=utf-8",
};

const { default: nitroApp } = await import(pathToFileURL(serverEntry).href);
const fetchHandler =
  typeof nitroApp === "function"
    ? nitroApp
    : nitroApp?.fetch?.bind(nitroApp) ||
      nitroApp?.default?.fetch?.bind(nitroApp.default);

if (!fetchHandler) {
  console.error("[serve-prod] nitro entry has no fetch handler", nitroApp);
  process.exit(1);
}

async function tryStatic(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0] || "/");
  const rel = decoded === "/" ? "" : decoded.replace(/^\/+/, "");
  if (rel.includes("..")) return null;
  const filePath = join(staticDir, rel);
  // Prevent path escape
  if (!normalize(filePath).startsWith(normalize(staticDir))) return null;
  try {
    const st = await stat(filePath);
    if (!st.isFile()) return null;
    const body = await readFile(filePath);
    const type = MIME[extname(filePath).toLowerCase()] || "application/octet-stream";
    return { body, type, length: st.size };
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    const staticHit = await tryStatic(url.pathname);
    if (staticHit) {
      res.writeHead(200, {
        "content-type": staticHit.type,
        "content-length": staticHit.length,
        "cache-control": url.pathname.startsWith("/assets/")
          ? "public, max-age=31536000, immutable"
          : "public, max-age=60",
      });
      res.end(staticHit.body);
      return;
    }

    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (v === undefined) continue;
      if (Array.isArray(v)) for (const item of v) headers.append(k, item);
      else headers.set(k, v);
    }

    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body =
      req.method === "GET" || req.method === "HEAD"
        ? undefined
        : Buffer.concat(chunks);

    const request = new Request(url, {
      method: req.method,
      headers,
      body,
      // @ts-expect-error node undici duplex
      duplex: body ? "half" : undefined,
    });

    const response = await fetchHandler(request);
    res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    const buf = Buffer.from(await response.arrayBuffer());
    res.end(buf);
  } catch (err) {
    console.error("[serve-prod]", err);
    if (!res.headersSent) {
      res.writeHead(500, { "content-type": "text/plain" });
      res.end(String(err?.stack || err));
    }
  }
});

server.listen(port, host, () => {
  console.log(`[serve-prod] http://${host}:${port}/  (static + nitro)`);
});
