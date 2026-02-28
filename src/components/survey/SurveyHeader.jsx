import { Icon } from "../../icons/Icon";
import { StatusBadge } from "../shared";
import { useLang } from "../../i18n/LangContext";
import { SECTIONS } from "../../data/sectionRegistry";

export const SurveyHeader = ({ survey, completedCount, onBack }) => {
  const { t } = useLang();
  const addr = survey.address;
  const totalSections = SECTIONS.length;

  return (
    <div className="bg-bg-elevated border-b border-border shrink-0 pt-3.5 px-6 pb-0">
      <button onClick={onBack} className="font-mono text-[11px] text-text-secondary flex items-center gap-[5px] bg-transparent border-none cursor-pointer mb-2.5 p-0">
        <Icon n="chevR" size={12} className="rotate-180" color="var(--text-secondary)" />
        {t("backToDashboard")}
      </button>

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-[5px] flex-wrap">
            <StatusBadge status={survey.status} />
            <span className="font-mono text-xs text-text-muted">{survey.tsg_id}</span>
            {survey.building_id && (
              <span className="font-mono text-xs text-text-muted">· {survey.building_id}</span>
            )}
          </div>
          <h2 className="font-display text-[26px] font-extrabold tracking-wide">{addr.street} {addr.number}</h2>
          <div className="font-mono text-sm text-text-secondary mt-[3px]">{addr.postal_code} {addr.city}</div>
          <div className="flex gap-4 mt-2.5 flex-wrap">
            {[
              ["nav", `${survey.distance_km} km`],
              ["clock", survey.scheduled_time],
              ["nav", `${addr.lat}, ${addr.lng}`],
            ].map(([icon, val], i) => (
              <div key={i} className="flex items-center gap-[5px]">
                <Icon n={icon} size={12} color="var(--text-muted)" />
                <span className="font-mono text-xs text-text-secondary">{val}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-display text-[40px] font-extrabold text-text-primary-accent leading-none">
            {completedCount}/{totalSections}
          </div>
          <div className="font-mono text-xs text-text-muted">{t("completed")}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[3px] bg-bg-overlay mt-3">
        <div className="h-full bg-primary" style={{
          width: `${(completedCount / totalSections) * 100}%`,
          transition: "width .4s ease",
        }} />
      </div>
    </div>
  );
};
