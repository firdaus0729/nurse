import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isAdminPagePath = pathname.startsWith('/admin')
  const isAdminApiPath = pathname.startsWith('/api/admin')
  const isAdminLoginPath = pathname.startsWith('/admin/login')

  if (!isAdminPagePath && !isAdminApiPath) {
    return NextResponse.next()
  }

  // NextAuth uses different cookie names depending on environment
  const sessionCookie =
    req.cookies.get('next-auth.session-token') ??
    req.cookies.get('__Secure-next-auth.session-token')
  const hasSession = !!sessionCookie

  // API routes: return status codes (no redirects)
  if (isAdminApiPath) {
    if (!hasSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.next()
  }

  // Admin pages: unauthenticated users must log in
  if (!hasSession) {
    if (isAdminLoginPath) return NextResponse.next()
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  // Logged-in admins should not see the login screen again
  if (isAdminLoginPath) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}

