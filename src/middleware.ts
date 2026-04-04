import { NextResponse } from "next/server"
import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware() {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized({ token }) {
        // If no NEXTAUTH_SECRET configured, allow access (demo mode)
        if (!process.env.NEXTAUTH_SECRET) return true
        return !!token
      },
    },
    pages: {
      signIn: "/login",
    },
  }
)

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*"],
}
