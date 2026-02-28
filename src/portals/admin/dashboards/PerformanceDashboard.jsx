import { useMemo } from "react";
import { useLang } from "../../../i18n/LangContext";
import { MOCK_SURVEYS } from "../../../data/mockSurveys";
import { KpiCard, ChartCard } from "../../../components/shared";
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
    <div className="flex-1 overflow-y-auto" style={{ padding: isMobile ? "20px 16px" : "24px 28px" }}>
      <h1 className={`font-display ${isMobile ? "text-[22px]" : "text-[28px]"} font-extrabold tracking-wide`}>Performance Dashboard</h1>
      <p className="font-mono text-sm text-text-secondary mt-1 mb-6">
        Surveyor and subcontractor performance metrics
      </p>

      {/* Surveyor Performance Table */}
      <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2.5">
        Surveyor Performance
      </div>
      <div className="border border-border rounded-lg overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <div
            className="font-mono text-xs text-text-muted uppercase tracking-wider bg-bg-elevated border-b border-border"
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "2fr 1fr 1fr" : "2fr 1fr 1fr 1fr 1fr",
              padding: "10px 14px",
            }}
          >
            <div>Surveyor</div>
            <div>Assigned</div>
            <div>Completed</div>
            {!isMobile && <div>Rework</div>}
            {!isMobile && <div>Rework %</div>}
          </div>
          {surveyorData.map(s => (
            <div key={s.name} className="border-b border-border" style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "2fr 1fr 1fr" : "2fr 1fr 1fr 1fr 1fr",
              padding: "10px 14px",
            }}>
              <div className="font-mono text-sm text-text-primary">{s.name}</div>
              <div className="font-mono text-sm text-text-secondary">{s.total}</div>
              <div className="font-mono text-sm text-text-green">{s.completed}</div>
              {!isMobile && <div className={`font-mono text-sm ${s.rework > 0 ? "text-text-red" : "text-text-secondary"}`}>{s.rework}</div>}
              {!isMobile && <div className="font-mono text-sm text-text-secondary">{s.reworkRate}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Subcontractor metrics (mock) */}
      <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2.5">
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
