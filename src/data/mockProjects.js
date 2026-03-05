// ---------------------------------------------------------------------------
// mockProjects.js — Wyre Surveyor Portal
// Mock project data linking surveys into project containers.
// ---------------------------------------------------------------------------

export const PROJECT_STATUSES = {
  active: { label: "Active", color: "var(--primary)", bg: "var(--primary-glow)", border: "var(--primary-dim)" },
  completed: { label: "Completed", color: "var(--text-green)", bg: "var(--green-glow)", border: "var(--green-dim)" },
  archived: { label: "Archived", color: "var(--text-muted)", bg: "var(--bg-overlay)", border: "var(--border)" },
};

export const MOCK_PROJECTS = [
  {
    id: "proj-001",
    name: "Wervik FTTH Rollout",
    region: "West-Vlaanderen",
    municipality: "Wervik",
    status: "active",
    survey_ids: [1, 2, 3, 4, 5, 6],
    created_at: "2026-02-15",
    updated_at: "2026-03-01",
  },
  {
    id: "proj-002",
    name: "Menen Phase 2",
    region: "West-Vlaanderen",
    municipality: "Menen",
    status: "active",
    survey_ids: [7, 8, 9],
    created_at: "2026-02-20",
    updated_at: "2026-02-28",
  },
  {
    id: "proj-003",
    name: "Ieper Centrum",
    region: "West-Vlaanderen",
    municipality: "Ieper",
    status: "completed",
    survey_ids: [10, 11, 12],
    created_at: "2026-01-10",
    updated_at: "2026-02-25",
  },
];

export function getProjectById(id) {
  return MOCK_PROJECTS.find((p) => p.id === id) || null;
}

export function getProjectSurveys(projectId, surveys) {
  const project = getProjectById(projectId);
  if (!project) return [];
  return surveys.filter((s) => project.survey_ids.includes(s.id));
}
