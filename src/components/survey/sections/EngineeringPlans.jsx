import { Icon } from "../../../icons/Icon";
import { useLang } from "../../../i18n/LangContext";
import { mono, disp } from "../../../styles/helpers";

export const EngineeringPlans = ({ survey, setField, disabled }) => {
  const { t } = useLang();
  const plans = survey.engineering_plans || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Upload Area */}
      <div
        style={{
          border: "2px dashed var(--border-bright)",
          borderRadius: "var(--radius-lg)",
          padding: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          background: "var(--bg-raised)",
          cursor: disabled ? "default" : "pointer",
          opacity: disabled ? 0.55 : 1,
        }}
      >
        <Icon n="upload" size={28} color="var(--text-muted)" />
        <span style={disp(14, 600, "var(--text-secondary)")}>
          {t("uploadPlan")}
        </span>
        <span style={mono(12, "var(--text-muted)")}>
          {t("dropFiles")}
        </span>
      </div>

      {/* Upload Plan Button */}
      <button
        className="toggle-btn primary active"
        disabled={disabled}
        style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6 }}
      >
        <Icon n="upload" size={14} color="#fff" />
        <span>{t("uploadPlanBtn")}</span>
      </button>

      {/* Plan List */}
      {plans.length > 0 && (
        <div style={{
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr 50px",
            gap: 0,
            background: "var(--bg-overlay)",
            padding: "10px 14px",
            borderBottom: "1px solid var(--border)",
          }}>
            {["Filename", "Description", "Uploaded By", "Uploaded At", ""].map((col) => (
              <div key={col} style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".1em" })}>
                {col}
              </div>
            ))}
          </div>

          {/* Rows */}
          {plans.map((plan, idx) => (
            <div
              key={idx}
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr 50px",
                gap: 0,
                padding: "10px 14px",
                borderBottom: idx < plans.length - 1 ? "1px solid var(--border)" : "none",
                background: "var(--bg-raised)",
                alignItems: "center",
              }}
            >
              <div style={{
                ...mono(12, "var(--text-secondary)"),
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <Icon n="file" size={14} color="var(--text-muted)" />
                {plan.filename || "--"}
              </div>
              <div style={mono(12, "var(--text-muted)")}>
                {plan.description || "--"}
              </div>
              <div style={mono(12, "var(--text-muted)")}>
                {plan.uploaded_by || "--"}
              </div>
              <div style={mono(12, "var(--text-muted)")}>
                {plan.uploaded_at || "--"}
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  className="toggle-btn"
                  disabled={disabled}
                  style={{
                    padding: "4px 6px",
                    background: "transparent",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    cursor: disabled ? "default" : "pointer",
                  }}
                >
                  <Icon n="trash" size={14} color="var(--red)" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {plans.length === 0 && (
        <div style={{
          ...mono(12, "var(--text-muted)"),
          padding: 20,
          textAlign: "center",
          background: "var(--bg-raised)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border)",
        }}>
          {t("noPlans")}
        </div>
      )}
    </div>
  );
};
