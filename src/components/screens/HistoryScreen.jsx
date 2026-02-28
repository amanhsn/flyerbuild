import { useMemo } from "react";
import { useLang } from "../../i18n/LangContext";
import { StatusBadge } from "../shared/StatusBadge";
import { EmptyState } from "../shared/EmptyState";
import { Icon } from "../../icons/Icon";
import { useIsMobile } from "../../hooks/useIsMobile";
import { MOCK_SURVEYS } from "../../data/mockSurveys";

const BUILDING_LABELS = {
  single_family: "Single Family",
  apartment: "Apartment",
  terraced: "Terraced",
  semi_detached: "Semi-Detached",
};

function fmtDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-GB", { month: "short", day: "numeric" });
}
function fmtTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export const HistoryScreen = () => {
  const { t } = useLang();
  const isMobile = useIsMobile();

  // Build a flat, date-sorted visit timeline from all surveys
  const history = useMemo(() => {
    const entries = [];
    MOCK_SURVEYS.forEach(s => {
      if (!s.visits || s.visits.length === 0) return;
      s.visits.forEach(v => {
        entries.push({ survey: s, visit: v });
      });
    });
    entries.sort((a, b) => new Date(b.visit.timestamp) - new Date(a.visit.timestamp));
    return entries;
  }, []);

  return (
    <div className="flex-1 overflow-y-auto" style={{ padding: isMobile ? 16 : 24 }}>
      <h2 className={`font-display ${isMobile ? "text-[22px]" : "text-[28px]"} font-extrabold tracking-wide mb-1`}>{t("historyTitle")}</h2>
      <p className="font-mono text-sm text-text-secondary mb-4">
        {history.length} visits across {MOCK_SURVEYS.filter(s => s.visits?.length > 0).length} addresses
      </p>

      <div className="flex flex-col gap-2.5">
        {history.map(({ survey: s, visit: v }, i) => {
          const isNoEntry = v.entry_status === "no_entry";
          const bType = BUILDING_LABELS[s.building_info?.building_type] || s.building_info?.building_type || "";
          const floors = s.building_info?.nr_of_floors;
          const sections = s.completed_sections?.length || 0;
          const totalSections = 22;

          return (
            <div key={i} className="rounded-lg bg-bg-raised border border-border" style={{
              padding: isMobile ? "12px 14px" : "14px 16px",
            }}>
              {/* Top row: date/time + status */}
              <div className="flex items-center gap-2 mb-2">
                <Icon n="clock" size={13} color="var(--text-muted)" />
                <span className="font-mono text-xs text-text-muted">
                  {fmtDate(v.timestamp)} · {fmtTime(v.timestamp)}
                </span>
                <div className="flex-1" />
                <StatusBadge status={s.status} />
              </div>

              {/* Address + TSG */}
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className={`font-display ${isMobile ? "text-[15px]" : "text-[17px]"} font-bold tracking-wide`}>
                  {s.address.street} {s.address.number}{s.address.bus ? ` ${s.address.bus}` : ""}
                </span>
                <span className="font-mono text-[11px] text-text-muted">{s.tsg_id}</span>
              </div>
              <div className="font-mono text-xs text-text-secondary mt-0.5">
                {s.address.postal_code} {s.address.city}
              </div>

              {/* Details row */}
              <div className="flex flex-wrap mt-2 pt-2 border-t border-border" style={{ gap: isMobile ? 8 : 14 }}>
                {/* Entry status */}
                <div className="inline-flex items-center gap-1 rounded-sm" style={{
                  padding: "3px 8px",
                  background: isNoEntry ? "var(--red-glow)" : "var(--green-glow)",
                  border: `1px solid ${isNoEntry ? "var(--red-dim)" : "var(--green-dim)"}`,
                }}>
                  <Icon n={isNoEntry ? "x" : "check"} size={11} color={isNoEntry ? "var(--red)" : "var(--green)"} />
                  <span className={`font-mono text-[11px] ${isNoEntry ? "text-text-red" : "text-text-green"}`}>
                    {isNoEntry ? "No Entry" : "Entry Granted"}
                  </span>
                </div>

                {/* Building type */}
                {bType && (
                  <div className="inline-flex items-center gap-1">
                    <Icon n="building" size={12} color="var(--text-muted)" />
                    <span className="font-mono text-[11px] text-text-secondary">
                      {bType}{floors ? ` · ${floors}F` : ""}
                    </span>
                  </div>
                )}

                {/* Sections progress */}
                <div className="inline-flex items-center gap-1">
                  <Icon n="clipboard" size={12} color="var(--text-muted)" />
                  <span className="font-mono text-[11px] text-text-secondary">
                    {sections}/{totalSections} sections
                  </span>
                </div>

                {/* Surveyor */}
                <div className="inline-flex items-center gap-1">
                  <Icon n="user" size={12} color="var(--text-muted)" />
                  <span className="font-mono text-[11px] text-text-secondary">{v.surveyor}</span>
                </div>
              </div>

              {/* Visit remark */}
              {v.visit_remark && (
                <div className="font-mono text-xs text-text-secondary mt-2 rounded-sm bg-bg-overlay italic" style={{
                  padding: "6px 10px",
                  lineHeight: 1.4,
                }}>
                  {v.visit_remark}
                </div>
              )}

              {/* Rework remarks if any */}
              {s.rework_remarks && (
                <div className="font-mono text-[11px] text-text-red mt-1.5 rounded-sm" style={{
                  padding: "6px 10px",
                  background: "var(--red-glow)", border: "1px solid var(--red-dim)",
                  lineHeight: 1.4,
                }}>
                  Rework: {s.rework_remarks}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {history.length === 0 && (
        <EmptyState icon="clock" message="No visit history yet." sub="Completed visits will appear here" />
      )}
    </div>
  );
};
