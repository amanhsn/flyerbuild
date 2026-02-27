import { Icon } from "../../icons/Icon";
import { useLang } from "../../i18n/LangContext";
import { mono } from "../../styles/helpers";

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
    <div style={{
      display: "flex", overflowX: "auto",
      background: "var(--bg-elevated)",
      borderBottom: "1px solid var(--border)",
      flexShrink: 0,
    }}>
      {sections.map((s, i) => {
        const isActive = i === activeIndex;
        const isDone = completedSections.includes(s.key);
        return (
          <button
            key={s.key}
            onClick={() => onSelect(i)}
            style={{
              flexShrink: 0, padding: "10px 13px",
              background: "none", border: "none", cursor: "pointer",
              ...mono(12,
                isActive ? "var(--text-primary-accent)" : isDone ? "var(--text-green)" : "var(--text-muted)",
                { fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase" },
              ),
              borderBottom: isActive ? "2px solid var(--primary)" : "2px solid transparent",
              display: "flex", alignItems: "center", gap: 5,
              transition: "all .15s",
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
