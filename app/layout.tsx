import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { FloatingChatButton } from "@/components/FloatingChatButton"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BE NURSE - Educación en Salud Sexual",
  description: "Plataforma educativa y de apoyo comunitario sobre salud sexual",
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
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
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <FloatingChatButton />
      </body>
    </html>
  )
}

