import { Icon } from "../../icons/Icon";
import { useLang } from "../../i18n/LangContext";
import { LangToggle } from "../../i18n/LangContext";
import { useIsMobile } from "../../hooks/useIsMobile";
import { cn } from "../../lib/utils";

export const TopBar = ({ lang, setLang, online = true, theme, setTheme, onMenuToggle, children }) => {
  const { t, currentUser } = useLang();
  const isMobile = useIsMobile();

  const initials = (currentUser?.name || "U").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header className="app-topbar">
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        {onMenuToggle && (
          <button className="topbar-menu-btn" onClick={onMenuToggle}>
            <Icon n="list" size={18} color="var(--text-secondary)" />
          </button>
        )}
        <div className="w-[30px] h-[30px] rounded-sm bg-primary flex items-center justify-center shrink-0">
          <Icon n="layers" size={15} color="#fff" />
        </div>
        <div>
          <div className="font-display text-sm font-extrabold tracking-wide uppercase leading-none">
            {t("appName")}
          </div>
          <div className="topbar-appname-sub font-mono text-xs text-text-muted uppercase tracking-widest">
            {t("appRole")}
          </div>
        </div>
        {children}
      </div>

      <div className={cn("flex items-center shrink-0", isMobile ? "gap-1.5" : "gap-3")}>
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="bg-bg-overlay border border-border rounded-sm px-2 py-[5px] cursor-pointer flex items-center justify-center"
        >
          <Icon n={theme === "light" ? "moon" : "sun"} size={14} color="var(--text-secondary)" />
        </button>
        <LangToggle lang={lang} setLang={setLang} />
        <div className="font-mono text-xs text-text-green flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green" />
          <span className="topbar-online-label">{t("online")}</span>
        </div>
        <div className="w-[30px] h-[30px] rounded-full bg-bg-elevated border border-border flex items-center justify-center font-display font-extrabold text-xs text-text-primary-accent">
          {initials}
        </div>
      </div>
    </header>
  );
};
