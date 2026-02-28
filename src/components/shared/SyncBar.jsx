import { Icon } from "../../icons/Icon";
import { useLang } from "../../i18n/LangContext";
import { cn } from "../../lib/utils";

export const SyncBar = ({ online }) => {
  const { t } = useLang();
  return (
    <div
      className={cn(
        "app-syncbar flex items-center gap-2.5 px-5 py-[7px] border-t",
        online
          ? "bg-[rgba(16,185,129,.06)] border-green-dim"
          : "bg-[rgba(192,57,43,.06)] border-primary-dim"
      )}
    >
      <Icon n={online ? "wifi" : "wifiOff"} size={13} color={online ? "var(--text-green)" : "var(--text-primary-accent)"} />
      <span className={cn("font-mono text-xs", online ? "text-text-green" : "text-text-primary-accent")}>
        {online ? t("syncOnline") : t("syncOffline")}
      </span>
      <span className="font-mono text-[10px] text-text-muted ml-auto">
        {online ? t("syncDone") : t("syncPending")}
      </span>
      <div
        className={cn(
          "w-[7px] h-[7px] rounded-full",
          online ? "bg-green" : "bg-primary animate-pulse-dot"
        )}
      />
    </div>
  );
};
