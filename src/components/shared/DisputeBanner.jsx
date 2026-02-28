import { Icon } from "../../icons/Icon";
import { cn } from "../../lib/utils";

export const DisputeBanner = ({ dispute, onDismiss }) => {
  if (!dispute) return null;

  return (
    <div className="flex items-start gap-3 px-4 py-3.5 mb-3 bg-red-glow border border-red-dim rounded-md">
      <Icon n="alert" size={18} color="var(--red)" className="shrink-0 mt-0.5" />
      <div className="flex-1">
        <div className="font-mono text-sm text-text-red font-semibold mb-1">
          Dispute Raised — Uploads Blocked
        </div>
        <div className="font-mono text-xs text-text-secondary">
          {dispute.comment || "A dispute has been raised by the project manager. Please review the instructions below."}
        </div>
        {dispute.instructions && (
          <div className="font-mono text-xs text-text-primary mt-2 px-2.5 py-2 bg-bg-overlay rounded-sm border border-border">
            {dispute.instructions}
          </div>
        )}
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="bg-transparent border-none cursor-pointer p-1">
          <Icon n="x" size={14} color="var(--text-red)" />
        </button>
      )}
    </div>
  );
};
