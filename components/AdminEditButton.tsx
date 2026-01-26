'use client'

import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'

interface AdminEditButtonProps {
  onClick: () => void
  className?: string
}

export function AdminEditButton({ onClick, className }: AdminEditButtonProps) {
  const { data: session } = useSession()
  const userRole = (session?.user as any)?.role
  const isAdmin = userRole === 'ADMIN'

  if (!isAdmin) return null

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={`flex items-center gap-2 ${className || ''}`}
    >
      <Edit className="h-4 w-4" />
      Editar
    </Button>
  )
}
