"use client"

import { useRouter } from "next/navigation"
import { Dashboard } from "@/components/dashboard/Dashboard"

export default function SurveyorDashboardPage() {
  const router = useRouter()

  const handleSelectSurvey = (survey) => {
    router.push(`/surveyor/survey/${survey.id}`)
  }

  return <Dashboard onSelectSurvey={handleSelectSurvey} />
}
