"use client"

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useLang } from "../../i18n/LangContext";
import { KpiCard, StatusBadge, EmptyState } from "../../components/shared";
import { Icon } from "../../icons/Icon";
import { useIsMobile } from "../../hooks/useIsMobile";
import { MOCK_PROJECTS, getProjectForSurvey } from "../../data/mockProjects";

const ValidatorMap = dynamic(() => import("./ValidatorMap"), { ssr: false });

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending Review", statuses: ["validation_f49"] },
  { key: "approved", label: "Approved", statuses: ["completed", "sent", "validation_client"] },
  { key: "rejected", label: "Rejected", statuses: ["rework", "rejected"] },
];

export const ValidatorQueue = ({ surveys, filter, setFilter, onSelectSurvey }) => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [projectFilter, setProjectFilter] = useState("all");
  const [view, setView] = useState("list");
  const [selectedId, setSelectedId] = useState(null);

  const filtered = useMemo(() => {
    let result = surveys;
    if (filter !== "all") {
      const f = FILTERS.find(fl => fl.key === filter);
      if (f?.statuses) result = result.filter(s => f.statuses.includes(s.status));
    }
    if (projectFilter !== "all") {
      result = result.filter(s => s.project_id === projectFilter);
    }
    return result;
  }, [surveys, filter, projectFilter]);

  const selectedSurvey = selectedId ? filtered.find(s => s.id === selectedId) : null;

  // KPIs
  const queueDepth = surveys.filter(s => s.status === "validation_f49").length;
  const approved = surveys.filter(s => ["completed", "sent", "validation_client"].includes(s.status)).length;
  const rejected = surveys.filter(s => ["rework", "rejected"].includes(s.status)).length;
  const total = surveys.length;
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div style={{ padding: isMobile ? "16px 16px 0" : "24px 28px 0" }}>
        <h1 className={`font-display ${isMobile ? "text-[22px]" : "text-[28px]"} font-extrabold tracking-wide`}>Validation Queue</h1>
        <p className="font-mono text-sm text-text-secondary mt-1 mb-5">
          Review completed surveys · {surveys.length} in queue
        </p>

        {/* KPIs */}
        <div className="mb-5" style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(140px, 1fr))", gap: isMobile ? 8 : 12 }}>
          <KpiCard label="Queue Depth" value={queueDepth} color="var(--primary)" total={total} />
          <KpiCard label="Approved" value={approved} color="var(--green)" total={total} />
          <KpiCard label="Rejected" value={rejected} color="var(--red)" total={total} />
          <KpiCard label="Approval Rate" value={`${approvalRate}%`} color="var(--blue)" />
        </div>

        {/* Filters + View Toggle */}
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex gap-1.5 overflow-x-auto shrink-0">
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  className={`filter-btn${filter === f.key ? " active" : ""}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="font-mono text-xs bg-bg-elevated border border-border rounded-md text-text-primary cursor-pointer"
              style={{ padding: "6px 10px" }}
            >
              <option value="all">All Projects</option>
              {MOCK_PROJECTS.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-1">
            <button className={`filter-btn${view === "list" ? " active" : ""}`} onClick={() => setView("list")}>
              <Icon n="list" size={13} color={view === "list" ? "#fff" : "var(--text-muted)"} />
            </button>
            <button className={`filter-btn${view === "map" ? " active" : ""}`} onClick={() => setView("map")}>
              <Icon n="map" size={13} color={view === "map" ? "#fff" : "var(--text-muted)"} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden" style={{ padding: isMobile ? "0 16px 16px" : "0 28px 28px" }}>
        {view === "list" ? (
          <div className="flex flex-col gap-2 overflow-y-auto h-full">
            {filtered.map(s => (
              <div
                key={s.id}
                onClick={() => onSelectSurvey(s)}
                className="survey-card fade-up cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <StatusBadge status={s.status} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="font-display text-base font-bold tracking-wide">{s.address.street} {s.address.number}</div>
                      {(() => { const p = getProjectForSurvey(s); return p ? (
                        <span className="font-mono text-[10px] px-1.5 py-[1px] rounded-sm whitespace-nowrap" style={{ background: "var(--primary-glow)", border: "1px solid var(--primary-dim)", color: "var(--text-primary-accent)" }}>
                          {p.name}
                        </span>
                      ) : null; })()}
                    </div>
                    <div className="font-mono text-xs text-text-secondary mt-0.5">
                      {s.tsg_id} · {s.address.postal_code} {s.address.city}
                    </div>
                  </div>
                  <div className="font-mono text-xs text-text-muted">
                    {s.completed_sections?.length || 0} sections
                  </div>
                  <Icon n="chevR" size={14} color="var(--text-muted)" />
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <EmptyState icon="list" message="No surveys match this filter." sub="Try adjusting your filters" />
            )}
          </div>
        ) : (
          <div className={`h-full flex ${isMobile ? "flex-col" : "gap-4"}`}>
            {/* Map */}
            <div className={`rounded-lg overflow-hidden border border-border ${isMobile ? "h-[55%] shrink-0" : "flex-1"}`}>
              <ValidatorMap
                surveys={filtered}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>
            {/* Side panel */}
            <div className={`overflow-y-auto flex flex-col gap-2 ${isMobile ? "flex-1 pt-3" : ""}`} style={isMobile ? {} : { width: 320, flexShrink: 0 }}>
              {selectedSurvey ? (
                <div className="bg-bg-raised border border-border rounded-lg" style={{ padding: "14px 16px" }}>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <StatusBadge status={selectedSurvey.status} />
                    <span className="font-mono text-xs text-text-muted">{selectedSurvey.tsg_id}</span>
                    {(() => { const p = getProjectForSurvey(selectedSurvey); return p ? (
                      <span className="font-mono text-[10px] px-1.5 py-[1px] rounded-sm whitespace-nowrap" style={{ background: "var(--primary-glow)", border: "1px solid var(--primary-dim)", color: "var(--text-primary-accent)" }}>
                        {p.name}
                      </span>
                    ) : null; })()}
                  </div>
                  <div className="font-display text-lg font-bold tracking-wide">
                    {selectedSurvey.address.street} {selectedSurvey.address.number}
                  </div>
                  <div className="font-mono text-xs text-text-secondary mt-0.5">
                    {selectedSurvey.address.postal_code} {selectedSurvey.address.city}
                  </div>
                  <div className="flex items-center gap-3 mt-3 mb-3 border-t border-border pt-3">
                    <div className="font-mono text-xs text-text-muted">
                      <span className="font-bold text-text-primary">{selectedSurvey.completed_sections?.length || 0}</span> sections
                    </div>
                    {selectedSurvey.assigned_surveyor && (
                      <div className="font-mono text-xs text-text-muted">
                        <Icon n="user" size={10} color="var(--text-muted)" className="inline mr-1" />
                        {selectedSurvey.assigned_surveyor}
                      </div>
                    )}
                  </div>
                  <button
                    className="toggle-btn primary active w-full flex items-center justify-center gap-2"
                    style={{ padding: "8px 16px" }}
                    onClick={() => onSelectSurvey(selectedSurvey)}
                  >
                    Open Survey
                    <Icon n="chevR" size={12} color="#fff" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-text-muted">
                  <Icon n="map" size={28} color="var(--text-muted)" />
                  <div className="font-mono text-xs mt-2">Select a survey on the map</div>
                </div>
              )}
              {/* Survey list */}
              {filtered.length > 0 && (
                <div className="flex flex-col gap-1.5 mt-1">
                  {filtered.map(s => {
                    const isActive = selectedId === s.id;
                    const proj = getProjectForSurvey(s);
                    return (
                      <div
                        key={s.id}
                        onClick={() => setSelectedId(s.id)}
                        className="bg-bg-raised border rounded-lg cursor-pointer transition-all hover:border-primary-dim"
                        style={{
                          padding: "10px 12px",
                          borderColor: isActive ? "var(--primary)" : "var(--border)",
                          boxShadow: isActive ? "0 0 0 1px var(--primary-dim)" : "none",
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <StatusBadge status={s.status} />
                          <span className="font-mono text-[10px] text-text-muted">{s.tsg_id}</span>
                          {proj && (
                            <span className="font-mono text-[9px] px-1 py-[1px] rounded-sm whitespace-nowrap" style={{ background: "var(--primary-glow)", border: "1px solid var(--primary-dim)", color: "var(--text-primary-accent)" }}>
                              {proj.name}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="font-display text-sm font-bold tracking-wide truncate">{s.address.street} {s.address.number}</div>
                            <div className="font-mono text-[10px] text-text-secondary mt-0.5">{s.address.postal_code} {s.address.city}</div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-mono text-[10px] text-text-muted">{s.completed_sections?.length || 0}s</span>
                            <Icon n="chevR" size={12} color="var(--text-muted)" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
