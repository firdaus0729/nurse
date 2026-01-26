'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Edit, Heart } from 'lucide-react'

const inputClass =
  'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'

type CuidateCard = {
  key: string
  title: string
  briefDescription: string
  imageUrl?: string | null
  fullContent: string
}

export default function AdminCuidatePage() {
  const [cards, setCards] = useState<CuidateCard[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<CuidateCard>({
    key: '',
    title: '',
    briefDescription: '',
    imageUrl: '',
    fullContent: '',
  })

  const load = async () => {
    try {
      const res = await fetch('/api/admin/cuidate')
      if (res.ok) {
        const { cards: c } = await res.json()
        setCards(c || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openEdit = (index: number) => {
    const card = cards[index]
    setEditingIndex(index)
    setForm({
      key: card.key,
      title: card.title,
      briefDescription: card.briefDescription,
      imageUrl: card.imageUrl || '',
      fullContent: card.fullContent,
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const updatedCards = [...cards]
      if (editingIndex !== null) {
        updatedCards[editingIndex] = {
          ...form,
          imageUrl: form.imageUrl || null,
        }
      }

      const res = await fetch('/api/admin/cuidate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cards: updatedCards }),
      })

      if (!res.ok) throw new Error('Error')
      setModalOpen(false)
      load()
    } catch (err) {
      console.error(err)
      alert('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const moveCard = async (index: number, direction: 'up' | 'down') => {
    const newCards = [...cards]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= newCards.length) return

    ;[newCards[index], newCards[newIndex]] = [newCards[newIndex], newCards[index]]

    try {
      const res = await fetch('/api/admin/cuidate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cards: newCards }),
      })
      if (res.ok) load()
    } catch (err) {
      console.error(err)
      alert('Error al reordenar')
    }
  }

  if (loading) return <div>Cargando...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Cuídate (tarjetas)</h1>
      </div>

      <p className="text-muted-foreground mb-6">
        Edita textos e imagen (URL) de las tarjetas de la sección Cuídate. Las enfermeras pueden
        modificar el contenido completo de cada tarjeta.
      </p>

      <div className="space-y-4">
        {cards.map((card, index) => (
          <Card key={card.key}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{card.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveCard(index, 'up')}
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveCard(index, 'down')}
                    disabled={index === cards.length - 1}
                  >
                    ↓
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {card.imageUrl && (
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="w-full h-32 object-cover rounded mb-4"
                />
              )}
              <p className="text-sm text-muted-foreground mb-4">{card.briefDescription}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <span>Clave: {card.key}</span>
                <Link
                  href="/take-care"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Ver en web
                </Link>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(index)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {cards.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No hay tarjetas. Las tarjetas se crean desde el seed de la base de datos.
          </CardContent>
        </Card>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar tarjeta de Cuídate</DialogTitle>
            <DialogDescription>
              Textos e imagen (URL). Puedes usar HTML en el contenido completo si lo necesitas.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Título *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripción breve *</label>
              <textarea
                value={form.briefDescription}
                onChange={(e) => setForm({ ...form, briefDescription: e.target.value })}
                rows={3}
                className={inputClass}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Texto corto que aparece en la vista colapsada de la tarjeta.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Imagen (URL)</label>
              <input
                type="url"
                value={form.imageUrl || ''}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className={inputClass}
                placeholder="https://... o /cuídate/imagen.jpg"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enlaza una foto subida a Imgur, Google Drive (enlace público), etc.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contenido completo *</label>
              <textarea
                value={form.fullContent}
                onChange={(e) => setForm({ ...form, fullContent: e.target.value })}
                rows={15}
                className={inputClass}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Contenido HTML que aparece al expandir la tarjeta. Puedes usar HTML:
                &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;&lt;li&gt;, &lt;h4&gt;, &lt;h5&gt;, etc.
              </p>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? 'Guardando…' : 'Guardar'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
