import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useSurveyForm } from "../hooks/useSurveyForm"

const baseSurvey = () => ({
  id: "test-1",
  status: "to_do",
  completed_sections: [],
  visits: [],
  appointment: null,
  client: { company: "", contact_name: "" },
  building_owner: { owner_name: "" },
})

describe("useSurveyForm", () => {
  it("initializes with the provided survey", () => {
    const init = baseSurvey()
    const { result } = renderHook(() => useSurveyForm(init))
    expect(result.current.survey.id).toBe("test-1")
    expect(result.current.survey.status).toBe("to_do")
  })

  describe("setField", () => {
    it("sets a top-level field", () => {
      const { result } = renderHook(() => useSurveyForm(baseSurvey()))
      act(() => result.current.setField("status", "on_going"))
      expect(result.current.survey.status).toBe("on_going")
    })

    it("sets a nested field via dot notation", () => {
      const { result } = renderHook(() => useSurveyForm(baseSurvey()))
      act(() => result.current.setField("client.company", "Wyre"))
      expect(result.current.survey.client.company).toBe("Wyre")
    })
  })

  describe("completeSection", () => {
    it("adds section to completed_sections", () => {
      const { result } = renderHook(() => useSurveyForm(baseSurvey()))
      act(() => result.current.completeSection("visit_info"))
      expect(result.current.survey.completed_sections).toContain("visit_info")
    })

    it("does not duplicate sections", () => {
      const { result } = renderHook(() => useSurveyForm(baseSurvey()))
      act(() => result.current.completeSection("visit_info"))
      act(() => result.current.completeSection("visit_info"))
      expect(result.current.survey.completed_sections.filter(k => k === "visit_info")).toHaveLength(1)
    })

    it("transitions to_do → on_going on first complete", () => {
      const { result } = renderHook(() => useSurveyForm(baseSurvey()))
      act(() => result.current.completeSection("visit_info"))
      expect(result.current.survey.status).toBe("on_going")
    })

    it("sets editing to false for the section", () => {
      const { result } = renderHook(() => useSurveyForm(baseSurvey()))
      act(() => result.current.setEditing("visit_info", true))
      expect(result.current.isSectionEditing("visit_info")).toBe(true)
      act(() => result.current.completeSection("visit_info"))
      expect(result.current.isSectionEditing("visit_info")).toBe(false)
    })
  })

  describe("saveSection", () => {
    it("marks section complete and transitions to_do → on_going", () => {
      const { result } = renderHook(() => useSurveyForm(baseSurvey()))
      act(() => result.current.saveSection("building_info"))
      expect(result.current.survey.completed_sections).toContain("building_info")
      expect(result.current.survey.status).toBe("on_going")
    })
  })

  describe("status transitions - visits", () => {
    it("on_going → visited when visit is added", () => {
      const init = { ...baseSurvey(), status: "on_going" }
      const { result } = renderHook(() => useSurveyForm(init))
      act(() => result.current.addVisit("entry", "first visit"))
      expect(result.current.survey.status).toBe("visited")
    })

    it("3 no_entry visits → final_no_entry", () => {
      const init = {
        ...baseSurvey(),
        status: "on_going",
        visits: [
          { entry_status: "no_entry", visit_remark: "", timestamp: "", surveyor: "" },
          { entry_status: "no_entry", visit_remark: "", timestamp: "", surveyor: "" },
        ],
      }
      const { result } = renderHook(() => useSurveyForm(init))
      act(() => result.current.addVisit("no_entry", "third attempt"))
      expect(result.current.survey.status).toBe("final_no_entry")
    })

    it("does not trigger final_no_entry with only 2 no_entry visits total", () => {
      const init = {
        ...baseSurvey(),
        status: "on_going",
        visits: [
          { entry_status: "no_entry", visit_remark: "", timestamp: "", surveyor: "" },
        ],
      }
      const { result } = renderHook(() => useSurveyForm(init))
      act(() => result.current.addVisit("no_entry", "second attempt"))
      // Only 2 no_entry total, so should become visited, not final_no_entry
      expect(result.current.survey.status).toBe("visited")
    })

    it("reverts to on_going when all visits deleted from visited", () => {
      const init = {
        ...baseSurvey(),
        status: "visited",
        visits: [{ entry_status: "entry", visit_remark: "", timestamp: "", surveyor: "" }],
      }
      const { result } = renderHook(() => useSurveyForm(init))
      act(() => result.current.deleteVisit(0))
      expect(result.current.survey.visits).toHaveLength(0)
      expect(result.current.survey.status).toBe("on_going")
    })
  })

  describe("status transitions - appointments", () => {
    it("to_do → appointment on addAppointment", () => {
      const { result } = renderHook(() => useSurveyForm(baseSurvey()))
      act(() => result.current.addAppointment("Jonas", "2025-03-01"))
      expect(result.current.survey.status).toBe("appointment")
      expect(result.current.survey.appointment).toEqual({
        surveyor_name: "Jonas",
        date: "2025-03-01",
        remark: "",
      })
    })

    it("on_going → appointment on addAppointment", () => {
      const init = { ...baseSurvey(), status: "on_going" }
      const { result } = renderHook(() => useSurveyForm(init))
      act(() => result.current.addAppointment("Jonas", "2025-03-01", "call first"))
      expect(result.current.survey.status).toBe("appointment")
    })

    it("deleteAppointment does NOT revert status", () => {
      const init = { ...baseSurvey(), status: "appointment", appointment: { surveyor_name: "J", date: "2025-01-01", remark: "" } }
      const { result } = renderHook(() => useSurveyForm(init))
      act(() => result.current.deleteAppointment())
      expect(result.current.survey.appointment).toBeNull()
      expect(result.current.survey.status).toBe("appointment")
    })
  })

  describe("transitionStatus", () => {
    it("directly sets the status", () => {
      const { result } = renderHook(() => useSurveyForm(baseSurvey()))
      act(() => result.current.transitionStatus("rework"))
      expect(result.current.survey.status).toBe("rework")
    })
  })

  describe("isSaveDisabled", () => {
    it("is true for inactive status", () => {
      const init = { ...baseSurvey(), status: "inactive" }
      const { result } = renderHook(() => useSurveyForm(init))
      expect(result.current.isSaveDisabled).toBe(true)
    })

    it("is true for sv status", () => {
      const init = { ...baseSurvey(), status: "sv" }
      const { result } = renderHook(() => useSurveyForm(init))
      expect(result.current.isSaveDisabled).toBe(true)
    })

    it("is false for on_going status", () => {
      const init = { ...baseSurvey(), status: "on_going" }
      const { result } = renderHook(() => useSurveyForm(init))
      expect(result.current.isSaveDisabled).toBe(false)
    })
  })

  describe("isSectionCompleted / isSectionEditing", () => {
    it("isSectionCompleted returns true after completeSection", () => {
      const { result } = renderHook(() => useSurveyForm(baseSurvey()))
      act(() => result.current.completeSection("client_info"))
      expect(result.current.isSectionCompleted("client_info")).toBe(true)
      expect(result.current.isSectionCompleted("building_info")).toBe(false)
    })

    it("isSectionEditing returns true after setEditing", () => {
      const { result } = renderHook(() => useSurveyForm(baseSurvey()))
      act(() => result.current.setEditing("client_info", true))
      expect(result.current.isSectionEditing("client_info")).toBe(true)
    })
  })
})
