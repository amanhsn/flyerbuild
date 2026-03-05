"use client"

import { Icon } from "../../icons/Icon";
import { StatusBadge, MiniProgress } from "../shared";
import { getProjectById } from "../../data/mockProjects";
import { useLang } from "../../i18n/LangContext";
import { SECTIONS } from "../../data/sectionRegistry";

export const MapDetailPanel = ({ survey, onClose, onViewFull }) => {
  const { t } = useLang();
  if (!survey) return null;

  const addr = survey.address;
  const project = getProjectById(survey.project_id);
  const completedCount = survey.completed_sections?.length || 0;
  const totalSections = SECTIONS.length;

  const rows = [
    { label: "TSG ID", value: survey.tsg_id },
    { label: "Building ID", value: survey.building_id },
    { label: "Project", value: project?.name || "—" },
    { label: "Surveyor", value: survey.assigned_surveyor || "—" },
    { label: "Scheduled", value: survey.scheduled_time || "—" },
    { label: "Distance", value: survey.distance_km ? `${survey.distance_km} km` : "—" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-border">
        <div className="min-w-0 flex-1">
          <StatusBadge status={survey.status} />
          <h3 className="font-display text-lg font-bold tracking-wide mt-2 truncate">
            {addr.street} {addr.number}
          </h3>
          <p className="font-mono text-xs text-text-secondary mt-0.5">
            {addr.postal_code} {addr.city}
          </p>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 ml-2 p-1 rounded-sm bg-transparent border-none cursor-pointer hover:bg-bg-overlay transition-colors"
        >
          <Icon n="x" size={16} color="var(--text-muted)" />
        </button>
      </div>

      {/* Detail rows */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
              {r.label}
            </div>
            <div className="font-mono text-sm text-text-secondary mt-0.5">
              {r.value}
            </div>
          </div>
        ))}

        {/* Progress */}
        <div className="mt-1">
          <div className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-1.5">
            Completion
          </div>
          <MiniProgress val={completedCount} total={totalSections} />
        </div>
      </div>

      {/* CTA */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => onViewFull(survey)}
          className="w-full py-2.5 px-4 rounded-md font-display text-sm font-semibold tracking-wide text-white cursor-pointer border-none transition-opacity hover:opacity-90"
          style={{ background: "var(--primary)" }}
        >
          View Full Survey
        </button>
      </div>
    </div>
  );
};
