import { Icon } from "../../icons/Icon";
import { useLang } from "../../i18n/LangContext";
import { LangToggle } from "../../i18n/LangContext";
import { mono, disp } from "../../styles/helpers";
import { useIsMobile } from "../../hooks/useIsMobile";

export const TopBar = ({ lang, setLang, online = true, theme, setTheme, onMenuToggle, children }) => {
  const { t, currentUser } = useLang();
  const isMobile = useIsMobile();

  const initials = (currentUser?.name || "U").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header className="app-topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
        {onMenuToggle && (
          <button className="topbar-menu-btn" onClick={onMenuToggle}>
            <Icon n="list" size={18} color="var(--text-secondary)" />
          </button>
        )}
        <div style={{
          width: 30, height: 30, borderRadius: "var(--radius-sm)", background: "var(--primary)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon n="layers" size={15} color="#fff" />
        </div>
        <div>
          <div style={disp(14, 800, undefined, { letterSpacing: ".06em", textTransform: "uppercase", lineHeight: 1 })}>
            {t("appName")}
          </div>
          <div className="topbar-appname-sub" style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".1em" })}>
            {t("appRole")}
          </div>
        </div>
        {children}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 6 : 12, flexShrink: 0 }}>
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          style={{
            background: "var(--bg-overlay)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)", padding: "5px 8px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Icon n={theme === "light" ? "moon" : "sun"} size={14} color="var(--text-secondary)" />
        </button>
        <LangToggle lang={lang} setLang={setLang} />
        <div style={{ display: "flex", alignItems: "center", gap: 6, ...mono(12, "var(--text-green)") }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)" }} />
          <span className="topbar-online-label">{t("online")}</span>
        </div>
        <div style={{
          width: 30, height: 30, borderRadius: "50%", background: "var(--bg-elevated)",
          border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 12, color: "var(--text-primary-accent)",
        }}>{initials}</div>
      </div>
    </header>
  );
};
