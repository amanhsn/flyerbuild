import { useState, useEffect } from "react";
import { TRANSLATIONS } from "./i18n/translations";
import { LangCtx } from "./i18n/LangContext";
import { TopBar } from "./components/shell/TopBar";
import { SyncBar } from "./components/shared/SyncBar";

// Portal imports
import { SurveyorPortalRoot } from "./portals/surveyor/SurveyorPortalRoot";
import { ValidatorPortalRoot } from "./portals/validator/ValidatorPortalRoot";
import { AdminPortalRoot } from "./portals/admin/AdminPortalRoot";
import { SubcoPortalRoot } from "./portals/subcontractor/SubcoPortalRoot";

import { ROLES } from "./data/roles";
import { DEFAULT_USERS } from "./data/mockUsers";
import { mono } from "./styles/helpers";
import { useIsMobile } from "./hooks/useIsMobile";

export default function App() {
  const [lang, setLang] = useState("en");
  const [userRole, setUserRole] = useState("surveyor");
  const [theme, setTheme] = useState(() => localStorage.getItem("wyre-theme") || "light");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const online = true;
  const isMobile = useIsMobile();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("wyre-theme", theme);
  }, [theme]);

  // Close sidebar when switching roles
  useEffect(() => {
    setSidebarOpen(false);
  }, [userRole]);

  const t = (key) => {
    const val = TRANSLATIONS[lang]?.[key];
    return typeof val === "function" ? val : (val ?? key);
  };

  const currentUser = DEFAULT_USERS[userRole];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <LangCtx.Provider value={{ lang, t, userRole, currentUser }}>
      <div className="app-shell">
        {/* Top bar with role switcher */}
        <TopBar
          lang={lang} setLang={setLang} online={online} theme={theme} setTheme={setTheme}
          onMenuToggle={() => setSidebarOpen(v => !v)}
        >
          {/* Role switcher for dev */}
          {isMobile ? (
            <select
              className="field-input"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              style={{ width: "auto", marginLeft: 8, padding: "4px 8px", ...mono(11, "var(--text-primary)") }}
            >
              {Object.keys(ROLES).map(role => (
                <option key={role} value={role}>
                  {role === "subcontractor" ? "Subco" : role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          ) : (
            <div style={{ display: "flex", gap: 4, marginLeft: 12 }}>
              {Object.keys(ROLES).map(role => (
                <button
                  key={role}
                  onClick={() => setUserRole(role)}
                  style={{
                    ...mono(11, userRole === role ? "#fff" : "var(--text-muted)"),
                    padding: "3px 8px", borderRadius: "var(--radius-sm)",
                    border: userRole === role ? "1px solid var(--primary)" : "1px solid var(--border)",
                    background: userRole === role ? "var(--primary)" : "var(--bg-overlay)",
                    cursor: "pointer", textTransform: "uppercase", letterSpacing: ".06em",
                  }}
                >
                  {role === "subcontractor" ? "Subco" : role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          )}
        </TopBar>

        {/* Portal content */}
        <div className="app-body" style={{ flex: 1, overflow: "hidden", display: "flex" }}>
          {userRole === "surveyor" && <SurveyorPortalRoot sidebarOpen={sidebarOpen} onSidebarClose={closeSidebar} />}
          {userRole === "validator" && <ValidatorPortalRoot />}
          {userRole === "admin" && <AdminPortalRoot sidebarOpen={sidebarOpen} onSidebarClose={closeSidebar} onMenuToggle={() => setSidebarOpen(v => !v)} />}
          {userRole === "subcontractor" && <SubcoPortalRoot />}
        </div>

        <SyncBar online={online} />
      </div>
    </LangCtx.Provider>
  );
}
