import { useMemo } from "react";
import { useLang } from "../../i18n/LangContext";
import { KpiCard, StatusBadge, EmptyState } from "../../components/shared";
import { Icon } from "../../icons/Icon";
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
    <div className="flex-1 overflow-y-auto" style={{ padding: isMobile ? "16px" : "24px 28px" }}>
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

      {/* Survey list */}
      <div className="flex flex-col gap-2">
        {filtered.map(s => (
          <div
            key={s.id}
            onClick={() => onSelectSurvey(s)}
            className="survey-card fade-up cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <StatusBadge status={s.status} />
              <div className="flex-1 min-w-0">
                <div className="font-display text-base font-bold tracking-wide">{s.address.street} {s.address.number}</div>
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
    </div>
  );
};
