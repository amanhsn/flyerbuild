import { cn } from "../../lib/utils";

const inputClasses = "w-full px-3 py-2.5 bg-bg-elevated border border-border-bright rounded-md text-text-primary font-mono text-sm outline-none transition-colors focus:border-primary disabled:bg-bg-overlay disabled:border-border";

export const Field = ({ label, value, onChange, disabled, flex, type = "text", placeholder, className }) => (
  <div className={cn("min-w-0", className)} style={flex != null ? { flex } : { flex: 1 }}>
    {label && (
      <div className="font-mono text-xs text-text-muted uppercase tracking-[.08em] mb-1.5">
        {label}
      </div>
    )}
    <input
      className={inputClasses}
      type={type}
      value={value ?? ""}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      defaultValue={!onChange ? value : undefined}
      disabled={disabled}
      placeholder={placeholder}
    />
  </div>
);

export const TextArea = ({ label, value, onChange, disabled, placeholder, rows = 4, className }) => (
  <div className={cn("flex-1 min-w-0", className)}>
    {label && (
      <div className="font-mono text-xs text-text-muted uppercase tracking-[.08em] mb-1.5">
        {label}
      </div>
    )}
    <textarea
      className={cn(inputClasses, "resize-y w-full")}
      value={value ?? ""}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      defaultValue={!onChange ? value : undefined}
      disabled={disabled}
      placeholder={placeholder}
      rows={rows}
    />
  </div>
);
