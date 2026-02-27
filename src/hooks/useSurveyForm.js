import { useReducer, useCallback } from "react";
import { HIDDEN_STATUSES, SAVE_DISABLED_STATUSES } from "../data/statusConfig";

const ACTION = {
  SET_FIELD: "SET_FIELD",
  COMPLETE_SECTION: "COMPLETE_SECTION",
  UNCOMPLETE_SECTION: "UNCOMPLETE_SECTION",
  TRANSITION_STATUS: "TRANSITION_STATUS",
  ADD_VISIT: "ADD_VISIT",
  DELETE_VISIT: "DELETE_VISIT",
  ADD_APPOINTMENT: "ADD_APPOINTMENT",
  DELETE_APPOINTMENT: "DELETE_APPOINTMENT",
  SET_EDITING: "SET_EDITING",
  SAVE_SECTION: "SAVE_SECTION",
};

function surveyReducer(state, action) {
  switch (action.type) {
    case ACTION.SET_FIELD: {
      const { path, value } = action.payload;
      const keys = path.split(".");
      const newState = { ...state };
      let obj = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return newState;
    }

    case ACTION.COMPLETE_SECTION: {
      const { sectionKey } = action.payload;
      const completed = [...new Set([...state.completed_sections, sectionKey])];
      let newStatus = state.status;
      // Auto-transition: to_do → on_going on first save
      if (state.status === "to_do") {
        newStatus = "on_going";
      }
      return {
        ...state,
        completed_sections: completed,
        editing: { ...state.editing, [sectionKey]: false },
        status: newStatus,
      };
    }

    case ACTION.UNCOMPLETE_SECTION: {
      const { sectionKey } = action.payload;
      return {
        ...state,
        completed_sections: state.completed_sections.filter(k => k !== sectionKey),
      };
    }

    case ACTION.TRANSITION_STATUS: {
      return { ...state, status: action.payload.status };
    }

    case ACTION.ADD_VISIT: {
      const { entry_status, visit_remark } = action.payload;
      const newVisit = {
        entry_status,
        visit_remark,
        timestamp: new Date().toISOString(),
        surveyor: "Jonas Jacobs",
      };
      const visits = [...state.visits, newVisit];

      let newStatus = state.status;
      // Auto-transitions on visit add
      // final_no_entry requires: new visit is no_entry AND at least 2 existing no_entry visits
      const existingNoEntryCount = state.visits.filter(v => v.entry_status === "no_entry").length;
      if (entry_status === "no_entry" && existingNoEntryCount >= 2) {
        newStatus = "final_no_entry";
      } else if (state.status === "on_going") {
        newStatus = "visited";
      }

      return { ...state, visits, status: newStatus };
    }

    case ACTION.DELETE_VISIT: {
      const visits = state.visits.filter((_, i) => i !== action.payload.index);
      let newStatus = state.status;
      // Revert if all visits removed
      if (visits.length === 0 && (state.status === "visited" || state.status === "final_no_entry")) {
        newStatus = "on_going";
      }
      return { ...state, visits, status: newStatus };
    }

    case ACTION.ADD_APPOINTMENT: {
      const { surveyor_name, date, remark } = action.payload;
      let newStatus = state.status;
      if (["to_do", "rework", "visited", "on_going"].includes(state.status)) {
        newStatus = "appointment";
      }
      return {
        ...state,
        appointment: { surveyor_name, date, remark },
        status: newStatus,
      };
    }

    case ACTION.DELETE_APPOINTMENT: {
      // Deletion should NOT revert status (per spec)
      return { ...state, appointment: null };
    }

    case ACTION.SET_EDITING: {
      return {
        ...state,
        editing: { ...state.editing, [action.payload.sectionKey]: action.payload.value },
      };
    }

    case ACTION.SAVE_SECTION: {
      const { sectionKey } = action.payload;
      let newStatus = state.status;
      if (state.status === "to_do") {
        newStatus = "on_going";
      }
      return {
        ...state,
        completed_sections: [...new Set([...state.completed_sections, sectionKey])],
        editing: { ...state.editing, [sectionKey]: false },
        status: newStatus,
      };
    }

    default:
      return state;
  }
}

export function useSurveyForm(initialSurvey) {
  const [survey, dispatch] = useReducer(surveyReducer, {
    ...initialSurvey,
    editing: {},
  });

  const setField = useCallback((path, value) => {
    dispatch({ type: ACTION.SET_FIELD, payload: { path, value } });
  }, []);

  const completeSection = useCallback((sectionKey) => {
    dispatch({ type: ACTION.COMPLETE_SECTION, payload: { sectionKey } });
  }, []);

  const saveSection = useCallback((sectionKey) => {
    dispatch({ type: ACTION.SAVE_SECTION, payload: { sectionKey } });
  }, []);

  const setEditing = useCallback((sectionKey, value) => {
    dispatch({ type: ACTION.SET_EDITING, payload: { sectionKey, value } });
  }, []);

  const transitionStatus = useCallback((status) => {
    dispatch({ type: ACTION.TRANSITION_STATUS, payload: { status } });
  }, []);

  const addVisit = useCallback((entry_status, visit_remark = "") => {
    dispatch({ type: ACTION.ADD_VISIT, payload: { entry_status, visit_remark } });
  }, []);

  const deleteVisit = useCallback((index) => {
    dispatch({ type: ACTION.DELETE_VISIT, payload: { index } });
  }, []);

  const addAppointment = useCallback((surveyor_name, date, remark = "") => {
    dispatch({ type: ACTION.ADD_APPOINTMENT, payload: { surveyor_name, date, remark } });
  }, []);

  const deleteAppointment = useCallback(() => {
    dispatch({ type: ACTION.DELETE_APPOINTMENT });
  }, []);

  const isSaveDisabled = SAVE_DISABLED_STATUSES.includes(survey.status);
  const isSectionCompleted = (key) => survey.completed_sections.includes(key);
  const isSectionEditing = (key) => !!survey.editing[key];

  return {
    survey,
    setField,
    completeSection,
    saveSection,
    setEditing,
    transitionStatus,
    addVisit,
    deleteVisit,
    addAppointment,
    deleteAppointment,
    isSaveDisabled,
    isSectionCompleted,
    isSectionEditing,
  };
}
