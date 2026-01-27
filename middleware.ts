import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isAdminPath = pathname.startsWith('/admin')
  const isLoginPath = pathname.startsWith('/admin/login')

  if (!isAdminPath) {
    return NextResponse.next()
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isAdmin = token?.role === 'ADMIN'

  // Block access to all admin routes (except login) when no session exists
  if (!token) {
    if (isLoginPath) return NextResponse.next()
    const loginUrl = new URL('/admin/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated non-admins to the main page
  if (!isAdmin) {
    const homeUrl = new URL('/', req.url)
    return NextResponse.redirect(homeUrl)
  }

  // Keep logged-in admins away from the login page
  if (isLoginPath) {
    const adminUrl = new URL('/admin', req.url)
    return NextResponse.redirect(adminUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

