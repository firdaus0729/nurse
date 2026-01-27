'use client'

import { usePathname } from 'next/navigation'
import { AdminNav } from '@/components/AdminNav'

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === '/admin/login'

  if (isLogin) return <>{children}</>

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <AdminNav />
      <div className="container py-8">{children}</div>
    </div>
  )
}
