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
        alignItems: "center", justifyContent: "center", gap: 6, margin: 8,
        border: `2px dashed ${required ? "var(--red-dim)" : "var(--border)"}`,
        borderRadius: "var(--radius-lg)",
      }}>
        <Icon n="plus" size={20} color={required ? "var(--text-red)" : "var(--text-muted)"} />
        <span style={{ ...mono(12, required ? "var(--text-red)" : "var(--text-muted)"), textAlign: "center" }}>
          {label}{required && " *"}
        </span>
      </div>
    )}
  </div>
);
