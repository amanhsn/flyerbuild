import { Icon } from "../../icons/Icon";
import { cn } from "../../lib/utils";

export const PhotoSlot = ({ label, required = false, filled = false, onClick }) => (
  <div
    className={cn("photo-slot", !filled && required && "missing-required")}
    onClick={onClick}
  >
    {filled ? (
      <>
        <div className="flex-1 flex items-center justify-center" style={{ background: "linear-gradient(135deg,var(--bg-overlay),var(--bg-elevated))" }}>
          <Icon n="camera" size={26} color="var(--text-muted)" />
        </div>
        <div className="font-mono text-xs text-text-secondary px-2.5 py-[7px] bg-bg-overlay flex justify-between">
          <span>{label}</span>
          <span className="text-text-green">&#10003;</span>
        </div>
      </>
    ) : (
      <div
        className="flex-1 flex flex-col items-center justify-center gap-2 m-2 rounded-lg"
        style={{
          border: `2px dashed ${required ? "var(--red-dim)" : "var(--border)"}`,
          background: `radial-gradient(circle at 50% 40%, ${required ? "var(--red-glow)" : "var(--bg-elevated)"} 0%, transparent 70%)`,
        }}
      >
        <div
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center border",
            required
              ? "bg-red-glow border-red-dim"
              : "bg-bg-overlay border-border"
          )}
        >
          <Icon n="camera" size={16} color={required ? "var(--text-red)" : "var(--text-muted)"} />
        </div>
        <span
          className={cn(
            "font-mono text-[11px] text-center leading-snug max-w-[80%]",
            required ? "text-text-red" : "text-text-muted"
          )}
        >
          {label}{required && " *"}
        </span>
      </div>
    )}
  </div>
);
