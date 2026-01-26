'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { CuidateCardGrid, type CuidateItem } from '@/components/CuidateCardGrid'
import { AdminEditButton } from '@/components/AdminEditButton'
import { Button } from '@/components/ui/button'

type PageWithSections = {
  id: string
  sections: Array<{ id: string; title: string | null; type: string; metadata: unknown; content: string }>
} | null

export function EditableTakeCarePage() {
  const { data: session } = useSession()
  const userRole = (session?.user as any)?.role
  const isAdmin = userRole === 'ADMIN'

  const [page, setPage] = useState<PageWithSections>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPage()
  }, [])

  const loadPage = async () => {
    try {
      const res = await fetch('/api/admin/cuidate')
      if (res.ok) {
        const { section, cards } = await res.json()
        if (section) {
          setPage({
            id: section.id,
            sections: [
              {
                id: section.id,
                title: section.title,
                type: 'CARD_GRID',
                metadata: { items: cards || [] },
                content: '',
              },
            ],
          })
        }
      }
    } catch (error) {
      console.error('Error loading page:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="container py-8 max-w-6xl">Cargando...</div>
  }

  return (
    <div className="container py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Cuídate</h1>
          <p className="text-lg text-muted-foreground">
            Información y recursos para cuidarte, prevenir y tomar decisiones seguras sobre tu salud sexual.
          </p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => window.open('/admin/cuidate', '_blank')}
              className="flex items-center gap-2"
            >
              Editar tarjetas
            </Button>
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20 p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Modo administrador:</strong> Haz clic en "Editar tarjetas" para modificar el contenido de las tarjetas de Cuídate.
          </p>
        </div>
      )}

      {!page && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 p-6 text-center">
          <p className="text-amber-800 dark:text-amber-200 font-medium mb-2">
            No hemos podido cargar el contenido
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Comprueba tu conexión a internet y que la base de datos esté activa (por ejemplo, en Neon,
            reactiva el proyecto si está en pausa). Vuelve a intentar en unos momentos.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Volver al inicio
          </Link>
        </div>
      )}

      {page && page.sections.length > 0 && (
        <div>
          {page.sections.map((section) => {
            // If it's a CARD_GRID section, render with CuidateCardGrid
            if (section.type === 'CARD_GRID' && section.metadata) {
              const items = (section.metadata as any)?.items as CuidateItem[] | undefined

              return (
                <div key={section.id} className="mb-12">
                  {section.title && (
                    <h2 className="text-2xl font-semibold mb-8">{section.title}</h2>
                  )}
                  {items && items.length > 0 ? (
                    <CuidateCardGrid items={items} />
                  ) : (
                    <p className="text-muted-foreground">No content available</p>
                  )}
                </div>
              )
            }

            // Regular text sections
            return (
              <div key={section.id} className="mb-12">
                {section.title && (
                  <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                )}
                <div
                  className="prose max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
