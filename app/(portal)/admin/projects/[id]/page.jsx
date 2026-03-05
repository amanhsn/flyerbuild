"use client"

import { use } from "react"
import { ProjectDetail } from "@/portals/admin/projects/ProjectDetail"

export default function AdminProjectDetailPage({ params }) {
  const { id } = use(params)
  return <ProjectDetail projectId={id} />
}
