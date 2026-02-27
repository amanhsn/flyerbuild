import { Icon } from "../../icons/Icon";
import { mono } from "../../styles/helpers";

/**
 * EmptyState — polished empty/placeholder with icon + message.
 * @param {string} icon   - Icon name from the icon set
 * @param {string} message - Primary message text
 * @param {string} [sub]  - Optional secondary line
 * @param {number} [pad]  - Padding override (default 48)
 */
export const EmptyState = ({ icon = "clipboard", message, sub, pad = 48 }) => (
  <div style={{
    padding: pad,
    display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
    textAlign: "center",
  }}>
    <div style={{
      width: 44, height: 44, borderRadius: "50%",
      background: "var(--bg-elevated)", border: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Icon n={icon} size={20} color="var(--text-muted)" />
    </div>
    <span style={mono(13, "var(--text-muted)")}>{message}</span>
    {sub && <span style={mono(12, "var(--border-bright)")}>{sub}</span>}
  </div>
);
