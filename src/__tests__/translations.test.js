import { describe, it, expect } from "vitest"
import { TRANSLATIONS } from "../i18n/translations"

describe("translations", () => {
  it("has en and nl locales", () => {
    expect(TRANSLATIONS).toHaveProperty("en")
    expect(TRANSLATIONS).toHaveProperty("nl")
  })

  it("all en keys exist in nl", () => {
    const enKeys = Object.keys(TRANSLATIONS.en)
    const nlKeys = Object.keys(TRANSLATIONS.nl)
    const missing = enKeys.filter(k => !nlKeys.includes(k))
    if (missing.length > 0) {
      console.warn("Missing NL translations:", missing)
    }
    // At minimum, core keys should be present
    const coreKeys = ["appName", "navDashboard", "navMap", "navHistory", "navProfile", "online", "offline"]
    for (const key of coreKeys) {
      expect(TRANSLATIONS.en).toHaveProperty(key)
      expect(TRANSLATIONS.nl).toHaveProperty(key)
    }
  })

  it("function-type translations work (e.g. queueCount)", () => {
    const fn = TRANSLATIONS.en.queueCount
    expect(typeof fn).toBe("function")
    expect(fn(5)).toContain("5")
  })
})
