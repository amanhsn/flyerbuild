// ---------------------------------------------------------------------------
// statusConfig.js — Wyre Surveyor Portal
// Display configuration for all 15 site‑survey statuses.
// ---------------------------------------------------------------------------

export const STATUSES = {
  inactive: {
    label: "Inactive",
    surveyorLabel: "Inactive",
    description: "This survey is not yet active",
    color: "var(--text-muted)",
    bg: "var(--bg-overlay)",
    border: "var(--border)",
    hex: "#64748b",
    category: "grey",
  },
  sv: {
    label: "Site Visit",
    surveyorLabel: "Site Visit",
    description: "Pending site visit",
    color: "var(--text-muted)",
    bg: "var(--bg-overlay)",
    border: "var(--border)",
    hex: "#64748b",
    category: "grey",
  },
  na: {
    label: "N/A",
    surveyorLabel: "Not Applicable",
    description: "This survey is not applicable",
    color: "var(--text-muted)",
    bg: "var(--bg-overlay)",
    border: "var(--border)",
    hex: "#64748b",
    category: "grey",
  },
  to_do: {
    label: "Not Started",
    surveyorLabel: "Not Started",
    description: "Assigned but not yet opened",
    color: "var(--text-secondary)",
    bg: "var(--bg-overlay)",
    border: "var(--border)",
    hex: "#64748b",
    category: "grey",
  },
  appointment: {
    label: "Appointment",
    surveyorLabel: "Appointment Set",
    description: "An appointment has been scheduled",
    color: "var(--blue)",
    bg: "var(--blue-glow)",
    border: "var(--blue)",
    hex: "#2563eb",
    category: "blue",
  },
  on_going: {
    label: "In Progress",
    surveyorLabel: "In Progress",
    description: "Survey has been started — continue filling sections",
    color: "var(--amber)",
    bg: "var(--amber-glow)",
    border: "var(--amber)",
    hex: "#d97706",
    category: "amber",
  },
  visited: {
    label: "Visited",
    surveyorLabel: "Submitted",
    description: "Survey submitted — awaiting validation",
    color: "var(--blue)",
    bg: "var(--blue-glow)",
    border: "var(--blue)",
    hex: "#2563eb",
    category: "blue",
  },
  rework: {
    label: "Rework Required",
    surveyorLabel: "Rework Required",
    description: "Validator sent back for corrections — check remarks",
    color: "var(--text-red)",
    bg: "var(--red-glow)",
    border: "var(--red)",
    hex: "#dc2626",
    category: "red",
  },
  validation_f49: {
    label: "In Validation",
    surveyorLabel: "In Validation",
    description: "Validator is actively reviewing this survey",
    color: "var(--purple)",
    bg: "var(--purple-glow)",
    border: "var(--purple)",
    hex: "#7c3aed",
    category: "purple",
  },
  validation_client: {
    label: "Client Validation",
    surveyorLabel: "In Validation",
    description: "Client is reviewing this survey",
    color: "var(--purple)",
    bg: "var(--purple-glow)",
    border: "var(--purple)",
    hex: "#7c3aed",
    category: "purple",
  },
  sent: {
    label: "Sent",
    surveyorLabel: "Approved",
    description: "Survey has been approved and sent",
    color: "var(--dark-green)",
    bg: "var(--dark-green-glow)",
    border: "var(--dark-green)",
    hex: "#1a6e3c",
    category: "dark-green",
  },
  completed: {
    label: "Approved",
    surveyorLabel: "Approved",
    description: "Fully validated and approved",
    color: "var(--dark-green)",
    bg: "var(--dark-green-glow)",
    border: "var(--dark-green)",
    hex: "#1a6e3c",
    category: "dark-green",
  },
  rejected: {
    label: "Rejected",
    surveyorLabel: "Rejected",
    description: "Survey has been rejected",
    color: "var(--text-red)",
    bg: "var(--red-glow)",
    border: "var(--red)",
    hex: "#dc2626",
    category: "red",
  },
  final_no_entry: {
    label: "Final No Entry",
    surveyorLabel: "No Entry",
    description: "Three or more failed entry attempts — escalated",
    color: "var(--text-red)",
    bg: "var(--red-glow)",
    border: "var(--red)",
    hex: "#dc2626",
    category: "red",
  },
  no_tsa_nd: {
    label: "No TSA ND",
    surveyorLabel: "On Hold",
    description: "Flagged or blocked for external reason",
    color: "var(--orange)",
    bg: "var(--orange-glow)",
    border: "var(--orange)",
    hex: "#ea580c",
    category: "orange",
  },
};

// ---------------------------------------------------------------------------
// Surveyor-facing status display mapping.
// Maps internal statuses to the 7 user-visible status categories.
// ---------------------------------------------------------------------------
export const SURVEYOR_STATUS_MAP = {
  not_started:    ["inactive", "sv", "na", "to_do"],
  in_progress:    ["on_going", "appointment"],
  submitted:      ["visited"],
  in_validation:  ["validation_f49", "validation_client"],
  rework:         ["rework"],
  approved:       ["completed", "sent"],
  on_hold:        ["no_tsa_nd", "final_no_entry", "rejected"],
};

// ---------------------------------------------------------------------------
// Filter groups used on the dashboard to bucket surveys by category.
// ---------------------------------------------------------------------------
export const STATUS_GROUPS = {
  active: ["on_going", "visited"],
  pending: ["to_do", "appointment"],
  review: ["rework", "validation_f49", "validation_client"],
  done: ["completed", "sent"],
  issues: ["rejected", "final_no_entry"],
};

// ---------------------------------------------------------------------------
// Statuses where most survey sections should be hidden from the UI.
// ---------------------------------------------------------------------------
export const HIDDEN_STATUSES = [
  "inactive",
  "sv",
  "na",
  "to_do",
  "appointment",
];

// ---------------------------------------------------------------------------
// Statuses where the global "Save" action is disabled.
// ---------------------------------------------------------------------------
export const SAVE_DISABLED_STATUSES = ["inactive", "sv", "na"];
