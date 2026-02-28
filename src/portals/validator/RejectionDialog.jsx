import { useState } from "react";
import { ReasonCodeSelect } from "../../components/shared/ReasonCodeSelect";
import { TextArea } from "../../components/shared/Field";
import { Icon } from "../../icons/Icon";

export const RejectionDialog = ({ onSubmit, onCancel }) => {
  const [reasonCode, setReasonCode] = useState("");
  const [notes, setNotes] = useState("");

  const canSubmit = reasonCode !== "";

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{
      background: "rgba(0,0,0,.6)",
      zIndex: 1000,
    }}>
      <div className="w-full rounded-xl border border-border" style={{
        background: "var(--bg-base)",
        padding: 24,
        maxWidth: 460, boxShadow: "0 8px 32px rgba(0,0,0,.4)",
      }}>
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex items-center justify-center rounded-md" style={{
            width: 36, height: 36,
            background: "var(--red-glow)", border: "1px solid var(--red-dim)",
          }}>
            <Icon n="x" size={18} color="var(--red)" />
          </div>
          <div>
            <div className="font-display text-base font-bold tracking-wide">Reject Survey</div>
            <div className="font-mono text-xs text-text-secondary">Select a reason and add notes</div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <ReasonCodeSelect
            value={reasonCode}
            onChange={setReasonCode}
            label="Rejection Reason"
          />

          <TextArea
            label="Notes"
            value={notes}
            onChange={setNotes}
            placeholder="Add detailed notes for the surveyor..."
            rows={4}
          />
        </div>

        <div className="flex gap-2.5 mt-5 justify-end">
          <button className="cta-btn secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="toggle-btn red active flex items-center gap-1.5"
            onClick={() => onSubmit(reasonCode, notes)}
            disabled={!canSubmit}
            style={{
              padding: "8px 20px",
              opacity: canSubmit ? 1 : 0.5,
            }}
          >
            <Icon n="x" size={14} color="#fff" />
            Reject Survey
          </button>
        </div>
      </div>
    </div>
  );
};
