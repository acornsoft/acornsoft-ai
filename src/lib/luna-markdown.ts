import { lunaHrefForOnboardingFile } from "./luna-docs";

const ONBOARDING = import.meta.glob("/docs/onboarding/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export function loadLunaMarkdown(file: string): string {
  const key = Object.keys(ONBOARDING).find((k) => k.endsWith(`/${file}`));
  if (!key) return "";
  return rewriteOnboardingLinks(ONBOARDING[key] ?? "");
}

/** Extension-relative links become public /luna trails. */
export function rewriteOnboardingLinks(md: string): string {
  return md.replace(
    /\]\((?:\.\.\/)*((?:docs\/onboarding\/)?[^)\s]+)\)/g,
    (full, target: string) => {
      const name = target.split("/").pop() ?? target;
      if (name.endsWith(".md") || name === "SUPPORT.md") {
        return `](${lunaHrefForOnboardingFile(name)})`;
      }
      return full;
    },
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, """);
}

function inline(s: string): string {
  let out = escapeHtml(s);
  out = out.replace(
    /\[([^\]]+)\]\((https?:[^)\s]+|\/[^)\s]*)\)/g,
    '<a href="$2">$1</a>',
  );
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  return out;
}

function cells(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

function tableToList(block: string[]): string {
  const rows = block
    .filter((l) => l.trim() && !/^[\s|:-]+$/.test(l))
    .map(cells);
  if (!rows.length) return "";
  const head = rows[0];
  const body = rows.slice(1);
  const items = body.map((row) => {
    const parts = row.map((c, i) => {
      const label = head[i] && head[i] !== c ? head[i] : "";
      return label ? `<strong>${inline(c)}</strong>` : inline(c);
    });
    if (row.length >= 2) {
      return `<li><strong>${inline(row[0])}</strong> — ${inline(row.slice(1).join(" · "))}</li>`;
    }
    return `<li>${parts.join(" — ")}</li>`;
  });
  return `<ul class="ac-luna-plain-list">${items.join("")}</ul>`;
}

/** Markdown → HTML. Tables become lists (canonical help has no tables). */
export function lunaMarkdownToHtml(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let i = 0;
  let inCode = false;
  let code: string[] = [];

  const flushPara = (buf: string[]) => {
    const t = buf.join(" ").trim();
    if (t) html.push(`<p>${inline(t)}</p>`);
    buf.length = 0;
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (inCode) {
        html.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
        code = [];
        inCode = false;
      } else {
        inCode = true;
      }
      i += 1;
      continue;
    }
    if (inCode) {
      code.push(line);
      i += 1;
      continue;
    }

    if (/^\s*\|.+\|\s*$/.test(line) || (line.includes("|") && lines[i + 1] && /^[\s|:-]+$/.test(lines[i + 1]))) {
      const block: string[] = [];
      while (i < lines.length && (lines[i].includes("|") || /^[\s|:-]+$/.test(lines[i]))) {
        if (!lines[i].trim()) break;
        block.push(lines[i]);
        i += 1;
      }
      html.push(tableToList(block));
      continue;
    }

    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const n = h[1].length;
      html.push(`<h${n}>${inline(h[2])}</h${n}>`);
      i += 1;
      continue;
    }

    if (/^---+\s*$/.test(line)) {
      html.push("<hr />");
      i += 1;
      continue;
    }

    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line);
      const items: string[] = [];
      while (i < lines.length && (/^\s*[-*]\s+/.test(lines[i]) || /^\s*\d+\.\s+/.test(lines[i]))) {
        items.push(`<li>${inline(lines[i].replace(/^\s*(?:[-*]|\d+\.)\s+/, ""))}</li>`);
        i += 1;
      }
      html.push(ordered ? `<ol>${items.join("")}</ol>` : `<ul>${items.join("")}</ul>`);
      continue;
    }

    if (!line.trim()) {
      i += 1;
      continue;
    }

    const para: string[] = [line];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("```") &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^---+\s*$/.test(lines[i]) &&
      !lines[i].includes("|")
    ) {
      para.push(lines[i]);
      i += 1;
    }
    flushPara(para);
  }

  return html.join("\n");
}
