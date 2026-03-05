"use client"

import dynamic from "next/dynamic"

const GisMapView = dynamic(
  () => import("@/portals/admin/map/GisMapView").then((mod) => mod.GisMapView),
  { ssr: false }
)

export default function AdminMapPage() {
  return <GisMapView />
}
