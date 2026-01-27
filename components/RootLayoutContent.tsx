'use client'

import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { FloatingChatButton } from '@/components/FloatingChatButton'
import { LoginPage } from '@/components/LoginPage'

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  
  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Cargando...</div>
      </div>
    )
  }

  // If no session, show login page (without header/footer)
  if (!session) {
    return <LoginPage />
  }

  // If session exists, show main content with header/footer
  // Exclude admin routes from showing public navigation
  const isAdminRoute = pathname?.startsWith('/admin')
  
  if (isAdminRoute) {
    // Admin routes have their own layout
    return <>{children}</>
  }

  // Public routes with navigation
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <FloatingChatButton />
    </>
  )
}
