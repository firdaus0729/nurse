'use client'

import { usePathname } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { FloatingChatButton } from '@/components/FloatingChatButton'

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

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
