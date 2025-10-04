import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export const middleware = async (req) => {
  const { nextUrl } = req
  const pathname = nextUrl.pathname

  // Static and authless paths
  const publicPaths = new Set(["/", "/auth/signin", "/login", "/register"])
  const isPublicPath = publicPaths.has(pathname)

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const role = token?.role?.toString?.().trim().toLowerCase()

  // Redirect authenticated users away from home to their dashboards
  if (pathname === "/" && token) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    return NextResponse.redirect(new URL("/appBar", req.url))
  }

  // Redirect authenticated users away from login/register
  if ((pathname === "/auth/signin" || pathname === "/login" || pathname === "/register") && token) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    return NextResponse.redirect(new URL("/appBar", req.url))
  }

  // Protect admin dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/appBar", req.url))
    }
  }

  // Protect user area
  if (pathname.startsWith("/appBar") || pathname.startsWith("/app")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }
    if (role === "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  // If not logged in, only allow public paths
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/signin", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/((?!api|_next/static|_next/image|favicon.ico|assets|public).*)",
  ],
}