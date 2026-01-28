'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Edit, Trash2 } from 'lucide-react'

const inputClass =
  'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'

export default function AdminLearnPage() {
  const { data: session } = useSession()
  const userRole = (session?.user as any)?.role
  const isAdmin = userRole === 'ADMIN'

  const [sections, setSections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    content: '',
    order: 0,
    type: 'CONTENT',
    metadataJson: '',
  })

  useEffect(() => {
    loadSections()
  }, [])

  const loadSections = async () => {
    try {
      const res = await fetch('/api/admin/pages/learn/sections')
      if (res.ok) {
        const data = await res.json()
        setSections(data.sections || [])
      }
    } catch (error) {
      console.error('Error loading sections:', error)
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setEditing(null)
    setForm({
      title: '',
      content: '',
      order: sections.length,
      type: 'CONTENT',
      metadataJson: '',
    })
    setModalOpen(true)
  }

  const openEdit = (section: any) => {
    setEditing(section)
    setForm({
      title: section.title || '',
      content: section.content || '',
      order: section.order || 0,
      type: section.type || 'CONTENT',
      metadataJson: section.metadata ? JSON.stringify(section.metadata, null, 2) : '',
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      let metadata: any = undefined
      if (form.type === 'CARD_GRID') {
        if (!form.metadataJson.trim()) {
          alert('Para CARD_GRID, completa el JSON de metadata.')
          setSaving(false)
          return
        }
        try {
          metadata = JSON.parse(form.metadataJson)
        } catch {
          alert('El JSON de metadata no es válido.')
          setSaving(false)
          return
        }
      } else if (form.metadataJson.trim()) {
        // allow metadata for other types if provided
        try {
          metadata = JSON.parse(form.metadataJson)
        } catch {
          alert('El JSON de metadata no es válido.')
          setSaving(false)
          return
        }
      }

      const url = editing
        ? `/api/admin/pages/learn/sections/${editing.id}`
        : '/api/admin/pages/learn/sections'
      const method = editing ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          content: form.content,
          order: form.order,
          type: form.type,
          metadata,
        }),
      })
      if (!res.ok) throw new Error('Error al guardar')
      setModalOpen(false)
      loadSections()
    } catch (err) {
      console.error(err)
      alert('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta sección?')) return
    try {
      const res = await fetch(`/api/admin/pages/learn/sections/${id}`, { method: 'DELETE' })
      if (res.ok) loadSections()
      else alert('Error al eliminar')
    } catch (err) {
      console.error(err)
      alert('Error al eliminar')
    }
  }

  if (loading) return <div className="container py-8">Cargando...</div>

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Editar Infórmate</h1>

      <div className="flex items-center justify-between mb-8">
        <p className="text-muted-foreground">
          {isAdmin
            ? 'Edita las secciones de la página \"Infórmate\".'
            : 'Vista de secciones. Solo los administradores pueden editar.'}
        </p>
        {isAdmin && (
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva sección
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle>
                {section.title || 'Sin título'}{' '}
                <span className="text-xs font-normal text-muted-foreground">
                  ({section.type || 'CONTENT'})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose max-w-none text-muted-foreground mb-4"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
              {isAdmin && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(section)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(section.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {sections.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No hay secciones. Crea una nueva para comenzar.
          </CardContent>
        </Card>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar sección' : 'Nueva sección'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Título</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputClass}
                disabled={!isAdmin}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className={inputClass}
                disabled={!isAdmin}
              >
                <option value="CONTENT">CONTENT</option>
                <option value="CARD_GRID">CARD_GRID (ITS más comunes)</option>
                <option value="FAQ">FAQ</option>
                <option value="ACCORDION">ACCORDION</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Para “ITS más comunes” usa <strong>CARD_GRID</strong> y completa la metadata.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contenido *</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={12}
                className={inputClass}
                required={form.type === 'CONTENT'}
                disabled={!isAdmin}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Puedes usar HTML: &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;&lt;li&gt;, &lt;h4&gt;, etc.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Metadata (JSON)</label>
              <textarea
                value={form.metadataJson}
                onChange={(e) => setForm({ ...form, metadataJson: e.target.value })}
                rows={12}
                className={inputClass}
                placeholder={`Ejemplo para CARD_GRID:\n{\n  \"items\": [\n    {\n      \"key\": \"clamidia\",\n      \"name\": \"Clamidia\",\n      \"imageUrl\": \"/logo.png\",\n      \"whatIs\": \"...\",\n      \"symptoms\": \"...\",\n      \"transmission\": \"...\",\n      \"consequences\": \"...\",\n      \"treatment\": \"...\",\n      \"prevention\": \"...\"\n    }\n  ]\n}`}
                disabled={!isAdmin}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Para CARD_GRID necesitas un objeto con <code>items</code> (array) y cada item debe tener:
                <code> key, name, whatIs, symptoms, transmission, consequences, treatment, prevention</code>.
                <br />
                <code>imageUrl</code> es opcional.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Orden</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: parseInt(e.target.value, 10) || 0 })}
                className={inputClass}
                disabled={!isAdmin}
              />
            </div>
            {isAdmin && (
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Guardando…' : 'Guardar'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Cancelar
                </Button>
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

