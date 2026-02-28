import { useMemo } from "react";
import { useLang } from "../../../i18n/LangContext";
import { MOCK_SURVEYS } from "../../../data/mockSurveys";
import { KpiCard, ChartCard } from "../../../components/shared";
import { useIsMobile } from "../../../hooks/useIsMobile";

export const ProjectDashboard = () => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const surveys = MOCK_SURVEYS;

  const stats = useMemo(() => {
    const total = surveys.length;
    const completed = surveys.filter(s => ["completed", "sent"].includes(s.status)).length;
    const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Bottleneck: which status has the most surveys?
    const statusCounts = {};
    surveys.forEach(s => { statusCounts[s.status] = (statusCounts[s.status] || 0) + 1; });
    const bottleneck = Object.entries(statusCounts).sort((a, b) => b[1] - a[1])[0];

    // Aging approvals
    const agingApprovals = surveys.filter(s =>
      ["validation_f49", "validation_client"].includes(s.status)
    ).length;

    return { total, completed, completionPct, bottleneck, agingApprovals };
  }, [surveys]);

  return (
    <div className="flex-1 overflow-y-auto" style={{ padding: isMobile ? "20px 16px" : "24px 28px" }}>
      <h1 className={`font-display ${isMobile ? "text-[22px]" : "text-[28px]"} font-extrabold tracking-wide`}>Project Dashboard</h1>
      <p className="font-mono text-sm text-text-secondary mt-1 mb-6">
        Project health and forecasting
      </p>

      <div className="mb-6" style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(160px, 1fr))", gap: isMobile ? 8 : 12 }}>
        <KpiCard label="Completion" value={`${stats.completionPct}%`} color="var(--green)" />
        <KpiCard label="Completed" value={stats.completed} color="var(--green)" total={stats.total} />
        <KpiCard label="Remaining" value={stats.total - stats.completed} color="var(--primary)" total={stats.total} />
        <KpiCard label="Aging Approvals" value={stats.agingApprovals} color="var(--red)" />
      </div>

      {stats.bottleneck && (
        <div className="rounded-md mb-5" style={{
          padding: "14px 18px", background: "var(--primary-glow)",
          border: "1px solid var(--primary-dim)",
        }}>
          <div className="font-mono text-xs text-text-primary-accent uppercase tracking-widest mb-1">
            Bottleneck
          </div>
          <div className="font-mono text-[13px] text-text-primary">
            {stats.bottleneck[1]} surveys stuck in <strong>{stats.bottleneck[0]}</strong>
          </div>
        </div>
      )}

      <ChartCard
        title="Monthly Completion Forecast"
        data={[
          { label: "Jan", value: 1, color: "var(--green)" },
          { label: "Feb", value: 3, color: "var(--green)" },
          { label: "Mar", value: 5, color: "var(--green-dim)" },
          { label: "Apr", value: 3, color: "var(--green-dim)" },
        ]}
        height={140}
      />
    </div>
  );
};
