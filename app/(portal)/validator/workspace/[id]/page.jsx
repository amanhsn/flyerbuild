"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { MOCK_SURVEYS } from "@/data/mockSurveys"
import { ValidationWorkspace } from "@/portals/validator/ValidationWorkspace"

export default function ValidatorWorkspacePage({ params }) {
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
    <ValidationWorkspace
      survey={survey}
      onBack={() => router.push("/validator/queue")}
    />
  )
}
