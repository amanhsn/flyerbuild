import { useState } from "react";
import { ReadOnlySurveyView } from "../../components/shared/ReadOnlySurveyView";
import { RejectionDialog } from "./RejectionDialog";
import { Icon } from "../../icons/Icon";
import { useLang } from "../../i18n/LangContext";
import { mono, disp } from "../../styles/helpers";
import { getMissingSectionFields, SECTIONS } from "../../data/sectionRegistry";
import { useIsMobile } from "../../hooks/useIsMobile";

export const ValidationWorkspace = ({ survey, onBack }) => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [actionTaken, setActionTaken] = useState(null); // "approved" | "rejected"

  // Pre-validation flags
  const preValidationFlags = [];
  SECTIONS.forEach(sec => {
    const missing = getMissingSectionFields(survey, sec.key);
    if (missing.length > 0) {
      preValidationFlags.push({ section: sec.key, fields: missing });
    }
  });
  const hasSignature = survey.agreement?.owner_signature;
  if (!hasSignature) preValidationFlags.push({ section: "statement_agreement", issue: "Missing owner signature" });

  // Rework history
  const reworkHistory = survey.rework_remarks ? [{ remarks: survey.rework_remarks }] : [];

  const handleApprove = () => {
    setActionTaken("approved");
  };

  const handleReject = (reasonCode, notes) => {
    setActionTaken("rejected");
    setShowRejectDialog(false);
  };

  const actionBar = (
    <div style={{
      position: "sticky", bottom: 0,
      padding: isMobile ? "12px 16px" : "12px 24px", borderTop: "1px solid var(--border)",
      background: "var(--bg-base)", display: "flex", flexDirection: "column", gap: 8,
    }}>
      {/* Pre-validation flags */}
      {preValidationFlags.length > 0 && !actionTaken && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
          background: "var(--primary-glow)", border: "1px solid var(--primary-dim)",
          borderRadius: "var(--radius-sm)",
        }}>
          <Icon n="alert" size={14} color="var(--primary)" />
          <span style={mono(11, "var(--text-primary-accent)")}>
            {preValidationFlags.length} pre-validation flag(s) detected
          </span>
        </div>
      )}

      {/* Rework history */}
      {reworkHistory.length > 0 && (
        <div style={{
          padding: "8px 12px", background: "var(--bg-raised)",
          border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
        }}>
          <div style={mono(11, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 })}>
            Rework History
          </div>
          {reworkHistory.map((r, i) => (
            <div key={i} style={mono(11, "var(--text-secondary)")}>{r.remarks}</div>
          ))}
        </div>
      )}

      {/* Action taken banner */}
      {actionTaken && (
        <div style={{
          padding: "12px 16px", textAlign: "center",
          borderRadius: "var(--radius-md)",
          background: actionTaken === "approved" ? "var(--green-glow)" : "var(--red-glow)",
          border: `1px solid ${actionTaken === "approved" ? "var(--green-dim)" : "var(--red-dim)"}`,
          ...mono(12, actionTaken === "approved" ? "var(--text-green)" : "var(--text-red)"),
        }}>
          Survey {actionTaken === "approved" ? "Approved" : "Rejected"} ✓
        </div>
      )}

      {/* Action buttons */}
      {!actionTaken && (
        <div style={{ display: "flex", gap: isMobile ? 6 : 10, flexWrap: "wrap" }}>
          <button
            className="cta-btn secondary"
            onClick={onBack}
            style={{ flex: 0 }}
          >
            ← Back
          </button>
          <div style={{ flex: 1 }} />
          <button
            className="toggle-btn red"
            onClick={() => setShowRejectDialog(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px" }}
          >
            <Icon n="x" size={14} color="var(--red)" />
            Reject
          </button>
          <button
            className="toggle-btn green active"
            onClick={handleApprove}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px" }}
          >
            <Icon n="check" size={14} color="#fff" />
            Approve
          </button>
        </div>
      )}

      {showRejectDialog && (
        <RejectionDialog
          onSubmit={handleReject}
          onCancel={() => setShowRejectDialog(false)}
        />
      )}
    </div>
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <ReadOnlySurveyView survey={survey} onBack={onBack} actionBar={actionBar} />
    </div>
  );
};
