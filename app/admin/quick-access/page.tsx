'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default function AdminQuickAccessPage() {
  const [cards, setCards] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCards()
  }, [])

  const loadCards = async () => {
    try {
      const response = await fetch('/api/admin/quick-access')
      if (response.ok) {
        const data = await response.json()
        setCards(data.cards)
      }
    } catch (error) {
      console.error('Error loading cards:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div>Cargando...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Accesos rápidos</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva tarjeta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Card key={card.id}>
            <CardHeader>
              <CardTitle className="text-lg">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {card.description && (
                <p className="text-sm text-muted-foreground mb-4">
                  {card.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground mb-4">
                Enlace: {card.link}
              </p>
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    card.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {card.isActive ? 'Activo' : 'Inactivo'}
                </span>
                {card.isCampaign && (
                  <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                    Campaña
                  </span>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {cards.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No hay tarjetas de acceso rápido. Crea una nueva para comenzar.
          </CardContent>
        </Card>
      )}
    </div>
  )
}

