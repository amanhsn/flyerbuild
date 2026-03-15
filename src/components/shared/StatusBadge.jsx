import { STATUSES } from "../../data/statusConfig";

/**
 * StatusBadge — displays survey status with color-coded styling.
 *
 * @param {string}  status       - Internal status key (e.g. "on_going")
 * @param {"default"|"surveyor"} variant - Which label set to use
 * @param {boolean} showDescription - Show description text below the badge
 * @param {"sm"|"md"}  size      - Badge size
 */
export const StatusBadge = ({
  status,
  variant = "default",
  showDescription = false,
  size = "sm",
}) => {
  const s = STATUSES[status] || STATUSES.to_do;
  const label = variant === "surveyor" ? (s.surveyorLabel || s.label) : s.label;

  const sizeClasses = size === "md"
    ? "text-[11px] px-2.5 py-1 tracking-[.06em]"
    : "text-xs px-2 py-0.5 tracking-[.08em]";

  return (
    <span className="inline-flex flex-col">
      <span
        className={`inline-flex items-center gap-1.5 font-mono font-semibold uppercase rounded-sm border ${sizeClasses}`}
        style={{ color: s.color, background: s.bg, borderColor: s.border }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: s.color }}
        />
        {label}
      </span>
      {showDescription && s.description && (
        <span className="font-mono text-[10px] text-text-secondary mt-0.5 leading-tight">
          {s.description}
        </span>
      )}
    </span>
  );
};
