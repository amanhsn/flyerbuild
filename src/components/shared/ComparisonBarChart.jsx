"use client"

import { useIsMobile } from "../../hooks/useIsMobile";

function varianceColor(pct) {
  const abs = Math.abs(pct);
  if (abs <= 10) return { bg: "var(--green-glow)", border: "var(--green-dim)", color: "var(--text-green)" };
  if (abs <= 25) return { bg: "var(--primary-glow)", border: "var(--primary-dim)", color: "var(--text-primary-accent)" };
  return { bg: "var(--red-glow)", border: "var(--red-dim)", color: "var(--text-red)" };
}

export const ComparisonBarChart = ({ items }) => {
  const isMobile = useIsMobile();
  const visible = items.filter((d) => d.estCost > 0 || d.actCost > 0);
  const maxCost = Math.max(...visible.map((d) => Math.max(d.estCost, d.actCost)), 1);

  if (visible.length === 0) {
    return (
      <div className="bg-bg-raised border border-border rounded-lg p-6 text-center">
        <div className="font-mono text-xs text-text-muted">No quantity data to compare</div>
      </div>
    );
  }

  return (
    <div className="bg-bg-raised border border-border rounded-lg overflow-hidden">
      {/* Legend */}
      <div className="flex items-center gap-5 border-b border-border" style={{ padding: "10px 16px" }}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-2 rounded-sm" style={{ background: "var(--primary)" }} />
          <span className="font-mono text-[10px] text-text-secondary uppercase tracking-wider">Estimated</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-2 rounded-sm" style={{ background: "var(--blue)" }} />
          <span className="font-mono text-[10px] text-text-secondary uppercase tracking-wider">Actual</span>
        </div>
      </div>

      {visible.map((d, i) => {
        const estPct = (d.estCost / maxCost) * 100;
        const actPct = (d.actCost / maxCost) * 100;
        const vc = varianceColor(d.variancePct);
        const isLast = i === visible.length - 1;

        return (
          <div
            key={d.code}
            className={`${!isLast ? "border-b border-border" : ""}`}
            style={{ padding: isMobile ? "10px 12px" : "12px 16px" }}
          >
            <div className={`flex ${isMobile ? "flex-col gap-2" : "items-center gap-4"}`}>
              {/* Label */}
              <div className="shrink-0" style={{ width: isMobile ? "auto" : 160 }}>
                <div className="font-mono text-xs font-semibold text-text-primary">{d.label}</div>
                <div className="font-mono text-[10px] text-text-muted">{d.code} · per {d.unit}</div>
              </div>

              {/* Bars */}
              <div className="flex-1 flex flex-col gap-1.5">
                {/* Estimated bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-[16px] bg-bg-overlay rounded-sm overflow-hidden">
                    <div
                      className="h-full rounded-sm transition-[width] duration-300 ease-out"
                      style={{
                        width: `${Math.max(estPct, 1)}%`,
                        background: "var(--primary)",
                        opacity: 0.75,
                      }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-text-secondary tabular-nums shrink-0" style={{ width: 56, textAlign: "right" }}>
                    {d.estQty} × €{d.unitPrice}
                  </span>
                  <span className="font-mono text-xs font-semibold text-text-primary tabular-nums shrink-0" style={{ width: 62, textAlign: "right" }}>
                    €{d.estCost.toFixed(0)}
                  </span>
                </div>
                {/* Actual bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-[16px] bg-bg-overlay rounded-sm overflow-hidden">
                    <div
                      className="h-full rounded-sm transition-[width] duration-300 ease-out"
                      style={{
                        width: `${Math.max(actPct, 1)}%`,
                        background: "var(--blue)",
                      }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-text-secondary tabular-nums shrink-0" style={{ width: 56, textAlign: "right" }}>
                    {d.actQty} × €{d.unitPrice}
                  </span>
                  <span className="font-mono text-xs font-semibold text-text-primary tabular-nums shrink-0" style={{ width: 62, textAlign: "right" }}>
                    €{d.actCost.toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Variance badge */}
              <div className="shrink-0" style={{ width: isMobile ? "auto" : 64, textAlign: "right" }}>
                <span
                  className="inline-flex font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded-sm"
                  style={{ background: vc.bg, border: `1px solid ${vc.border}`, color: vc.color }}
                >
                  {d.variancePct > 0 ? "+" : ""}{d.variancePct}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
