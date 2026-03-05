"use client"

import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"

const MapScreen = dynamic(
  () => import("@/components/screens/MapScreen").then((mod) => mod.MapScreen),
  { ssr: false }
)

export default function SurveyorMapPage() {
  const router = useRouter()

  const handleSelectSurvey = (survey) => {
    router.push(`/surveyor/survey/${survey.id}`)
  }

  return <MapScreen onSelectSurvey={handleSelectSurvey} />
}
