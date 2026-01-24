'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export type CuidateItem = {
  key: string
  title: string
  briefDescription: string
  imageUrl?: string | null
  fullContent: string
}

export function CuidateCardGrid({ items }: { items: CuidateItem[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null)

  const safeItems = useMemo(() => items.filter(Boolean), [items])

  if (!safeItems.length) return null

  return (
    <div className="not-prose">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeItems.map((item) => {
          const isOpen = openKey === item.key
          return (
            <Card key={item.key} className="overflow-hidden">
              <div className="relative h-48 w-full bg-secondary/50">
                {/* Image with fallback */}
                <Image
                  src={item.imageUrl || '/logo.png'}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/5" />
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">
                  {item.briefDescription}
                </p>
                <button
                  type="button"
                  onClick={() => setOpenKey(isOpen ? null : item.key)}
                  className={cn(
                    'w-full flex items-center justify-between rounded-md border border-primary/30 px-3 py-2 text-sm font-medium',
                    'hover:bg-primary/10 hover:border-primary transition-colors'
                  )}
                  aria-expanded={isOpen}
                >
                  {isOpen ? 'Ver menos' : 'Ver más'}
                  <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
                </button>

                {isOpen && (
                  <div className="mt-4 pt-4 border-t space-y-3 text-sm text-muted-foreground prose prose-sm max-w-none">
                    <div
                      dangerouslySetInnerHTML={{ __html: item.fullContent }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
