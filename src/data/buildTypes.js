// ---------------------------------------------------------------------------
// buildTypes.js — Build type definitions for subcontractor execution
// ---------------------------------------------------------------------------

export const BUILD_TYPES = {
  sdu_standard: {
    label: "SDU Standard",
    description: "Single dwelling unit — standard installation",
    phases: {
      pre_build: { requiredImages: 3, forms: [] },
      during_build: { requiredImages: 4, forms: ["cable_routing"] },
      post_build: { requiredImages: 3, forms: [] },
    },
  },
  sdu_complex: {
    label: "SDU Complex",
    description: "Single dwelling unit — complex routing or heritage",
    phases: {
      pre_build: { requiredImages: 5, forms: ["site_assessment"] },
      during_build: { requiredImages: 6, forms: ["cable_routing", "obstacle_report"] },
      post_build: { requiredImages: 4, forms: ["completion_checklist"] },
    },
  },
  mdu_small: {
    label: "Small MDU",
    description: "Multi-dwelling unit — 9 to 16 units",
    phases: {
      pre_build: { requiredImages: 6, forms: ["site_assessment"] },
      during_build: { requiredImages: 8, forms: ["cable_routing", "riser_progress"] },
      post_build: { requiredImages: 5, forms: ["completion_checklist"] },
    },
  },
  mdu_large: {
    label: "Large MDU",
    description: "Multi-dwelling unit — 17 to 48 units",
    phases: {
      pre_build: { requiredImages: 8, forms: ["site_assessment", "riser_plan"] },
      during_build: { requiredImages: 12, forms: ["cable_routing", "riser_progress", "floor_progress"] },
      post_build: { requiredImages: 6, forms: ["completion_checklist", "test_results"] },
    },
  },
  mdu_xl: {
    label: "Extra Large MDU",
    description: "Multi-dwelling unit — 49+ units",
    phases: {
      pre_build: { requiredImages: 10, forms: ["site_assessment", "riser_plan", "access_plan"] },
      during_build: { requiredImages: 16, forms: ["cable_routing", "riser_progress", "floor_progress", "safety_checklist"] },
      post_build: { requiredImages: 8, forms: ["completion_checklist", "test_results", "handover_report"] },
    },
  },
};

export const BUILD_TYPE_KEYS = Object.keys(BUILD_TYPES);

export const BUILD_PHASES = ["pre_build", "during_build", "post_build"];

export const BUILD_PHASE_LABELS = {
  pre_build: "Pre-Build",
  during_build: "During Build",
  post_build: "Post-Build",
};
