import { mono } from "../../styles/helpers";

export const MiniProgress = ({ val, total, color }) => {
  const barColor = color || "var(--primary)";
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 3, background: "var(--bg-overlay)", borderRadius: 2 }}>
        <div style={{
          width: `${total > 0 ? (val / total) * 100 : 0}%`,
          height: "100%",
          borderRadius: 2,
          transition: "width .4s ease",
          background: barColor,
        }} />
      </div>
      <span style={mono(12, "var(--text-muted)", { flexShrink: 0 })}>{val}/{total}</span>
    </div>
  );
};
