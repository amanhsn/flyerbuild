import { mono } from "../../styles/helpers";

export const Field = ({ label, value, onChange, disabled, flex, type = "text", placeholder }) => (
  <div style={{ flex: flex || 1 }}>
    {label && (
      <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 5 })}>
        {label}
      </div>
    )}
    <input
      className="field-input"
      type={type}
      value={value ?? ""}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      defaultValue={!onChange ? value : undefined}
      disabled={disabled}
      placeholder={placeholder}
    />
  </div>
);

export const TextArea = ({ label, value, onChange, disabled, placeholder, rows = 4 }) => (
  <div style={{ flex: 1 }}>
    {label && (
      <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 5 })}>
        {label}
      </div>
    )}
    <textarea
      className="field-input"
      value={value ?? ""}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      defaultValue={!onChange ? value : undefined}
      disabled={disabled}
      placeholder={placeholder}
      rows={rows}
      style={{ width: "100%" }}
    />
  </div>
);
