import { Icon } from "../../../icons/Icon";
import { useLang } from "../../../i18n/LangContext";


export const EngineeringPlans = ({ survey, setField, disabled }) => {
  const { t } = useLang();
  const plans = survey.engineering_plans || [];

  return (
    <div className="flex flex-col gap-4">
      {/* Upload Area */}
      <div
        className="flex flex-col items-center justify-center gap-2.5 bg-bg-raised rounded-lg p-[30px] border-2 border-dashed border-border-bright"
        style={{
          cursor: disabled ? "default" : "pointer",
          opacity: disabled ? 0.55 : 1,
        }}
      >
        <Icon n="upload" size={28} color="var(--text-muted)" />
        <span className="font-display text-sm font-semibold tracking-wide text-text-secondary">
          {t("uploadPlan")}
        </span>
        <span className="font-mono text-xs text-text-muted">
          {t("dropFiles")}
        </span>
      </div>

      {/* Upload Plan Button */}
      <button
        className="toggle-btn primary active self-start flex items-center gap-1.5"
        disabled={disabled}
      >
        <Icon n="upload" size={14} color="#fff" />
        <span>{t("uploadPlanBtn")}</span>
      </button>

      {/* Plan List */}
      {plans.length > 0 && (
        <div className="border border-border rounded-lg overflow-hidden">
          {/* Header */}
          <div
            className="bg-bg-overlay py-2.5 px-3.5 border-b border-border"
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr 50px",
            }}
          >
            {["Filename", "Description", "Uploaded By", "Uploaded At", ""].map((col) => (
              <div key={col} className="font-mono text-xs text-text-muted uppercase tracking-widest">
                {col}
              </div>
            ))}
          </div>

          {/* Rows */}
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className="py-2.5 px-3.5 bg-bg-raised items-center"
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr 50px",
                borderBottom: idx < plans.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <div className="font-mono text-xs text-text-secondary flex items-center gap-1.5">
                <Icon n="file" size={14} color="var(--text-muted)" />
                {plan.filename || "--"}
              </div>
              <div className="font-mono text-xs text-text-muted">
                {plan.description || "--"}
              </div>
              <div className="font-mono text-xs text-text-muted">
                {plan.uploaded_by || "--"}
              </div>
              <div className="font-mono text-xs text-text-muted">
                {plan.uploaded_at || "--"}
              </div>
              <div className="flex justify-center">
                <button
                  className="toggle-btn py-1 px-1.5 bg-transparent border border-border rounded-sm"
                  disabled={disabled}
                  style={{
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
        <div className="font-mono text-xs text-text-muted text-center p-5 bg-bg-raised rounded-lg border border-border">
          {t("noPlans")}
        </div>
      )}
    </div>
  );
};
