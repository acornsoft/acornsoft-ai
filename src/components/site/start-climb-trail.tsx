import type { ClimbStationId, StationStatus } from "./start-climb-model";

type Props = {
  statuses: Record<ClimbStationId, StationStatus>;
  active: ClimbStationId;
  onSelect: (id: ClimbStationId) => void;
};

/**
 * Climb order (Start here → … → Summit → Descent).
 * SVG y grows downward, so Summit must have the smallest y (the peak).
 * Descent is after the peak: lower than Summit, offset to the right.
 */
const STATIONS: {
  id: ClimbStationId;
  label: string;
  mark: string;
  x: number;
  y: number;
}[] = [
  { id: "start", label: "Start here", mark: "S", x: 96, y: 490 },
  { id: "basecamp", label: "Base Camp", mark: "1", x: 56, y: 400 },
  { id: "route", label: "Route", mark: "2", x: 124, y: 318 },
  { id: "waypoint", label: "Waypoint", mark: "3", x: 52, y: 220 },
  { id: "summit", label: "Summit", mark: "4", x: 102, y: 56 },
  { id: "descent", label: "Descent", mark: "D", x: 188, y: 138 },
];

const TRAIL_PATH =
  "M96 490 C68 458, 40 430, 56 400 C78 360, 116 348, 124 318 C132 280, 72 258, 52 220 C36 186, 58 100, 102 56 C130 70, 160 110, 188 138";

function stationClass(status: StationStatus, isActive: boolean): string {
  const bits = ["ac-start-trail-node", `is-${status}`];
  if (isActive) bits.push("is-current");
  return bits.join(" ");
}

export function StartClimbTrail({ statuses, active, onSelect }: Props) {
  return (
    <aside className="ac-start-trail" aria-label="Climb trail">
      <p className="ac-start-trail-kicker">Trail</p>
      <ol className="ac-start-trail-chips">
        {STATIONS.map((station) => {
          const status = statuses[station.id];
          const locked = status === "locked" || status === "narrative";
          return (
            <li key={station.id}>
              <button
                type="button"
                className={stationClass(status, active === station.id)}
                data-station={station.id}
                disabled={locked}
                aria-current={active === station.id ? "step" : undefined}
                onClick={() => onSelect(station.id)}
              >
                <span className="ac-start-trail-chip-mark">{station.mark}</span>
                {station.label}
              </button>
            </li>
          );
        })}
      </ol>
      <svg
        className="ac-start-trail-map"
        viewBox="0 0 280 530"
        role="img"
        aria-label="Trail climbs Start here, Base Camp, Route, and Waypoint to Summit at the peak, then descends"
      >
        <path className="ac-start-trail-line" d={TRAIL_PATH} />
        {STATIONS.map((station) => {
          const status = statuses[station.id];
          const isActive = active === station.id;
          const locked = status === "locked" || status === "narrative";
          return (
            <g
              key={station.id}
              className={stationClass(status, isActive)}
              data-station={station.id}
              transform={`translate(${station.x} ${station.y})`}
            >
              <circle className="ac-start-trail-hit" r="18" />
              <circle className="ac-start-trail-dot" r={isActive ? 11 : 9} />
              <text className="ac-start-trail-mark" textAnchor="middle" dy="4">
                {station.mark}
              </text>
              <text className="ac-start-trail-lab" x="20" y="4" textAnchor="start">
                {station.label}
              </text>
              {!locked ? (
                <circle
                  className="ac-start-trail-btn"
                  r="18"
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
    </aside>
  );
}
