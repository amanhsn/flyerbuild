"use client"

import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Sidebar } from "@/components/shell/Sidebar"
import { BottomNav } from "@/components/shell/BottomNav"
import { useIsMobile } from "@/hooks/useIsMobile"
import { useLang } from "@/i18n/LangContext"

const NAV_ITEMS = [
  ["dashboard", "dashboard", "Dashboard"],
  ["map", "map", "Map"],
  ["history", "clock", "History"],
  ["profile", "user", "Profile"],
]

const MOBILE_NAV = [
  { id: "dashboard", icon: "dashboard", label: "Dashboard" },
  { id: "map", icon: "map", label: "Map" },
  { id: "history", icon: "clock", label: "History" },
  { id: "profile", icon: "user", label: "Profile" },
]

function getActiveTab(pathname) {
  const segments = pathname.split("/")
  const tab = segments[2] || "dashboard"
  if (tab === "survey") return null // hide nav in survey view
  return tab
}

export default function SurveyorLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useIsMobile()
  const { t } = useLang()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const activeTab = getActiveTab(pathname)
  const inSurveyView = pathname.includes("/survey/")

  const handleNav = (id) => {
    router.push(`/surveyor/${id}`)
    setSidebarOpen(false)
  }

  return (
    <>
      {!isMobile && (
        <Sidebar
          active={activeTab}
          setActive={handleNav}
          items={NAV_ITEMS}
          roleLabel="Surveyor"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={inSurveyView}
        />
      )}
      {isMobile && !inSurveyView && (
        <Sidebar
          active={activeTab}
          setActive={handleNav}
          items={NAV_ITEMS}
          roleLabel="Surveyor"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}
      <main
        className="main-content flex-1 overflow-hidden flex flex-col"
        style={{ paddingBottom: isMobile && !inSurveyView ? 60 : 0 }}
      >
        {children}
      </main>
      {isMobile && !inSurveyView && (
        <BottomNav active={activeTab} setActive={handleNav} items={MOBILE_NAV} />
      )}
    </>
  )
}
