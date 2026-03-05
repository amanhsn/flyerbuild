import { NextResponse } from "next/server"

const VALID_PORTALS = ["surveyor", "validator", "admin", "subcontractor"]

export default function proxy(request) {
  const role = request.cookies.get("role")?.value
  const { pathname } = request.nextUrl

  // Allow public routes
  if (pathname === "/login" || pathname.startsWith("/_next") || pathname.startsWith("/assets") || pathname === "/favicon.ico") {
    return NextResponse.next()
  }

  // No role → redirect to login
  if (!role) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Root → redirect to portal
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${role}`, request.url))
  }

  // Portal mismatch → redirect to correct portal
  const portalSegment = pathname.split("/")[1]
  if (VALID_PORTALS.includes(portalSegment) && portalSegment !== role) {
    return NextResponse.redirect(new URL(`/${role}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|assets|favicon).*)"],
}
