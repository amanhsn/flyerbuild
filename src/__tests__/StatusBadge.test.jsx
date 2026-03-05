import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { StatusBadge } from "../components/shared/StatusBadge"

describe("StatusBadge", () => {
  it("renders the correct label for a status", () => {
    render(<StatusBadge status="on_going" />)
    expect(screen.getByText("On Going")).toBeInTheDocument()
  })

  it("renders Completed for completed status", () => {
    render(<StatusBadge status="completed" />)
    expect(screen.getByText("Completed")).toBeInTheDocument()
  })

  it("falls back to To Do for unknown status", () => {
    render(<StatusBadge status="unknown_status_xyz" />)
    expect(screen.getByText("To Do")).toBeInTheDocument()
  })

  it("renders as a span element", () => {
    const { container } = render(<StatusBadge status="visited" />)
    const span = container.querySelector("span")
    expect(span).toBeInTheDocument()
    expect(span.textContent).toBe("Visited")
  })
})
