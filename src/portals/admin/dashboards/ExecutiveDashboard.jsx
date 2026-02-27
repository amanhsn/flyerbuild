import { useMemo } from "react";
import { useLang } from "../../../i18n/LangContext";
import { MOCK_SURVEYS } from "../../../data/mockSurveys";
import { STATUSES } from "../../../data/statusConfig";
import { KpiCard, ChartCard } from "../../../components/shared";
import { disp, mono } from "../../../styles/helpers";
import { useIsMobile } from "../../../hooks/useIsMobile";

export const ExecutiveDashboard = () => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const surveys = MOCK_SURVEYS;

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
    <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "20px 16px" : "24px 28px" }}>
      <h1 style={disp(28, 800)}>Executive Dashboard</h1>
      <p style={mono(12, "var(--text-secondary)", { marginTop: 4, marginBottom: 24 })}>
        Overall platform metrics — {stats.total} total addresses
      </p>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
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
      <div style={{ marginTop: 24 }}>
        <div style={mono(11, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 })}>
          Workflow Funnel
        </div>
        <div style={{ display: isMobile ? "grid" : "flex", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 8 : 4, alignItems: "flex-end" }}>
          {[
            { label: "Survey", count: stats.inProgress + stats.pending, color: "var(--primary)" },
            { label: "Validation", count: stats.review, color: "var(--blue)" },
            { label: "Completed", count: stats.completed, color: "var(--green)" },
            { label: "Issues", count: stats.issues, color: "var(--red)" },
          ].map((stage, i) => (
            <div key={i} style={{
              flex: 1, padding: "12px 16px", textAlign: "center",
              background: "var(--bg-raised)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
            }}>
              <div style={disp(24, 800, stage.color)}>{stage.count}</div>
              <div style={mono(11, "var(--text-secondary)", { marginTop: 4 })}>{stage.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
