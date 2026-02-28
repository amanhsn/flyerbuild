import { Icon } from "../../icons/Icon";
import { StatusBadge, Accordion } from "../shared";
import { useLang } from "../../i18n/LangContext";
import { SECTIONS } from "../../data/sectionRegistry";
import { cn } from "../../lib/utils";

export const SurveySidebar = ({ survey, visibleSections }) => {
  const { t } = useLang();
  const completedSet = new Set(survey.completed_sections);

  return (
    <div className="w-[280px] shrink-0 border-l border-border bg-bg-raised overflow-y-auto flex flex-col gap-3 p-4">
      {/* Status */}
      <div className="px-3.5 py-3 rounded-md bg-bg-elevated border border-border">
        <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2">
          Status
        </div>
        <StatusBadge status={survey.status} />
      </div>

      {/* Details */}
      <Accordion title={t("sidebarDetails")} defaultOpen={true}>
        <div className="flex flex-col gap-2.5">
          <div>
            <div className="font-mono text-xs text-text-muted uppercase tracking-widest">
              {t("sidebarTsgId")}
            </div>
            <div className="font-mono text-sm text-text-secondary mt-0.5">{survey.tsg_id}</div>
          </div>

          {survey.rework_remarks && (
            <div>
              <div className="font-mono text-xs text-text-red uppercase tracking-widest">
                {t("sidebarReworkRemarks")}
              </div>
              <div className="font-mono text-xs text-text-secondary mt-0.5">{survey.rework_remarks}</div>
            </div>
          )}

          {survey.validated_by && (
            <div>
              <div className="font-mono text-xs text-text-muted uppercase tracking-widest">
                {t("sidebarValidatedBy")}
              </div>
              <div className="font-mono text-xs text-text-secondary mt-0.5">
                {survey.validated_by} · {survey.validated_at}
              </div>
            </div>
          )}

          {survey.completed_by && (
            <div>
              <div className="font-mono text-xs text-text-muted uppercase tracking-widest">
                {t("sidebarCompletedBy")}
              </div>
              <div className="font-mono text-xs text-text-secondary mt-0.5">
                {survey.completed_by} · {survey.completed_at}
              </div>
            </div>
          )}
        </div>
      </Accordion>

      {/* Sections checklist */}
      <Accordion title={t("sidebarSections")} defaultOpen={true}>
        <div className="flex flex-col gap-1">
          {visibleSections.map((sec) => {
            const done = completedSet.has(sec.key);
            return (
              <div key={sec.key} className="flex items-center gap-2 py-1">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    background: done ? "var(--green)" : "var(--bg-overlay)",
                    border: `1px solid ${done ? "var(--green)" : "var(--border-bright)"}`,
                  }}
                />
                <span className={cn("font-mono text-xs", done ? "text-text-green" : "text-text-secondary")}>
                  {t(`sec_${sec.key}`)}
                </span>
              </div>
            );
          })}
        </div>
      </Accordion>

      {/* Distance */}
      <div className="px-3.5 py-3 rounded-md bg-bg-elevated border border-border flex items-center gap-2.5">
        <Icon n="nav" size={14} color="var(--text-primary-accent)" />
        <div>
          <div className="font-mono text-xs text-text-muted uppercase tracking-widest">
            {t("sidebarDistance")}
          </div>
          <div className="font-mono text-[13px] text-text-primary mt-0.5">{survey.distance_km} km</div>
        </div>
      </div>

      {/* PDF Downloads */}
      <Accordion title={t("sidebarPdfDownloads")}>
        <div className="flex flex-col gap-2">
          <button className="font-mono text-[11px] text-text-secondary flex items-center gap-2 py-2 px-3 rounded-sm bg-bg-overlay border border-border cursor-pointer w-full">
            <Icon n="file" size={13} /> {t("downloadTsa")}
          </button>
          <button className="font-mono text-[11px] text-text-secondary flex items-center gap-2 py-2 px-3 rounded-sm bg-bg-overlay border border-border cursor-pointer w-full">
            <Icon n="file" size={13} /> {t("downloadSsv")}
          </button>
        </div>
      </Accordion>
    </div>
  );
};
