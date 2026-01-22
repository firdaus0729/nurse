'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default function AdminCarouselPage() {
  const [slides, setSlides] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSlides()
  }, [])

  const loadSlides = async () => {
    try {
      const response = await fetch('/api/admin/carousel')
      if (response.ok) {
        const data = await response.json()
        setSlides(data.slides)
      }
    } catch (error) {
      console.error('Error loading slides:', error)
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
        <h1 className="text-3xl font-bold">Carrusel</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo slide
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map((slide) => (
          <Card key={slide.id}>
            <CardHeader>
              <CardTitle className="text-lg">{slide.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {slide.imageUrl && (
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="w-full h-32 object-cover rounded mb-4"
                />
              )}
              <p className="text-sm text-muted-foreground mb-4">
                {slide.subtitle}
              </p>
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    slide.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {slide.isActive ? 'Activo' : 'Inactivo'}
                </span>
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

      {slides.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No hay slides en el carrusel. Crea uno nuevo para comenzar.
          </CardContent>
        </Card>
      )}
    </div>
  )
}

