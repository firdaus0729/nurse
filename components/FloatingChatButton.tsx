'use client'

import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { Button } from './ui/button'

export function FloatingChatButton() {
  return (
    <Link href="/chat">
      <Button
        size="lg"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center h-14 w-14 rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 hover:shadow-xl transition-all"
      >
        <MessageCircle className="h-7 w-7 text-white" />
        <span className="sr-only">Hablar con BE NURSE</span>
      </Button>
    </Link>
  )
}

