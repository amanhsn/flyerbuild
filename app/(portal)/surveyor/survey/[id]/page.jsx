"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { SurveyView } from "@/components/survey/SurveyView"
import { MOCK_SURVEYS } from "@/data/mockSurveys"

export default function SurveyPage({ params }) {
  const { id } = use(params)
  const router = useRouter()

  const survey = MOCK_SURVEYS.find((s) => String(s.id) === id)

  if (!survey) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-muted font-mono text-sm">
        Survey not found
      </div>
    )
  }

  return (
    <SurveyView
      initialSurvey={survey}
      onBack={() => router.push("/surveyor/dashboard")}
    />
  )
}
