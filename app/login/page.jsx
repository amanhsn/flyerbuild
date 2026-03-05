"use client"

import { useRouter } from "next/navigation"
import { Icon } from "@/icons/Icon"

const ROLES = [
  { id: "surveyor", label: "Surveyor", icon: "map", description: "Field surveys & site assessments" },
  { id: "validator", label: "Validator", icon: "check", description: "Review & validate surveys" },
  { id: "admin", label: "Admin", icon: "shield", description: "Manage projects, users & workflows" },
  { id: "subcontractor", label: "Subcontractor", icon: "settings", description: "Build assignments & execution" },
]

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = (role) => {
    document.cookie = `role=${role};path=/;max-age=${60 * 60 * 24 * 365}`
    router.push(`/${role}`)
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mx-auto mb-4">
            <Icon n="layers" size={24} color="#fff" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-text-primary tracking-wide uppercase">
            Fyberbuild
          </h1>
          <p className="font-mono text-xs text-text-muted uppercase tracking-widest mt-1">
            Surveyor Portal
          </p>
        </div>

        <div className="space-y-3">
          {ROLES.map(({ id, label, icon, description }) => (
            <button
              key={id}
              onClick={() => handleLogin(id)}
              className="w-full flex items-center gap-4 p-4 bg-bg-raised border border-border rounded-xl hover:border-primary hover:bg-primary-glow transition-all cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-bg-elevated flex items-center justify-center shrink-0">
                <Icon n={icon} size={20} color="var(--text-secondary)" />
              </div>
              <div>
                <div className="font-display font-bold text-sm text-text-primary">{label}</div>
                <div className="font-mono text-xs text-text-muted mt-0.5">{description}</div>
              </div>
            </button>
          ))}
        </div>

        <p className="text-center font-mono text-[10px] text-text-muted mt-6 uppercase tracking-widest">
          Development Mode — Select a role to continue
        </p>
      </div>
    </div>
  )
}
