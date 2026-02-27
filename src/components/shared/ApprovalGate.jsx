import { Icon } from "../../icons/Icon";
import { mono, disp } from "../../styles/helpers";

/**
 * ApprovalGate — visualizes a workflow gate status.
 * gates: [{ key, label, cleared: boolean, clearedAt?, clearedBy? }]
 */
export const ApprovalGate = ({ title, gates = [] }) => {
  const allCleared = gates.every(g => g.cleared);

  return (
    <div style={{
      background: "var(--bg-raised)", border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)", padding: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Icon
          n={allCleared ? "check" : "shield"}
          size={16}
          color={allCleared ? "var(--green)" : "var(--primary)"}
        />
        <div style={disp(14, 600, allCleared ? "var(--text-green)" : "var(--text-primary)")}>
          {title}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {gates.map(g => (
          <div key={g.key} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 12px",
            background: g.cleared ? "var(--green-glow)" : "var(--bg-overlay)",
            border: `1px solid ${g.cleared ? "var(--green-dim)" : "var(--border)"}`,
            borderRadius: "var(--radius-sm)",
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: g.cleared ? "var(--green)" : "var(--bg-elevated)",
              border: g.cleared ? "none" : "1px solid var(--border)",
            }}>
              {g.cleared && <Icon n="check" size={12} color="#fff" />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={mono(11, g.cleared ? "var(--text-green)" : "var(--text-secondary)")}>
                {g.label}
              </div>
              {g.cleared && g.clearedBy && (
                <div style={mono(11, "var(--text-muted)", { marginTop: 2 })}>
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
