import { useIsMobile } from "../../hooks/useIsMobile";
import { cn } from "../../lib/utils";

export const KpiCard = ({ label, value, color = "var(--primary)", total }) => {
  const isMobile = useIsMobile();
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className={cn(
      "bg-bg-raised border border-border rounded-lg flex flex-col flex-1 min-w-0",
      isMobile ? "px-3.5 py-3 gap-1" : "px-[18px] py-4 gap-2"
    )}>
      <div className="font-mono text-xs text-text-muted uppercase tracking-[.08em]">
        {label}
      </div>
      <div
        className={cn(
          "font-display font-extrabold tracking-wide",
          isMobile ? "text-[26px]" : "text-4xl"
        )}
        style={{ color }}
      >
        {value}
      </div>
      {total != null && (
        <div className="h-[3px] bg-bg-overlay rounded-sm">
          <div
            className="h-full rounded-sm transition-[width] duration-400 ease-out"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
      )}
    </div>
  );
};
