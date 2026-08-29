import { lunaHrefForOnboardingFile } from "./luna-docs";

const ONBOARDING = {
  ...import.meta.glob("/docs/onboarding/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
  }),
  ...import.meta.glob("../../docs/onboarding/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
  }),
} as Record<string, string>;

export function loadLunaMarkdown(file: string): string {
  const key = Object.keys(ONBOARDING).find((k) => k.endsWith(`/${file}`));
  if (!key) return "";
  return rewriteOnboardingLinks(ONBOARDING[key] ?? "");
}

function publicAssetUrl(path: string): string {
  const name = (path.split("?")[0] ?? path).split("/").pop() ?? "";
  if (/\.(png|jpe?g|gif|webp)$/i.test(name)) {
    return `/images/luna/${name}`;
  }
  return path;
}

function isSafePublicUrl(url: string): boolean {
  return (
    url.startsWith("/images/luna/") ||
    url.startsWith("/luna") ||
    url.startsWith("/start") ||
    url.startsWith("/field-guide") ||
    url.startsWith("https://www.acornsoft.ai/") ||
    url.startsWith("https://marketplace.visualstudio.com/") ||
    url.startsWith("https://grok.com/")
  );
}

/** Extension-relative links become public /luna trails. */
export function rewriteOnboardingLinks(md: string): string {
  let out = md.replace(
    /src=(["'])(?:\.\.\/)*(?:docs\/onboarding\/)?assets\//g,
    "src=$1/images/luna/",
  );
  out = out.replace(
    /\]\((?:\.\.\/)*(?:docs\/onboarding\/)?assets\//g,
    "](/images/luna/",
  );
  out = out.replace(
    /\]\((?:\.\.\/)*((?:docs\/onboarding\/)?[^)\s]+)\)/g,
    (full, target: string) => {
      const name = target.split("/").pop() ?? target;
      if (name.endsWith(".md") || name === "SUPPORT.md") {
        return `](${lunaHrefForOnboardingFile(name)})`;
      }
      return full;
    },
  );
  return out;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function imgHtml(src: string, alt: string): string {
  let url = src.trim();
  if (url.includes("assets/") || url.startsWith("./")) {
    url = publicAssetUrl(url);
  }
  if (!isSafePublicUrl(url) && url.startsWith("/images/")) {
    url = publicAssetUrl(url);
  }
  if (!isSafePublicUrl(url)) return "";
  return `<p class="ac-luna-figure"><img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}" /></p>`;
}

function lineToImg(line: string): string | null {
  const trimmed = line.trim();
  const md = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  if (md) return imgHtml(md[2], md[1]);
  if (!/^<img\b/i.test(trimmed)) return null;
  const src = trimmed.match(/src=["']([^"']+)["']/i)?.[1];
  const alt = trimmed.match(/alt=["']([^"']*)["']/i)?.[1] ?? "";
  if (!src) return null;
  return imgHtml(src, alt);
}

function inline(s: string): string {
  let out = escapeHtml(s);
  out = out.replace(
    /!\[([^\]]*)\]\((https?:[^)\s]+|\/[^)\s]*)\)/g,
    (_m, alt: string, src: string) => {
      const html = imgHtml(src, alt);
      return html.replace(/^<p class="ac-luna-figure">/, "").replace(/<\/p>$/, "");
    },
  );
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

    if (/^\s*<\/?div\b/i.test(line) || /^\s*<\/div>\s*$/i.test(line)) {
      i += 1;
      continue;
    }

    const img = lineToImg(line);
    if (img) {
      html.push(img);
      i += 1;
      continue;
    }

    if (
      /^\s*\|.+\|\s*$/.test(line) ||
      (line.includes("|") && lines[i + 1] && /^[\s|:-]+$/.test(lines[i + 1]))
    ) {
      const block: string[] = [];
      while (
        i < lines.length &&
        (lines[i].includes("|") || /^[\s|:-]+$/.test(lines[i]))
      ) {
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
      while (
        i < lines.length &&
        (/^\s*[-*]\s+/.test(lines[i]) || /^\s*\d+\.\s+/.test(lines[i]))
      ) {
        const imgItem = lineToImg(
          lines[i].replace(/^\s*(?:[-*]|\d+\.)\s+/, ""),
        );
        if (imgItem) {
          items.push(`<li>${imgItem}</li>`);
        } else {
          items.push(
            `<li>${inline(lines[i].replace(/^\s*(?:[-*]|\d+\.)\s+/, ""))}</li>`,
          );
        }
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
      !lines[i].includes("|") &&
      !lineToImg(lines[i]) &&
      !/^\s*<\/?div\b/i.test(lines[i])
    ) {
      para.push(lines[i]);
      i += 1;
    }
    flushPara(para);
  }

  return html.join("\n");
}
