'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Plus, Edit, Trash2 } from 'lucide-react'

const inputClass =
  'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'

export default function AdminCarouselPage() {
  const [slides, setSlides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    ctaText: '',
    ctaLink: '',
    order: 0,
    isActive: true,
  })

  const load = async () => {
    try {
      const res = await fetch('/api/admin/carousel')
      if (res.ok) {
        const { slides: s } = await res.json()
        setSlides(s)
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

  const openCreate = () => {
    setEditing(null)
    setForm({
      title: '',
      subtitle: '',
      imageUrl: '',
      ctaText: '',
      ctaLink: '',
      order: slides.length,
      isActive: true,
    })
    setModalOpen(true)
  }

  const openEdit = (s: any) => {
    setEditing(s)
    setForm({
      title: s.title ?? '',
      subtitle: s.subtitle ?? '',
      imageUrl: s.imageUrl ?? '',
      ctaText: s.ctaText ?? '',
      ctaLink: s.ctaLink ?? '',
      order: s.order ?? 0,
      isActive: s.isActive ?? true,
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const url = editing ? `/api/admin/carousel/${editing.id}` : '/api/admin/carousel'
      const method = editing ? 'PATCH' : 'POST'
      const body = editing ? { ...form } : { ...form }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este slide?')) return
    try {
      const res = await fetch(`/api/admin/carousel/${id}`, { method: 'DELETE' })
      if (res.ok) load()
      else alert('Error al eliminar')
    } catch (err) {
      console.error(err)
      alert('Error al eliminar')
    }
  }

  if (loading) return <div>Cargando...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Carrusel (inicio)</h1>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo slide
        </Button>
      </div>

      <p className="text-muted-foreground mb-6">
        Edita textos e imagen (URL) de los slides del inicio. Máx. 3 activos.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map((s) => (
          <Card key={s.id}>
            <CardHeader>
              <CardTitle className="text-lg">{s.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {s.imageUrl && (
                <img
                  src={s.imageUrl}
                  alt={s.title}
                  className="w-full h-32 object-cover rounded mb-4"
                />
              )}
              <p className="text-sm text-muted-foreground mb-4">{s.subtitle}</p>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    s.isActive ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s.isActive ? 'Activo' : 'Inactivo'}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(s)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(s.id)}
                    className="text-destructive hover:text-destructive"
                  >
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
            No hay slides. Crea uno nuevo para comenzar.
          </CardContent>
        </Card>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar slide' : 'Nuevo slide'}</DialogTitle>
            <DialogDescription>
              Texto e imagen (URL). CTA = botón del slide.
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
              <label className="block text-sm font-medium mb-1">Subtítulo</label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Imagen (URL) *</label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className={inputClass}
                placeholder="https://... o /slide1.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Texto del botón (CTA)</label>
              <input
                type="text"
                value={form.ctaText}
                onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                className={inputClass}
                placeholder="ej. Habla ahora"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Enlace del botón</label>
              <input
                type="text"
                value={form.ctaLink}
                onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                className={inputClass}
                placeholder="/chat, /realities, /take-care"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Orden</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: parseInt(e.target.value, 10) || 0 })}
                className={inputClass}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="rounded border"
              />
              <label htmlFor="active" className="text-sm">
                Activo
              </label>
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
