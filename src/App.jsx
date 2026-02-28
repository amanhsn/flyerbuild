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
import { useIsMobile } from "./hooks/useIsMobile";
import { cn } from "./lib/utils";

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
              className="w-auto ml-2 px-2 py-1 bg-bg-elevated border border-border-bright rounded-md text-text-primary font-mono text-xs outline-none"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
            >
              {Object.keys(ROLES).map(role => (
                <option key={role} value={role}>
                  {role === "subcontractor" ? "Subco" : role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex gap-1 ml-3">
              {Object.keys(ROLES).map(role => (
                <button
                  key={role}
                  onClick={() => setUserRole(role)}
                  className={cn(
                    "font-mono text-xs uppercase tracking-wider px-2 py-[3px] rounded-sm border cursor-pointer",
                    userRole === role
                      ? "text-white border-primary bg-primary"
                      : "text-text-muted border-border bg-bg-overlay"
                  )}
                >
                  {role === "subcontractor" ? "Subco" : role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          )}
        </TopBar>

        {/* Portal content */}
        <div className="app-body flex-1 overflow-hidden flex">
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
