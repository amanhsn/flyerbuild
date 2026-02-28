import { useState } from "react";
import { Field } from "../../shared";
import { SignatureModal } from "../../shared/SignatureModal";
import { Icon } from "../../../icons/Icon";
import { useLang } from "../../../i18n/LangContext";

export const StatementOfAgreement = ({ survey, setField, disabled }) => {
  const { t } = useLang();
  const agreement = survey.agreement || {};
  const [sigModal, setSigModal] = useState(null); // null | "owner" | "subco"

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });

  const handleSave = (dataUrl) => {
    if (sigModal === "owner") {
      setField("agreement.ownerSignature", dataUrl);
      setField("agreement.signature_date_owner", new Date().toISOString().split("T")[0]);
    } else {
      setField("agreement.subcoSignature", dataUrl);
      setField("agreement.signature_date_subco", new Date().toISOString().split("T")[0]);
    }
    setSigModal(null);
  };

  const sigBox = (sig, labelKey, which) => (
    <div className="flex-1 flex flex-col gap-2">
      <div className="font-mono text-xs text-text-muted uppercase tracking-widest">
        {t(labelKey)}
      </div>
      <div
        onClick={() => { if (!disabled && !sig) setSigModal(which); }}
        className="flex items-center justify-center rounded-lg transition-all"
        style={{
          height: sig ? "auto" : 60,
          minHeight: 60,
          border: `2px dashed ${sig ? "var(--green-dim)" : "var(--border-bright)"}`,
          background: sig ? "var(--green-glow)" : "var(--bg-raised)",
          cursor: disabled || sig ? "default" : "pointer",
          padding: sig ? 6 : 0,
        }}
      >
        {sig ? (
          <img
            src={sig}
            alt={t(labelKey)}
            style={{ maxHeight: 60, maxWidth: "90%", objectFit: "contain" }}
          />
        ) : (
          <div className="flex items-center gap-1.5">
            <Icon n="sig" size={14} color="var(--text-muted)" />
            <span className="font-mono text-xs text-text-muted">{t("signHere")}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Legal Text Block */}
      <div className="bg-bg-raised border border-border rounded-lg p-4 max-h-[180px] overflow-y-auto">
        <div className="font-display text-[13px] font-semibold tracking-wide text-text-primary mb-2.5">
          {t("agreementTitle")}
        </div>
        <div className="font-mono text-xs text-text-muted leading-relaxed">
          Agreement text... By signing this document, the undersigned confirms that the survey has been
          conducted in accordance with the applicable standards and regulations. The information provided
          herein is accurate to the best knowledge of the surveyor. The building owner or representative
          acknowledges the survey findings and agrees to the proposed installation plan. Any deviations
          from the standard installation procedure have been documented and communicated to all parties
          involved. This agreement is binding upon signature by both the owner (or representative) and
          the subcontractor surveyor.
        </div>
      </div>

      {/* Undersigned Name */}
      <Field
        label={t("undersignedName")}
        value={agreement.undersignedName}
        onChange={(v) => setField("agreement.undersignedName", v)}
        disabled={disabled}
      />

      {/* Signature Date */}
      <div>
        <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-[5px]">
          {t("signatureDate")}
        </div>
        <div className="font-mono text-sm text-text-secondary py-2.5 px-3.5 bg-bg-overlay rounded-sm border border-border flex items-center gap-2">
          <Icon n="calendar" size={14} color="var(--text-muted)" />
          {agreement.signatureDate || today}
        </div>
      </div>

      {/* Signature Areas */}
      <div className="flex gap-4">
        {sigBox(agreement.ownerSignature, "ownerSignature", "owner")}
        {sigBox(agreement.subcoSignature, "subcoSignature", "subco")}
      </div>

      {/* Refuse Button */}
      {!agreement.ownerSignature && (
        <button
          disabled={disabled}
          onClick={() => {
            setField("agreement.rejected", true);
          }}
          className="font-mono text-xs text-red self-start flex items-center gap-1.5 py-2 px-4 bg-transparent rounded-sm border border-red"
          style={{
            cursor: disabled ? "default" : "pointer",
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <Icon n="x" size={12} color="var(--red)" />
          {t("refuseSignature")}
        </button>
      )}

      {/* Signature Modal */}
      {sigModal && (
        <SignatureModal
          title={sigModal === "owner" ? t("ownerSignature") : t("subcoSignature")}
          onSave={handleSave}
          onCancel={() => setSigModal(null)}
        />
      )}
    </div>
  );
};
