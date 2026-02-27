// ---------------------------------------------------------------------------
// mockUsers.js — Mock users per role for local development
// ---------------------------------------------------------------------------

export const MOCK_USERS = [
  {
    id: "usr-001",
    name: "Jonas Jacobs",
    email: "jonas.jacobs@fyberbuild.be",
    role: "surveyor",
    region: "West-Vlaanderen",
    avatar: null,
  },
  {
    id: "usr-002",
    name: "Elena Maes",
    email: "elena.maes@fyberbuild.be",
    role: "surveyor",
    region: "Oost-Vlaanderen",
    avatar: null,
  },
  {
    id: "usr-003",
    name: "Sofie Mertens",
    email: "sofie.mertens@wyre.be",
    role: "validator",
    region: null,
    avatar: null,
  },
  {
    id: "usr-004",
    name: "Thomas Willems",
    email: "thomas.willems@wyre.be",
    role: "validator",
    region: null,
    avatar: null,
  },
  {
    id: "usr-005",
    name: "Pieter Claeys",
    email: "pieter.claeys@wyre.be",
    role: "admin",
    region: null,
    avatar: null,
  },
  {
    id: "usr-006",
    name: "An Dewitte",
    email: "an.dewitte@wyre.be",
    role: "admin",
    region: null,
    avatar: null,
  },
  {
    id: "usr-007",
    name: "FiberCo BVBA",
    email: "ops@fiberco.be",
    role: "subcontractor",
    region: "West-Vlaanderen",
    avatar: null,
    company: "FiberCo BVBA",
  },
  {
    id: "usr-008",
    name: "TelNet BV",
    email: "dispatch@telnet.be",
    role: "subcontractor",
    region: "Oost-Vlaanderen",
    avatar: null,
    company: "TelNet BV",
  },
];

export function getUsersByRole(role) {
  return MOCK_USERS.filter(u => u.role === role);
}

export function getUserById(id) {
  return MOCK_USERS.find(u => u.id === id);
}

// Default user per role for local dev
export const DEFAULT_USERS = {
  surveyor: MOCK_USERS[0],
  validator: MOCK_USERS[2],
  admin: MOCK_USERS[4],
  subcontractor: MOCK_USERS[6],
};
