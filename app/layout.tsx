import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "@/components/SessionProvider"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { FloatingChatButton } from "@/components/FloatingChatButton"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BE NURSE - Educación en Salud Sexual",
  description: "Plataforma educativa y de apoyo comunitario sobre salud sexual",
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SessionProvider>
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <FloatingChatButton />
        </SessionProvider>
      </body>
    </html>
  )
}

