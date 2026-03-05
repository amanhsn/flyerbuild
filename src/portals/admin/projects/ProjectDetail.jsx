"use client"

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { getProjectById } from "../../../data/mockProjects";
import { MOCK_SURVEYS } from "../../../data/mockSurveys";
import { STATUSES } from "../../../data/statusConfig";
import { StatusBadge, KpiCard, DataTable, AssignmentModal } from "../../../components/shared";
import { PROJECT_STATUSES } from "../../../data/mockProjects";
import { Icon } from "../../../icons/Icon";
import { useIsMobile } from "../../../hooks/useIsMobile";

// Lazy-load the map portion to avoid SSR issues with Leaflet
const ProjectMap = dynamic(() => import("./ProjectMap"), { ssr: false });

export const ProjectDetail = ({ projectId }) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const project = getProjectById(projectId);

  const [surveys, setSurveys] = useState(() =>
    project ? MOCK_SURVEYS.filter((s) => project.survey_ids.includes(s.id)) : []
  );
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(new Set());
  const [assignModal, setAssignModal] = useState(null); // null | { survey } | { bulk: true }
  const [selectedId, setSelectedId] = useState(null);

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="font-mono text-sm text-text-muted">Project not found</div>
      </div>
    );
  }

  const ps = PROJECT_STATUSES[project.status] || PROJECT_STATUSES.active;

  // KPI stats
  const total = surveys.length;
  const completed = surveys.filter((s) => ["completed", "sent"].includes(s.status)).length;
  const inProgress = surveys.filter((s) => ["on_going", "visited"].includes(s.status)).length;
  const pending = surveys.filter((s) => ["to_do", "appointment"].includes(s.status)).length;
  const issues = surveys.filter((s) => ["rework", "rejected", "final_no_entry"].includes(s.status)).length;

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === surveys.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(surveys.map((s) => s.id)));
    }
  };

  const handleAssign = (userName, notes) => {
    if (assignModal?.bulk) {
      setSurveys((prev) =>
        prev.map((s) => (selected.has(s.id) ? { ...s, assigned_surveyor: userName } : s))
      );
      setSelected(new Set());
    } else if (assignModal?.id) {
      setSurveys((prev) =>
        prev.map((s) => (s.id === assignModal.id ? { ...s, assigned_surveyor: userName } : s))
      );
    }
    setAssignModal(null);
  };

  const columns = [
    {
      key: "select",
      label: "",
      width: "40px",
      render: (r) => (
        <input
          type="checkbox"
          checked={selected.has(r.id)}
          onChange={() => toggleSelect(r.id)}
          onClick={(e) => e.stopPropagation()}
          className="accent-primary"
        />
      ),
    },
    { key: "tsg_id", label: "TSG ID", width: "90px" },
    { key: "status", label: "Status", width: "120px", render: (r) => <StatusBadge status={r.status} /> },
    { key: "address", label: "Address", render: (r) => `${r.address.street} ${r.address.number}` },
    { key: "city", label: "City", width: "90px", render: (r) => r.address.city },
    { key: "surveyor", label: "Surveyor", width: "130px", render: (r) => r.assigned_surveyor || "--" },
    {
      key: "assign",
      label: "",
      width: "40px",
      render: (r) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setAssignModal(r);
          }}
          className="flex items-center justify-center cursor-pointer rounded-sm"
          style={{ background: "none", border: "none", padding: 4 }}
          title="Assign surveyor"
        >
          <Icon n="user" size={14} color="var(--text-muted)" />
        </button>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div style={{ padding: isMobile ? "16px 16px 0" : "20px 28px 0" }}>
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => router.push("/admin/projects")}
            className="flex items-center cursor-pointer"
            style={{ background: "none", border: "none", padding: 4 }}
          >
            <Icon n="chevR" size={18} color="var(--text-secondary)" style={{ transform: "rotate(180deg)" }} />
          </button>
          <h1 className={`font-display ${isMobile ? "text-[22px]" : "text-[28px]"} font-extrabold tracking-wide`}>
            {project.name}
          </h1>
          <span
            className="inline-flex items-center font-mono text-xs font-semibold tracking-[.08em] uppercase px-2 py-0.5 rounded-sm border"
            style={{ color: ps.color, background: ps.bg, borderColor: ps.border }}
          >
            {ps.label}
          </span>
        </div>

        {/* KPI Row */}
        <div
          className="mb-4"
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(140px, 1fr))",
            gap: isMobile ? 10 : 14,
          }}
        >
          <KpiCard label="Total" value={total} color="var(--primary)" />
          <KpiCard label="Completed" value={completed} color="var(--text-green)" total={total} />
          <KpiCard label="In Progress" value={inProgress} color="var(--blue)" />
          <KpiCard label="Pending" value={pending} color="var(--text-secondary)" />
          <KpiCard label="Issues" value={issues} color="var(--text-red)" />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <div className="flex gap-1">
            <button className={`filter-btn${view === "list" ? " active" : ""}`} onClick={() => setView("list")}>
              List
            </button>
            <button className={`filter-btn${view === "map" ? " active" : ""}`} onClick={() => setView("map")}>
              Map
            </button>
          </div>
          <div className="flex gap-2">
            {selected.size > 0 && (
              <button
                className="toggle-btn primary active flex items-center gap-1.5"
                style={{ padding: "6px 14px" }}
                onClick={() => setAssignModal({ bulk: true })}
              >
                <Icon n="user" size={14} color="#fff" />
                Assign Selected ({selected.size})
              </button>
            )}
            <button
              className="toggle-btn primary active flex items-center gap-1.5"
              style={{ padding: "6px 14px" }}
              onClick={() => router.push(`/admin/projects/${projectId}/create`)}
            >
              <Icon n="plus" size={14} color="#fff" />
              Add Survey
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden" style={{ padding: isMobile ? "0 16px 16px" : "0 28px 28px" }}>
        {view === "list" ? (
          <div className="overflow-y-auto h-full">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={selected.size === surveys.length && surveys.length > 0}
                onChange={toggleSelectAll}
                className="accent-primary"
              />
              <span className="font-mono text-xs text-text-muted">
                {selected.size > 0 ? `${selected.size} selected` : "Select all"}
              </span>
            </div>
            <DataTable
              columns={columns}
              rows={surveys}
              selectedId={selectedId}
              onRowClick={(row) => setSelectedId(row.id)}
              emptyMessage="No surveys in this project"
            />
          </div>
        ) : (
          <div className="h-full rounded-lg overflow-hidden border border-border">
            <ProjectMap
              surveys={surveys}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      {assignModal && (
        <AssignmentModal
          title={assignModal.bulk ? "Bulk Assign Surveyor" : "Assign Surveyor"}
          subtitle={
            assignModal.bulk
              ? `${selected.size} surveys selected`
              : `${assignModal.tsg_id} — ${assignModal.address?.street} ${assignModal.address?.number}`
          }
          role="surveyor"
          currentValue=""
          onCancel={() => setAssignModal(null)}
          onSubmit={handleAssign}
        />
      )}
    </div>
  );
};
