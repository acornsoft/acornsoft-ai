import type { ClimbStationId, StationStatus } from "./start-climb-model";

type Props = {
  statuses: Record<ClimbStationId, StationStatus>;
  active: ClimbStationId;
  onSelect: (id: ClimbStationId) => void;
};

const STATIONS: {
  id: ClimbStationId;
  label: string;
  mark: string;
  x: number;
  y: number;
}[] = [
  { id: "descent", label: "Descent", mark: "D", x: 152, y: 42 },
  { id: "summit", label: "Summit", mark: "4", x: 88, y: 118 },
  { id: "waypoint", label: "Waypoint", mark: "3", x: 52, y: 216 },
  { id: "route", label: "Route", mark: "2", x: 118, y: 308 },
  { id: "basecamp", label: "Base Camp", mark: "1", x: 56, y: 398 },
  { id: "start", label: "Start here", mark: "S", x: 96, y: 490 },
];

const TRAIL_PATH =
  "M96 490 C64 462, 42 432, 56 398 C74 356, 110 344, 118 308 C126 270, 70 252, 52 216 C36 180, 62 144, 88 118 C108 98, 132 66, 152 42";

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
        {[...STATIONS].reverse().map((station) => {
          const status = statuses[station.id];
          const locked = status === "locked" || status === "narrative";
          return (
            <li key={station.id}>
              <button
                type="button"
                className={stationClass(status, active === station.id)}
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
        viewBox="0 0 260 530"
        role="img"
        aria-label="Trail from Start here up through Base Camp, Route, and Waypoint to Summit, then Descent"
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
