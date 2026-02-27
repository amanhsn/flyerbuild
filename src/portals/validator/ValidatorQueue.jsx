import { useMemo } from "react";
import { useLang } from "../../i18n/LangContext";
import { KpiCard, StatusBadge } from "../../components/shared";
import { Icon } from "../../icons/Icon";
import { disp, mono } from "../../styles/helpers";
import { useIsMobile } from "../../hooks/useIsMobile";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending Review", statuses: ["validation_f49"] },
  { key: "approved", label: "Approved", statuses: ["completed", "sent", "validation_client"] },
  { key: "rejected", label: "Rejected", statuses: ["rework", "rejected"] },
];

export const ValidatorQueue = ({ surveys, filter, setFilter, onSelectSurvey }) => {
  const { t } = useLang();
  const isMobile = useIsMobile();

  const filtered = useMemo(() => {
    if (filter === "all") return surveys;
    const f = FILTERS.find(fl => fl.key === filter);
    if (!f?.statuses) return surveys;
    return surveys.filter(s => f.statuses.includes(s.status));
  }, [surveys, filter]);

  // KPIs
  const queueDepth = surveys.filter(s => s.status === "validation_f49").length;
  const approved = surveys.filter(s => ["completed", "sent", "validation_client"].includes(s.status)).length;
  const rejected = surveys.filter(s => ["rework", "rejected"].includes(s.status)).length;
  const total = surveys.length;
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px" : "24px 28px" }}>
      <h1 style={disp(isMobile ? 22 : 28, 800)}>Validation Queue</h1>
      <p style={mono(14, "var(--text-secondary)", { marginTop: 4, marginBottom: 20 })}>
        Review completed surveys · {surveys.length} in queue
      </p>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(140px, 1fr))", gap: isMobile ? 8 : 12, marginBottom: 20 }}>
        <KpiCard label="Queue Depth" value={queueDepth} color="var(--primary)" total={total} />
        <KpiCard label="Approved" value={approved} color="var(--green)" total={total} />
        <KpiCard label="Rejected" value={rejected} color="var(--red)" total={total} />
        <KpiCard label="Approval Rate" value={`${approvalRate}%`} color="var(--blue)" />
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

      {/* Survey list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(s => (
          <div
            key={s.id}
            onClick={() => onSelectSurvey(s)}
            className="survey-card fade-up"
            style={{ cursor: "pointer" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <StatusBadge status={s.status} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={disp(16, 700)}>{s.address.street} {s.address.number}</div>
                <div style={mono(12, "var(--text-secondary)", { marginTop: 2 })}>
                  {s.tsg_id} · {s.address.postal_code} {s.address.city}
                </div>
              </div>
              <div style={mono(12, "var(--text-muted)")}>
                {s.completed_sections?.length || 0} sections
              </div>
              <Icon n="chevR" size={14} color="var(--text-muted)" />
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", ...mono(13, "var(--text-muted)") }}>
            No surveys match this filter.
          </div>
        )}
      </div>
    </div>
  );
};
