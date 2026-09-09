import { useEffect, useState } from "react";
import {
  fieldRecipes,
  WORKFORCE_LAYERS,
  type FieldRecipe,
  type WorkforceLayer,
} from "./field-guide-data";

const LOOP_PATH =
  "M180 72 H620 C708 72 728 92 728 160 V248 C728 316 708 336 620 336 H180 C92 336 72 316 72 248 V160 C72 92 92 72 180 72 Z";

const STATION_POS: Record<string, { x: number; y: number }> = {
  "name-the-problem": { x: 180, y: 72 },
  "set-the-measure": { x: 620, y: 72 },
  "cut-the-slice": { x: 620, y: 336 },
  "write-the-note": { x: 180, y: 336 },
};

type Props = {
  compact?: boolean;
};

export function OperatingCycle({ compact = false }: Props) {
  const [active, setActive] = useState<FieldRecipe["id"]>(
    compact ? "write-the-note" : "write-the-note",
  );
  const [kit, setKit] = useState<Set<WorkforceLayer["id"]>>(new Set());
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const recipe = fieldRecipes.find((r) => r.id === active) ?? fieldRecipes[0];
  const onExec = active === "write-the-note";

  function toggle(id: WorkforceLayer["id"]) {
    setActive("write-the-note");
    setKit((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (compact) {
    return <ToolRail kit={kit} onToggle={toggle} compact />;
  }

  return (
    <figure className="ac-cycle">
      <div className="ac-cycle-board">
        <svg
          className="ac-cycle-svg"
          viewBox="0 0 800 410"
          role="img"
          aria-label="Operating cycle: Base Camp, Route, Waypoint, Execution, return to Base Camp"
        >
          <path className="ac-cycle-track" d={LOOP_PATH} />
          <path className="ac-cycle-return" d="M180 336 C120 336 90 280 90 216" />
          {!reduce ? (
            <circle className="ac-cycle-runner" r="6" cx="180" cy="72">
              <animateMotion
                dur="10s"
                repeatCount="indefinite"
                rotate="auto"
                path={LOOP_PATH}
              />
            </circle>
          ) : null}
          {fieldRecipes.map((step) => {
            const p = STATION_POS[step.id];
            const on = active === step.id;
            return (
              <g
                key={step.id}
                className={`ac-cycle-node${on ? " is-on" : ""}`}
                transform={`translate(${p.x} ${p.y})`}
              >
                <a href={`#${step.id}`} onClick={(e) => {
                  e.preventDefault();
                  setActive(step.id);
                }}>
                  <circle r={on ? 28 : 22} />
                  <text className="ac-cycle-num" textAnchor="middle" dy="5">
                    {step.number}
                  </text>
                </a>
              </g>
            );
          })}
          <text className="ac-cycle-lab" x="180" y="28" textAnchor="middle">
            Base Camp
          </text>
          <text className="ac-cycle-lab" x="620" y="28" textAnchor="middle">
            Route
          </text>
          <text className="ac-cycle-lab" x="620" y="378" textAnchor="middle">
            Waypoint
          </text>
          <text className="ac-cycle-lab" x="180" y="378" textAnchor="middle">
            Execution
          </text>
        </svg>
      </div>

      <figcaption className="ac-cycle-panel" id={recipe.id}>
        <p className="ac-cycle-kicker">
          {recipe.number} · {recipe.title}
        </p>
        <h2 className="ac-cycle-title">{recipe.when}</h2>
        {recipe.steps.length > 0 ? (
          <ol className="ac-cycle-steps">
            {recipe.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        ) : null}
        <p className="ac-cycle-done">
          Complete when {recipe.doneWhen.charAt(0).toLowerCase()}
          {recipe.doneWhen.slice(1)}
        </p>
        {onExec ? <ToolRail kit={kit} onToggle={toggle} /> : null}
        {onExec ? (
          <p className="ac-cycle-back">
            <button
              type="button"
              onClick={() => setActive("name-the-problem")}
            >
              Return to Base Camp
            </button>
          </p>
        ) : null}
      </figcaption>
    </figure>
  );
}

function ToolRail({
  kit,
  onToggle,
  compact = false,
}: {
  kit: Set<WorkforceLayer["id"]>;
  onToggle: (id: WorkforceLayer["id"]) => void;
  compact?: boolean;
}) {
  return (
    <ol
      className={`ac-cycle-tools${compact ? " is-compact" : ""}`}
      aria-label="Optional Grok tools"
    >
      {WORKFORCE_LAYERS.map((layer) => {
        const on = kit.has(layer.id);
        return (
          <li key={layer.id}>
            <button
              type="button"
              className={`ac-cycle-tool ac-cycle-tool--${layer.id}${on ? " is-on" : ""}`}
              aria-pressed={on}
              onClick={() => onToggle(layer.id)}
            >
              <span className="ac-cycle-tool-mark" aria-hidden>
                {layer.verb}
              </span>
              <span className="ac-cycle-tool-t">{layer.title}</span>
              {compact ? null : (
                <span className="ac-cycle-tool-l">{layer.line}</span>
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
