import { useMemo } from "react";
import { useLang } from "../../../i18n/LangContext";
import { MOCK_SURVEYS } from "../../../data/mockSurveys";
import { STATUSES } from "../../../data/statusConfig";
import { KpiCard, ChartCard } from "../../../components/shared";
import { Icon } from "../../../icons/Icon";
import { useIsMobile } from "../../../hooks/useIsMobile";

export const ExecutiveDashboard = ({ surveys: surveysProp, onCreateSurvey }) => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const surveys = surveysProp || MOCK_SURVEYS;

  const stats = useMemo(() => {
    const total = surveys.length;
    const byStatus = {};
    surveys.forEach(s => { byStatus[s.status] = (byStatus[s.status] || 0) + 1; });
    const completed = (byStatus.completed || 0) + (byStatus.sent || 0);
    const inProgress = (byStatus.on_going || 0) + (byStatus.visited || 0);
    const pending = (byStatus.to_do || 0) + (byStatus.appointment || 0);
    const review = (byStatus.validation_f49 || 0) + (byStatus.validation_client || 0);
    const issues = (byStatus.rework || 0) + (byStatus.rejected || 0) + (byStatus.final_no_entry || 0);
    return { total, completed, inProgress, pending, review, issues, byStatus };
  }, [surveys]);

  const statusChartData = Object.entries(stats.byStatus).map(([status, count]) => ({
    label: STATUSES[status]?.label || status,
    value: count,
    color: STATUSES[status]?.color || "var(--text-muted)",
  }));

  return (
    <div className="flex-1 overflow-y-auto" style={{ padding: isMobile ? "20px 16px" : "24px 28px" }}>
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <h1 className={`font-display ${isMobile ? "text-[22px]" : "text-[28px]"} font-extrabold tracking-wide`}>Executive Dashboard</h1>
          <p className="font-mono text-sm text-text-secondary mt-1">
            Overall platform metrics — {stats.total} total addresses
          </p>
        </div>
        {onCreateSurvey && (
          <button
            className="toggle-btn primary active flex items-center gap-2 shrink-0"
            onClick={onCreateSurvey}
            style={{ padding: "10px 20px" }}
          >
            <Icon n="plus" size={16} color="#fff" />
            {!isMobile && "Create Survey"}
          </button>
        )}
      </div>

      {/* KPI Row */}
      <div className="mb-6" style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(140px, 1fr))", gap: isMobile ? 8 : 12 }}>
        <KpiCard label="Total Addresses" value={stats.total} color="var(--primary)" />
        <KpiCard label="Completed" value={stats.completed} color="var(--green)" total={stats.total} />
        <KpiCard label="In Progress" value={stats.inProgress} color="var(--blue)" total={stats.total} />
        <KpiCard label="Pending" value={stats.pending} color="var(--text-secondary)" total={stats.total} />
        <KpiCard label="In Review" value={stats.review} color="var(--primary)" total={stats.total} />
        <KpiCard label="Issues" value={stats.issues} color="var(--red)" total={stats.total} />
      </div>

      {/* Status distribution chart */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <ChartCard title="Status Distribution" data={statusChartData} height={160} />
        <ChartCard
          title="Weekly Completion Trend"
          data={[
            { label: "W1", value: 2, color: "var(--green)" },
            { label: "W2", value: 3, color: "var(--green)" },
            { label: "W3", value: 1, color: "var(--green)" },
            { label: "W4", value: 4, color: "var(--green)" },
          ]}
          height={160}
        />
      </div>

      {/* Completion funnel */}
      <div className="mt-6">
        <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-3">
          Workflow Funnel
        </div>
        <div className="items-end" style={{ display: isMobile ? "grid" : "flex", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 8 : 4 }}>
          {[
            { label: "Survey", count: stats.inProgress + stats.pending, color: "var(--primary)" },
            { label: "Validation", count: stats.review, color: "var(--blue)" },
            { label: "Completed", count: stats.completed, color: "var(--green)" },
            { label: "Issues", count: stats.issues, color: "var(--red)" },
          ].map((stage, i) => (
            <div key={i} className="flex-1 text-center bg-bg-raised border border-border rounded-md" style={{
              padding: "12px 16px",
            }}>
              <div className="font-display text-2xl font-extrabold tracking-wide" style={{ color: stage.color }}>{stage.count}</div>
              <div className="font-mono text-xs text-text-secondary mt-1">{stage.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
