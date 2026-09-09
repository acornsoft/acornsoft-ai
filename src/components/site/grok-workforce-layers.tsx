import { useEffect, useRef, useState } from "react";
import { WORKFORCE_LAYERS, type WorkforceLayer } from "./field-guide-data";

type Props = {
  compact?: boolean;
  defaultOpen?: boolean;
};

const TOKEN: Record<WorkforceLayer["id"], string> = {
  voice: "/images/workforce/token-voice.jpg",
  build: "/images/workforce/token-build.jpg",
  grok: "/images/workforce/token-grok.jpg",
  imagine: "/images/workforce/token-imagine.jpg",
};

export function GrokWorkforceLayers({ compact = false }: Props) {
  const [kit, setKit] = useState<Set<WorkforceLayer["id"]>>(new Set());
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.pause();
      return;
    }
    void el.play().catch(() => {});
  }, [compact]);

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
      <div className="ac-wf-film">
        {compact ? (
          <img
            className="ac-wf-still"
            src="/images/workforce/climb-cut.jpg"
            alt=""
          />
        ) : (
          <video
            ref={videoRef}
            className="ac-wf-video"
            poster="/images/workforce/climb-cut.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/images/workforce/climb-cut.mp4" type="video/mp4" />
          </video>
        )}
      </div>

      <ol className="ac-wf-hud" aria-label="Tools">
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
                <img
                  className="ac-wf-token"
                  src={TOKEN[layer.id]}
                  alt=""
                  width={48}
                  height={48}
                />
                <span className="ac-wf-hand-t">{layer.title}</span>
                <span className="ac-wf-hand-l">{layer.line}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
