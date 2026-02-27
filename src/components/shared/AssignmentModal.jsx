import { useState } from "react";
import { getUsersByRole } from "../../data/mockUsers";
import { TextArea } from "./Field";
import { Icon } from "../../icons/Icon";
import { mono, disp } from "../../styles/helpers";
import { useIsMobile } from "../../hooks/useIsMobile";

export const AssignmentModal = ({ title, subtitle, role, currentValue, onSubmit, onCancel }) => {
  const isMobile = useIsMobile();
  const users = getUsersByRole(role);
  const [selectedUser, setSelectedUser] = useState(currentValue || "");
  const [notes, setNotes] = useState("");

  const canSubmit = selectedUser !== "";
  const iconName = role === "subcontractor" ? "settings" : "user";
  const accentBg = "var(--primary-glow)";
  const accentBorder = "var(--primary-dim)";
  const accentColor = "var(--primary)";

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-base)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)", padding: isMobile ? 16 : 24, width: "100%",
          maxWidth: 460, margin: isMobile ? "0 16px" : 0,
          boxShadow: "0 8px 32px rgba(0,0,0,.4)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "var(--radius-md)",
            background: accentBg, border: `1px solid ${accentBorder}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon n={iconName} size={18} color={accentColor} />
          </div>
          <div>
            <div style={disp(16, 700)}>{title}</div>
            {subtitle && <div style={mono(12, "var(--text-secondary)")}>{subtitle}</div>}
          </div>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 5 })}>
              {role === "subcontractor" ? "Subcontractor" : "Surveyor"}
            </div>
            <select
              className="field-input"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="">Select {role === "subcontractor" ? "subcontractor" : "surveyor"}...</option>
              {users.map((u) => (
                <option key={u.id} value={u.name}>{u.name}</option>
              ))}
            </select>
          </div>

          <TextArea
            label="Notes (optional)"
            value={notes}
            onChange={setNotes}
            placeholder="Add assignment notes..."
            rows={3}
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
          <button className="cta-btn secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="toggle-btn primary active"
            onClick={() => onSubmit(selectedUser, notes)}
            disabled={!canSubmit}
            style={{
              padding: "8px 20px", display: "flex", alignItems: "center", gap: 6,
              opacity: canSubmit ? 1 : 0.5,
            }}
          >
            <Icon n={iconName} size={14} color="#fff" />
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};
