import { Icon } from "../../icons/Icon";
import { StatusBadge } from "../shared";
import { useLang } from "../../i18n/LangContext";
import { mono, disp } from "../../styles/helpers";
import { SECTIONS } from "../../data/sectionRegistry";

export const SurveyHeader = ({ survey, completedCount, onBack }) => {
  const { t } = useLang();
  const addr = survey.address;
  const totalSections = SECTIONS.length;

  return (
    <div style={{
      padding: "14px 24px 0",
      background: "var(--bg-elevated)",
      borderBottom: "1px solid var(--border)",
      flexShrink: 0,
    }}>
      <button onClick={onBack} style={{
        display: "flex", alignItems: "center", gap: 5,
        background: "none", border: "none", cursor: "pointer",
        color: "var(--text-secondary)", ...mono(11),
        marginBottom: 10, padding: 0,
      }}>
        <Icon n="chevR" size={12} style={{ transform: "rotate(180deg)" }} color="var(--text-secondary)" />
        {t("backToDashboard")}
      </button>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
            <StatusBadge status={survey.status} />
            <span style={mono(11, "var(--text-muted)")}>{survey.tsg_id}</span>
            {survey.building_id && (
              <span style={mono(11, "var(--text-muted)")}>· {survey.building_id}</span>
            )}
          </div>
          <h2 style={disp(26, 800)}>{addr.street} {addr.number}</h2>
          <div style={mono(12, "var(--text-secondary)", { marginTop: 3 })}>{addr.postal_code} {addr.city}</div>
          <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
            {[
              ["nav", `${survey.distance_km} km`],
              ["clock", survey.scheduled_time],
              ["nav", `${addr.lat}, ${addr.lng}`],
            ].map(([icon, val], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Icon n={icon} size={12} color="var(--text-muted)" />
                <span style={mono(11, "var(--text-secondary)")}>{val}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{
            fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 800,
            color: "var(--text-primary-accent)", lineHeight: 1,
          }}>
            {completedCount}/{totalSections}
          </div>
          <div style={mono(11, "var(--text-muted)")}>{t("completed")}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: "var(--bg-overlay)", marginTop: 12 }}>
        <div style={{
          height: "100%", background: "var(--primary)",
          width: `${(completedCount / totalSections) * 100}%`,
          transition: "width .4s ease",
        }} />
      </div>
    </div>
  );
};
