import { useMemo } from "react";
import { useLang } from "../../i18n/LangContext";
import { StatusBadge } from "../shared/StatusBadge";
import { Icon } from "../../icons/Icon";
import { disp, mono } from "../../styles/helpers";
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
    <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? 16 : 24 }}>
      <h2 style={{ ...disp(isMobile ? 22 : 28, 800), marginBottom: 4 }}>{t("historyTitle")}</h2>
      <p style={mono(12, "var(--text-secondary)", { marginBottom: 16 })}>
        {history.length} visits across {MOCK_SURVEYS.filter(s => s.visits?.length > 0).length} addresses
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {history.map(({ survey: s, visit: v }, i) => {
          const isNoEntry = v.entry_status === "no_entry";
          const bType = BUILDING_LABELS[s.building_info?.building_type] || s.building_info?.building_type || "";
          const floors = s.building_info?.nr_of_floors;
          const sections = s.completed_sections?.length || 0;
          const totalSections = 22;

          return (
            <div key={i} style={{
              padding: isMobile ? "12px 14px" : "14px 16px", borderRadius: "var(--radius-lg)",
              background: "var(--bg-raised)", border: "1px solid var(--border)",
            }}>
              {/* Top row: date/time + status */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Icon n="clock" size={13} color="var(--text-muted)" />
                <span style={mono(11, "var(--text-muted)")}>
                  {fmtDate(v.timestamp)} · {fmtTime(v.timestamp)}
                </span>
                <div style={{ flex: 1 }} />
                <StatusBadge status={s.status} />
              </div>

              {/* Address + TSG */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                <span style={disp(isMobile ? 15 : 17, 700)}>
                  {s.address.street} {s.address.number}{s.address.bus ? ` ${s.address.bus}` : ""}
                </span>
                <span style={mono(10, "var(--text-muted)")}>{s.tsg_id}</span>
              </div>
              <div style={mono(11, "var(--text-secondary)", { marginTop: 2 })}>
                {s.address.postal_code} {s.address.city}
              </div>

              {/* Details row */}
              <div style={{
                display: "flex", gap: isMobile ? 8 : 14, flexWrap: "wrap",
                marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--border)",
              }}>
                {/* Entry status */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  padding: "3px 8px", borderRadius: "var(--radius-sm)",
                  background: isNoEntry ? "var(--red-glow)" : "var(--green-glow)",
                  border: `1px solid ${isNoEntry ? "var(--red-dim)" : "var(--green-dim)"}`,
                }}>
                  <Icon n={isNoEntry ? "x" : "check"} size={11} color={isNoEntry ? "var(--red)" : "var(--green)"} />
                  <span style={mono(10, isNoEntry ? "var(--text-red)" : "var(--text-green)")}>
                    {isNoEntry ? "No Entry" : "Entry Granted"}
                  </span>
                </div>

                {/* Building type */}
                {bType && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <Icon n="building" size={12} color="var(--text-muted)" />
                    <span style={mono(10, "var(--text-secondary)")}>
                      {bType}{floors ? ` · ${floors}F` : ""}
                    </span>
                  </div>
                )}

                {/* Sections progress */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Icon n="clipboard" size={12} color="var(--text-muted)" />
                  <span style={mono(10, "var(--text-secondary)")}>
                    {sections}/{totalSections} sections
                  </span>
                </div>

                {/* Surveyor */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Icon n="user" size={12} color="var(--text-muted)" />
                  <span style={mono(10, "var(--text-secondary)")}>{v.surveyor}</span>
                </div>
              </div>

              {/* Visit remark */}
              {v.visit_remark && (
                <div style={{
                  marginTop: 8, padding: "6px 10px", borderRadius: "var(--radius-sm)",
                  background: "var(--bg-overlay)", ...mono(11, "var(--text-secondary)"),
                  fontStyle: "italic", lineHeight: 1.4,
                }}>
                  {v.visit_remark}
                </div>
              )}

              {/* Rework remarks if any */}
              {s.rework_remarks && (
                <div style={{
                  marginTop: 6, padding: "6px 10px", borderRadius: "var(--radius-sm)",
                  background: "var(--red-glow)", border: "1px solid var(--red-dim)",
                  ...mono(10, "var(--text-red)"), lineHeight: 1.4,
                }}>
                  Rework: {s.rework_remarks}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {history.length === 0 && (
        <div style={{ padding: 40, textAlign: "center", ...mono(13, "var(--text-muted)") }}>
          No visit history yet.
        </div>
      )}
    </div>
  );
};
