import { useLang } from "../../i18n/LangContext";
import { REJECTION_REASONS } from "../../data/rejectionReasons";
import { mono } from "../../styles/helpers";

/**
 * ReasonCodeSelect — dropdown for selecting predefined reason codes.
 * Used by Validator (rejection) and Subcontractor (reassignment request).
 */
export const ReasonCodeSelect = ({ value, onChange, disabled = false, label = "Reason" }) => {
  const { lang } = useLang();

  return (
    <div>
      <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 })}>
        {label}
      </div>
      <select
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        style={{
          width: "100%", padding: "10px 14px",
          background: "var(--bg-overlay)", color: "var(--text-primary)",
          border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
          fontFamily: "var(--font-mono)", fontSize: 12,
          cursor: disabled ? "default" : "pointer",
        }}
      >
        <option value="">Select a reason...</option>
        {REJECTION_REASONS.map(r => (
          <option key={r.code} value={r.code}>
            {lang === "nl" ? r.labelNl : r.label}
          </option>
        ))}
      </select>
    </div>
  );
};
