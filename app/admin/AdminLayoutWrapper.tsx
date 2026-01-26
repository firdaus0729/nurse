'use client'

import { useSession } from 'next-auth/react'
import { AdminNav } from '@/components/AdminNav'

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  // Show loading while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Cargando...</div>
      </div>
    )
  }

  // If no session, children (login page) will be shown by RootLayoutContent
  if (!session) {
    return <>{children}</>
  }

  // Authenticated - show admin layout
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <AdminNav />
      <div className="container py-8">{children}</div>
    </div>
  )
}
