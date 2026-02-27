import { useState, useMemo } from "react";
import { useLang } from "../../i18n/LangContext";
import { MOCK_SURVEYS } from "../../data/mockSurveys";
import { STATUS_GROUPS } from "../../data/statusConfig";
import { KpiRow } from "./KpiRow";
import { SurveyCard } from "./SurveyCard";
import { FilterBar } from "./FilterBar";
import { Icon } from "../../icons/Icon";
import { disp, mono } from "../../styles/helpers";
import { useIsMobile } from "../../hooks/useIsMobile";

export const Dashboard = ({ onSelectSurvey }) => {
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
          ...mono(11, "var(--text-muted)"),
          background: "var(--bg-elevated)",
          padding: "3px 8px",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border)",
        }}>
          {t("queueDate")}
        </span>
      </div>
      <p style={mono(12, "var(--text-secondary)", { marginTop: 5, marginBottom: 20 })}>
        {t("queueSurveyor")} · {t("queueCount")(surveys.length)}
      </p>

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
          <div style={mono(11, "var(--text-secondary)", { marginTop: 2 })}>{t("downloadSub")}</div>
        </div>
        <span style={{
          ...mono(11, "var(--text-primary-accent)"),
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
          <div style={{
            padding: 40, textAlign: "center",
            ...mono(13, "var(--text-muted)"),
          }}>
            No surveys match this filter.
          </div>
        )}
      </div>
    </div>
  );
};
