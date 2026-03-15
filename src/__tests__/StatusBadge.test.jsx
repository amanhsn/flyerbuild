import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { StatusBadge } from "../components/shared/StatusBadge"

describe("StatusBadge", () => {
  it("renders the correct label for a status", () => {
    render(<StatusBadge status="on_going" />)
    expect(screen.getByText("In Progress")).toBeInTheDocument()
  })

  it("renders Approved for completed status", () => {
    render(<StatusBadge status="completed" />)
    expect(screen.getByText("Approved")).toBeInTheDocument()
  })

  it("falls back to Not Started for unknown status", () => {
    render(<StatusBadge status="unknown_status_xyz" />)
    expect(screen.getByText("Not Started")).toBeInTheDocument()
  })

  it("renders as a span element", () => {
    const { container } = render(<StatusBadge status="visited" />)
    const span = container.querySelector("span")
    expect(span).toBeInTheDocument()
  })

  it("shows surveyor-facing labels when variant is surveyor", () => {
    render(<StatusBadge status="visited" variant="surveyor" />)
    expect(screen.getByText("Submitted")).toBeInTheDocument()
  })

  it("shows description when showDescription is true", () => {
    render(<StatusBadge status="rework" showDescription />)
    expect(screen.getByText("Rework Required")).toBeInTheDocument()
    expect(screen.getByText("Validator sent back for corrections — check remarks")).toBeInTheDocument()
  })
})
