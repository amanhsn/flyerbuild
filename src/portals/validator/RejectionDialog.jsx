import { useState } from "react";
import { ReasonCodeSelect } from "../../components/shared/ReasonCodeSelect";
import { TextArea } from "../../components/shared/Field";
import { Icon } from "../../icons/Icon";
import { mono, disp } from "../../styles/helpers";

export const RejectionDialog = ({ onSubmit, onCancel }) => {
  const [reasonCode, setReasonCode] = useState("");
  const [notes, setNotes] = useState("");

  const canSubmit = reasonCode !== "";

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000,
    }}>
      <div style={{
        background: "var(--bg-base)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)", padding: 24, width: "100%",
        maxWidth: 460, boxShadow: "0 8px 32px rgba(0,0,0,.4)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "var(--radius-md)",
            background: "var(--red-glow)", border: "1px solid var(--red-dim)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon n="x" size={18} color="var(--red)" />
          </div>
          <div>
            <div style={disp(16, 700)}>Reject Survey</div>
            <div style={mono(12, "var(--text-secondary)")}>Select a reason and add notes</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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

        <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
          <button className="cta-btn secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="toggle-btn red active"
            onClick={() => onSubmit(reasonCode, notes)}
            disabled={!canSubmit}
            style={{
              padding: "8px 20px", display: "flex", alignItems: "center", gap: 6,
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
