'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { Button } from './ui/button'

export function FloatingChatButton() {
  return (
    <Link href="/chat">
      <Button
        size="lg"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Hablar con BE NURSE</span>
      </Button>
    </Link>
  )
}

