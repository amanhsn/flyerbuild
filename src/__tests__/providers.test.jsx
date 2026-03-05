import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { LangCtx, useLang } from "../i18n/LangContext"
import { TRANSLATIONS } from "../i18n/translations"
import { TestProviders } from "./helpers"

function LangDisplay() {
  const { lang, t, theme } = useLang()
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="theme">{theme}</span>
      <span data-testid="dashboard">{t("navDashboard")}</span>
    </div>
  )
}

describe("LangCtx / Providers", () => {
  it("provides default lang=en", () => {
    render(<LangDisplay />, { wrapper: TestProviders })
    expect(screen.getByTestId("lang").textContent).toBe("en")
  })

  it("translates keys correctly in EN", () => {
    render(<LangDisplay />, { wrapper: TestProviders })
    expect(screen.getByTestId("dashboard").textContent).toBe("Dashboard")
  })

  it("translates keys correctly in NL", () => {
    render(
      <TestProviders lang="nl">
        <LangDisplay />
      </TestProviders>
    )
    expect(screen.getByTestId("dashboard").textContent).toBe(TRANSLATIONS.nl.navDashboard)
  })

  it("provides theme", () => {
    render(<LangDisplay />, { wrapper: TestProviders })
    expect(screen.getByTestId("theme").textContent).toBe("light")
  })

  it("returns key when translation is missing", () => {
    render(
      <TestProviders>
        <MissingKeyDisplay />
      </TestProviders>
    )
    expect(screen.getByTestId("missing").textContent).toBe("nonExistentKey")
  })
})

function MissingKeyDisplay() {
  const { t } = useLang()
  return <span data-testid="missing">{t("nonExistentKey")}</span>
}
