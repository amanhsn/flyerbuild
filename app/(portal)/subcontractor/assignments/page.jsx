"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SubcoAssignmentList } from "@/portals/subcontractor/SubcoAssignmentList"
import { MOCK_ASSIGNMENTS } from "@/data/mockAssignments"

export default function SubcoAssignmentsPage() {
  const router = useRouter()
  const [filter, setFilter] = useState("all")

  return (
    <SubcoAssignmentList
      assignments={MOCK_ASSIGNMENTS}
      filter={filter}
      setFilter={setFilter}
      onSelect={(assignment) => router.push(`/subcontractor/execution/${assignment.id}`)}
    />
  )
}
