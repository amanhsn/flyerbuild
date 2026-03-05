export function getClientRole() {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(/(?:^|;\s*)role=([^;]*)/)
  return match ? match[1] : null
}

export function setClientRole(role) {
  document.cookie = `role=${role};path=/;max-age=${60 * 60 * 24 * 365}`
}

export function clearClientRole() {
  document.cookie = "role=;path=/;max-age=0"
}

export const VALID_ROLES = ["surveyor", "validator", "admin", "subcontractor"]
