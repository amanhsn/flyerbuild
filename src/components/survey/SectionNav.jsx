import { Icon } from "../../icons/Icon";
import { useLang } from "../../i18n/LangContext";
import { cn } from "../../lib/utils";

const SHORT_KEYS = {
  visit_info: "short_visit",
  appointment_info: "short_appointment",
  client_info: "short_client",
  building_owner: "short_owner",
  building_info: "short_building",
  distribution_zone: "short_distribution",
  facade_street: "short_facade",
  existing_telecom: "short_telecom",
  execution_quantities: "short_quantities",
  legend: "short_legend",
  photo_facade: "short_photoFacade",
  photo_letterbox: "short_letterbox",
  floorplan_canvas: "short_floorplan",
  bordje_syndic: "short_syndic",
  fire_department: "short_firePlan",
  underground_intro: "short_underground",
  facade_distribution: "short_facadeDist",
  technical_room: "short_techRoom",
  cable_trajectory: "short_cable",
  photo_misc: "short_photoMisc",
  engineering_plans: "short_engPlans",
  statement_agreement: "short_agreement",
};

export const SectionNav = ({ sections, activeIndex, completedSections, onSelect }) => {
  const { t } = useLang();

  return (
    <div className="flex overflow-x-auto bg-bg-elevated border-b border-border shrink-0">
      {sections.map((s, i) => {
        const isActive = i === activeIndex;
        const isDone = completedSections.includes(s.key);
        return (
          <button
            key={s.key}
            onClick={() => onSelect(i)}
            className={cn(
              "shrink-0 py-2.5 px-[13px] bg-transparent border-none cursor-pointer flex items-center gap-[5px] transition-all font-mono text-xs font-semibold tracking-wider uppercase",
              isActive ? "text-text-primary-accent" : isDone ? "text-text-green" : "text-text-muted"
            )}
            style={{
              borderBottom: isActive ? "2px solid var(--primary)" : "2px solid transparent",
            }}
          >
            {isDone && <Icon n="check" size={10} color="var(--text-green)" />}
            {t(SHORT_KEYS[s.key] || s.key)}
          </button>
        );
      })}
    </div>
  );
};
