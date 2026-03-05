import { describe, it, expect } from "vitest"
import { STATUSES, STATUS_GROUPS, HIDDEN_STATUSES, SAVE_DISABLED_STATUSES } from "../data/statusConfig"

describe("statusConfig", () => {
  it("defines all 15 statuses", () => {
    const keys = Object.keys(STATUSES)
    expect(keys).toHaveLength(15)
    expect(keys).toContain("inactive")
    expect(keys).toContain("to_do")
    expect(keys).toContain("on_going")
    expect(keys).toContain("visited")
    expect(keys).toContain("completed")
    expect(keys).toContain("final_no_entry")
  })

  it("each status has label, color, bg, border, hex", () => {
    for (const [key, val] of Object.entries(STATUSES)) {
      expect(val).toHaveProperty("label")
      expect(val).toHaveProperty("color")
      expect(val).toHaveProperty("bg")
      expect(val).toHaveProperty("border")
      expect(val).toHaveProperty("hex")
      expect(val.hex).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })

  it("STATUS_GROUPS covers all non-hidden statuses", () => {
    const grouped = Object.values(STATUS_GROUPS).flat()
    // All grouped statuses should exist in STATUSES
    for (const s of grouped) {
      expect(STATUSES).toHaveProperty(s)
    }
  })

  it("HIDDEN_STATUSES are all valid", () => {
    for (const s of HIDDEN_STATUSES) {
      expect(STATUSES).toHaveProperty(s)
    }
  })

  it("SAVE_DISABLED_STATUSES is a subset of HIDDEN_STATUSES", () => {
    for (const s of SAVE_DISABLED_STATUSES) {
      expect(HIDDEN_STATUSES).toContain(s)
    }
  })
})
