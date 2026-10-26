import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, symlinkSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const outDir = "/tmp/bookworm-tests";
mkdirSync(outDir, { recursive: true });
try {
  symlinkSync("/workspace/node_modules", join(outDir, "node_modules"));
} catch (error) {
  if (error && typeof error === "object" && "code" in error && error.code !== "EEXIST") throw error;
}

const files = [
  "src/components/site/bookworm-starter.ts",
  "src/components/site/bookworm-free-path.tsx",
  "src/components/site/bookworm-free-path.test.tsx",
];

for (const file of files) {
  const source = readFileSync(file, "utf8");
  const transpiled = ts.transpileModule(source, {
    fileName: file,
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      jsxImportSource: "react",
    },
  });
  const code = transpiled.outputText.replace(
    /from "(\.[^"]+)"/g,
    (_, spec) => `from "${spec.replace(/\.tsx?$/, "")}.mjs"`,
  );
  const base = file
    .split("/")
    .pop()
    .replace(/\.tsx?$/, ".mjs");
  const dest = join(outDir, base);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, code);
}

const result = spawnSync(
  process.execPath,
  ["--test", join(outDir, "bookworm-free-path.test.mjs")],
  {
    stdio: "inherit",
  },
);
process.exit(result.status ?? 1);
