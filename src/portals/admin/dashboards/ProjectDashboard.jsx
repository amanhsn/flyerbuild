import { useMemo } from "react";
import { useLang } from "../../../i18n/LangContext";
import { MOCK_SURVEYS } from "../../../data/mockSurveys";
import { KpiCard, ChartCard } from "../../../components/shared";
import { disp, mono } from "../../../styles/helpers";
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
    <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "20px 16px" : "24px 28px" }}>
      <h1 style={disp(isMobile ? 22 : 28, 800)}>Project Dashboard</h1>
      <p style={mono(14, "var(--text-secondary)", { marginTop: 4, marginBottom: 24 })}>
        Project health and forecasting
      </p>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(160px, 1fr))", gap: isMobile ? 8 : 12, marginBottom: 24 }}>
        <KpiCard label="Completion" value={`${stats.completionPct}%`} color="var(--green)" />
        <KpiCard label="Completed" value={stats.completed} color="var(--green)" total={stats.total} />
        <KpiCard label="Remaining" value={stats.total - stats.completed} color="var(--primary)" total={stats.total} />
        <KpiCard label="Aging Approvals" value={stats.agingApprovals} color="var(--red)" />
      </div>

      {stats.bottleneck && (
        <div style={{
          padding: "14px 18px", background: "var(--primary-glow)",
          border: "1px solid var(--primary-dim)", borderRadius: "var(--radius-md)", marginBottom: 20,
        }}>
          <div style={mono(12, "var(--text-primary-accent)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 })}>
            Bottleneck
          </div>
          <div style={mono(13, "var(--text-primary)")}>
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
