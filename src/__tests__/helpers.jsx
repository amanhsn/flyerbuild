import { LangCtx } from "../i18n/LangContext"
import { TRANSLATIONS } from "../i18n/translations"

export function TestProviders({ children, lang = "en" }) {
  const t = (key) => {
    const val = TRANSLATIONS[lang]?.[key]
    return typeof val === "function" ? val : (val ?? key)
  }

  return (
    <LangCtx.Provider value={{ lang, setLang: () => {}, t, theme: "light", setTheme: () => {}, userRole: "surveyor", currentUser: { name: "Test User", initials: "TU" } }}>
      {children}
    </LangCtx.Provider>
  )
}
