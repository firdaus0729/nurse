import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isAdminPagePath = pathname.startsWith('/admin')
  const isAdminApiPath = pathname.startsWith('/api/admin')
  const isAdminLoginPath = pathname.startsWith('/admin/login')

  if (!isAdminPagePath && !isAdminApiPath) {
    return NextResponse.next()
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isAdmin = token?.role === 'ADMIN'

  // API routes: return status codes (no redirects)
  if (isAdminApiPath) {
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Only admins can access this resource' },
        { status: 403 }
      )
    }
    return NextResponse.next()
  }

  // Admin pages: unauthenticated users must log in
  if (!token) {
    if (isAdminLoginPath) return NextResponse.next()
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  // Authenticated non-admins are redirected to the main page
  if (!isAdmin) {
    return NextResponse.redirect(new URL('/', req.url))
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

