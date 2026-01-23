'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export type StiItem = {
  key: string
  name: string
  imageUrl?: string | null
  whatIs: string
  symptoms: string
  transmission: string
  consequences: string
  treatment: string
  prevention: string
}

export function StiCardGrid({ items }: { items: StiItem[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null)

  const safeItems = useMemo(() => items.filter(Boolean), [items])

  if (!safeItems.length) return null

  return (
    <div className="not-prose">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {safeItems.map((item) => {
          const isOpen = openKey === item.key
          return (
            <Card key={item.key} className="overflow-hidden">
              <div className="relative h-40 w-full bg-secondary">
                {/* Use next/image for performance, but fall back to logo if image missing */}
                <Image
                  src={item.imageUrl || '/logo.png'}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <button
                  type="button"
                  onClick={() => setOpenKey(isOpen ? null : item.key)}
                  className={cn(
                    'w-full flex items-center justify-between rounded-md border px-3 py-2 text-sm font-medium',
                    'hover:bg-accent hover:text-accent-foreground transition-colors'
                  )}
                  aria-expanded={isOpen}
                >
                  Ver información completa
                  <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
                </button>

                {isOpen && (
                  <div className="mt-4 space-y-4 text-sm text-muted-foreground">
                    <div>
                      <div className="font-semibold text-foreground mb-1">¿Qué es?</div>
                      <div>{item.whatIs}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground mb-1">Síntomas</div>
                      <div>{item.symptoms}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground mb-1">Transmisión</div>
                      <div>{item.transmission}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground mb-1">Consecuencias</div>
                      <div>{item.consequences}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground mb-1">Tratamiento / seguimiento</div>
                      <div>{item.treatment}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground mb-1">Mensaje preventivo</div>
                      <div>{item.prevention}</div>
                    </div>
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


