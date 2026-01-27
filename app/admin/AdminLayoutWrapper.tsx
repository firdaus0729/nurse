'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AdminNav } from '@/components/AdminNav'

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  const userRole = (session?.user as any)?.role
  const isAdmin = userRole === 'ADMIN'

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.replace('/admin/login')
      return
    }
    if (!isAdmin) {
      router.replace('/')
    }
  }, [status, session, isAdmin, router])

  // Show loading while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Cargando...</div>
      </div>
    )
  }

  // If redirecting away, avoid flashing admin UI
  if (!session || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Cargando...</div>
      </div>
    )
  }

  // Authenticated - show admin layout
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <AdminNav />
      <div className="container py-8">{children}</div>
    </div>
  )
}
