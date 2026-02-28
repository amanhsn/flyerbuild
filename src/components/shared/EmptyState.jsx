import { Icon } from "../../icons/Icon";

export const EmptyState = ({ icon = "clipboard", message, sub, pad = 48 }) => (
  <div className="flex flex-col items-center gap-2.5 text-center" style={{ padding: pad }}>
    <div className="w-11 h-11 rounded-full bg-bg-elevated border border-border flex items-center justify-center">
      <Icon n={icon} size={20} color="var(--text-muted)" />
    </div>
    <span className="font-mono text-[13px] text-text-muted">{message}</span>
    {sub && <span className="font-mono text-xs text-border-bright">{sub}</span>}
  </div>
);
