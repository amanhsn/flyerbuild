"use client"

import { useState, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { MOCK_SURVEYS } from "../../../data/mockSurveys";
import { getComparisonData, formatEur } from "../../../data/pricingRegistry";
import { KpiCard, DataTable } from "../../../components/shared";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "../../../components/ui/chart";
import { useIsMobile } from "../../../hooks/useIsMobile";

export const CostComparison = () => {
  const isMobile = useIsMobile();

  const comparableSurveys = useMemo(
    () => MOCK_SURVEYS.filter((s) => s.actual_quantities && s.execution_quantities),
    []
  );

  const [selectedId, setSelectedId] = useState(
    comparableSurveys.length > 0 ? comparableSurveys[0].id : null
  );

  const selected = comparableSurveys.find((s) => s.id === selectedId);
  const comparison = selected ? getComparisonData(selected) : null;

  const chartData = comparison
    ? comparison.items
        .filter((d) => d.estCost > 0 || d.actCost > 0)
        .map((d) => ({
          name: d.label.length > 14 ? d.label.slice(0, 12) + "…" : d.label,
          fullName: d.label,
          estimated: d.estCost,
          actual: d.actCost,
          variancePct: d.variancePct,
        }))
    : [];

  const chartConfig = {
    estimated: { label: "Estimated", color: "var(--chart-1)" },
    actual: { label: "Actual", color: "var(--chart-2)" },
  };

  const tableColumns = [
    { key: "code", label: "Code", width: "70px" },
    { key: "label", label: "Item" },
    { key: "estQty", label: "Est. Qty", width: "70px", render: (r) => r.estQty },
    { key: "actQty", label: "Act. Qty", width: "70px", render: (r) => r.actQty },
    { key: "unitPrice", label: "Unit €", width: "70px", render: (r) => formatEur(r.unitPrice) },
    { key: "estCost", label: "Est. Cost", width: "85px", render: (r) => formatEur(r.estCost) },
    { key: "actCost", label: "Act. Cost", width: "85px", render: (r) => formatEur(r.actCost) },
    {
      key: "variance",
      label: "Var %",
      width: "70px",
      render: (r) => {
        const abs = Math.abs(r.variancePct);
        const color = abs <= 10 ? "var(--text-green)" : abs <= 25 ? "var(--text-primary-accent)" : "var(--text-red)";
        return (
          <span className="font-semibold" style={{ color }}>
            {r.variancePct > 0 ? "+" : ""}{r.variancePct}%
          </span>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Survey selector */}
      <div>
        <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2">
          Select Address
        </div>
        <select
          value={selectedId || ""}
          onChange={(e) => setSelectedId(Number(e.target.value))}
          className="font-mono text-sm bg-bg-elevated border border-border rounded-md text-text-primary cursor-pointer w-full"
          style={{ padding: "8px 12px", maxWidth: 400 }}
        >
          {comparableSurveys.map((s) => (
            <option key={s.id} value={s.id}>
              {s.tsg_id} — {s.address.street} {s.address.number}, {s.address.city}
              {s.assigned_subcontractor ? ` (${s.assigned_subcontractor})` : ""}
            </option>
          ))}
        </select>
      </div>

      {comparison && (
        <>
          {/* KPI Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(150px, 1fr))",
              gap: isMobile ? 8 : 12,
            }}
          >
            <KpiCard label="Estimated Total" value={formatEur(comparison.totalEst)} color="var(--primary)" />
            <KpiCard label="Actual Total" value={formatEur(comparison.totalAct)} color="var(--blue)" />
            <KpiCard
              label="Variance"
              value={`${comparison.overallVariance > 0 ? "+" : ""}${comparison.overallVariance}%`}
              color={Math.abs(comparison.overallVariance) <= 15 ? "var(--text-green)" : "var(--text-red)"}
            />
            <KpiCard
              label="Accuracy"
              value={`${comparison.accuracy}%`}
              color={comparison.accuracy >= 80 ? "var(--text-green)" : comparison.accuracy >= 60 ? "var(--text-primary-accent)" : "var(--text-red)"}
            />
          </div>

          {/* Grouped Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Per-Item Cost Comparison</CardTitle>
              <CardDescription>Estimated vs actual cost per quantity item</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: isMobile ? -10 : 0 }}>
                    <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tick={{ fontSize: 9, fill: "var(--text-muted)" }}
                      interval={0}
                      angle={isMobile ? -45 : -30}
                      textAnchor="end"
                      height={isMobile ? 70 : 55}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                      width={50}
                      tickFormatter={(v) => `€${v}`}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          labelKey="fullName"
                          indicator="bar"
                        />
                      }
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="estimated" fill="var(--color-estimated)" radius={[4, 4, 0, 0]} barSize={isMobile ? 12 : 18} />
                    <Bar dataKey="actual" fill="var(--color-actual)" radius={[4, 4, 0, 0]} barSize={isMobile ? 12 : 18} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Summary Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Breakdown</CardTitle>
              <CardDescription>All quantity items with costs and variance</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={tableColumns}
                rows={comparison.items}
                emptyMessage="No data"
              />
            </CardContent>
          </Card>
        </>
      )}

      {comparableSurveys.length === 0 && (
        <div className="bg-bg-raised border border-border rounded-lg p-8 text-center">
          <div className="font-mono text-sm text-text-muted">
            No surveys with both estimated and actual quantities available.
          </div>
        </div>
      )}
    </div>
  );
};
