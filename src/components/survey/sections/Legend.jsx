import { useLang } from "../../../i18n/LangContext";


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
      <div
        className="w-3.5 h-3.5 rounded-full shrink-0"
        style={{ background: color }}
      />
    );
  }
  if (type === "rect") {
    return (
      <div
        className="w-4 h-3 shrink-0 opacity-80"
        style={{ borderRadius: 2, background: color }}
      />
    );
  }
  // line
  return (
    <div
      className="w-6 h-0 shrink-0"
      style={{ borderTop: `3px ${dashed ? "dashed" : "solid"} ${color}` }}
    />
  );
};

export const Legend = () => {
  const { t } = useLang();

  return (
    <div className="flex flex-col gap-4">
      <div className="font-mono text-xs text-text-muted uppercase tracking-widest">
        {t("annotationLegend")}
      </div>

      <div className="grid grid-cols-2 gap-1.5 bg-bg-raised border border-border rounded-lg p-4">
        {LEGEND_ITEMS.map(({ label, color, type, dashed }) => (
          <div
            key={label}
            className="flex items-center gap-2.5 py-2 px-2.5 rounded-sm bg-bg-elevated border border-border"
          >
            <LegendSymbol type={type} color={color} dashed={dashed} />
            <span className="font-mono text-xs text-text-secondary">
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-text-muted text-center py-2.5 px-3.5 bg-bg-overlay rounded-sm border border-border">
        This legend is for reference only and applies to floor plan annotations.
      </div>
    </div>
  );
};
