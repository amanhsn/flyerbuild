import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { SurveyCard } from "../components/dashboard/SurveyCard"
import { TestProviders } from "./helpers"

const mockSurvey = {
  id: "srv-001",
  tsg_id: "TSG-1234",
  status: "on_going",
  priority: false,
  address: {
    street: "Kerkstraat",
    number: "12",
    postal_code: "8000",
    city: "Brugge",
  },
  scheduled_time: "09:30",
  distance_km: "2.4",
  completed_sections: ["visit_info", "client_info"],
}

describe("SurveyCard", () => {
  it("renders address info", () => {
    render(
      <TestProviders>
        <SurveyCard survey={mockSurvey} selected={false} onClick={() => {}} />
      </TestProviders>
    )
    expect(screen.getByText("Kerkstraat 12")).toBeInTheDocument()
    expect(screen.getByText("8000 Brugge")).toBeInTheDocument()
  })

  it("renders tsg_id", () => {
    render(
      <TestProviders>
        <SurveyCard survey={mockSurvey} selected={false} onClick={() => {}} />
      </TestProviders>
    )
    expect(screen.getByText("TSG-1234")).toBeInTheDocument()
  })

  it("renders status badge", () => {
    render(
      <TestProviders>
        <SurveyCard survey={mockSurvey} selected={false} onClick={() => {}} />
      </TestProviders>
    )
    expect(screen.getByText("On Going")).toBeInTheDocument()
  })

  it("calls onClick when clicked", () => {
    const onClick = vi.fn()
    render(
      <TestProviders>
        <SurveyCard survey={mockSurvey} selected={false} onClick={onClick} />
      </TestProviders>
    )
    fireEvent.click(screen.getByText("Kerkstraat 12"))
    expect(onClick).toHaveBeenCalled()
  })

  it("renders scheduled time and distance", () => {
    render(
      <TestProviders>
        <SurveyCard survey={mockSurvey} selected={false} onClick={() => {}} />
      </TestProviders>
    )
    expect(screen.getByText("09:30")).toBeInTheDocument()
    expect(screen.getByText("2.4 km")).toBeInTheDocument()
  })

  it("applies conflict class for rework status", () => {
    const reworkSurvey = { ...mockSurvey, status: "rework" }
    const { container } = render(
      <TestProviders>
        <SurveyCard survey={reworkSurvey} selected={false} onClick={() => {}} />
      </TestProviders>
    )
    expect(container.firstChild.className).toContain("conflict")
  })

  it("applies priority class when priority is true", () => {
    const prioritySurvey = { ...mockSurvey, priority: true }
    const { container } = render(
      <TestProviders>
        <SurveyCard survey={prioritySurvey} selected={false} onClick={() => {}} />
      </TestProviders>
    )
    expect(container.firstChild.className).toContain("priority")
  })
})
