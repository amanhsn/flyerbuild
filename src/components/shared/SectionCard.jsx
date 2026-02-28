import { Icon } from "../../icons/Icon";
import { useLang } from "../../i18n/LangContext";
import { cn } from "../../lib/utils";

export const SectionCard = ({ title, sectionKey, completed, editing, setEditing, readOnly, saveDisabled, children }) => {
  const { t } = useLang();
  const isDone = !!completed[sectionKey];
  const isEditing = !!editing[sectionKey];

  return (
    <div className={cn(
      "section-card animate-fade-up",
      isDone && !isEditing && "done"
    )}>
      <div className="px-4 py-3.5 border-b border-border bg-bg-elevated flex items-center justify-between">
        <div>
          <div className="font-display text-lg font-bold tracking-wide">{title}</div>
          {isDone && !isEditing && (
            <div className="flex items-center gap-[5px] mt-[3px]">
              <Icon n="check" size={11} color="var(--text-green)" />
              <span className="font-mono text-xs text-text-green">{t("saved")}</span>
            </div>
          )}
          {readOnly && (
            <div className="flex items-center gap-[5px] mt-[3px]">
              <Icon n="info" size={11} color="var(--text-muted)" />
              <span className="font-mono text-xs text-text-muted">Read-only</span>
            </div>
          )}
        </div>
        {isDone && !isEditing && !readOnly && (
          <button
            onClick={() => setEditing(p => ({ ...p, [sectionKey]: true }))}
            className="flex items-center gap-1.5 px-3 py-[7px] rounded-sm bg-bg-overlay border border-border text-text-secondary font-mono text-[11px] cursor-pointer"
          >
            <Icon n="pen" size={12} /> {t("edit")}
          </button>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};
