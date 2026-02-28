import { useState } from "react";
import { Field } from "../../shared";
import { SignatureModal } from "../../shared/SignatureModal";
import { Icon } from "../../../icons/Icon";
import { useLang } from "../../../i18n/LangContext";
import { mono, disp } from "../../../styles/helpers";

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
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em" })}>
        {t(labelKey)}
      </div>
      <div
        onClick={() => { if (!disabled && !sig) setSigModal(which); }}
        style={{
          height: sig ? "auto" : 60,
          minHeight: 60,
          border: `2px dashed ${sig ? "var(--green-dim)" : "var(--border-bright)"}`,
          borderRadius: "var(--radius-lg)",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: sig ? "var(--green-glow)" : "var(--bg-raised)",
          cursor: disabled || sig ? "default" : "pointer",
          padding: sig ? 6 : 0,
          transition: "all .15s",
        }}
      >
        {sig ? (
          <img
            src={sig}
            alt={t(labelKey)}
            style={{ maxHeight: 60, maxWidth: "90%", objectFit: "contain" }}
          />
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icon n="sig" size={14} color="var(--text-muted)" />
            <span style={mono(12, "var(--text-muted)")}>{t("signHere")}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Legal Text Block */}
      <div style={{
        background: "var(--bg-raised)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: 16,
        maxHeight: 180,
        overflowY: "auto",
      }}>
        <div style={disp(13, 600, "var(--text-primary)", { marginBottom: 10 })}>
          {t("agreementTitle")}
        </div>
        <div style={mono(12, "var(--text-muted)", { lineHeight: 1.6 })}>
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
        <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 5 })}>
          {t("signatureDate")}
        </div>
        <div style={{
          ...mono(14, "var(--text-secondary)"),
          padding: "10px 14px",
          background: "var(--bg-overlay)",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <Icon n="calendar" size={14} color="var(--text-muted)" />
          {agreement.signatureDate || today}
        </div>
      </div>

      {/* Signature Areas */}
      <div style={{ display: "flex", gap: 16 }}>
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
          style={{
            ...mono(12, "var(--red)"),
            padding: "8px 16px",
            background: "transparent",
            border: "1px solid var(--red)",
            borderRadius: "var(--radius-sm)",
            cursor: disabled ? "default" : "pointer",
            opacity: disabled ? 0.5 : 1,
            alignSelf: "flex-start",
            display: "flex", alignItems: "center", gap: 6,
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
