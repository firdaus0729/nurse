import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect admin routes, but allow access to login page
        if (req.nextUrl.pathname.startsWith('/admin')) {
          // Allow access to login page without authentication
          if (req.nextUrl.pathname === '/admin/login') {
            return true
          }
          // All other admin routes require authentication
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*'],
  // Exclude login page from middleware
  // The matcher will still catch it, but we handle it in the callback
}

