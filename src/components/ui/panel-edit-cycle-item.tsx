import { useCallback, useId } from "react";
import { RefreshCw } from "lucide-react";

/**
 * Panel Edit Cycle Item
 *
 * Radio-style control for a closed state cycle. The Refresh icon sits to the
 * left as the visual label. Click advances one state; Ctrl+click (or Meta+click
 * on macOS) steps backward.
 */
export type PanelEditCycleState =
  | "draft"
  | "approved"
  | "published"
  | "archived";

export const PANEL_EDIT_CYCLE_STATES: readonly PanelEditCycleState[] = [
  "draft",
  "approved",
  "published",
  "archived",
] as const;

export const PANEL_EDIT_CYCLE_LABELS: Record<PanelEditCycleState, string> = {
  draft: "Draft",
  approved: "Approved",
  published: "Published",
  archived: "Archived",
};

export type PanelEditCycleItemProps = {
  value: PanelEditCycleState;
  onChange: (next: PanelEditCycleState) => void;
  disabled?: boolean;
  /** Accessible name for the control group */
  name?: string;
  className?: string;
  /** Spin the refresh icon while an async change is in flight */
  busy?: boolean;
};

function normalizeValue(value: string): PanelEditCycleState {
  if ((PANEL_EDIT_CYCLE_STATES as readonly string[]).includes(value)) {
    return value as PanelEditCycleState;
  }
  // Map legacy "pending" / "unpublished" into the cycle
  if (value === "pending") return "draft";
  return "draft";
}

function nextState(
  current: PanelEditCycleState,
  backward: boolean,
): PanelEditCycleState {
  const i = PANEL_EDIT_CYCLE_STATES.indexOf(current);
  const len = PANEL_EDIT_CYCLE_STATES.length;
  const idx = i < 0 ? 0 : i;
  const next = backward ? (idx - 1 + len) % len : (idx + 1) % len;
  return PANEL_EDIT_CYCLE_STATES[next]!;
}

export function PanelEditCycleItem({
  value,
  onChange,
  disabled = false,
  name,
  className = "",
  busy = false,
}: PanelEditCycleItemProps) {
  const autoId = useId();
  const groupName = name ?? `panel-edit-cycle-${autoId}`;
  const current = normalizeValue(value);
  const label = PANEL_EDIT_CYCLE_LABELS[current];

  const cycle = useCallback(
    (backward: boolean) => {
      if (disabled || busy) return;
      onChange(nextState(current, backward));
    },
    [busy, current, disabled, onChange],
  );

  return (
    <div
      className={["ac-peci", className].filter(Boolean).join(" ")}
      role="radiogroup"
      aria-label="Publish state"
      data-state={current}
    >
      <span className="ac-peci-icon" aria-hidden="true" title="Cycle state">
        <RefreshCw
          className={busy ? "is-spinning" : undefined}
          strokeWidth={2.25}
          size={15}
        />
      </span>

      <button
        type="button"
        className={`ac-peci-btn ac-peci-btn--${current}`}
        role="radio"
        aria-checked="true"
        aria-label={`State: ${label}. Click for next, hold Control and click for previous.`}
        title="Click → next state · Ctrl+click → previous"
        name={groupName}
        disabled={disabled || busy}
        onClick={(e) => {
          e.preventDefault();
          // Ctrl (Windows/Linux) or Meta (macOS) steps backward
          cycle(e.ctrlKey || e.metaKey);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault();
            cycle(false);
          } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();
            cycle(true);
          } else if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            cycle(e.ctrlKey || e.metaKey);
          }
        }}
      >
        <span className="ac-peci-dot" aria-hidden="true" />
        <span className="ac-peci-label">{label}</span>
      </button>

      {/* Hidden radios for form semantics / screen readers that prefer radio sets */}
      <div className="ac-peci-radios visually-hidden" aria-hidden="true">
        {PANEL_EDIT_CYCLE_STATES.map((s) => (
          <input
            key={s}
            type="radio"
            name={`${groupName}-sync`}
            value={s}
            checked={s === current}
            readOnly
            tabIndex={-1}
          />
        ))}
      </div>
    </div>
  );
}
