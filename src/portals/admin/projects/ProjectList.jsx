"use client"

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MOCK_PROJECTS, PROJECT_STATUSES } from "../../../data/mockProjects";
import { MOCK_SURVEYS } from "../../../data/mockSurveys";
import { KpiCard } from "../../../components/shared";
import { Icon } from "../../../icons/Icon";
import { useIsMobile } from "../../../hooks/useIsMobile";

const FILTERS = ["all", "active", "completed", "archived"];

function getProjectStats(project) {
  const surveys = MOCK_SURVEYS.filter((s) => project.survey_ids.includes(s.id));
  const total = surveys.length;
  const completed = surveys.filter((s) => ["completed", "sent"].includes(s.status)).length;
  const inProgress = surveys.filter((s) => ["on_going", "visited"].includes(s.status)).length;
  return { total, completed, inProgress, pct: total > 0 ? Math.round((completed / total) * 100) : 0 };
}

export const ProjectList = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "all") return MOCK_PROJECTS;
    return MOCK_PROJECTS.filter((p) => p.status === filter);
  }, [filter]);

  const totalSurveys = MOCK_PROJECTS.reduce((sum, p) => sum + p.survey_ids.length, 0);
  const activeProjects = MOCK_PROJECTS.filter((p) => p.status === "active").length;
  const allStats = MOCK_PROJECTS.map(getProjectStats);
  const totalCompleted = allStats.reduce((s, st) => s + st.completed, 0);
  const completionPct = totalSurveys > 0 ? Math.round((totalCompleted / totalSurveys) * 100) : 0;

  return (
    <div className="flex-1 overflow-y-auto" style={{ padding: isMobile ? "20px 16px" : "24px 28px" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className={`font-display ${isMobile ? "text-[22px]" : "text-[28px]"} font-extrabold tracking-wide`}>
          Projects
        </h1>
        <button
          className="toggle-btn primary active flex items-center gap-2"
          style={{ padding: "8px 18px" }}
          onClick={() => router.push("/admin/projects/new")}
        >
          <Icon n="plus" size={16} color="#fff" />
          New Project
        </button>
      </div>

      {/* KPI Row */}
      <div
        className="mb-5"
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(160px, 1fr))",
          gap: isMobile ? 10 : 14,
        }}
      >
        <KpiCard label="Total Projects" value={MOCK_PROJECTS.length} color="var(--primary)" />
        <KpiCard label="Active" value={activeProjects} color="var(--blue)" />
        <KpiCard label="Total Surveys" value={totalSurveys} color="var(--text-secondary)" />
        <KpiCard label="Completion" value={`${completionPct}%`} color="var(--text-green)" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-btn${filter === f ? " active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Project cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(340px, 1fr))",
          gap: isMobile ? 12 : 16,
        }}
      >
        {filtered.map((project) => {
          const stats = getProjectStats(project);
          const ps = PROJECT_STATUSES[project.status] || PROJECT_STATUSES.active;
          return (
            <div
              key={project.id}
              onClick={() => router.push(`/admin/projects/${project.id}`)}
              className="bg-bg-raised border border-border rounded-lg cursor-pointer transition-all hover:border-primary-dim"
              style={{ padding: isMobile ? "14px 16px" : "18px 20px" }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-display text-base font-bold tracking-wide text-text-primary">{project.name}</h3>
                <span
                  className="inline-flex items-center font-mono text-xs font-semibold tracking-[.08em] uppercase px-2 py-0.5 rounded-sm border whitespace-nowrap"
                  style={{ color: ps.color, background: ps.bg, borderColor: ps.border }}
                >
                  {ps.label}
                </span>
              </div>

              {/* Municipality */}
              <div className="font-mono text-xs text-text-secondary mb-3">
                {project.municipality}, {project.region}
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 mb-2">
                <div className="font-mono text-xs text-text-muted">
                  <span className="font-bold text-text-primary">{stats.total}</span> surveys
                </div>
                <div className="font-mono text-xs text-text-muted">
                  <span className="font-bold text-text-green">{stats.completed}</span> completed
                </div>
                <div className="font-mono text-xs text-text-muted">
                  <span className="font-bold text-blue-400">{stats.inProgress}</span> in progress
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-[3px] bg-bg-overlay rounded-sm mb-2">
                <div
                  className="h-full rounded-sm transition-[width] duration-400 ease-out"
                  style={{ width: `${stats.pct}%`, background: "var(--text-green)" }}
                />
              </div>

              {/* Date */}
              <div className="font-mono text-xs text-text-muted">
                Created {project.created_at}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-text-muted">
          <Icon n="clipboard" size={32} color="var(--text-muted)" />
          <div className="font-mono text-sm mt-3">No projects found</div>
        </div>
      )}
    </div>
  );
};
