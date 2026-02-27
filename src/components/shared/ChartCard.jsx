import { mono, disp } from "../../styles/helpers";

/**
 * ChartCard — simple bar chart card for dashboards.
 * data: [{ label, value, color? }]
 * title: string
 */
export const ChartCard = ({ title, data = [], height = 120 }) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);

  return (
    <div style={{
      background: "var(--bg-raised)", border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)", padding: 16,
    }}>
      <div style={mono(11, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 })}>
        {title}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={mono(11, "var(--text-secondary)")}>{d.value}</div>
            <div style={{
              width: "100%", maxWidth: 40,
              height: `${(d.value / maxVal) * (height - 30)}px`,
              background: d.color || "var(--primary)",
              borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
              minHeight: 2, transition: "height .3s ease",
            }} />
            <div style={mono(8, "var(--text-muted)", { textAlign: "center", lineHeight: 1.2 })}>
              {d.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
