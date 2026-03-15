"use client"

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

export const SectionNav = ({ sections, activeIndex, completedSections, reworkSections = [], onSelect, sticky = false }) => {
  const { t } = useLang();

  return (
    <div className={cn(
      "flex overflow-x-auto bg-bg-elevated border-b border-border shrink-0",
      sticky && "sticky top-0 z-10"
    )}>
      {sections.map((s, i) => {
        const isActive = i === activeIndex;
        const isDone = completedSections.includes(s.key);
        const needsRework = reworkSections.includes(s.key);
        return (
          <button
            key={s.key}
            onClick={() => onSelect(i)}
            className={cn(
              "shrink-0 py-2.5 px-[13px] bg-transparent border-none cursor-pointer flex items-center gap-[5px] transition-all font-mono text-xs font-semibold tracking-wider uppercase",
              needsRework
                ? "text-text-red"
                : isActive ? "text-text-primary-accent" : isDone ? "text-text-green" : "text-text-muted"
            )}
            style={{
              borderBottom: isActive
                ? needsRework ? "2px solid var(--red)" : "2px solid var(--primary)"
                : needsRework ? "2px solid var(--red-dim)" : "2px solid transparent",
            }}
          >
            {needsRework && <Icon n="alert" size={10} color="var(--text-red)" />}
            {!needsRework && isDone && <Icon n="check" size={10} color="var(--text-green)" />}
            {t(SHORT_KEYS[s.key] || s.key)}
          </button>
        );
      })}
    </div>
  );
};
