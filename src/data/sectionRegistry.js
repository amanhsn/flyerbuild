// ---------------------------------------------------------------------------
// sectionRegistry.js — Wyre Surveyor Portal
// Ordered list of all 22 survey sections and visibility logic.
// ---------------------------------------------------------------------------

import { HIDDEN_STATUSES } from "./statusConfig";

export const SECTIONS = [
  {
    key: "visit_info",
    icon: "eye",
    alwaysVisible: false,
    visibleWhen: null,
    requiredFields: [],
  },
  {
    key: "appointment_info",
    icon: "calendar",
    alwaysVisible: false,
    visibleWhen: ["to_do", "rework", "visited", "on_going", "appointment"],
    requiredFields: [],
  },
  {
    key: "client_info",
    icon: "user",
    alwaysVisible: false,
    visibleWhen: null,
    requiredFields: ["client.company", "client.contact_name"],
  },
  {
    key: "building_owner",
    icon: "home",
    alwaysVisible: true,
    saveDisabledWhen: ["to_do", "na"],
    requiredFields: ["building_owner.owner_name"],
  },
  {
    key: "building_info",
    icon: "building",
    alwaysVisible: false,
    visibleWhen: null,
    requiredFields: ["building_info.amountLu"],
  },
  {
    key: "distribution_zone",
    icon: "zap",
    alwaysVisible: false,
    visibleWhen: null,
    requiredFields: ["distribution_zone.popArea"],
  },
  {
    key: "facade_street",
    icon: "eye",
    alwaysVisible: false,
    visibleWhen: null,
    requiredFields: [],
  },
  {
    key: "existing_telecom",
    icon: "wifi",
    alwaysVisible: false,
    visibleWhen: null,
    requiredFields: [],
  },
  {
    key: "execution_quantities",
    icon: "clipboard",
    alwaysVisible: false,
    visibleWhen: null,
    requiredFields: [],
  },
  {
    key: "legend",
    icon: "info",
    alwaysVisible: false,
    readOnly: true,
    visibleWhen: null,
    requiredFields: [],
  },
  {
    key: "photo_facade",
    icon: "camera",
    alwaysVisible: false,
    visibleWhen: null,
    requiredFields: [],
  },
  {
    key: "photo_letterbox",
    icon: "camera",
    alwaysVisible: true,
    saveDisabledWhen: ["to_do", "na"],
    requiredFields: [],
  },
  {
    key: "floorplan_canvas",
    icon: "pen",
    alwaysVisible: false,
    visibleWhen: null,
    requiredFields: [],
  },
  {
    key: "bordje_syndic",
    icon: "camera",
    alwaysVisible: true,
    saveDisabledWhen: ["to_do", "na"],
    requiredFields: [],
  },
  {
    key: "fire_department",
    icon: "shield",
    alwaysVisible: false,
    visibleWhen: null,
    requiredFields: [],
  },
  {
    key: "underground_intro",
    icon: "download",
    alwaysVisible: false,
    visibleWhen: null,
    requiredFields: [],
  },
  {
    key: "facade_distribution",
    icon: "zap",
    alwaysVisible: false,
    visibleWhen: null,
    requiredFields: [],
  },
  {
    key: "technical_room",
    icon: "settings",
    alwaysVisible: false,
    visibleWhen: null,
    requiredFields: [],
  },
  {
    key: "cable_trajectory",
    icon: "nav",
    alwaysVisible: false,
    visibleWhen: null,
    requiredFields: [],
  },
  {
    key: "photo_misc",
    icon: "camera",
    alwaysVisible: false,
    visibleWhen: null,
    requiredFields: [],
  },
  {
    key: "engineering_plans",
    icon: "file",
    alwaysVisible: false,
    visibleWhen: null,
    requiredFields: [],
  },
  {
    key: "statement_agreement",
    icon: "sig",
    alwaysVisible: false,
    visibleWhen: null,
    requiredFields: ["agreement.undersigned_name"],
  },
];

// ---------------------------------------------------------------------------
// getFieldValue(survey, dotPath) — resolve a dot-notation path on the survey
// ---------------------------------------------------------------------------
function getFieldValue(survey, path) {
  return path.split(".").reduce((obj, key) => obj?.[key], survey);
}

// ---------------------------------------------------------------------------
// getMissingSectionFields(survey, sectionKey) — returns list of missing required
// field paths for a given section.
// ---------------------------------------------------------------------------
export function getMissingSectionFields(survey, sectionKey) {
  const section = SECTIONS.find(s => s.key === sectionKey);
  if (!section || !section.requiredFields?.length) return [];
  return section.requiredFields.filter(path => {
    const val = getFieldValue(survey, path);
    return val === undefined || val === null || val === "" || val === 0;
  });
}

// ---------------------------------------------------------------------------
// getVisibleSections(status)
//
// Returns the subset of SECTIONS that should be rendered for a given status.
//
// Rules:
//   1. If the status is "inactive", nothing is visible (empty array).
//   2. Sections with `alwaysVisible: true` are always included (except for
//      the "inactive" status handled above).
//   3. Sections that define a `visibleWhen` array are included only when the
//      current status appears in that array.
//   4. Sections with `visibleWhen: null` and `alwaysVisible: false` are shown
//      for every status that is NOT in HIDDEN_STATUSES.
// ---------------------------------------------------------------------------
export function getVisibleSections(status) {
  if (status === "inactive") {
    return [];
  }

  const isHidden = HIDDEN_STATUSES.includes(status);

  return SECTIONS.filter((section) => {
    // Always‑visible sections are shown regardless of status.
    if (section.alwaysVisible) {
      return true;
    }

    // Sections gated to a specific list of statuses.
    if (Array.isArray(section.visibleWhen)) {
      return section.visibleWhen.includes(status);
    }

    // Generic sections (visibleWhen === null, alwaysVisible === false):
    // hidden when the status belongs to HIDDEN_STATUSES.
    return !isHidden;
  });
}
