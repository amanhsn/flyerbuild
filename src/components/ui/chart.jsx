"use client"

import * as React from "react"
import { Tooltip as RechartsTooltip, Legend as RechartsLegend } from "recharts"
import { cn } from "@/lib/utils"

// Chart config context
const ChartContext = React.createContext(null)

function useChart() {
  const ctx = React.useContext(ChartContext)
  if (!ctx) throw new Error("useChart must be used within a ChartContainer")
  return ctx
}

// ChartContainer — wraps Recharts ResponsiveContainer with config context
const ChartContainer = React.forwardRef(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        ref={ref}
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-[var(--text-muted)] [&_.recharts-cartesian-axis-tick_text]:text-xs",
          "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-[var(--border)]",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-[var(--border)]",
          "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-[var(--border)]",
          "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-[var(--border)]",
          "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-[var(--bg-overlay)]",
          className
        )}
        {...props}
        style={{
          ...props.style,
          ...Object.fromEntries(
            Object.entries(config).flatMap(([key, value]) => {
              if (!value.color) return []
              return [[`--color-${key}`, value.color]]
            })
          ),
        }}
      >
        <div className="w-full [&_.recharts-responsive-container]:!w-full [&_.recharts-responsive-container]:!h-full" style={{ width: "100%", height: "100%" }}>
          {children}
        </div>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "ChartContainer"

// ChartTooltip — thin wrapper around Recharts Tooltip
const ChartTooltip = RechartsTooltip

// ChartTooltipContent — styled tooltip renderer
const ChartTooltipContent = React.forwardRef(
  ({ active, payload, label, className, hideLabel = false, hideIndicator = false, indicator = "dot", nameKey, labelKey }, ref) => {
    const { config } = useChart()

    if (!active || !payload?.length) return null

    return (
      <div
        ref={ref}
        className={cn(
          "bg-bg-raised border border-border rounded-md shadow-md min-w-[140px]",
          className
        )}
      >
        {!hideLabel && label && (
          <div className="border-b border-border px-3 py-1.5">
            <span className="font-mono text-xs text-text-muted">{label}</span>
          </div>
        )}
        <div className="flex flex-col gap-1 px-3 py-2">
          {payload.map((item, i) => {
            const key = nameKey || item.dataKey || item.name || "value"
            const itemConfig = config[key] || {}
            const displayLabel = itemConfig.label || item.name || key
            const color = item.color || itemConfig.color || "var(--primary)"

            return (
              <div key={i} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {!hideIndicator && (
                    indicator === "dot" ? (
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                    ) : indicator === "line" ? (
                      <div className="w-3 h-0.5 rounded-full shrink-0" style={{ background: color }} />
                    ) : (
                      <div className="w-1 h-3 rounded-sm shrink-0" style={{ background: color }} />
                    )
                  )}
                  <span className="font-mono text-xs text-text-secondary">{displayLabel}</span>
                </div>
                <span className="font-mono text-xs font-semibold text-text-primary tabular-nums">
                  {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

// ChartLegend — thin wrapper
const ChartLegend = RechartsLegend

// ChartLegendContent — styled legend renderer
const ChartLegendContent = React.forwardRef(
  ({ className, payload, nameKey }, ref) => {
    const { config } = useChart()

    if (!payload?.length) return null

    return (
      <div ref={ref} className={cn("flex items-center justify-center gap-4 pt-2", className)}>
        {payload.map((item, i) => {
          const key = nameKey || item.dataKey || item.value
          const itemConfig = config[key] || {}
          const color = item.color || itemConfig.color || "var(--primary)"

          return (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2 rounded-sm shrink-0" style={{ background: color }} />
              <span className="font-mono text-[10px] text-text-secondary">
                {itemConfig.label || item.value || key}
              </span>
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegendContent"

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
}
