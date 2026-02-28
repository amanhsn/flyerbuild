import { Icon } from "../../icons/Icon";
import { cn } from "../../lib/utils";

export const ApprovalGate = ({ title, gates = [] }) => {
  const allCleared = gates.every(g => g.cleared);

  return (
    <div className="bg-bg-raised border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon
          n={allCleared ? "check" : "shield"}
          size={16}
          color={allCleared ? "var(--green)" : "var(--primary)"}
        />
        <div className={cn(
          "font-display text-sm font-semibold tracking-wide",
          allCleared ? "text-text-green" : "text-text-primary"
        )}>
          {title}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {gates.map(g => (
          <div
            key={g.key}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-sm border",
              g.cleared
                ? "bg-green-glow border-green-dim"
                : "bg-bg-overlay border-border"
            )}
          >
            <div className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center",
              g.cleared
                ? "bg-green"
                : "bg-bg-elevated border border-border"
            )}>
              {g.cleared && <Icon n="check" size={12} color="#fff" />}
            </div>
            <div className="flex-1">
              <div className={cn(
                "font-mono text-xs",
                g.cleared ? "text-text-green" : "text-text-secondary"
              )}>
                {g.label}
              </div>
              {g.cleared && g.clearedBy && (
                <div className="font-mono text-xs text-text-muted mt-0.5">
                  {g.clearedBy} · {g.clearedAt || ""}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
