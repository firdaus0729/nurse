import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "@/components/SessionProvider"
import { RootLayoutContent } from "@/components/RootLayoutContent"

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
          <RootLayoutContent>{children}</RootLayoutContent>
        </SessionProvider>
      </body>
    </html>
  )
}

