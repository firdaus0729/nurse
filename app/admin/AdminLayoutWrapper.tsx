'use client'

import { usePathname } from 'next/navigation'
import { AdminNav } from '@/components/AdminNav'

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  // If on login page, render without nav (authentication handled by middleware)
  if (isLoginPage) {
    return <>{children}</>
  }

  // For all other admin pages, show full layout
  // Authentication is handled by middleware and individual pages
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <AdminNav />
      <div className="container py-8">{children}</div>
    </div>
  )
}
