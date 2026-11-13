import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteChrome } from "./site-chrome";
import type { GrokUsageDay, GrokUsageFile } from "@/lib/grok-usage/types";
import "./grok-usage.css";

const USAGE_URL = "/grok-usage/usage.json";

const ACTIVITY = [
  { key: "chats" as const, label: "Chats with David", swatch: "chats" },
  { key: "routines" as const, label: "Routines", swatch: "routines" },
  { key: "botToBot" as const, label: "Bot-to-bot", swatch: "botToBot" },
  { key: "group" as const, label: "Group chats", swatch: "group" },
];

const SEGMENT_COLOR: Record<(typeof ACTIVITY)[number]["key"], string> = {
  chats: "#FF9900",
  routines: "#C45C12",
  botToBot: "#E8C49A",
  group: "#6B1D08",
};

function formatShare(n: number, approximate?: boolean): string {
  if (n <= 0) return "0%";
  if (approximate && n === 0.5) return "<1%";
  if (Number.isInteger(n)) return `${n}%`;
  return `${n}%`;
}

function formatDay(iso: string): string {
  const [y, m, d] = iso.split("-").map((v) => Number.parseInt(v, 10));
  if (!y || !m || !d) return iso;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function formatUpdated(iso: string): string {
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return iso;
  return dt.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  });
}

function stackHeight(day: GrokUsageDay): number {
  return day.chats + day.routines + day.botToBot + day.group;
}

type Tip = { day: GrokUsageDay; x: number; y: number };

function DailyChart({ daily }: { daily: GrokUsageDay[] }) {
  const [tip, setTip] = useState<Tip | null>(null);
  const width = 1000;
  const height = 280;
  const pad = { top: 16, right: 12, bottom: 36, left: 36 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const max = Math.max(1, ...daily.map((d) => Math.max(d.total, stackHeight(d))));
  const gap = daily.length > 0 ? Math.min(6, innerW / daily.length / 4) : 0;
  const barW = daily.length > 0 ? (innerW - gap * (daily.length - 1)) / daily.length : 0;

  const ticks = useMemo(() => {
    const step = max >= 12 ? 4 : max >= 6 ? 2 : 1;
    const out: number[] = [];
    for (let v = 0; v <= max; v += step) out.push(v);
    if (out[out.length - 1] !== Math.ceil(max)) out.push(Math.ceil(max));
    return out;
  }, [max]);

  const labelEvery = daily.length > 20 ? 5 : daily.length > 12 ? 2 : 1;

  return (
    <div className="ac-gu-chart-wrap">
      <svg
        className="ac-gu-chart"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Daily share of Grok Bot work, stacked by chats, routines, bot-to-bot, and group chats"
      >
        {ticks.map((t) => {
          const y = pad.top + innerH - (t / max) * innerH;
          return (
            <g key={t}>
              <line className="ac-gu-grid" x1={pad.left} x2={width - pad.right} y1={y} y2={y} />
              <text className="ac-gu-axis" x={pad.left - 8} y={y + 4} textAnchor="end">
                {t}%
              </text>
            </g>
          );
        })}
        {daily.map((day, i) => {
          const x = pad.left + i * (barW + gap);
          let y = pad.top + innerH;
          const segs = ACTIVITY.map((a) => ({ key: a.key, value: day[a.key] })).filter(
            (s) => s.value > 0,
          );
          return (
            <g
              key={day.date}
              className="ac-gu-chart-bar"
              tabIndex={0}
              role="listitem"
              aria-label={`${formatDay(day.date)}: ${formatShare(day.total, day.approximate)} total`}
              onMouseEnter={(e) => {
                const wrap = (e.currentTarget.ownerSVGElement?.parentElement ??
                  null) as HTMLElement | null;
                const svg = e.currentTarget.ownerSVGElement;
                if (!wrap || !svg) return;
                const rect = svg.getBoundingClientRect();
                const wr = wrap.getBoundingClientRect();
                setTip({
                  day,
                  x: ((x + barW / 2) / width) * rect.width + (rect.left - wr.left),
                  y: (pad.top / height) * rect.height + 8,
                });
              }}
              onMouseLeave={() => setTip(null)}
              onFocus={(e) => {
                const wrap = (e.currentTarget.ownerSVGElement?.parentElement ??
                  null) as HTMLElement | null;
                const svg = e.currentTarget.ownerSVGElement;
                if (!wrap || !svg) return;
                const rect = svg.getBoundingClientRect();
                const wr = wrap.getBoundingClientRect();
                setTip({
                  day,
                  x: ((x + barW / 2) / width) * rect.width + (rect.left - wr.left),
                  y: (pad.top / height) * rect.height + 8,
                });
              }}
              onBlur={() => setTip(null)}
            >
              {segs.map((s) => {
                const h = (s.value / max) * innerH;
                y -= h;
                return (
                  <rect
                    key={s.key}
                    className="ac-gu-seg"
                    x={x}
                    y={y}
                    width={Math.max(barW, 1)}
                    height={Math.max(h, 0)}
                    fill={SEGMENT_COLOR[s.key]}
                    rx={i === 0 && s === segs[segs.length - 1] ? 2 : 0}
                  />
                );
              })}
              {i % labelEvery === 0 || i === daily.length - 1 ? (
                <text className="ac-gu-axis" x={x + barW / 2} y={height - 10} textAnchor="middle">
                  {formatDay(day.date)}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      {tip ? (
        <div className="ac-gu-tip" style={{ left: tip.x, top: tip.y }} role="status">
          <strong>
            {formatDay(tip.day.date)} · {formatShare(tip.day.total, tip.day.approximate)} of the
            period
          </strong>
          {ACTIVITY.map((a) => (
            <div key={a.key}>
              {a.label}:{" "}
              {formatShare(tip.day[a.key], tip.day.approximate && tip.day[a.key] === 0.5)}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function leadStat(usage: GrokUsageFile): { value: string; label: string } {
  const lead = usage.byBot[0];
  if (!lead) return { value: "—", label: "Share by bot" };
  return {
    value: formatShare(lead.share, lead.approximate),
    label: `${lead.label} leads`,
  };
}

export function GrokUsagePage() {
  const [usage, setUsage] = useState<GrokUsageFile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(USAGE_URL, { cache: "no-store" });
        if (!res.ok) throw new Error(`Could not load usage (${res.status})`);
        const data = (await res.json()) as GrokUsageFile;
        if (!cancelled) {
          setUsage(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load usage");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const lead = usage ? leadStat(usage) : null;

  return (
    <SiteChrome mainClassName="ac-page-top">
      <div className="ac-service-page ac-grok-usage ac-page-top">
        <div className="ac-service-stack">
          <header className="ac-service-head">
            <span className="ac-service-kicker">Acornsoft · Grok</span>
            <h1 className="ac-service-title">How Acornsoft AI uses Grok</h1>
            <div className="ac-service-lede-box">
              <p className="ac-service-lede ac-service-lede--last">
                A public look at how Acornsoft’s Grok Bot workforce spent its time
                {usage ? ` over the ${usage.periodLabel.toLowerCase()}` : ""}.{" "}
                <Link to="/canopy">Canopy</Link> is the live radar for the same work.
              </p>
            </div>
          </header>

          {error ? <p className="ac-gu-status ac-gu-status--error">{error}</p> : null}
          {!usage && !error ? <p className="ac-gu-status">Loading the latest snapshot…</p> : null}

          {usage ? (
            <>
              <ul className="ac-gu-stats">
                <li className="ac-gu-stat">
                  <span className="ac-gu-stat-value ac-gu-stat-value--gold">{lead?.value}</span>
                  <span className="ac-gu-stat-label">{lead?.label}</span>
                </li>
                <li className="ac-gu-stat">
                  <span className="ac-gu-stat-value">{usage.counts.namedBots}</span>
                  <span className="ac-gu-stat-label">Named Acornsoft bots</span>
                </li>
                <li className="ac-gu-stat">
                  <span className="ac-gu-stat-value">{usage.counts.canopyFeedEntries ?? "—"}</span>
                  <span className="ac-gu-stat-label">Canopy feed posts</span>
                </li>
                <li className="ac-gu-stat">
                  <span className="ac-gu-stat-value" style={{ fontSize: "1.35rem" }}>
                    {usage.periodStart && usage.periodEnd
                      ? `${formatDay(usage.periodStart)} – ${formatDay(usage.periodEnd)}`
                      : usage.periodLabel}
                  </span>
                  <span className="ac-gu-stat-label">Period</span>
                </li>
              </ul>

              <section className="ac-gu-panel" aria-labelledby="ac-gu-bots">
                <h2 id="ac-gu-bots">Share by bot</h2>
                <ul className="ac-gu-bars">
                  {usage.byBot.map((bot) => (
                    <li key={bot.label} className="ac-gu-bar-row">
                      <div className="ac-gu-bar-name">
                        <span className="ac-gu-bar-label">{bot.label}</span>
                        {bot.role ? <span className="ac-gu-bar-role">{bot.role}</span> : null}
                      </div>
                      <div
                        className="ac-gu-bar-track"
                        role="img"
                        aria-label={`${bot.label}${bot.role ? `, ${bot.role}` : ""}: ${formatShare(bot.share, bot.approximate)}`}
                      >
                        <span
                          className="ac-gu-bar-fill"
                          style={{ width: `${Math.min(100, Math.max(bot.share, 0))}%` }}
                        />
                      </div>
                      <span className="ac-gu-bar-share">
                        {formatShare(bot.share, bot.approximate)}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="ac-gu-panel" aria-labelledby="ac-gu-daily">
                <h2 id="ac-gu-daily">Daily share, last 30 days</h2>
                <DailyChart daily={usage.daily} />
                <ul className="ac-gu-legend">
                  {ACTIVITY.map((a) => (
                    <li key={a.key}>
                      <span className={`ac-gu-swatch ac-gu-swatch--${a.swatch}`} aria-hidden />
                      {a.label}
                    </li>
                  ))}
                </ul>
              </section>

              <p className="ac-gu-caption">
                Numbers are shares of all Grok Bot work in this period — not token counts, API
                calls, or cost. Values under 1% are shown as about half a percent. The snapshot is
                refreshed weekly
                {usage.updatedAt ? ` (last pulled ${formatUpdated(usage.updatedAt)})` : ""}.
              </p>
            </>
          ) : null}
        </div>
      </div>
    </SiteChrome>
  );
}
