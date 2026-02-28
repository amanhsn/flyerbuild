import { useState } from "react";
import { getUsersByRole } from "../../data/mockUsers";
import { TextArea } from "./Field";
import { Icon } from "../../icons/Icon";
import { useIsMobile } from "../../hooks/useIsMobile";
import { cn } from "../../lib/utils";

export const AssignmentModal = ({ title, subtitle, role, currentValue, onSubmit, onCancel }) => {
  const isMobile = useIsMobile();
  const users = getUsersByRole(role);
  const [selectedUser, setSelectedUser] = useState(currentValue || "");
  const [notes, setNotes] = useState("");

  const canSubmit = selectedUser !== "";
  const iconName = role === "subcontractor" ? "settings" : "user";

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "bg-bg-base border border-border rounded-xl w-full max-w-[460px] shadow-[0_8px_32px_rgba(0,0,0,.4)]",
          isMobile ? "p-4 mx-4" : "p-6"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-md bg-primary-glow border border-primary-dim flex items-center justify-center">
            <Icon n={iconName} size={18} color="var(--primary)" />
          </div>
          <div>
            <div className="font-display text-base font-bold tracking-wide">{title}</div>
            {subtitle && <div className="font-mono text-xs text-text-secondary">{subtitle}</div>}
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="font-mono text-xs text-text-muted uppercase tracking-[.08em] mb-1.5">
              {role === "subcontractor" ? "Subcontractor" : "Surveyor"}
            </div>
            <select
              className="w-full px-3 py-2.5 bg-bg-elevated border border-border-bright rounded-md text-text-primary font-mono text-sm outline-none transition-colors focus:border-primary"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
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
        <div className="flex gap-2.5 mt-5 justify-end">
          <button
            className="px-4 py-2 bg-bg-elevated border border-border rounded-md font-display text-base font-semibold text-text-secondary cursor-pointer transition-all"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={cn(
              "flex items-center gap-1.5 px-5 py-2 rounded-md bg-primary border border-primary text-white font-display text-[17px] font-bold tracking-[.03em] cursor-pointer transition-all",
              !canSubmit && "opacity-50 cursor-default"
            )}
            onClick={() => onSubmit(selectedUser, notes)}
            disabled={!canSubmit}
          >
            <Icon n={iconName} size={14} color="#fff" />
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};
