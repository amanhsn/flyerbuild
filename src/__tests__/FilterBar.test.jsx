import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { FilterBar } from "../components/dashboard/FilterBar"
import { TestProviders } from "./helpers"

describe("FilterBar", () => {
  it("renders all 6 filter buttons", () => {
    render(
      <TestProviders>
        <FilterBar filter="all" setFilter={() => {}} />
      </TestProviders>
    )
    expect(screen.getByText("All")).toBeInTheDocument()
    expect(screen.getByText("Active")).toBeInTheDocument()
    expect(screen.getByText("Pending")).toBeInTheDocument()
    expect(screen.getByText("Review")).toBeInTheDocument()
    expect(screen.getByText("Done")).toBeInTheDocument()
    expect(screen.getByText("Issues")).toBeInTheDocument()
  })

  it("calls setFilter on click", () => {
    const setFilter = vi.fn()
    render(
      <TestProviders>
        <FilterBar filter="all" setFilter={setFilter} />
      </TestProviders>
    )
    fireEvent.click(screen.getByText("Active"))
    expect(setFilter).toHaveBeenCalledWith("active")
  })

  it("applies active class to current filter", () => {
    render(
      <TestProviders>
        <FilterBar filter="done" setFilter={() => {}} />
      </TestProviders>
    )
    const doneBtn = screen.getByText("Done")
    expect(doneBtn.className).toContain("active")
  })
})
