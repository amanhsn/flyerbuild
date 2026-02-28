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
import { disp, mono } from "../../styles/helpers";
import { useIsMobile } from "../../hooks/useIsMobile";

const DashboardSkeleton = ({ isMobile }) => (
  <>
    <div style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(160px, 1fr))",
      gap: 12, marginBottom: 20,
    }}>
      {Array.from({ length: 5 }, (_, i) => <SkeletonKpiCard key={i} />)}
    </div>
    <div style={{ marginTop: 12 }}>
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
    <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px" : "24px 28px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", gap: isMobile ? 8 : 12, marginBottom: 4, flexWrap: "wrap" }}>
        <h1 style={disp(isMobile ? 24 : 30, 800)}>{t("navDashboard")}</h1>
        <span style={{
          ...mono(12, "var(--text-muted)"),
          background: "var(--bg-elevated)",
          padding: "3px 8px",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border)",
        }}>
          {t("queueDate")}
        </span>
      </div>
      <p style={mono(14, "var(--text-secondary)", { marginTop: 5, marginBottom: 20 })}>
        {t("queueSurveyor")} · {loading ? "..." : t("queueCount")(surveys.length)}
      </p>

      {loading ? <DashboardSkeleton isMobile={isMobile} /> : (
        <>
          {/* KPI Row */}
          <KpiRow surveys={surveys} />

          {/* Download tomorrow card */}
          <div style={{
            marginBottom: 16, padding: "12px 16px", borderRadius: "var(--radius-md)",
            background: "var(--bg-elevated)", border: "1px solid var(--border)",
            display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
          }}>
            <Icon n="download" size={15} color="var(--text-primary-accent)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14 }}>{t("downloadTomorrow")}</div>
              <div style={mono(12, "var(--text-secondary)", { marginTop: 2 })}>{t("downloadSub")}</div>
            </div>
            <span style={{
              ...mono(12, "var(--text-primary-accent)"),
              background: "var(--primary-glow)",
              padding: "4px 10px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--primary-dim)",
            }}>
              {t("downloadFetch")}
            </span>
          </div>

          {/* Filters */}
          <FilterBar filter={filter} setFilter={setFilter} />

          {/* Survey cards */}
          <div style={{ marginTop: 12 }}>
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
