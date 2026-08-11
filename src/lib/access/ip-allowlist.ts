/**
 * IP allowlist helpers (IPv4 + CIDR).
 * Used by Vite (dev) and Nitro (Vercel) middleware.
 *
 * Env:
 *   IP_ALLOWLIST=203.0.113.10,198.51.100.0/24
 *   IP_ALLOWLIST_ENABLED=true|false  (optional; default = list non-empty)
 *   IP_ALLOWLIST_EXEMPT_PATHS=/api/canopy/refresh,/favicon.png
 *   IP_ALLOWLIST_TRUST_PROXY=true    (use x-forwarded-for; default true on Vercel)
 */

export type AllowlistConfig = {
  enabled: boolean;
  entries: string[];
  exemptPaths: string[];
  trustProxy: boolean;
};

function env(name: string): string | undefined {
  if (typeof process === "undefined") return undefined;
  const v = process.env[name];
  return v && v.trim() ? v.trim() : undefined;
}

export function parseList(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function loadAllowlistConfig(): AllowlistConfig {
  const entries = parseList(env("IP_ALLOWLIST") ?? env("ACCESS_IP_ALLOWLIST"));
  const flag = (env("IP_ALLOWLIST_ENABLED") ?? "").toLowerCase();
  const enabled =
    flag === "true" || flag === "1" || flag === "yes"
      ? true
      : flag === "false" || flag === "0" || flag === "no"
        ? false
        : entries.length > 0;

  const exemptPaths = parseList(
    env("IP_ALLOWLIST_EXEMPT_PATHS") ??
      "/api/canopy/refresh,/favicon.png,/favicon.ico",
  );

  const trustRaw = (env("IP_ALLOWLIST_TRUST_PROXY") ?? "true").toLowerCase();
  const trustProxy = !(trustRaw === "false" || trustRaw === "0" || trustRaw === "no");

  return { enabled, entries, exemptPaths, trustProxy };
}

/** IPv4 string → 32-bit number; null if invalid. */
export function ipv4ToInt(ip: string): number | null {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(ip.trim());
  if (!m) return null;
  const parts = [m[1], m[2], m[3], m[4]].map((x) => Number(x));
  if (parts.some((n) => n > 255)) return null;
  return (
    ((parts[0]! << 24) >>> 0) +
    ((parts[1]! << 16) >>> 0) +
    ((parts[2]! << 8) >>> 0) +
    (parts[3]! >>> 0)
  ) >>> 0;
}

/** True if ip is exactly entry or inside entry CIDR (IPv4). */
export function ipv4Matches(ip: string, entry: string): boolean {
  const e = entry.trim();
  if (!e) return false;

  if (e.includes("/")) {
    const [base, bitsRaw] = e.split("/");
    const bits = Number(bitsRaw);
    if (!base || !Number.isInteger(bits) || bits < 0 || bits > 32) return false;
    const ipN = ipv4ToInt(ip);
    const baseN = ipv4ToInt(base);
    if (ipN == null || baseN == null) return false;
    if (bits === 0) return true;
    const mask = bits === 32 ? 0xffffffff : (~((1 << (32 - bits)) - 1)) >>> 0;
    return (ipN & mask) === (baseN & mask);
  }

  // Exact IPv4
  if (ipv4ToInt(e) != null) return ip === e;

  // Exact IPv6 (string equality, no CIDR)
  if (e.includes(":")) return ip.toLowerCase() === e.toLowerCase();

  return false;
}

export function ipAllowed(ip: string | null | undefined, entries: string[]): boolean {
  if (!ip) return false;
  const cleaned = stripIpv4Mapped(ip);
  if (isLoopback(cleaned)) return true; // local tools / health on loopback
  return entries.some((entry) => ipv4Matches(cleaned, entry) || ipv6Exact(cleaned, entry));
}

function ipv6Exact(ip: string, entry: string): boolean {
  if (!entry.includes(":") || entry.includes("/")) return false;
  return ip.toLowerCase() === entry.toLowerCase();
}

function stripIpv4Mapped(ip: string): string {
  const t = ip.trim();
  if (t.startsWith("::ffff:")) return t.slice(7);
  return t;
}

function isLoopback(ip: string): boolean {
  if (ip === "::1" || ip === "127.0.0.1") return true;
  const n = ipv4ToInt(ip);
  if (n == null) return false;
  // 127.0.0.0/8
  return (n >>> 24) === 127;
}

/**
 * Pick client IP from headers (Vercel / proxies).
 * Prefer left-most x-forwarded-for when trustProxy.
 */
export function clientIpFromHeaders(
  headers: Headers | Record<string, string | string[] | undefined>,
  trustProxy = true,
): string | null {
  const get = (name: string): string | undefined => {
    if (headers instanceof Headers) {
      return headers.get(name) ?? undefined;
    }
    const v = headers[name] ?? headers[name.toLowerCase()];
    if (Array.isArray(v)) return v[0];
    return v;
  };

  if (trustProxy) {
    const xff = get("x-forwarded-for") ?? get("X-Forwarded-For");
    if (xff) {
      const first = xff.split(",")[0]?.trim();
      if (first) return stripIpv4Mapped(first);
    }
    const real = get("x-real-ip") ?? get("X-Real-Ip");
    if (real) return stripIpv4Mapped(real.trim());
    const vercel = get("x-vercel-forwarded-for");
    if (vercel) {
      const first = vercel.split(",")[0]?.trim();
      if (first) return stripIpv4Mapped(first);
    }
  }

  return null;
}

export function pathIsExempt(pathname: string, exemptPaths: string[]): boolean {
  const path = pathname.split("?")[0] || "/";
  return exemptPaths.some((ex) => {
    if (!ex) return false;
    if (ex.endsWith("*")) return path.startsWith(ex.slice(0, -1));
    return path === ex;
  });
}

export function evaluateAccess(opts: {
  ip: string | null;
  pathname: string;
  config?: AllowlistConfig;
}): { allowed: boolean; reason: string; config: AllowlistConfig } {
  const config = opts.config ?? loadAllowlistConfig();
  if (!config.enabled) {
    return { allowed: true, reason: "allowlist_disabled", config };
  }
  if (pathIsExempt(opts.pathname, config.exemptPaths)) {
    return { allowed: true, reason: "path_exempt", config };
  }
  if (ipAllowed(opts.ip, config.entries)) {
    return { allowed: true, reason: "ip_allowed", config };
  }
  return { allowed: false, reason: "ip_denied", config };
}

export function forbiddenHtml(ip: string | null): string {
  const shown = ip ? escapeHtml(ip) : "unknown";
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Access limited</title>
  <style>
    body{font-family:system-ui,sans-serif;background:#0c0c10;color:#e8edf4;
      display:grid;place-items:center;min-height:100vh;margin:0;padding:24px}
    main{max-width:28rem;border:1px solid rgba(255,255,255,.1);border-radius:14px;
      padding:28px 24px;background:rgba(20,16,12,.9)}
    h1{font-size:1.25rem;margin:0 0 10px;color:#fff}
    p{margin:0 0 8px;line-height:1.5;color:#a8b0ba;font-size:.95rem}
    code{color:#ffb020;font-size:.85rem}
  </style>
</head>
<body>
  <main>
    <h1>Access limited</h1>
    <p>This site is only available from approved network ranges.</p>
    <p>Your address: <code>${shown}</code></p>
    <p>If you should have access, ask the owner to add your IP or CIDR to the allowlist.</p>
  </main>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
