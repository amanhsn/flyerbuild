"use client"

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Area, AreaChart, Cell } from "recharts";
import { useLang } from "../../../i18n/LangContext";
import { MOCK_SURVEYS } from "../../../data/mockSurveys";
import { STATUSES } from "../../../data/statusConfig";
import { KpiCard } from "../../../components/shared";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../components/ui/chart";
import { useIsMobile } from "../../../hooks/useIsMobile";

export const ProjectDashboard = () => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const surveys = MOCK_SURVEYS;

  const stats = useMemo(() => {
    const total = surveys.length;
    const completed = surveys.filter(s => ["completed", "sent"].includes(s.status)).length;
    const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;

    const statusCounts = {};
    surveys.forEach(s => { statusCounts[s.status] = (statusCounts[s.status] || 0) + 1; });
    const bottleneck = Object.entries(statusCounts).sort((a, b) => b[1] - a[1])[0];

    const agingApprovals = surveys.filter(s =>
      ["validation_f49", "validation_client"].includes(s.status)
    ).length;

    return { total, completed, completionPct, bottleneck, agingApprovals, statusCounts };
  }, [surveys]);

  // Monthly forecast data
  const forecastData = [
    { month: "Jan", completed: 1, forecast: 2 },
    { month: "Feb", completed: 3, forecast: 3 },
    { month: "Mar", completed: 5, forecast: 4 },
    { month: "Apr", completed: 3, forecast: 5 },
    { month: "May", completed: null, forecast: 6 },
    { month: "Jun", completed: null, forecast: 7 },
  ];
  const forecastConfig = {
    completed: { label: "Completed", color: "var(--chart-3)" },
    forecast: { label: "Forecast", color: "var(--chart-2)" },
  };

  // Status pipeline data
  const pipelineData = Object.entries(stats.statusCounts)
    .map(([status, count]) => ({
      name: STATUSES[status]?.label || status,
      count,
      fill: STATUSES[status]?.hex || "#94a3b8",
    }))
    .sort((a, b) => b.count - a.count);

  const pipelineConfig = Object.fromEntries(
    pipelineData.map(d => [d.name, { label: d.name, color: d.fill }])
  );

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

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        {/* Monthly Completion Forecast */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Completion Forecast</CardTitle>
            <CardDescription>Completed surveys vs projected trajectory</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={forecastConfig} className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-completed)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-completed)" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="fillForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-forecast)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="var(--color-forecast)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--text-muted)" }} width={30} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    dataKey="forecast"
                    type="monotone"
                    fill="url(#fillForecast)"
                    stroke="var(--color-forecast)"
                    strokeWidth={2}
                    strokeDasharray="5 3"
                    connectNulls
                  />
                  <Area
                    dataKey="completed"
                    type="monotone"
                    fill="url(#fillCompleted)"
                    stroke="var(--color-completed)"
                    strokeWidth={2}
                    connectNulls
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Status Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle>Status Pipeline</CardTitle>
            <CardDescription>Survey count by current status (ranked)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pipelineConfig} className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineData} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="3 3" />
                  <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--text-muted)" }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                    width={isMobile ? 70 : 100}
                  />
                  <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {pipelineData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
