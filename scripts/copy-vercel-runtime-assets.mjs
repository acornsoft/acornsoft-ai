#!/usr/bin/env node
/**
 * After `vite build` (Nitro vercel preset), copy runtime binaries/data that the
 * serverless bundle cannot inline:
 *
 * 1. PGLite wasm + filesystem image next to the bundled electric-sql module
 *    (`new URL("./pglite.data", import.meta.url)`). Without these, production
 *    cold-starts crash with ENOENT when DATABASE_URL is unset (PGLite fallback).
 * 2. `content/` (Climb Notes markdown seed + canopy interests) into the
 *    function root so `process.cwd()/content/...` works on Vercel.
 *
 * Safe no-op when `.vercel/output` is missing (non-vercel builds).
 */
import { cpSync, existsSync, mkdirSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const funcRoot = join(root, ".vercel", "output", "functions", "__server.func");
const libsDir = join(funcRoot, "_libs");
const pgliteDist = join(root, "node_modules", "@electric-sql", "pglite", "dist");

if (!existsSync(funcRoot)) {
  console.log(
    "[copy-vercel-runtime-assets] no .vercel/output function dir — skip",
  );
  process.exit(0);
}

function copyPgliteAssets() {
  if (!existsSync(libsDir)) {
    console.warn(
      "[copy-vercel-runtime-assets] _libs missing — cannot place PGLite assets",
    );
    return;
  }
  const files = ["pglite.data", "pglite.wasm", "initdb.wasm"];
  let n = 0;
  for (const name of files) {
    const src = join(pgliteDist, name);
    if (!existsSync(src)) {
      console.warn(`[copy-vercel-runtime-assets] missing ${src}`);
      continue;
    }
    copyFileSync(src, join(libsDir, name));
    n += 1;
  }
  console.log(
    `[copy-vercel-runtime-assets] copied ${n}/${files.length} PGLite asset(s) → _libs/`,
  );
}

function copyContent() {
  const src = join(root, "content");
  if (!existsSync(src)) {
    console.log("[copy-vercel-runtime-assets] no content/ — skip");
    return;
  }
  const dest = join(funcRoot, "content");
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: true });
  console.log("[copy-vercel-runtime-assets] copied content/ → function root");
}

copyPgliteAssets();
copyContent();
