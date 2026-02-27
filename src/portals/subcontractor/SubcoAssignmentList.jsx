import { useMemo } from "react";
import { useLang } from "../../i18n/LangContext";
import { KpiCard } from "../../components/shared";
import { Icon } from "../../icons/Icon";
import { disp, mono } from "../../styles/helpers";
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
    <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px" : "24px 28px" }}>
      <h1 style={disp(isMobile ? 22 : 28, 800)}>My Assignments</h1>
      <p style={mono(12, "var(--text-secondary)", { marginTop: 4, marginBottom: 20 })}>
        FiberCo BVBA — {assigned} assignments
      </p>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(130px, 1fr))", gap: isMobile ? 8 : 12, marginBottom: 20 }}>
        <KpiCard label="Assigned" value={assigned} color="var(--primary)" />
        <KpiCard label="In Progress" value={inProgress} color="var(--blue)" total={assigned} />
        <KpiCard label="Completed" value={completed} color="var(--green)" total={assigned} />
        <KpiCard label="Disputed" value={disputed} color="var(--red)" total={assigned} />
        <KpiCard label="Pending Accept" value={pendingAccept} color="var(--text-secondary)" total={assigned} />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", flexShrink: 0 }}>
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
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(a => (
          <div
            key={a.id}
            onClick={() => onSelect(a)}
            className="survey-card fade-up"
            style={{
              cursor: "pointer",
              borderLeft: `3px solid ${statusColors[a.status] || "var(--border)"}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                ...mono(11, statusColors[a.status]),
                padding: "2px 8px", borderRadius: "var(--radius-sm)",
                background: "var(--bg-overlay)", border: `1px solid ${statusColors[a.status]}40`,
                textTransform: "uppercase",
              }}>
                {a.status.replace(/_/g, " ")}
              </div>
              <span style={mono(11, "var(--text-muted)")}>{a.tsg_id}</span>
              {a.dispute && <Icon n="alert" size={12} color="var(--red)" />}
            </div>
            <div style={disp(17, 700, undefined, { marginTop: 6 })}>
              {a.address.street} {a.address.number}
            </div>
            <div style={mono(11, "var(--text-secondary)", { marginTop: 2 })}>
              {a.address.postal_code} {a.address.city}
            </div>

            {a.phase && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
                <span style={mono(11, "var(--text-muted)")}>
                  {BUILD_PHASE_LABELS[a.phase] || a.phase}
                </span>
                <div style={{ flex: 1, height: 4, background: "var(--bg-overlay)", borderRadius: 2 }}>
                  <div style={{
                    width: `${a.progress}%`, height: "100%", borderRadius: 2,
                    background: statusColors[a.status] || "var(--primary)",
                  }} />
                </div>
                <span style={mono(11, "var(--text-muted)")}>{a.progress}%</span>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", ...mono(13, "var(--text-muted)") }}>
            No assignments match this filter.
          </div>
        )}
      </div>
    </div>
  );
};
