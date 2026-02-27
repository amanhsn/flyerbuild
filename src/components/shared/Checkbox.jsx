import { mono } from "../../styles/helpers";

export const Checkbox = ({ label, checked, onChange, disabled }) => (
  <label style={{
    display: "flex", alignItems: "center", gap: 10, cursor: disabled ? "default" : "pointer",
    padding: "8px 0", opacity: disabled ? 0.55 : 1,
  }}>
    <div style={{
      width: 20, height: 20, borderRadius: "var(--radius-sm)",
      border: `1px solid ${checked ? "var(--primary)" : "var(--border-bright)"}`,
      background: checked ? "var(--primary)" : "var(--bg-elevated)",
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all .15s", flexShrink: 0,
    }}>
      {checked && (
        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
    <span style={mono(12, "var(--text-secondary)")}>{label}</span>
  </label>
);
