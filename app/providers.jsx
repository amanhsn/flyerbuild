"use client"

import { useState, useEffect } from "react"
import { TRANSLATIONS } from "@/i18n/translations"
import { LangCtx } from "@/i18n/LangContext"
import { DEFAULT_USERS } from "@/data/mockUsers"
import { getClientRole } from "@/lib/auth"

export function Providers({ children }) {
  const [lang, setLang] = useState("en")
  const [theme, setTheme] = useState("light")
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem("wyre-theme") || "light"
    setTheme(saved)
    document.documentElement.setAttribute("data-theme", saved)
    setUserRole(getClientRole())
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("wyre-theme", theme)
  }, [theme])

  const t = (key) => {
    const val = TRANSLATIONS[lang]?.[key]
    return typeof val === "function" ? val : (val ?? key)
  }

  const currentUser = userRole ? DEFAULT_USERS[userRole] : null

  return (
    <LangCtx.Provider value={{ lang, setLang, t, theme, setTheme, userRole, currentUser }}>
      {children}
    </LangCtx.Provider>
  )
}
