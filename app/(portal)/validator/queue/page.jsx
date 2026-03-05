"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { MOCK_SURVEYS } from "@/data/mockSurveys"
import { ValidatorQueue } from "@/portals/validator/ValidatorQueue"

export default function ValidatorQueuePage() {
  const router = useRouter()
  const [filter, setFilter] = useState("all")

  const surveys = MOCK_SURVEYS
  const queueSurveys = useMemo(
    () =>
      surveys.filter((s) =>
        ["validation_f49", "validation_client", "completed", "sent", "rework", "rejected"].includes(
          s.status
        )
      ),
    [surveys]
  )

  const handleSelectSurvey = (survey) => {
    router.push(`/validator/workspace/${survey.id}`)
  }

  return (
    <ValidatorQueue
      surveys={queueSurveys}
      filter={filter}
      setFilter={setFilter}
      onSelectSurvey={handleSelectSurvey}
    />
  )
}
