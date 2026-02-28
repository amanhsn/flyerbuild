import { cn } from "../../lib/utils";

export const Checkbox = ({ label, checked, onChange, disabled }) => (
  <label className={cn(
    "flex items-center gap-2.5 py-2 cursor-pointer",
    disabled && "cursor-default opacity-55"
  )}>
    <div className={cn(
      "w-5 h-5 rounded-sm border flex items-center justify-center shrink-0 transition-all",
      checked
        ? "border-primary bg-primary"
        : "border-border-bright bg-bg-elevated"
    )}>
      {checked && (
        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
    <span className="font-mono text-sm text-text-secondary">{label}</span>
  </label>
);
