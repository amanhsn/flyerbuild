import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"

describe("useIsMobile", () => {
  let listeners = []
  let matchesValue = false

  beforeEach(() => {
    listeners = []
    matchesValue = false

    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: matchesValue,
      media: query,
      addEventListener: (_, handler) => listeners.push(handler),
      removeEventListener: (_, handler) => {
        listeners = listeners.filter(l => l !== handler)
      },
    }))
  })

  it("returns false for desktop viewport", async () => {
    matchesValue = false
    const { useIsMobile } = await import("../hooks/useIsMobile")
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it("returns true for mobile viewport", async () => {
    matchesValue = true
    // force re-import
    vi.resetModules()
    const { useIsMobile } = await import("../hooks/useIsMobile")
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it("updates when viewport changes", async () => {
    matchesValue = false
    vi.resetModules()
    const { useIsMobile } = await import("../hooks/useIsMobile")
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)

    act(() => {
      listeners.forEach(l => l({ matches: true }))
    })
    expect(result.current).toBe(true)
  })
})
