import { Icon } from "../../icons/Icon";
import { mono, disp } from "../../styles/helpers";
import { useLang } from "../../i18n/LangContext";

export const SectionCard = ({ title, sectionKey, completed, editing, setEditing, readOnly, saveDisabled, children }) => {
  const { t } = useLang();
  const isDone = !!completed[sectionKey];
  const isEditing = !!editing[sectionKey];

  return (
    <div className={`section-card${isDone && !isEditing ? " done" : ""} fade-up`}>
      {/* Header */}
      <div style={{
        padding: "14px 16px",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-elevated)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={disp(18, 700)}>{title}</div>
          {isDone && !isEditing && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
              <Icon n="check" size={11} color="var(--text-green)" />
              <span style={mono(12, "var(--text-green)")}>{t("saved")}</span>
            </div>
          )}
          {readOnly && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
              <Icon n="info" size={11} color="var(--text-muted)" />
              <span style={mono(12, "var(--text-muted)")}>Read-only</span>
            </div>
          )}
        </div>
        {isDone && !isEditing && !readOnly && (
          <button
            onClick={() => setEditing(p => ({ ...p, [sectionKey]: true }))}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "7px 12px",
              borderRadius: "var(--radius-sm)", background: "var(--bg-overlay)",
              border: "1px solid var(--border)", color: "var(--text-secondary)",
              ...mono(11), cursor: "pointer",
            }}
          >
            <Icon n="pen" size={12} /> {t("edit")}
          </button>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "16px" }}>{children}</div>
    </div>
  );
};
