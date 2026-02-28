import { useState } from "react";
import { ReadOnlySurveyView } from "../../components/shared/ReadOnlySurveyView";
import { RejectionDialog } from "./RejectionDialog";
import { Icon } from "../../icons/Icon";
import { useLang } from "../../i18n/LangContext";
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
    <div className="sticky bottom-0 border-t border-border flex flex-col gap-2" style={{
      padding: isMobile ? "12px 16px" : "12px 24px",
      background: "var(--bg-base)",
    }}>
      {/* Pre-validation flags */}
      {preValidationFlags.length > 0 && !actionTaken && (
        <div className="flex items-center gap-2 rounded-sm" style={{
          padding: "8px 12px",
          background: "var(--primary-glow)", border: "1px solid var(--primary-dim)",
        }}>
          <Icon n="alert" size={14} color="var(--primary)" />
          <span className="font-mono text-xs text-text-primary-accent">
            {preValidationFlags.length} pre-validation flag(s) detected
          </span>
        </div>
      )}

      {/* Rework history */}
      {reworkHistory.length > 0 && (
        <div className="rounded-sm bg-bg-raised border border-border" style={{
          padding: "8px 12px",
        }}>
          <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-1">
            Rework History
          </div>
          {reworkHistory.map((r, i) => (
            <div key={i} className="font-mono text-xs text-text-secondary">{r.remarks}</div>
          ))}
        </div>
      )}

      {/* Action taken banner */}
      {actionTaken && (
        <div className="text-center rounded-md" style={{
          padding: "12px 16px",
          background: actionTaken === "approved" ? "var(--green-glow)" : "var(--red-glow)",
          border: `1px solid ${actionTaken === "approved" ? "var(--green-dim)" : "var(--red-dim)"}`,
        }}>
          <span className={`font-mono text-sm ${actionTaken === "approved" ? "text-text-green" : "text-text-red"}`}>
            Survey {actionTaken === "approved" ? "Approved" : "Rejected"} ✓
          </span>
        </div>
      )}

      {/* Action buttons */}
      {!actionTaken && (
        <div className="flex flex-wrap" style={{ gap: isMobile ? 6 : 10 }}>
          <button
            className="cta-btn secondary shrink-0"
            onClick={onBack}
          >
            ← Back
          </button>
          <div className="flex-1" />
          <button
            className="toggle-btn red flex items-center gap-1.5 px-4 py-2"
            onClick={() => setShowRejectDialog(true)}
          >
            <Icon n="x" size={14} color="var(--red)" />
            Reject
          </button>
          <button
            className="toggle-btn green active flex items-center gap-1.5 px-4 py-2"
            onClick={handleApprove}
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
    <div className="flex-1 flex flex-col overflow-hidden">
      <ReadOnlySurveyView survey={survey} onBack={onBack} actionBar={actionBar} />
    </div>
  );
};
