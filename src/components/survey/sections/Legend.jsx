"use client"

import { useLang } from "../../../i18n/LangContext";
import { ANNOTATION_LEGEND_ITEMS } from "../../../data/annotationLegend";


const LegendSymbol = ({ shape, color, dash, text }) => {
  if (shape === "circle") {
    return (
      <div
        className="w-3.5 h-3.5 rounded-full shrink-0"
        style={{ background: color }}
      />
    );
  }
  if (shape === "labelRect") {
    return (
      <div
        className="shrink-0 px-1 py-0.5 rounded-sm font-mono text-[10px] font-bold text-white leading-none"
        style={{ background: color }}
      >
        {text}
      </div>
    );
  }
  // line
  return (
    <div
      className="w-6 h-0 shrink-0"
      style={{ borderTop: `3px ${dash ? "dashed" : "solid"} ${color}` }}
    />
  );
};

export const Legend = () => {
  const { t } = useLang();

  return (
    <div className="flex flex-col gap-4">
      <div className="font-mono text-xs text-text-muted uppercase tracking-widest">
        {t("annotationLegend")}
      </div>

      <div className="grid grid-cols-2 gap-1.5 bg-bg-raised border border-border rounded-lg p-4">
        {ANNOTATION_LEGEND_ITEMS.map(({ key, label, color, shape, dash, text }) => (
          <div
            key={key}
            className="flex items-center gap-2.5 py-2 px-2.5 rounded-sm bg-bg-elevated border border-border"
          >
            <LegendSymbol shape={shape} color={color} dash={dash} text={text} />
            <span className="font-mono text-xs text-text-secondary">
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-text-muted text-center py-2.5 px-3.5 bg-bg-overlay rounded-sm border border-border">
        This legend is for reference only and applies to photo and floor plan annotations.
      </div>
    </div>
  );
};
