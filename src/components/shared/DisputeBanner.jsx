import { Icon } from "../../icons/Icon";
import { mono } from "../../styles/helpers";

/**
 * DisputeBanner — shown to subcontractors when blocked by a dispute.
 */
export const DisputeBanner = ({ dispute, onDismiss }) => {
  if (!dispute) return null;

  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 12,
      padding: "14px 16px", margin: "0 0 12px",
      background: "var(--red-glow)", border: "1px solid var(--red-dim)",
      borderRadius: "var(--radius-md)",
    }}>
      <Icon n="alert" size={18} color="var(--red)" style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1 }}>
        <div style={{ ...mono(12, "var(--text-red)"), fontWeight: 600, marginBottom: 4 }}>
          Dispute Raised — Uploads Blocked
        </div>
        <div style={mono(11, "var(--text-secondary)")}>
          {dispute.comment || "A dispute has been raised by the project manager. Please review the instructions below."}
        </div>
        {dispute.instructions && (
          <div style={{
            ...mono(11, "var(--text-primary)"),
            marginTop: 8, padding: "8px 10px",
            background: "var(--bg-overlay)", borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border)",
          }}>
            {dispute.instructions}
          </div>
        )}
      </div>
      {onDismiss && (
        <button onClick={onDismiss} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <Icon n="x" size={14} color="var(--text-red)" />
        </button>
      )}
    </div>
  );
};
