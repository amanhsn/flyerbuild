"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useLang } from "@/i18n/LangContext"
import { TopBar } from "@/components/shell/TopBar"
import { SyncBar } from "@/components/shared/SyncBar"
import { useIsMobile } from "@/hooks/useIsMobile"
import { getClientRole, setClientRole, VALID_ROLES } from "@/lib/auth"
import { cn } from "@/lib/utils"

export default function PortalLayout({ children }) {
  const { lang, setLang, t, theme, setTheme } = useLang()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useIsMobile()
  const online = true

  const userRole = getClientRole() || "surveyor"

  const handleRoleSwitch = (role) => {
    setClientRole(role)
    setSidebarOpen(false)
    router.push(`/${role}`)
  }

  return (
    <div className="app-shell">
      <TopBar
        lang={lang}
        setLang={setLang}
        online={online}
        theme={theme}
        setTheme={setTheme}
        onMenuToggle={() => setSidebarOpen((v) => !v)}
      >
        {isMobile ? (
          <select
            className="w-auto ml-2 px-2 py-1 bg-bg-elevated border border-border-bright rounded-md text-text-primary font-mono text-xs outline-none"
            value={userRole}
            onChange={(e) => handleRoleSwitch(e.target.value)}
          >
            {VALID_ROLES.map((role) => (
              <option key={role} value={role}>
                {role === "subcontractor"
                  ? "Subco"
                  : role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        ) : (
          <div className="flex gap-1 ml-3">
            {VALID_ROLES.map((role) => (
              <button
                key={role}
                onClick={() => handleRoleSwitch(role)}
                className={cn(
                  "font-mono text-xs uppercase tracking-wider px-2 py-[3px] rounded-sm border cursor-pointer",
                  userRole === role
                    ? "text-white border-primary bg-primary"
                    : "text-text-muted border-border bg-bg-overlay"
                )}
              >
                {role === "subcontractor"
                  ? "Subco"
                  : role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
        )}
      </TopBar>

      <div className="app-body flex-1 overflow-hidden flex">
        {children}
      </div>

      <SyncBar online={online} />
    </div>
  )
}
