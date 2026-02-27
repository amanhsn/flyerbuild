import { useMemo } from "react";
import { useLang } from "../../../i18n/LangContext";
import { MOCK_SURVEYS } from "../../../data/mockSurveys";
import { KpiCard, ChartCard } from "../../../components/shared";
import { disp, mono } from "../../../styles/helpers";
import { useIsMobile } from "../../../hooks/useIsMobile";

export const PerformanceDashboard = () => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const surveys = MOCK_SURVEYS;

  const stats = useMemo(() => {
    // Group by surveyor
    const bySurveyor = {};
    surveys.forEach(s => {
      const name = s.assigned_surveyor || "Unassigned";
      if (!bySurveyor[name]) bySurveyor[name] = { total: 0, completed: 0, rework: 0 };
      bySurveyor[name].total++;
      if (["completed", "sent"].includes(s.status)) bySurveyor[name].completed++;
      if (s.status === "rework") bySurveyor[name].rework++;
    });

    return { bySurveyor };
  }, [surveys]);

  const surveyorData = Object.entries(stats.bySurveyor).map(([name, data]) => ({
    name,
    ...data,
    velocity: `${data.completed}/day`,
    reworkRate: data.total > 0 ? `${Math.round((data.rework / data.total) * 100)}%` : "0%",
  }));

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "20px 16px" : "24px 28px" }}>
      <h1 style={disp(isMobile ? 22 : 28, 800)}>Performance Dashboard</h1>
      <p style={mono(12, "var(--text-secondary)", { marginTop: 4, marginBottom: 24 })}>
        Surveyor and subcontractor performance metrics
      </p>

      {/* Surveyor Performance Table */}
      <div style={mono(11, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 })}>
        Surveyor Performance
      </div>
      <div style={{
        border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
        overflow: "hidden", marginBottom: 24,
      }}>
        <div style={{ overflowX: "auto" }}>
          <div style={{
            display: "grid", gridTemplateColumns: isMobile ? "2fr 1fr 1fr" : "2fr 1fr 1fr 1fr 1fr",
            background: "var(--bg-elevated)", padding: "10px 14px",
            borderBottom: "1px solid var(--border)",
            minWidth: isMobile ? undefined : undefined,
            ...mono(11, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".06em" }),
          }}>
            <div>Surveyor</div>
            <div>Assigned</div>
            <div>Completed</div>
            {!isMobile && <div>Rework</div>}
            {!isMobile && <div>Rework %</div>}
          </div>
          {surveyorData.map(s => (
            <div key={s.name} style={{
              display: "grid", gridTemplateColumns: isMobile ? "2fr 1fr 1fr" : "2fr 1fr 1fr 1fr 1fr",
              padding: "10px 14px", borderBottom: "1px solid var(--border)",
            }}>
              <div style={mono(12, "var(--text-primary)")}>{s.name}</div>
              <div style={mono(12, "var(--text-secondary)")}>{s.total}</div>
              <div style={mono(12, "var(--text-green)")}>{s.completed}</div>
              {!isMobile && <div style={mono(12, s.rework > 0 ? "var(--text-red)" : "var(--text-secondary)")}>{s.rework}</div>}
              {!isMobile && <div style={mono(12, "var(--text-secondary)")}>{s.reworkRate}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Subcontractor metrics (mock) */}
      <div style={mono(11, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 })}>
        Subcontractor Performance
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(160px, 1fr))", gap: isMobile ? 8 : 12 }}>
        <KpiCard label="FiberCo — Avg Build Time" value="4.2d" color="var(--blue)" />
        <KpiCard label="FiberCo — Issues" value={0} color="var(--green)" />
        <KpiCard label="TelNet — Avg Build Time" value="5.1d" color="var(--primary)" />
        <KpiCard label="TelNet — Issues" value={1} color="var(--red)" />
      </div>
    </div>
  );
};
