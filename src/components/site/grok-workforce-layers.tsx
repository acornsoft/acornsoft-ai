import { useState } from "react";
import { WORKFORCE_LAYERS, type WorkforceLayer } from "./field-guide-data";

type Props = {
  compact?: boolean;
  defaultOpen?: boolean;
};

export function GrokWorkforceLayers({ compact = false }: Props) {
  const [kit, setKit] = useState<Set<WorkforceLayer["id"]>>(new Set());

  function toggle(id: WorkforceLayer["id"]) {
    setKit((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <figure className={`ac-wf ac-wf--stage${compact ? " ac-wf--compact" : ""}`}>
      <ol className="ac-wf-hud" aria-label="Optional Grok tools">
        {WORKFORCE_LAYERS.map((layer) => {
          const inKit = kit.has(layer.id);
          return (
            <li
              key={layer.id}
              id={layer.recipeId}
              className={`ac-wf-hand ac-wf-hand--${layer.id}${inKit ? " is-in" : ""}`}
            >
              <button
                type="button"
                className="ac-wf-hand-hit"
                aria-pressed={inKit}
                onClick={() => toggle(layer.id)}
              >
                <span className="ac-wf-token" aria-hidden>
                  {layer.verb}
                </span>
                <span className="ac-wf-hand-t">{layer.title}</span>
                {compact ? null : (
                  <span className="ac-wf-hand-l">{layer.line}</span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
