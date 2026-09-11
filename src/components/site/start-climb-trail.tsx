import type { ReactNode } from "react";
import {
  ArrowUpRight,
  Crosshair,
  Flag,
  Lightbulb,
  User,
} from "lucide-react";
import type { ClimbStationId, StationStatus } from "./start-climb-model";

type Props = {
  statuses: Record<ClimbStationId, StationStatus>;
  active: ClimbStationId;
  onSelect: (id: ClimbStationId) => void;
};

export const TRAIL_STATIONS: {
  id: Exclude<ClimbStationId, "start">;
  label: string;
  callout: string;
  x: number;
  y: number;
}[] = [
  { id: "basecamp", label: "Base Camp", callout: "What has to stay true", x: 248, y: 708 },
  { id: "route", label: "Route", callout: "The one job", x: 286, y: 548 },
  { id: "waypoint", label: "Waypoint", callout: "Go or hold", x: 308, y: 398 },
  { id: "descent", label: "Descent", callout: "What we learn on the way down", x: 322, y: 248 },
  { id: "summit", label: "Summit", callout: "Acornsoft sets success criteria", x: 334, y: 98 },
];

const VIEW_W = 640;
const VIEW_H = 840;

const TRAIL_PATH =
  "M248 708 C262 668, 274 608, 286 548 C296 508, 302 448, 308 398 C314 348, 318 298, 322 248 C326 198, 330 148, 334 98";

type Star = { x: number; y: number; r: number; a: number };

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function inMountain(x: number, y: number): boolean {
  const nx = x / VIEW_W;
  const ny = y / VIEW_H;
  const peakX = 0.5;
  const half = 0.11 + 0.4 * ny ** 1.12;
  const rightLobe =
    ny < 0.56
      ? Math.exp(-((nx - 0.68) ** 2) / 0.038 - ((ny - 0.3) ** 2) / 0.055) * 0.2
      : 0;
  const leftLobe =
    ny < 0.5
      ? Math.exp(-((nx - 0.3) ** 2) / 0.03 - ((ny - 0.26) ** 2) / 0.048) * 0.16
      : 0;
  return (
    Math.abs(nx - peakX) < half + rightLobe + leftLobe &&
    ny > 0.035 &&
    ny < 0.97
  );
}

function buildStars(): Star[] {
  const rand = mulberry32(20260911);
  const stars: Star[] = [];
  for (let i = 0; i < 2400 && stars.length < 320; i += 1) {
    const x = 20 + rand() * (VIEW_W - 40);
    const y = 16 + rand() * (VIEW_H - 32);
    if (!inMountain(x, y)) continue;
    const edge = Math.abs(x / VIEW_W - 0.5) / 0.5;
    stars.push({
      x,
      y,
      r: 0.85 + rand() * 2.35,
      a: 0.38 + rand() * 0.58 - edge * 0.06,
    });
  }
  return stars;
}

function buildLinks(stars: Star[]): [number, number][] {
  const links: [number, number][] = [];
  for (let i = 0; i < stars.length; i += 1) {
    const near: { j: number; d: number }[] = [];
    for (let j = i + 1; j < stars.length; j += 1) {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const d = Math.hypot(dx, dy);
      if (d < 62) near.push({ j, d });
    }
    near.sort((a, b) => a.d - b.d);
    for (const n of near.slice(0, 2)) links.push([i, n.j]);
  }
  return links;
}

const STARS = buildStars();
const LINKS = buildLinks(STARS);

function stationIcon(id: (typeof TRAIL_STATIONS)[number]["id"]): ReactNode {
  const props = { size: 16, strokeWidth: 2.15, "aria-hidden": true as const };
  switch (id) {
    case "basecamp":
      return <User {...props} />;
    case "route":
      return <ArrowUpRight {...props} />;
    case "waypoint":
      return <Crosshair {...props} />;
    case "descent":
      return <Lightbulb {...props} />;
    case "summit":
      return <Flag {...props} />;
    default: {
      const _never: never = id;
      return _never;
    }
  }
}

function stationClass(status: StationStatus, isActive: boolean): string {
  const bits = ["ac-start-trail-node", `is-${status}`];
  if (isActive) bits.push("is-current");
  return bits.join(" ");
}

export function StartClimbTrail({ statuses, active, onSelect }: Props) {
  const trailActive =
    active === "start"
      ? "basecamp"
      : TRAIL_STATIONS.some((s) => s.id === active)
        ? active
        : "basecamp";

  return (
    <aside className="ac-start-trail" aria-label="Climb trail">
      <p className="ac-start-trail-kicker">Constellation trail</p>
      <ol className="ac-start-trail-chips">
        {TRAIL_STATIONS.map((station) => {
          const status = statuses[station.id];
          const locked = status === "locked" || status === "narrative";
          return (
            <li key={station.id}>
              <button
                type="button"
                className={stationClass(status, trailActive === station.id)}
                data-station={station.id}
                disabled={locked}
                aria-current={trailActive === station.id ? "step" : undefined}
                onClick={() => onSelect(station.id)}
              >
                <span className="ac-start-trail-chip-mark">
                  {stationIcon(station.id)}
                </span>
                {station.label}
              </button>
            </li>
          );
        })}
      </ol>
      <div className="ac-start-trail-stage">
        <svg
          className="ac-start-trail-map"
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          role="img"
          aria-label="Constellation trail from Base Camp to Summit, with Descent just below the peak"
        >
          <defs>
            <radialGradient id="ac-trail-wash" cx="52%" cy="42%" r="62%">
              <stop offset="0%" stopColor="#ff7a18" stopOpacity="0.16" />
              <stop offset="42%" stopColor="#801428" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#080204" stopOpacity="0" />
            </radialGradient>
            <filter id="ac-star-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="2.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="ac-node-glow" x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur stdDeviation="4.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect width={VIEW_W} height={VIEW_H} fill="url(#ac-trail-wash)" />
          {LINKS.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              className="ac-start-trail-net"
              x1={STARS[a].x}
              y1={STARS[a].y}
              x2={STARS[b].x}
              y2={STARS[b].y}
            />
          ))}
          {STARS.map((star, i) => (
            <circle
              key={i}
              className="ac-start-trail-star"
              cx={star.x}
              cy={star.y}
              r={star.r}
              opacity={star.a}
              filter="url(#ac-star-glow)"
            />
          ))}
          <path className="ac-start-trail-line" d={TRAIL_PATH} />
          {TRAIL_STATIONS.map((station) => {
            const status = statuses[station.id];
            const isActive = trailActive === station.id;
            const locked = status === "locked" || status === "narrative";
            return (
              <g
                key={station.id}
                className={stationClass(status, isActive)}
                data-station={station.id}
                transform={`translate(${station.x} ${station.y})`}
              >
                {isActive ? (
                  <circle className="ac-start-trail-halo" r="28" filter="url(#ac-node-glow)" />
                ) : null}
                <circle className="ac-start-trail-hit" r="22" />
                <circle className="ac-start-trail-dot" r={isActive ? 18 : 15} />
                <foreignObject x="-10" y="-10" width="20" height="20">
                  <span className="ac-start-trail-icon">{stationIcon(station.id)}</span>
                </foreignObject>
                <text className="ac-start-trail-lab" x="0" y="38" textAnchor="middle">
                  {station.label}
                </text>
                {isActive ? (
                  <g className="ac-start-trail-callout" transform="translate(34 -6)">
                    <rect
                      className="ac-start-trail-callout-plate"
                      x="0"
                      y="-16"
                      width={Math.max(168, Math.min(248, 22 + station.callout.length * 7.1))}
                      height="30"
                      rx="15"
                    />
                    <text className="ac-start-trail-callout-txt" x="14" y="4">
                      {station.callout}
                    </text>
                  </g>
                ) : null}
                {!locked ? (
                  <circle
                    className="ac-start-trail-btn"
                    r="22"
                    role="button"
                    tabIndex={0}
                    aria-label={station.label}
                    onClick={() => onSelect(station.id)}
                    onKeyDown={(ev) => {
                      if (ev.key === "Enter" || ev.key === " ") {
                        ev.preventDefault();
                        onSelect(station.id);
                      }
                    }}
                  />
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>
    </aside>
  );
}
