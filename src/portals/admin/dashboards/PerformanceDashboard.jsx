"use client"

import { useMemo } from "react";
import { useLang } from "../../../i18n/LangContext";
import { MOCK_SURVEYS } from "../../../data/mockSurveys";
import { MOCK_ASSIGNMENTS } from "../../../data/mockAssignments";
import { DataTable } from "../../../components/shared/DataTable";
import { KpiCard } from "../../../components/shared";
import { useIsMobile } from "../../../hooks/useIsMobile";

// ── Surveyor Stats ──────────────────────────────────────────────────────────

const SurveyorStats = ({ isMobile }) => {
  const surveys = MOCK_SURVEYS;

  const { rows, kpis } = useMemo(() => {
    const bySurveyor = {};
    surveys.forEach(s => {
      const name = s.assigned_surveyor || "Unassigned";
      if (!bySurveyor[name]) bySurveyor[name] = { total: 0, completed: 0, rework: 0, onGoing: 0, toDo: 0 };
      bySurveyor[name].total++;
      if (["completed", "sent"].includes(s.status)) bySurveyor[name].completed++;
      if (s.status === "rework") bySurveyor[name].rework++;
      if (s.status === "on_going") bySurveyor[name].onGoing++;
      if (s.status === "to_do") bySurveyor[name].toDo++;
    });

    const rows = Object.entries(bySurveyor).map(([name, d]) => ({
      id: name,
      name,
      assigned: d.total,
      completed: d.completed,
      onGoing: d.onGoing,
      toDo: d.toDo,
      rework: d.rework,
      reworkRate: d.total > 0 ? `${Math.round((d.rework / d.total) * 100)}%` : "0%",
      completionRate: d.total > 0 ? `${Math.round((d.completed / d.total) * 100)}%` : "0%",
    }));

    const totalAssigned = rows.reduce((s, r) => s + r.assigned, 0);
    const totalCompleted = rows.reduce((s, r) => s + r.completed, 0);
    const totalRework = rows.reduce((s, r) => s + r.rework, 0);

    return {
      rows,
      kpis: {
        surveyors: rows.filter(r => r.name !== "Unassigned").length,
        totalAssigned,
        totalCompleted,
        avgRework: totalAssigned > 0 ? `${Math.round((totalRework / totalAssigned) * 100)}%` : "0%",
      },
    };
  }, [surveys]);

  const columns = [
    { key: "name", label: "Surveyor", width: "180px", render: r => (
      <span className="font-mono text-xs text-text-primary font-semibold">{r.name}</span>
    )},
    { key: "assigned", label: "Assigned", width: "90px" },
    { key: "completed", label: "Completed", width: "100px", render: r => (
      <span className="text-text-green font-mono text-xs">{r.completed}</span>
    )},
    { key: "onGoing", label: "On Going", width: "90px" },
    { key: "toDo", label: "To Do", width: "80px" },
    { key: "rework", label: "Rework", width: "80px", render: r => (
      <span className={`font-mono text-xs ${r.rework > 0 ? "text-text-red" : "text-text-secondary"}`}>{r.rework}</span>
    )},
    { key: "reworkRate", label: "Rework %", width: "90px" },
    { key: "completionRate", label: "Completion %", width: "110px", render: r => (
      <span className="text-text-primary-accent font-mono text-xs">{r.completionRate}</span>
    )},
  ];

  const mobileColumns = columns.filter(c => ["name", "assigned", "completed", "reworkRate"].includes(c.key));

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 8 : 12 }} className="mb-6">
        <KpiCard label="Active Surveyors" value={kpis.surveyors} color="var(--primary)" />
        <KpiCard label="Total Assigned" value={kpis.totalAssigned} color="var(--blue)" />
        <KpiCard label="Total Completed" value={kpis.totalCompleted} color="var(--green)" />
        <KpiCard label="Avg Rework Rate" value={kpis.avgRework} color="var(--red)" />
      </div>
      <DataTable columns={isMobile ? mobileColumns : columns} rows={rows} />
    </>
  );
};

// ── Subcontractor Stats ─────────────────────────────────────────────────────

const SubcontractorStats = ({ isMobile }) => {
  const surveys = MOCK_SURVEYS;
  const assignments = MOCK_ASSIGNMENTS;

  const { rows, kpis } = useMemo(() => {
    // Aggregate from surveys (assigned_subcontractor)
    const bySubco = {};
    surveys.forEach(s => {
      const name = s.assigned_subcontractor;
      if (!name) return;
      if (!bySubco[name]) bySubco[name] = { assigned: 0, completed: 0, inProgress: 0, disputed: 0 };
      bySubco[name].assigned++;
    });

    // Augment with assignments mock data
    assignments.forEach(a => {
      // Use a generic subco name since assignments don't have subco name
      const name = "FiberCo BVBA";
      if (!bySubco[name]) bySubco[name] = { assigned: 0, completed: 0, inProgress: 0, disputed: 0 };
      if (a.status === "completed") bySubco[name].completed++;
      if (["in_progress", "accepted"].includes(a.status)) bySubco[name].inProgress++;
      if (a.status === "disputed") bySubco[name].disputed++;
    });

    // Add a second subco for demo purposes
    if (!bySubco["TelNet NV"]) {
      bySubco["TelNet NV"] = { assigned: 3, completed: 1, inProgress: 1, disputed: 1 };
    }

    const rows = Object.entries(bySubco).map(([name, d]) => ({
      id: name,
      name,
      assigned: d.assigned || assignments.filter(() => name === "FiberCo BVBA").length || d.inProgress + d.completed + d.disputed,
      completed: d.completed,
      inProgress: d.inProgress,
      disputed: d.disputed,
      completionRate: (d.completed + d.inProgress + d.disputed) > 0
        ? `${Math.round((d.completed / (d.completed + d.inProgress + d.disputed)) * 100)}%`
        : "0%",
      disputeRate: (d.completed + d.inProgress + d.disputed) > 0
        ? `${Math.round((d.disputed / (d.completed + d.inProgress + d.disputed)) * 100)}%`
        : "0%",
    }));

    const totalAssigned = rows.reduce((s, r) => s + r.assigned, 0);
    const totalCompleted = rows.reduce((s, r) => s + r.completed, 0);
    const totalDisputed = rows.reduce((s, r) => s + r.disputed, 0);

    return {
      rows,
      kpis: {
        subcontractors: rows.length,
        totalAssigned,
        totalCompleted,
        totalDisputed,
      },
    };
  }, [surveys, assignments]);

  const columns = [
    { key: "name", label: "Subcontractor", width: "180px", render: r => (
      <span className="font-mono text-xs text-text-primary font-semibold">{r.name}</span>
    )},
    { key: "assigned", label: "Assigned", width: "90px" },
    { key: "completed", label: "Completed", width: "100px", render: r => (
      <span className="text-text-green font-mono text-xs">{r.completed}</span>
    )},
    { key: "inProgress", label: "In Progress", width: "100px" },
    { key: "disputed", label: "Disputed", width: "90px", render: r => (
      <span className={`font-mono text-xs ${r.disputed > 0 ? "text-text-red" : "text-text-secondary"}`}>{r.disputed}</span>
    )},
    { key: "completionRate", label: "Completion %", width: "110px", render: r => (
      <span className="text-text-primary-accent font-mono text-xs">{r.completionRate}</span>
    )},
    { key: "disputeRate", label: "Dispute %", width: "100px" },
  ];

  const mobileColumns = columns.filter(c => ["name", "assigned", "completed", "disputed"].includes(c.key));

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 8 : 12 }} className="mb-6">
        <KpiCard label="Subcontractors" value={kpis.subcontractors} color="var(--primary)" />
        <KpiCard label="Total Assigned" value={kpis.totalAssigned} color="var(--blue)" />
        <KpiCard label="Total Completed" value={kpis.totalCompleted} color="var(--green)" />
        <KpiCard label="Total Disputed" value={kpis.totalDisputed} color="var(--red)" />
      </div>
      <DataTable columns={isMobile ? mobileColumns : columns} rows={rows} />
    </>
  );
};

// ── Main ────────────────────────────────────────────────────────────────────

export const PerformanceDashboard = ({ view = "surveyor" }) => {
  const isMobile = useIsMobile();

  const title = view === "surveyor" ? "Surveyor Stats" : "Subcontractor Stats";
  const subtitle = view === "surveyor"
    ? "Individual surveyor performance and completion metrics"
    : "Subcontractor assignment progress and dispute tracking";

  return (
    <div className="flex-1 overflow-y-auto" style={{ padding: isMobile ? "20px 16px" : "24px 28px" }}>
      <h1 className={`font-display ${isMobile ? "text-[22px]" : "text-[28px]"} font-extrabold tracking-wide`}>
        {title}
      </h1>
      <p className="font-mono text-sm text-text-secondary mt-1 mb-6">{subtitle}</p>

      {view === "surveyor" ? <SurveyorStats isMobile={isMobile} /> : <SubcontractorStats isMobile={isMobile} />}
    </div>
  );
};
