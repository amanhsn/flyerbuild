// ---------------------------------------------------------------------------
// roles.js — Role definitions and permission sets for the 4-role platform
// ---------------------------------------------------------------------------

export const ROLES = {
  surveyor: {
    label: "Surveyor",
    description: "Field surveyor — conducts site surveys, fills forms, uploads photos",
    permissions: [
      "survey.view_assigned",
      "survey.edit",
      "survey.submit",
      "visit.add",
      "visit.delete",
      "appointment.add",
      "appointment.delete",
      "photo.upload",
      "photo.delete",
      "agreement.sign",
    ],
    defaultRoute: "/surveyor",
  },
  validator: {
    label: "Validator",
    description: "Quality control — reviews completed surveys, approves or rejects",
    permissions: [
      "survey.view_all",
      "survey.validate",
      "survey.approve",
      "survey.reject",
      "validation.add_notes",
    ],
    defaultRoute: "/validator",
  },
  admin: {
    label: "PM / Admin",
    description: "Central operations — full visibility, workflow gates, engineering, disputes",
    permissions: [
      "survey.view_all",
      "survey.edit_all",
      "survey.validate",
      "survey.approve",
      "survey.reject",
      "workflow.manage",
      "pdf.generate",
      "pdf.send",
      "engineering.upload",
      "engineering.define_build_type",
      "subcontractor.assign",
      "subcontractor.dispute",
      "subcontractor.resume",
      "financials.manage",
      "admin.import",
      "admin.grouping",
      "admin.rbac",
    ],
    defaultRoute: "/admin",
  },
  subcontractor: {
    label: "Subcontractor",
    description: "Restricted execution — views assigned builds, uploads evidence, handles disputes",
    permissions: [
      "assignment.view_own",
      "assignment.accept",
      "assignment.request_reassign",
      "build.upload_photos",
      "build.fill_forms",
      "build.submit_phase",
      "meetstaat.upload",
      "dispute.view",
      "dispute.respond",
    ],
    defaultRoute: "/subcontractor",
  },
};

export const ROLE_KEYS = Object.keys(ROLES);

export function hasPermission(role, permission) {
  return ROLES[role]?.permissions.includes(permission) ?? false;
}
