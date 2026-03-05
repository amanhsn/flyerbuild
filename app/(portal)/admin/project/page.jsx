"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminProjectPage() {
  const router = useRouter()
  useEffect(() => { router.replace("/admin/projects") }, [router])
  return null
}
