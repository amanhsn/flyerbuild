import { mono, disp } from "../../styles/helpers";
import { useIsMobile } from "../../hooks/useIsMobile";

export const KpiCard = ({ label, value, color = "var(--primary)", total, icon }) => {
  const isMobile = useIsMobile();
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div style={{
      background: "var(--bg-raised)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      padding: isMobile ? "12px 14px" : "16px 18px",
      display: "flex", flexDirection: "column", gap: isMobile ? 4 : 8,
      flex: 1, minWidth: 0,
    }}>
      <div style={mono(11, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em" })}>
        {label}
      </div>
      <div style={disp(isMobile ? 26 : 36, 800, color)}>{value}</div>
      {total != null && (
        <div style={{ height: 3, background: "var(--bg-overlay)", borderRadius: 2 }}>
          <div style={{
            width: `${pct}%`, height: "100%", borderRadius: 2,
            background: color, transition: "width .4s ease",
          }} />
        </div>
      )}
    </div>
  );
};
