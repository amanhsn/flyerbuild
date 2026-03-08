"use client"

import { useState } from "react";
import { MeetstaaReview } from "./MeetstaaReview";
import { CostComparison } from "./CostComparison";
import { useIsMobile } from "../../../hooks/useIsMobile";

const TABS = [
  { key: "meetstaat", label: "Meetstaat Review" },
  { key: "comparison", label: "Cost Comparison" },
];

export const FinancialsHub = () => {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState("meetstaat");

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Tab bar */}
      <div className="shrink-0 border-b border-border" style={{ padding: isMobile ? "12px 16px 0" : "16px 28px 0" }}>
        <h1 className={`font-display ${isMobile ? "text-[22px]" : "text-[28px]"} font-extrabold tracking-wide mb-3`}>
          Financials
        </h1>
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`filter-btn${tab === t.key ? " active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" style={{ padding: isMobile ? "16px" : "24px 28px" }}>
        {tab === "meetstaat" ? <MeetstaaReview embedded /> : <CostComparison />}
      </div>
    </div>
  );
};
