import { useLang } from "../../i18n/LangContext";
import { REJECTION_REASONS } from "../../data/rejectionReasons";

export const ReasonCodeSelect = ({ value, onChange, disabled = false, label = "Reason" }) => {
  const { lang } = useLang();

  return (
    <div>
      <div className="font-mono text-xs text-text-muted uppercase tracking-[.08em] mb-1.5">
        {label}
      </div>
      <select
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className="w-full px-3.5 py-2.5 bg-bg-overlay text-text-primary border border-border rounded-sm font-mono text-xs cursor-pointer disabled:cursor-default"
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
