import { useMemo } from "react";
import { useLang } from "../../i18n/LangContext";
import { KpiCard } from "../shared/KpiCard";
import { useIsMobile } from "../../hooks/useIsMobile";

export const KpiRow = ({ surveys }) => {
  const { t } = useLang();
  const isMobile = useIsMobile();

  const kpis = useMemo(() => {
    const total = surveys.length;
    const inProgress = surveys.filter(s => ["on_going", "visited"].includes(s.status)).length;
    const completed = surveys.filter(s => ["completed", "sent"].includes(s.status)).length;
    const pending = surveys.filter(s => ["to_do", "appointment"].includes(s.status)).length;
    const conflicts = surveys.filter(s => ["rework", "rejected", "final_no_entry"].includes(s.status)).length;
    return [
      { label: t("kpiTotalAssigned"), value: total, color: "var(--primary)", total },
      { label: t("kpiInProgress"), value: inProgress, color: "var(--blue)", total },
      { label: t("kpiCompletedToday"), value: completed, color: "var(--green)", total },
      { label: t("kpiPending"), value: pending, color: "var(--text-secondary)", total },
      { label: t("kpiConflicts"), value: conflicts, color: "var(--red)", total },
    ];
  }, [surveys, t]);

  return (
    <div
      className="gap-3 mb-5"
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(160px, 1fr))",
      }}
    >
      {kpis.map((kpi) => (
        <KpiCard key={kpi.label} {...kpi} />
      ))}
    </div>
  );
};
