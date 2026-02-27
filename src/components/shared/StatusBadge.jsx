import { STATUSES } from "../../data/statusConfig";
import { mono } from "../../styles/helpers";

export const StatusBadge = ({ status }) => {
  const s = STATUSES[status] || STATUSES.to_do;
  return (
    <span style={{
      ...mono(11, s.color),
      fontWeight: 600,
      letterSpacing: ".08em",
      textTransform: "uppercase",
      padding: "3px 8px",
      borderRadius: "var(--radius-sm)",
      background: s.bg,
      border: `1px solid ${s.border}`,
    }}>
      {s.label}
    </span>
  );
};
