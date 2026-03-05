"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Sidebar } from "@/components/shell/Sidebar"
import { BottomNav } from "@/components/shell/BottomNav"
import { useIsMobile } from "@/hooks/useIsMobile"

const ADMIN_NAV = [
  ["executive", "dashboard", "Executive"],
  ["projects", "clipboard", "Projects"],
  ["performance", "star", "Performance"],
  ["map", "map", "Map & Table"],
  ["approval", "check", "Approvals"],
  ["engineering", "settings", "Engineering"],
  ["monitoring", "eye", "Subco Monitor"],
  ["disputes", "alert", "Disputes"],
  ["financials", "file", "Financials"],
  ["admin", "shield", "Admin"],
]

const ADMIN_MOBILE_NAV = [
  { id: "executive", icon: "dashboard", label: "Executive" },
  { id: "projects", icon: "clipboard", label: "Projects" },
  { id: "map", icon: "map", label: "Map" },
  { id: "approval", icon: "check", label: "Approvals" },
  { id: "more", icon: "list", label: "More" },
]

function getActiveTab(pathname) {
  const segments = pathname.split("/")
  return segments[2] || "executive"
}

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const activeTab = getActiveTab(pathname)

  const handleNav = (id) => {
    router.push(`/admin/${id}`)
    setSidebarOpen(false)
  }

  const handleMobileNav = (id) => {
    if (id === "more") {
      setSidebarOpen((v) => !v)
    } else {
      handleNav(id)
    }
  }

  return (
    <>
      <Sidebar
        active={activeTab}
        setActive={handleNav}
        items={ADMIN_NAV}
        roleLabel="Admin Console"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main
        className="flex-1 overflow-hidden flex flex-col"
        style={{ paddingBottom: isMobile ? 60 : 0 }}
      >
        {children}
      </main>
      {isMobile && (
        <BottomNav
          active={activeTab}
          setActive={handleMobileNav}
          items={ADMIN_MOBILE_NAV}
        />
      )}
    </>
  )
}
