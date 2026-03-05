"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { CreateSurvey } from "@/portals/admin/admin/CreateSurvey"

export default function AdminProjectCreateSurveyPage({ params }) {
  const { id } = use(params)
  const router = useRouter()
  return (
    <CreateSurvey
      projectId={id}
      onSubmit={() => router.push(`/admin/projects/${id}`)}
      onCancel={() => router.push(`/admin/projects/${id}`)}
    />
  )
}
