// ---------------------------------------------------------------------------
// statusConfig.js — Wyre Surveyor Portal
// Display configuration for all 15 site‑survey statuses.
// ---------------------------------------------------------------------------

export const STATUSES = {
  inactive: {
    label: "Inactive",
    color: "var(--text-muted)",
    bg: "var(--bg-overlay)",
    border: "var(--border)",
    hex: "#64748b",
  },
  sv: {
    label: "Site Visit",
    color: "var(--text-muted)",
    bg: "var(--bg-overlay)",
    border: "var(--border)",
    hex: "#64748b",
  },
  na: {
    label: "N/A",
    color: "var(--text-muted)",
    bg: "var(--bg-overlay)",
    border: "var(--border)",
    hex: "#64748b",
  },
  to_do: {
    label: "To Do",
    color: "var(--text-secondary)",
    bg: "var(--bg-overlay)",
    border: "var(--border)",
    hex: "#64748b",
  },
  appointment: {
    label: "Appointment",
    color: "var(--blue)",
    bg: "var(--blue-glow)",
    border: "var(--blue)",
    hex: "#2563eb",
  },
  on_going: {
    label: "On Going",
    color: "var(--primary)",
    bg: "var(--primary-glow)",
    border: "var(--primary)",
    hex: "#c0392b",
  },
  visited: {
    label: "Visited",
    color: "var(--text-green)",
    bg: "var(--green-glow)",
    border: "var(--green-dim)",
    hex: "#059669",
  },
  rework: {
    label: "Rework",
    color: "var(--text-red)",
    bg: "var(--red-glow)",
    border: "var(--red-dim)",
    hex: "#dc2626",
  },
  validation_f49: {
    label: "Validation F49",
    color: "var(--text-primary-accent)",
    bg: "var(--primary-glow)",
    border: "var(--primary-dim)",
    hex: "#c0392b",
  },
  validation_client: {
    label: "Client Validation",
    color: "var(--text-primary-accent)",
    bg: "var(--primary-glow)",
    border: "var(--primary-dim)",
    hex: "#c0392b",
  },
  sent: {
    label: "Sent",
    color: "var(--text-green)",
    bg: "var(--green-glow)",
    border: "var(--green-dim)",
    hex: "#059669",
  },
  completed: {
    label: "Completed",
    color: "var(--text-green)",
    bg: "var(--green-glow)",
    border: "var(--green-dim)",
    hex: "#059669",
  },
  rejected: {
    label: "Rejected",
    color: "var(--text-red)",
    bg: "var(--red-glow)",
    border: "var(--red-dim)",
    hex: "#dc2626",
  },
  final_no_entry: {
    label: "Final No Entry",
    color: "var(--text-red)",
    bg: "var(--red-glow)",
    border: "var(--red-dim)",
    hex: "#dc2626",
  },
  no_tsa_nd: {
    label: "No TSA ND",
    color: "var(--text-muted)",
    bg: "var(--bg-overlay)",
    border: "var(--border)",
    hex: "#64748b",
  },
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
