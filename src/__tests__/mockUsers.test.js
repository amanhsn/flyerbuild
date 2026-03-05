import { describe, it, expect } from "vitest"
import { MOCK_USERS, getUsersByRole, getUserById, DEFAULT_USERS } from "../data/mockUsers"

describe("mockUsers", () => {
  it("has at least one user per role", () => {
    const roles = ["surveyor", "validator", "admin", "subcontractor"]
    for (const role of roles) {
      expect(getUsersByRole(role).length).toBeGreaterThan(0)
    }
  })

  it("getUserById returns the correct user", () => {
    const user = getUserById("usr-001")
    expect(user).toBeDefined()
    expect(user.name).toBe("Jonas Jacobs")
    expect(user.role).toBe("surveyor")
  })

  it("getUserById returns undefined for invalid id", () => {
    expect(getUserById("usr-999")).toBeUndefined()
  })

  it("DEFAULT_USERS has one entry per role", () => {
    expect(DEFAULT_USERS.surveyor.role).toBe("surveyor")
    expect(DEFAULT_USERS.validator.role).toBe("validator")
    expect(DEFAULT_USERS.admin.role).toBe("admin")
    expect(DEFAULT_USERS.subcontractor.role).toBe("subcontractor")
  })

  it("all users have required fields", () => {
    for (const u of MOCK_USERS) {
      expect(u).toHaveProperty("id")
      expect(u).toHaveProperty("name")
      expect(u).toHaveProperty("email")
      expect(u).toHaveProperty("role")
    }
  })
})
