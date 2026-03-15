// ---------------------------------------------------------------------------
// constructionStatuses.js — Subcontractor construction status options
// These feed into the admin dashboard and approval flow tracker.
// ---------------------------------------------------------------------------

export const CONSTRUCTION_STATUSES = {
  start_construction: {
    label: "Start Construction",
    color: "var(--blue)",
    bg: "var(--blue-glow)",
    border: "var(--blue)",
  },
  vc_done: {
    label: "VC Done",
    color: "var(--amber)",
    bg: "var(--amber-glow)",
    border: "var(--amber)",
  },
  intro_done: {
    label: "INTRO Done",
    color: "var(--dark-green)",
    bg: "var(--dark-green-glow)",
    border: "var(--dark-green)",
  },
  dispute: {
    label: "Dispute / On Hold",
    color: "var(--text-red)",
    bg: "var(--red-glow)",
    border: "var(--red)",
  },
};

export const CONSTRUCTION_STATUS_KEYS = Object.keys(CONSTRUCTION_STATUSES);
