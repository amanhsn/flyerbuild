import { useLang } from "../../../i18n/LangContext";
import { mono, disp } from "../../../styles/helpers";

const LEGEND_ITEMS = [
  { label: "Fiber Cable", color: "var(--primary)", type: "line" },
  { label: "Coax Cable", color: "var(--blue)", type: "line" },
  { label: "Electricity Cable", color: "var(--red)", type: "line" },
  { label: "Wall Penetration", color: "var(--green)", type: "circle" },
  { label: "Cable Duct", color: "var(--text-secondary)", type: "line", dashed: true },
  { label: "Vertical Shaft", color: "var(--primary)", type: "rect" },
  { label: "Distribution Box", color: "var(--blue)", type: "rect" },
  { label: "Connection Point", color: "var(--green)", type: "circle" },
  { label: "Fire Barrier", color: "var(--red)", type: "rect" },
  { label: "Floor Box", color: "var(--text-secondary)", type: "rect" },
];

const LegendSymbol = ({ type, color, dashed }) => {
  if (type === "circle") {
    return (
      <div style={{
        width: 14, height: 14, borderRadius: "50%",
        background: color, flexShrink: 0,
      }} />
    );
  }
  if (type === "rect") {
    return (
      <div style={{
        width: 16, height: 12, borderRadius: 2,
        background: color, opacity: 0.8, flexShrink: 0,
      }} />
    );
  }
  // line
  return (
    <div style={{
      width: 24, height: 0,
      borderTop: `3px ${dashed ? "dashed" : "solid"} ${color}`,
      flexShrink: 0,
    }} />
  );
};

export const Legend = () => {
  const { t } = useLang();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={mono(11, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em" })}>
        {t("annotationLegend")}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 6,
        background: "var(--bg-raised)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: 16,
      }}>
        {LEGEND_ITEMS.map(({ label, color, type, dashed }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 10px",
              borderRadius: "var(--radius-sm)",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
            }}
          >
            <LegendSymbol type={type} color={color} dashed={dashed} />
            <span style={mono(11, "var(--text-secondary)")}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <div style={{
        ...mono(11, "var(--text-muted)"),
        padding: "10px 14px",
        background: "var(--bg-overlay)",
        borderRadius: "var(--radius-sm)",
        border: "1px solid var(--border)",
        textAlign: "center",
      }}>
        This legend is for reference only and applies to floor plan annotations.
      </div>
    </div>
  );
};
