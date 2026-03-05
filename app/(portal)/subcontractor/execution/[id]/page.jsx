"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { SubcoExecutionHub } from "@/portals/subcontractor/SubcoExecutionHub"
import { MOCK_ASSIGNMENTS } from "@/data/mockAssignments"

export default function SubcoExecutionPage({ params }) {
  const { id } = use(params)
  const router = useRouter()

  const assignment = MOCK_ASSIGNMENTS.find((a) => String(a.id) === id)

  if (!assignment) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-muted font-mono text-sm">
        Assignment not found
      </div>
    )
  }

  return (
    <SubcoExecutionHub
      assignment={assignment}
      onBack={() => router.push("/subcontractor/assignments")}
    />
  )
}
