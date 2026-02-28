import { STATUSES } from "../../data/statusConfig";

export const StatusBadge = ({ status }) => {
  const s = STATUSES[status] || STATUSES.to_do;
  return (
    <span
      className="inline-flex items-center font-mono text-xs font-semibold tracking-[.08em] uppercase px-2 py-0.5 rounded-sm border"
      style={{ color: s.color, background: s.bg, borderColor: s.border }}
    >
      {s.label}
    </span>
  );
};
