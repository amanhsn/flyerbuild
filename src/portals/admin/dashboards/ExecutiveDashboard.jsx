"use client"

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useLang } from "../../../i18n/LangContext";
import { MOCK_SURVEYS } from "../../../data/mockSurveys";
import { STATUSES } from "../../../data/statusConfig";
import { KpiCard } from "../../../components/shared";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "../../../components/ui/chart";
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

  // Status distribution for bar chart
  const statusChartData = Object.entries(stats.byStatus).map(([status, count]) => ({
    name: STATUSES[status]?.label || status,
    count,
    fill: STATUSES[status]?.hex || "#94a3b8",
  }));

  const statusChartConfig = Object.fromEntries(
    statusChartData.map(d => [d.name, { label: d.name, color: d.fill }])
  );

  // Weekly trend data
  const weeklyData = [
    { week: "W1", completed: 2, started: 3 },
    { week: "W2", completed: 3, started: 4 },
    { week: "W3", completed: 1, started: 5 },
    { week: "W4", completed: 4, started: 2 },
  ];
  const weeklyConfig = {
    completed: { label: "Completed", color: "var(--chart-3)" },
    started: { label: "Started", color: "var(--chart-2)" },
  };

  // Pie data for funnel
  const pieData = [
    { name: "In Progress", value: stats.inProgress + stats.pending, fill: "var(--chart-1)" },
    { name: "In Review", value: stats.review, fill: "var(--chart-2)" },
    { name: "Completed", value: stats.completed, fill: "var(--chart-3)" },
    { name: "Issues", value: stats.issues, fill: "var(--chart-5)" },
  ].filter(d => d.value > 0);
  const pieConfig = Object.fromEntries(pieData.map(d => [d.name, { label: d.name, color: d.fill }]));

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

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>Survey count by current status</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={statusChartConfig} className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                    interval={0}
                    angle={isMobile ? -45 : 0}
                    textAnchor={isMobile ? "end" : "middle"}
                    height={isMobile ? 60 : 30}
                  />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--text-muted)" }} width={30} />
                  <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {statusChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Weekly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Completion Trend</CardTitle>
            <CardDescription>Surveys completed vs started per week</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={weeklyConfig} className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                  <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--text-muted)" }} width={30} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="completed" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="started" fill="var(--color-started)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Funnel — Pie + stages */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Funnel</CardTitle>
          <CardDescription>Survey distribution across pipeline stages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`flex ${isMobile ? "flex-col" : "items-center"} gap-6`}>
            <ChartContainer config={pieConfig} className={`${isMobile ? "h-[180px] w-full" : "h-[180px] w-[180px]"} shrink-0`}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={75}
                    strokeWidth={2}
                    stroke="var(--bg-raised)"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex-1 grid gap-2" style={{ gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)" }}>
              {[
                { label: "Survey", count: stats.inProgress + stats.pending, color: "var(--chart-1)" },
                { label: "Validation", count: stats.review, color: "var(--chart-2)" },
                { label: "Completed", count: stats.completed, color: "var(--chart-3)" },
                { label: "Issues", count: stats.issues, color: "var(--chart-5)" },
              ].map((stage, i) => (
                <div key={i} className="text-center bg-bg-elevated border border-border rounded-md" style={{ padding: "12px 8px" }}>
                  <div className="font-display text-2xl font-extrabold tracking-wide" style={{ color: stage.color }}>{stage.count}</div>
                  <div className="font-mono text-[10px] text-text-secondary mt-1 uppercase tracking-wider">{stage.label}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
