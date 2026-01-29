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
    faqItems: [] as Array<{ question: string; answer: string }>,
    stiItems: [] as Array<{
      key: string
      name: string
      imageUrl?: string | null
      whatIs: string
      symptoms: string
      transmission: string
      consequences: string
      treatment: string
      prevention: string
    }>,
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
      faqItems: [],
      stiItems: [],
    })
    setModalOpen(true)
  }

  const openEdit = (section: any) => {
    setEditing(section)

    // Parse FAQ items if it's FAQ/ACCORDION type
    let faqItems: Array<{ question: string; answer: string }> = []
    if ((section.type === 'FAQ' || section.type === 'ACCORDION') && section.metadata) {
      try {
        const metadata = typeof section.metadata === 'string'
          ? JSON.parse(section.metadata)
          : section.metadata
        if (Array.isArray(metadata.items)) {
          faqItems = metadata.items
        } else if (Array.isArray(metadata)) {
          faqItems = metadata
        }
      } catch (e) {
        // ignore parsing errors
      }
    }

    setForm({
      title: section.title || '',
      content: section.content || '',
      order: section.order || 0,
      type: section.type || 'CONTENT',
      metadataJson: section.metadata ? JSON.stringify(section.metadata, null, 2) : '',
      faqItems,
    })
    setModalOpen(true)
  }

  const addFaqItem = () => {
    setForm({
      ...form,
      faqItems: [...form.faqItems, { question: '', answer: '' }],
    })
  }

  const updateFaqItem = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...form.faqItems]
    updated[index] = { ...updated[index], [field]: value }
    setForm({ ...form, faqItems: updated })
  }

  const removeFaqItem = (index: number) => {
    setForm({
      ...form,
      faqItems: form.faqItems.filter((_, i) => i !== index),
    })
  }

  const addStiItem = () => {
    setForm({
      ...form,
      stiItems: [...form.stiItems, {
        key: '',
        name: '',
        imageUrl: null,
        whatIs: '',
        symptoms: '',
        transmission: '',
        consequences: '',
        treatment: '',
        prevention: '',
      }],
    })
  }

  const updateStiItem = (index: number, field: string, value: string) => {
    const updated = [...form.stiItems]
    updated[index] = { ...updated[index], [field]: value }
    setForm({ ...form, stiItems: updated })
  }

  const removeStiItem = (index: number) => {
    setForm({
      ...form,
      stiItems: form.stiItems.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      let metadata: any = undefined

      // Handle FAQ/ACCORDION: convert faqItems to metadata
      if (form.type === 'FAQ' || form.type === 'ACCORDION') {
        if (form.faqItems.length > 0) {
          metadata = { items: form.faqItems.filter(item => item.question.trim() && item.answer.trim()) }
        } else if (form.metadataJson.trim()) {
          // Fallback to JSON if provided
          try {
            metadata = JSON.parse(form.metadataJson)
          } catch {
            alert('El JSON de metadata no es válido.')
            setSaving(false)
            return
          }
        }
      } else if (form.type === 'CARD_GRID') {
        if (form.stiItems.length > 0) {
          // Filter out incomplete items
          const validItems = form.stiItems.filter(item =>
            item.key.trim() && item.name.trim() && item.whatIs.trim()
          )
          if (validItems.length === 0) {
            alert('Añade al menos un elemento completo (key, name, whatIs son obligatorios).')
            setSaving(false)
            return
          }
          metadata = { items: validItems }
        } else if (form.metadataJson.trim()) {
          // Fallback to JSON if provided
          try {
            metadata = JSON.parse(form.metadataJson)
          } catch {
            alert('El JSON de metadata no es válido.')
            setSaving(false)
            return
          }
        } else {
          alert('Para CARD_GRID, añade elementos usando el editor o completa el JSON de metadata.')
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
        {sections.map((section) => {
          // Parse metadata for FAQ/ACCORDION sections
          let faqItems: Array<{ question: string; answer: string }> = []
          if ((section.type === 'FAQ' || section.type === 'ACCORDION') && section.metadata) {
            try {
              const metadata = typeof section.metadata === 'string'
                ? JSON.parse(section.metadata)
                : section.metadata
              if (Array.isArray(metadata.items)) {
                faqItems = metadata.items
              } else if (Array.isArray(metadata)) {
                faqItems = metadata
              }
            } catch (e) {
              // ignore parsing errors
            }
          }

          return (
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
                {/* Show FAQ items if available */}
                {faqItems.length > 0 ? (
                  <div className="mb-4 space-y-2">
                    {faqItems.map((item, idx) => (
                      <div key={idx} className="border-l-2 border-primary pl-3 py-1">
                        <p className="font-medium text-sm">{item.question}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                ) : section.content?.trim() ? (
                  <div
                    className="prose max-w-none text-muted-foreground mb-4"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mb-4 italic">
                    Sin contenido configurado
                  </p>
                )}
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
          )
        })}
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
                onChange={(e) => {
                  const newType = e.target.value
                  // Reset FAQ items if switching away from FAQ/ACCORDION
                  // Reset STI items if switching away from CARD_GRID
                  setForm({
                    ...form,
                    type: newType,
                    faqItems: (newType === 'FAQ' || newType === 'ACCORDION') ? form.faqItems : [],
                    stiItems: newType === 'CARD_GRID' ? form.stiItems : [],
                  })
                }}
                className={inputClass}
                disabled={!isAdmin}
              >
                <option value="CONTENT">CONTENT</option>
                <option value="CARD_GRID">CARD_GRID (ITS más comunes)</option>
                <option value="FAQ">FAQ (Preguntas frecuentes)</option>
                <option value="ACCORDION">ACCORDION</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Para “ITS más comunes” usa <strong>CARD_GRID</strong> y completa la metadata.
                <br />
                Para <strong>FAQ</strong> o <strong>ACCORDION</strong>, usa el editor de preguntas y respuestas.
              </p>
            </div>
            {/* FAQ/ACCORDION Editor */}
            {(form.type === 'FAQ' || form.type === 'ACCORDION') ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Preguntas y Respuestas</label>
                  {isAdmin && (
                    <Button type="button" variant="outline" size="sm" onClick={addFaqItem}>
                      <Plus className="h-3 w-3 mr-1" />
                      Añadir pregunta
                    </Button>
                  )}
                </div>
                <div className="space-y-3 border rounded-md p-4">
                  {form.faqItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No hay preguntas. Haz clic en "Añadir pregunta" para comenzar.
                    </p>
                  ) : (
                    form.faqItems.map((item, idx) => (
                      <div key={idx} className="border rounded-md p-3 bg-muted/30">
                        <div className="space-y-2">
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Pregunta</label>
                            <input
                              type="text"
                              value={item.question}
                              onChange={(e) => updateFaqItem(idx, 'question', e.target.value)}
                              className={inputClass}
                              placeholder="¿Cuál es tu pregunta?"
                              disabled={!isAdmin}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Respuesta</label>
                            <textarea
                              value={item.answer}
                              onChange={(e) => updateFaqItem(idx, 'answer', e.target.value)}
                              rows={3}
                              className={inputClass}
                              placeholder="Escribe la respuesta..."
                              disabled={!isAdmin}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Puedes usar HTML: &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;&lt;li&gt;, etc.
                            </p>
                          </div>
                          {isAdmin && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeFaqItem(idx)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Eliminar
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : form.type === 'CARD_GRID' ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">ITS (Elementos de la cuadrícula)</label>
                  {isAdmin && (
                    <Button type="button" variant="outline" size="sm" onClick={addStiItem}>
                      <Plus className="h-3 w-3 mr-1" />
                      Añadir ITS
                    </Button>
                  )}
                </div>
                <div className="space-y-3 border rounded-md p-4 max-h-[600px] overflow-y-auto">
                  {form.stiItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No hay elementos. Haz clic en "Añadir ITS" para comenzar.
                    </p>
                  ) : (
                    form.stiItems.map((item, idx) => (
                      <div key={idx} className="border rounded-md p-3 bg-muted/30">
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-xs font-medium text-muted-foreground">Key *</label>
                              <input
                                type="text"
                                value={item.key}
                                onChange={(e) => updateStiItem(idx, 'key', e.target.value)}
                                className={inputClass}
                                placeholder="clamidia"
                                disabled={!isAdmin}
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-muted-foreground">Nombre *</label>
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => updateStiItem(idx, 'name', e.target.value)}
                                className={inputClass}
                                placeholder="Clamidia"
                                disabled={!isAdmin}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">URL de imagen</label>
                            <input
                              type="text"
                              value={item.imageUrl || ''}
                              onChange={(e) => updateStiItem(idx, 'imageUrl', e.target.value)}
                              className={inputClass}
                              placeholder="/logo.png"
                              disabled={!isAdmin}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">¿Qué es? *</label>
                            <textarea
                              value={item.whatIs}
                              onChange={(e) => updateStiItem(idx, 'whatIs', e.target.value)}
                              rows={2}
                              className={inputClass}
                              placeholder="Descripción..."
                              disabled={!isAdmin}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Síntomas</label>
                            <textarea
                              value={item.symptoms}
                              onChange={(e) => updateStiItem(idx, 'symptoms', e.target.value)}
                              rows={2}
                              className={inputClass}
                              placeholder="Síntomas..."
                              disabled={!isAdmin}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Transmisión</label>
                            <textarea
                              value={item.transmission}
                              onChange={(e) => updateStiItem(idx, 'transmission', e.target.value)}
                              rows={2}
                              className={inputClass}
                              placeholder="Cómo se transmite..."
                              disabled={!isAdmin}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Consecuencias</label>
                            <textarea
                              value={item.consequences}
                              onChange={(e) => updateStiItem(idx, 'consequences', e.target.value)}
                              rows={2}
                              className={inputClass}
                              placeholder="Consecuencias..."
                              disabled={!isAdmin}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Tratamiento</label>
                            <textarea
                              value={item.treatment}
                              onChange={(e) => updateStiItem(idx, 'treatment', e.target.value)}
                              rows={2}
                              className={inputClass}
                              placeholder="Tratamiento..."
                              disabled={!isAdmin}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Prevención</label>
                            <textarea
                              value={item.prevention}
                              onChange={(e) => updateStiItem(idx, 'prevention', e.target.value)}
                              rows={2}
                              className={inputClass}
                              placeholder="Prevención..."
                              disabled={!isAdmin}
                            />
                          </div>
                          {isAdmin && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeStiItem(idx)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Eliminar
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  También puedes usar el campo JSON de metadata más abajo para edición avanzada.
                </p>
              </div>
            ) : (
              <>
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
                {form.type === 'CARD_GRID' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Metadata (JSON) - Opcional</label>
                    <textarea
                      value={form.metadataJson}
                      onChange={(e) => setForm({ ...form, metadataJson: e.target.value })}
                      rows={8}
                      className={inputClass}
                      placeholder={`Alternativa: puedes editar directamente el JSON aquí\n{\n  \"items\": [\n    {\n      \"key\": \"clamidia\",\n      \"name\": \"Clamidia\",\n      \"imageUrl\": \"/logo.png\",\n      \"whatIs\": \"...\",\n      \"symptoms\": \"...\",\n      \"transmission\": \"...\",\n      \"consequences\": \"...\",\n      \"treatment\": \"...\",\n      \"prevention\": \"...\"\n    }\n  ]\n}`}
                      disabled={!isAdmin}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Si prefieres editar directamente el JSON, puedes hacerlo aquí. Los cambios del editor visual tienen prioridad.
                    </p>
                  </div>
                )}
              </>
            )}
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

