import { useState, useMemo } from "react";
import { useLang } from "../../i18n/LangContext";
import { MOCK_SURVEYS } from "../../data/mockSurveys";
import { STATUS_GROUPS } from "../../data/statusConfig";
import { KpiRow } from "./KpiRow";
import { SurveyCard } from "./SurveyCard";
import { FilterBar } from "./FilterBar";
import { Icon } from "../../icons/Icon";
import { SkeletonKpiCard, SkeletonSurveyCard } from "../shared/Skeleton";
import { EmptyState } from "../shared/EmptyState";
import { useIsMobile } from "../../hooks/useIsMobile";

const DashboardSkeleton = ({ isMobile }) => (
  <>
    <div
      className="mb-5 gap-3"
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(160px, 1fr))",
      }}
    >
      {Array.from({ length: 5 }, (_, i) => <SkeletonKpiCard key={i} />)}
    </div>
    <div className="mt-3">
      {Array.from({ length: 4 }, (_, i) => <SkeletonSurveyCard key={i} delay={i * 60} />)}
    </div>
  </>
);

export const Dashboard = ({ onSelectSurvey, loading = false }) => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [filter, setFilter] = useState("all");
  const surveys = MOCK_SURVEYS;

  const filtered = useMemo(() => {
    if (filter === "all") return surveys;
    const group = STATUS_GROUPS[filter];
    if (!group) return surveys;
    return surveys.filter(s => group.includes(s.status));
  }, [surveys, filter]);

  return (
    <div className="flex-1 overflow-y-auto" style={{ padding: isMobile ? "16px" : "24px 28px" }}>
      {/* Header */}
      <div className="flex items-baseline flex-wrap mb-1" style={{ gap: isMobile ? 8 : 12 }}>
        <h1 className={`font-display ${isMobile ? "text-2xl" : "text-[30px]"} font-extrabold tracking-wide`}>{t("navDashboard")}</h1>
        <span className="font-mono text-xs text-text-muted bg-bg-elevated rounded-sm border border-border" style={{
          padding: "3px 8px",
        }}>
          {t("queueDate")}
        </span>
      </div>
      <p className="font-mono text-sm text-text-secondary mt-1 mb-5">
        {t("queueSurveyor")} · {loading ? "..." : t("queueCount")(surveys.length)}
      </p>

      {loading ? <DashboardSkeleton isMobile={isMobile} /> : (
        <>
          {/* KPI Row */}
          <KpiRow surveys={surveys} />

          {/* Download tomorrow card */}
          <div className="mb-4 px-4 py-3 rounded-md bg-bg-elevated border border-border flex items-center gap-3 cursor-pointer">
            <Icon n="download" size={15} color="var(--text-primary-accent)" />
            <div className="flex-1">
              <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14 }}>{t("downloadTomorrow")}</div>
              <div className="font-mono text-xs text-text-secondary mt-0.5">{t("downloadSub")}</div>
            </div>
            <span className="font-mono text-xs text-text-primary-accent rounded-sm" style={{
              background: "var(--primary-glow)",
              padding: "4px 10px",
              border: "1px solid var(--primary-dim)",
            }}>
              {t("downloadFetch")}
            </span>
          </div>

          {/* Filters */}
          <FilterBar filter={filter} setFilter={setFilter} />

          {/* Survey cards */}
          <div className="mt-3">
            {filtered.map((s, i) => (
              <SurveyCard
                key={s.id}
                survey={s}
                selected={false}
                onClick={() => onSelectSurvey(s)}
              />
            ))}
            {filtered.length === 0 && (
              <EmptyState icon="list" message="No surveys match this filter." sub="Try adjusting your filters" />
            )}
          </div>
        </>
      )}
    </div>
  );
};
