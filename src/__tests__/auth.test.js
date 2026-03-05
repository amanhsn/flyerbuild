import { describe, it, expect, beforeEach } from "vitest"
import { getClientRole, setClientRole, clearClientRole, VALID_ROLES } from "../lib/auth"

describe("auth", () => {
  beforeEach(() => {
    document.cookie = "role=;path=/;max-age=0"
  })

  describe("VALID_ROLES", () => {
    it("contains all four roles", () => {
      expect(VALID_ROLES).toEqual(["surveyor", "validator", "admin", "subcontractor"])
    })
  })

  describe("getClientRole", () => {
    it("returns null when no role cookie is set", () => {
      expect(getClientRole()).toBeNull()
    })

    it("returns the role from cookie", () => {
      document.cookie = "role=admin;path=/"
      expect(getClientRole()).toBe("admin")
    })

    it("reads role when other cookies exist", () => {
      document.cookie = "other=value;path=/"
      document.cookie = "role=surveyor;path=/"
      expect(getClientRole()).toBe("surveyor")
    })
  })

  describe("setClientRole", () => {
    it("sets the role cookie", () => {
      setClientRole("validator")
      expect(getClientRole()).toBe("validator")
    })

    it("overwrites an existing role", () => {
      setClientRole("admin")
      setClientRole("surveyor")
      expect(getClientRole()).toBe("surveyor")
    })
  })

  describe("clearClientRole", () => {
    it("removes the role cookie", () => {
      setClientRole("admin")
      clearClientRole()
      expect(getClientRole()).toBeNull()
    })
  })
})
