import { Icon } from "../../icons/Icon";
import { mono } from "../../styles/helpers";

export const PhotoSlot = ({ label, required = false, filled = false, onClick }) => (
  <div
    className={`photo-slot${!filled && required ? " missing-required" : ""}`}
    onClick={onClick}
  >
    {filled ? (
      <>
        <div style={{
          flex: 1,
          background: "linear-gradient(135deg,var(--bg-overlay),var(--bg-elevated))",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon n="camera" size={26} color="var(--text-muted)" />
        </div>
        <div style={{
          padding: "7px 10px",
          background: "var(--bg-overlay)",
          display: "flex", justifyContent: "space-between",
          ...mono(12, "var(--text-secondary)"),
        }}>
          <span>{label}</span>
          <span style={{ color: "var(--text-green)" }}>✓</span>
        </div>
      </>
    ) : (
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 8, margin: 8,
        border: `2px dashed ${required ? "var(--red-dim)" : "var(--border)"}`,
        borderRadius: "var(--radius-lg)",
        background: `radial-gradient(circle at 50% 40%, ${required ? "var(--red-glow)" : "var(--bg-elevated)"} 0%, transparent 70%)`,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: required ? "var(--red-glow)" : "var(--bg-overlay)",
          border: `1px solid ${required ? "var(--red-dim)" : "var(--border)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon n="camera" size={16} color={required ? "var(--text-red)" : "var(--text-muted)"} />
        </div>
        <span style={{ ...mono(11, required ? "var(--text-red)" : "var(--text-muted)"), textAlign: "center", lineHeight: 1.3, maxWidth: "80%" }}>
          {label}{required && " *"}
        </span>
      </div>
    )}
  </div>
);
