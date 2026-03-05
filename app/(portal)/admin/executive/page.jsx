"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ExecutiveDashboard } from "@/portals/admin/dashboards/ExecutiveDashboard"
import { MOCK_SURVEYS } from "@/data/mockSurveys"

export default function AdminExecutivePage() {
  const router = useRouter()
  const [surveys] = useState(MOCK_SURVEYS)

  return (
    <ExecutiveDashboard
      surveys={surveys}
      onCreateSurvey={() => router.push("/admin/create")}
    />
  )
}
