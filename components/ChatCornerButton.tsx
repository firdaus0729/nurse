'use client'

import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

export function ChatCornerButton() {
  return (
    <Link href="/chat" className="fixed bottom-6 right-6 z-50">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 hover:shadow-xl transition-all">
        <MessageCircle
          className="h-6 w-6"
          color="#ffffff"
          strokeWidth={2.5}
        />
        <span className="sr-only">Hablar con BE NURSE</span>
      </div>
    </Link>
  )
}

