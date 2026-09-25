import type { ReactNode } from "react";
import {
  ArrowUpRight,
  Crosshair,
  Flag,
  Lightbulb,
  PersonStanding,
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
  callout: string | null;
  x: number;
  y: number;
}[] = [
  { id: "basecamp", label: "Base Camp", callout: "What has to stay true", x: 168, y: 548 },
  { id: "route", label: "Route", callout: null, x: 318, y: 368 },
  { id: "waypoint", label: "Waypoint", callout: null, x: 448, y: 198 },
  { id: "summit", label: "Summit", callout: null, x: 548, y: 72 },
  { id: "descent", label: "Descent", callout: null, x: 738, y: 312 },
];

const VIEW_W = 860;
const VIEW_H = 660;

const CLIMB_PATH =
  "M168 548 C230 500, 272 430, 318 368 C360 312, 408 248, 448 198 C488 150, 528 98, 548 72";
const DESCENT_PATH = "M548 72 C610 110, 676 210, 738 312";

type Ember = { x: number; y: number; r: number; a: number };

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

function buildEmbers(): Ember[] {
  const rand = mulberry32(20260925);
  const embers: Ember[] = [];
  for (let i = 0; i < 72; i += 1) {
    embers.push({
      x: 24 + rand() * (VIEW_W - 48),
      y: 18 + rand() * (VIEW_H - 36),
      r: 0.6 + rand() * 2.8,
      a: 0.12 + rand() * 0.42,
    });
  }
  return embers;
}

const EMBERS = buildEmbers();

function stationIcon(id: (typeof TRAIL_STATIONS)[number]["id"]): ReactNode {
  const props = { size: 18, strokeWidth: 2.2, "aria-hidden": true as const };
  switch (id) {
    case "basecamp":
      return <PersonStanding {...props} />;
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
      <p className="ac-start-trail-kicker">Journey map</p>
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
          aria-label="Glowing mountain path from Base Camp to Summit, then Descent on the downslope"
        >
          <defs>
            <filter id="ac-path-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="ac-ember-glow" x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur stdDeviation="1.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="ac-node-glow" x="-140%" y="-140%" width="380%" height="380%">
              <feGaussianBlur stdDeviation="5.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {EMBERS.map((ember, i) => (
            <circle
              key={i}
              className="ac-start-trail-ember"
              cx={ember.x}
              cy={ember.y}
              r={ember.r}
              opacity={ember.a}
              filter="url(#ac-ember-glow)"
            />
          ))}
          <path
            className="ac-start-trail-line ac-start-trail-line--glow"
            d={CLIMB_PATH}
            filter="url(#ac-path-glow)"
          />
          <path className="ac-start-trail-line" d={CLIMB_PATH} />
          <path
            className="ac-start-trail-line ac-start-trail-line--glow"
            d={DESCENT_PATH}
            filter="url(#ac-path-glow)"
          />
          <path className="ac-start-trail-line" d={DESCENT_PATH} />
          {TRAIL_STATIONS.map((station) => {
            const status = statuses[station.id];
            const isActive = trailActive === station.id;
            const locked = status === "locked" || status === "narrative";
            const showCallout = Boolean(isActive && station.callout);
            return (
              <g
                key={station.id}
                className={stationClass(status, isActive)}
                data-station={station.id}
                transform={`translate(${station.x} ${station.y})`}
              >
                {station.id === "summit" ? (
                  <g className="ac-start-trail-flagpole" aria-hidden>
                    <line x1="0" y1="-18" x2="0" y2="-46" />
                    <path d="M0 -46 L22 -38 L0 -30 Z" />
                  </g>
                ) : null}
                {isActive ? (
                  <circle className="ac-start-trail-halo" r="34" filter="url(#ac-node-glow)" />
                ) : null}
                <circle className="ac-start-trail-hit" r="26" />
                <circle className="ac-start-trail-dot" r={isActive ? 22 : 20} />
                <foreignObject x="-12" y="-12" width="24" height="24">
                  <span className="ac-start-trail-icon">{stationIcon(station.id)}</span>
                </foreignObject>
                <text
                  className="ac-start-trail-lab"
                  x={station.id === "descent" ? 0 : 0}
                  y={station.id === "summit" ? 40 : 40}
                  textAnchor="middle"
                >
                  {station.label}
                </text>
                {showCallout ? (
                  <g className="ac-start-trail-callout" transform="translate(36 -8)">
                    <rect
                      className="ac-start-trail-callout-plate"
                      x="0"
                      y="-16"
                      width="168"
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
                    r="26"
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
