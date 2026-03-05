import { describe, it, expect } from "vitest"
import { SECTIONS } from "../data/sectionRegistry"

describe("sectionRegistry", () => {
  it("has 22 sections", () => {
    expect(SECTIONS).toHaveLength(22)
  })

  it("each section has key and icon", () => {
    for (const s of SECTIONS) {
      expect(s).toHaveProperty("key")
      expect(typeof s.key).toBe("string")
      expect(s).toHaveProperty("icon")
    }
  })

  it("section keys are unique", () => {
    const keys = SECTIONS.map(s => s.key)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it("contains expected sections", () => {
    const keys = SECTIONS.map(s => s.key)
    expect(keys).toContain("visit_info")
    expect(keys).toContain("client_info")
    expect(keys).toContain("building_info")
    expect(keys).toContain("floorplan_canvas")
    expect(keys).toContain("statement_agreement")
  })
})
