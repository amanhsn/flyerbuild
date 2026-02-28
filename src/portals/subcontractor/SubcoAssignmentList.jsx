import { useMemo } from "react";
import { useLang } from "../../i18n/LangContext";
import { KpiCard, EmptyState } from "../../components/shared";
import { Icon } from "../../icons/Icon";
import { BUILD_PHASE_LABELS } from "../../data/buildTypes";
import { useIsMobile } from "../../hooks/useIsMobile";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending_acceptance", label: "Pending Acceptance" },
  { key: "accepted", label: "Accepted" },
  { key: "in_progress", label: "In Progress" },
  { key: "disputed", label: "Disputed" },
  { key: "completed", label: "Completed" },
];

const statusColors = {
  pending_acceptance: "var(--primary)",
  accepted: "var(--blue)",
  in_progress: "var(--blue)",
  disputed: "var(--red)",
  completed: "var(--green)",
};

export const SubcoAssignmentList = ({ assignments, filter, setFilter, onSelect }) => {
  const { t } = useLang();
  const isMobile = useIsMobile();

  const filtered = useMemo(() => {
    if (filter === "all") return assignments;
    return assignments.filter(a => a.status === filter);
  }, [assignments, filter]);

  const assigned = assignments.length;
  const inProgress = assignments.filter(a => ["accepted", "in_progress"].includes(a.status)).length;
  const completed = assignments.filter(a => a.status === "completed").length;
  const disputed = assignments.filter(a => a.status === "disputed").length;
  const pendingAccept = assignments.filter(a => a.status === "pending_acceptance").length;

  return (
    <div className="flex-1 overflow-y-auto" style={{ padding: isMobile ? "16px" : "24px 28px" }}>
      <h1 className={`font-display ${isMobile ? "text-[22px]" : "text-[28px]"} font-extrabold tracking-wide`}>My Assignments</h1>
      <p className="font-mono text-sm text-text-secondary mt-1 mb-5">
        FiberCo BVBA -- {assigned} assignments
      </p>

      {/* KPIs */}
      <div className="mb-5" style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(130px, 1fr))", gap: isMobile ? 8 : 12 }}>
        <KpiCard label="Assigned" value={assigned} color="var(--primary)" />
        <KpiCard label="In Progress" value={inProgress} color="var(--blue)" total={assigned} />
        <KpiCard label="Completed" value={completed} color="var(--green)" total={assigned} />
        <KpiCard label="Disputed" value={disputed} color="var(--red)" total={assigned} />
        <KpiCard label="Pending Accept" value={pendingAccept} color="var(--text-secondary)" total={assigned} />
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto shrink-0">
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

      {/* Assignment cards */}
      <div className="flex flex-col gap-2.5">
        {filtered.map(a => (
          <div
            key={a.id}
            onClick={() => onSelect(a)}
            className="survey-card fade-up cursor-pointer"
            style={{
              borderLeft: `3px solid ${statusColors[a.status] || "var(--border)"}`,
            }}
          >
            <div className="flex items-center gap-2.5">
              <div className="font-mono text-xs uppercase rounded-sm" style={{
                color: statusColors[a.status],
                padding: "2px 8px",
                background: "var(--bg-overlay)", border: `1px solid ${statusColors[a.status]}40`,
              }}>
                {a.status.replace(/_/g, " ")}
              </div>
              <span className="font-mono text-xs text-text-muted">{a.tsg_id}</span>
              {a.dispute && <Icon n="alert" size={12} color="var(--red)" />}
            </div>
            <div className="font-display text-[17px] font-bold tracking-wide mt-1.5">
              {a.address.street} {a.address.number}
            </div>
            <div className="font-mono text-xs text-text-secondary mt-0.5">
              {a.address.postal_code} {a.address.city}
            </div>

            {a.phase && (
              <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-border">
                <span className="font-mono text-xs text-text-muted">
                  {BUILD_PHASE_LABELS[a.phase] || a.phase}
                </span>
                <div className="flex-1" style={{ height: 4, background: "var(--bg-overlay)", borderRadius: 2 }}>
                  <div style={{
                    width: `${a.progress}%`, height: "100%", borderRadius: 2,
                    background: statusColors[a.status] || "var(--primary)",
                  }} />
                </div>
                <span className="font-mono text-xs text-text-muted">{a.progress}%</span>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <EmptyState icon="clipboard" message="No assignments match this filter." sub="Try adjusting your filters" />
        )}
      </div>
    </div>
  );
};
