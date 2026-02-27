import { Icon } from "../../icons/Icon";
import { StatusBadge, Accordion } from "../shared";
import { useLang } from "../../i18n/LangContext";
import { mono, disp } from "../../styles/helpers";
import { SECTIONS } from "../../data/sectionRegistry";

export const SurveySidebar = ({ survey, visibleSections }) => {
  const { t } = useLang();
  const completedSet = new Set(survey.completed_sections);

  return (
    <div style={{
      width: 280, flexShrink: 0,
      borderLeft: "1px solid var(--border)",
      background: "var(--bg-raised)",
      overflowY: "auto",
      display: "flex", flexDirection: "column", gap: 12,
      padding: 16,
    }}>
      {/* Status */}
      <div style={{
        padding: "12px 14px", borderRadius: "var(--radius-md)",
        background: "var(--bg-elevated)", border: "1px solid var(--border)",
      }}>
        <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 })}>
          Status
        </div>
        <StatusBadge status={survey.status} />
      </div>

      {/* Details */}
      <Accordion title={t("sidebarDetails")} defaultOpen={true}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em" })}>
              {t("sidebarTsgId")}
            </div>
            <div style={mono(14, "var(--text-secondary)", { marginTop: 2 })}>{survey.tsg_id}</div>
          </div>

          {survey.rework_remarks && (
            <div>
              <div style={mono(12, "var(--text-red)", { textTransform: "uppercase", letterSpacing: ".08em" })}>
                {t("sidebarReworkRemarks")}
              </div>
              <div style={mono(12, "var(--text-secondary)", { marginTop: 2 })}>{survey.rework_remarks}</div>
            </div>
          )}

          {survey.validated_by && (
            <div>
              <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em" })}>
                {t("sidebarValidatedBy")}
              </div>
              <div style={mono(12, "var(--text-secondary)", { marginTop: 2 })}>
                {survey.validated_by} · {survey.validated_at}
              </div>
            </div>
          )}

          {survey.completed_by && (
            <div>
              <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em" })}>
                {t("sidebarCompletedBy")}
              </div>
              <div style={mono(12, "var(--text-secondary)", { marginTop: 2 })}>
                {survey.completed_by} · {survey.completed_at}
              </div>
            </div>
          )}
        </div>
      </Accordion>

      {/* Sections checklist */}
      <Accordion title={t("sidebarSections")} defaultOpen={true}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {visibleSections.map((sec) => {
            const done = completedSet.has(sec.key);
            return (
              <div key={sec.key} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "4px 0",
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: done ? "var(--green)" : "var(--bg-overlay)",
                  border: `1px solid ${done ? "var(--green)" : "var(--border-bright)"}`,
                  flexShrink: 0,
                }} />
                <span style={mono(12, done ? "var(--text-green)" : "var(--text-secondary)")}>
                  {t(`sec_${sec.key}`)}
                </span>
              </div>
            );
          })}
        </div>
      </Accordion>

      {/* Distance */}
      <div style={{
        padding: "12px 14px", borderRadius: "var(--radius-md)",
        background: "var(--bg-elevated)", border: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <Icon n="nav" size={14} color="var(--text-primary-accent)" />
        <div>
          <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em" })}>
            {t("sidebarDistance")}
          </div>
          <div style={mono(13, "var(--text-primary)", { marginTop: 2 })}>{survey.distance_km} km</div>
        </div>
      </div>

      {/* PDF Downloads */}
      <Accordion title={t("sidebarPdfDownloads")}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
            borderRadius: "var(--radius-sm)", background: "var(--bg-overlay)",
            border: "1px solid var(--border)", color: "var(--text-secondary)",
            ...mono(11), cursor: "pointer", width: "100%",
          }}>
            <Icon n="file" size={13} /> {t("downloadTsa")}
          </button>
          <button style={{
            display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
            borderRadius: "var(--radius-sm)", background: "var(--bg-overlay)",
            border: "1px solid var(--border)", color: "var(--text-secondary)",
            ...mono(11), cursor: "pointer", width: "100%",
          }}>
            <Icon n="file" size={13} /> {t("downloadSsv")}
          </button>
        </div>
      </Accordion>
    </div>
  );
};
