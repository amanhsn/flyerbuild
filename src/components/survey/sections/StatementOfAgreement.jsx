import { Field } from "../../shared";
import { Icon } from "../../../icons/Icon";
import { useLang } from "../../../i18n/LangContext";
import { mono, disp } from "../../../styles/helpers";

export const StatementOfAgreement = ({ survey, setField, disabled }) => {
  const { t } = useLang();
  const agreement = survey.agreement || {};

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });

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
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <Icon n="calendar" size={14} color="var(--text-muted)" />
          {agreement.signatureDate || today}
        </div>
      </div>

      {/* Signature Areas */}
      <div style={{ display: "flex", gap: 16 }}>
        {/* Owner Signature */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em" })}>
            {t("ownerSignature")}
          </div>
          <div style={{
            height: 60,
            border: "2px dashed var(--border-bright)",
            borderRadius: "var(--radius-lg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg-raised)",
            cursor: disabled ? "default" : "pointer",
          }}>
            {agreement.ownerSignature ? (
              <span style={mono(12, "var(--green)")}>Signed</span>
            ) : (
              <span style={mono(12, "var(--text-muted)")}>
                {t("signHere")}
              </span>
            )}
          </div>

          {/* Refuse Button */}
          <button
            disabled={disabled}
            style={{
              ...mono(12, "var(--red)"),
              padding: "8px 16px",
              background: "transparent",
              border: "1px solid var(--red)",
              borderRadius: "var(--radius-sm)",
              cursor: disabled ? "default" : "pointer",
              opacity: disabled ? 0.5 : 1,
              alignSelf: "flex-start",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Icon n="x" size={12} color="var(--red)" />
            {t("refuse")}
          </button>
        </div>

        {/* Subco Signature */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em" })}>
            {t("subcoSignature")}
          </div>
          <div style={{
            height: 60,
            border: "2px dashed var(--border-bright)",
            borderRadius: "var(--radius-lg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg-raised)",
            cursor: disabled ? "default" : "pointer",
          }}>
            {agreement.subcoSignature ? (
              <span style={mono(12, "var(--green)")}>Signed</span>
            ) : (
              <span style={mono(12, "var(--text-muted)")}>
                {t("signHere")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
