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

export default function AdminQuickAccessPage() {
  const [cards, setCards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    icon: '',
    link: '',
    order: 0,
    isActive: true,
    isCampaign: false,
    campaignEnd: '',
  })

  const load = async () => {
    try {
      const res = await fetch('/api/admin/quick-access')
      if (res.ok) {
        const { cards: c } = await res.json()
        setCards(c)
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
      description: '',
      icon: '',
      link: '',
      order: cards.length,
      isActive: true,
      isCampaign: false,
      campaignEnd: '',
    })
    setModalOpen(true)
  }

  const openEdit = (c: any) => {
    setEditing(c)
    setForm({
      title: c.title ?? '',
      description: c.description ?? '',
      icon: c.icon ?? '',
      link: c.link ?? '',
      order: c.order ?? 0,
      isActive: c.isActive ?? true,
      isCampaign: c.isCampaign ?? false,
      campaignEnd: c.campaignEnd ? c.campaignEnd.slice(0, 10) : '',
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const url = editing ? `/api/admin/quick-access/${editing.id}` : '/api/admin/quick-access'
      const method = editing ? 'PATCH' : 'POST'
      const body = {
        ...form,
        campaignEnd: form.campaignEnd ? new Date(form.campaignEnd).toISOString() : null,
      }
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
    if (!confirm('¿Eliminar esta tarjeta?')) return
    try {
      const res = await fetch(`/api/admin/quick-access/${id}`, { method: 'DELETE' })
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
        <h1 className="text-3xl font-bold">Accesos rápidos (inicio)</h1>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva tarjeta
        </Button>
      </div>

      <p className="text-muted-foreground mb-6">
        Edita textos y enlaces de las tarjetas de acceso rápido en la página de inicio.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle className="text-lg">{c.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {c.description && (
                <p className="text-sm text-muted-foreground mb-4">{c.description}</p>
              )}
              <p className="text-xs text-muted-foreground mb-4">Enlace: {c.link}</p>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    c.isActive ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {c.isActive ? 'Activo' : 'Inactivo'}
                </span>
                {c.isCampaign && (
                  <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                    Campaña
                  </span>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(c)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(c.id)}
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

      {cards.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No hay tarjetas. Crea una nueva para comenzar.
          </CardContent>
        </Card>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar tarjeta' : 'Nueva tarjeta'}</DialogTitle>
            <DialogDescription>
              Texto y enlace de la tarjeta de acceso rápido.
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
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Enlace *</label>
              <input
                type="text"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                className={inputClass}
                placeholder="/learn, /take-care, /realities, /chat..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Icono (nombre)</label>
              <input
                type="text"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className={inputClass}
                placeholder="BookOpen, Heart, MessageCircle..."
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
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="campaign"
                checked={form.isCampaign}
                onChange={(e) => setForm({ ...form, isCampaign: e.target.checked })}
                className="rounded border"
              />
              <label htmlFor="campaign" className="text-sm">
                Campaña
              </label>
            </div>
            {form.isCampaign && (
              <div>
                <label className="block text-sm font-medium mb-1">Fin de campaña</label>
                <input
                  type="date"
                  value={form.campaignEnd}
                  onChange={(e) => setForm({ ...form, campaignEnd: e.target.value })}
                  className={inputClass}
                />
              </div>
            )}
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
