'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import {
  LayoutDashboard,
  MessageCircle,
  Image as ImageIcon,
  Grid3x3,
  FileText,
  LogOut,
} from 'lucide-react'

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/chat', label: 'Chat', icon: MessageCircle },
  { href: '/admin/carousel', label: 'Carrusel', icon: ImageIcon },
  { href: '/admin/quick-access', label: 'Accesos rápidos', icon: Grid3x3 },
  { href: '/admin/content', label: 'Contenido', icon: FileText },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/admin" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Image
              src="/logo.png"
              alt="BE NURSE Logo"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <span className="text-xl font-bold text-primary">BE NURSE Admin</span>
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            {adminNavItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Salir
        </Button>
      </div>
    </nav>
  )
}

