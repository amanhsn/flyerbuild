import { Icon } from "../../../icons/Icon";
import { useLang } from "../../../i18n/LangContext";
import { mono, disp } from "../../../styles/helpers";

const TOOLS = [
  { key: "pen", icon: "pen", label: "Pen" },
  { key: "line", icon: "sig", label: "Line" },
  { key: "text", icon: "file", label: "Text" },
  { key: "undo", icon: "x", label: "Undo" },
];

export const FloorplanCanvas = ({ survey, setField, disabled }) => {
  const { t } = useLang();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Toolbar */}
      <div style={{
        display: "flex",
        gap: 6,
        padding: "8px 10px",
        background: "var(--bg-overlay)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border)",
      }}>
        {TOOLS.map(({ key, icon, label }) => (
          <button
            key={key}
            disabled={disabled}
            className="toggle-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              cursor: disabled ? "default" : "pointer",
              opacity: disabled ? 0.5 : 1,
            }}
            title={label}
          >
            <Icon n={icon} size={14} color="var(--text-secondary)" />
            <span style={mono(11, "var(--text-secondary)")}>{label}</span>
          </button>
        ))}
      </div>

      {/* Canvas Area */}
      <div style={{
        width: "100%",
        height: 420,
        background: "var(--bg-base)",
        border: "2px solid var(--border-bright)",
        borderRadius: "var(--radius-lg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Grid pattern hint */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          pointerEvents: "none",
        }} />

        <Icon n="pen" size={32} color="var(--text-muted)" />
        <span style={disp(16, 600, "var(--text-muted)")}>
          {t("drawFloorPlan")}
        </span>
        <span style={mono(11, "var(--text-muted)")}>
          {t("canvasPlaceholder")}
        </span>
      </div>
    </div>
  );
};
