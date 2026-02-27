// ---------------------------------------------------------------------------
// workflowStates.js — Full 8-phase address lifecycle
// ---------------------------------------------------------------------------

export const WORKFLOW_PHASES = [
  {
    phase: 1,
    key: "survey",
    label: "Site Survey",
    description: "Surveyor visits the address and completes the survey form",
    statuses: ["to_do", "appointment", "on_going", "visited", "rework"],
    owner: "surveyor",
  },
  {
    phase: 2,
    key: "validation_internal",
    label: "Internal Validation (F49)",
    description: "Validator reviews the completed survey for quality",
    statuses: ["validation_f49"],
    owner: "validator",
  },
  {
    phase: 3,
    key: "validation_client",
    label: "Client Validation",
    description: "Client reviews and approves the survey / PDF",
    statuses: ["validation_client", "sent"],
    owner: "admin",
  },
  {
    phase: 4,
    key: "syndic_approval",
    label: "Syndic / Owner Approval",
    description: "Owner or syndic signs off on the work plan",
    statuses: ["completed"],
    owner: "admin",
    gates: ["client_approved", "pdf_generated"],
  },
  {
    phase: 5,
    key: "engineering",
    label: "Engineering & Planning",
    description: "PM uploads splicing plans, intro files, defines build type",
    statuses: [],
    owner: "admin",
    gates: ["syndic_approved", "engineering_inputs_present"],
  },
  {
    phase: 6,
    key: "build_execution",
    label: "Build Execution",
    description: "Subcontractor performs 3-phase build (pre/during/post)",
    statuses: [],
    owner: "subcontractor",
    gates: ["engineering_complete", "subcontractor_assigned"],
  },
  {
    phase: 7,
    key: "build_review",
    label: "Build Review & Dispute",
    description: "PM reviews build, may raise disputes",
    statuses: [],
    owner: "admin",
  },
  {
    phase: 8,
    key: "closure",
    label: "Meetstaat & Closure",
    description: "Subcontractor returns meetstaat, PM reconciles financials",
    statuses: [],
    owner: "admin",
  },
];

// Maps every survey status to its workflow phase key
export const STATUS_TO_PHASE = {};
WORKFLOW_PHASES.forEach(p => {
  p.statuses.forEach(s => { STATUS_TO_PHASE[s] = p.key; });
});

// Terminal / special statuses
export const TERMINAL_STATUSES = ["final_no_entry", "no_tsa_nd", "rejected", "inactive", "sv", "na"];
