"use client"

import { useRef, useEffect, useCallback } from "react";
import { StatusBadge } from "../../components/shared";
import { Icon } from "../../icons/Icon";
import { STATUSES } from "../../data/statusConfig";
import { getProjectForSurvey } from "../../data/mockProjects";

export const SurveyDrawer = ({ survey, onClose, onOpenFull }) => {
  const drawerRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Close on outside click
  const handleBackdropClick = useCallback((e) => {
    if (drawerRef.current && !drawerRef.current.contains(e.target)) onClose();
  }, [onClose]);

  if (!survey) return null;

  const project = getProjectForSurvey(survey);
  const s = STATUSES[survey.status] || STATUSES.to_do;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end" onClick={handleBackdropClick}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 animate-fade-in" />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className="relative z-[1] w-full max-w-[480px] h-full bg-bg-raised border-l border-border flex flex-col overflow-hidden"
        style={{ animation: "slideInRight .25s ease both" }}
      >
        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-border shrink-0">
          <div className="flex items-center justify-between mb-2">
            <button onClick={onClose} className="bg-transparent border-none cursor-pointer p-1">
              <Icon n="x" size={16} color="var(--text-secondary)" />
            </button>
            <StatusBadge status={survey.status} size="md" />
          </div>
          <h2 className="font-display text-xl font-extrabold tracking-wide">
            {survey.address.street} {survey.address.number}
          </h2>
          <div className="font-mono text-xs text-text-secondary mt-0.5">
            {survey.address.postal_code} {survey.address.city}
          </div>
          {s.description && (
            <p className="font-mono text-[10px] mt-1" style={{ color: s.color }}>{s.description}</p>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Key details */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <DetailField label="TSG ID" value={survey.tsg_id} />
            <DetailField label="Building ID" value={survey.building_id} />
            <DetailField label="Project" value={project?.name} />
            <DetailField label="MRO Zone" value={survey.distribution_zone?.mro_zone} />
            <DetailField label="POP Zone" value={survey.distribution_zone?.pop_area} />
            <DetailField label="Surveyor" value={survey.assigned_surveyor} />
            <DetailField label="Subcontractor" value={survey.assigned_subcontractor} />
            <DetailField label="Sections" value={`${survey.completed_sections?.length || 0} completed`} />
          </div>

          {/* Priority */}
          {survey.priority && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-md mb-4" style={{ background: "var(--primary-glow)", border: "1px solid var(--primary-dim)" }}>
              <Icon n="star" size={12} color="var(--text-primary-accent)" />
              <span className="font-mono text-xs text-text-primary-accent font-semibold">Priority Survey</span>
            </div>
          )}

          {/* Rework remarks */}
          {survey.status === "rework" && survey.rework_remarks && (
            <div className="px-3 py-2 rounded-md mb-4" style={{ background: "var(--red-glow)", border: "1px solid var(--red-dim)" }}>
              <div className="font-mono text-[10px] text-text-red font-semibold uppercase tracking-wider mb-1">Rework Remarks</div>
              <div className="font-mono text-xs text-text-secondary">{survey.rework_remarks}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border shrink-0">
          <button
            onClick={() => onOpenFull(survey)}
            className="toggle-btn primary active w-full flex items-center justify-center gap-2"
            style={{ padding: "10px 16px" }}
          >
            Open Full Survey
            <Icon n="chevR" size={12} color="#fff" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

const DetailField = ({ label, value }) => (
  <div>
    <div className="font-mono text-[10px] text-text-muted uppercase tracking-wider">{label}</div>
    <div className="font-mono text-xs text-text-primary mt-0.5">{value || "--"}</div>
  </div>
);
