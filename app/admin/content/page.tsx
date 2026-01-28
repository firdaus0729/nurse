'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ARTICLE_TYPE_LABELS } from '@/lib/utils'
import { FileText, Plus, Edit, Trash2 } from 'lucide-react'
import { ImageUpload } from '@/components/ImageUpload'

const articleTypes = [
  { value: 'HISTORIA_REAL', label: 'Historia real' },
  { value: 'ARTICULO', label: 'Artículo' },
  { value: 'NOTICIA', label: 'Noticia' },
  { value: 'PREGUNTA_INCOMODA', label: 'Pregunta incómoda' },
]

const inputClass =
  'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'

export default function AdminContentPage() {
  const { data: session } = useSession()
  const userRole = (session?.user as any)?.role
  const isAdmin = userRole === 'ADMIN'
  const isNurse = userRole === 'NURSE'
  
  const [articles, setArticles] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    articleType: 'ARTICULO',
    categoryId: '',
    isPublished: false,
  })

  const load = async () => {
    try {
      const [aRes, cRes] = await Promise.all([
        fetch('/api/admin/articles'),
        fetch('/api/admin/categories'),
      ])
      if (aRes.ok) {
        const { articles: a } = await aRes.json()
        setArticles(a)
      }
      if (cRes.ok) {
        const { categories: c } = await cRes.json()
        setCategories(c)
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
      slug: '',
      excerpt: '',
      content: '',
      imageUrl: '',
      articleType: 'ARTICULO',
      categoryId: categories[0]?.id ?? '',
      isPublished: false,
    })
    setModalOpen(true)
  }

  const openEdit = (a: any) => {
    setEditing(a)
    setForm({
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt ?? '',
      content: a.content,
      imageUrl: a.imageUrl ?? '',
      articleType: a.articleType ?? 'ARTICULO',
      categoryId: a.categoryId ?? '',
      isPublished: a.isPublished ?? false,
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const body = {
        ...form,
        categoryId: form.categoryId || null,
      }
      const url = editing ? `/api/admin/articles/${editing.id}` : '/api/admin/articles'
      const method = editing ? 'PATCH' : 'POST'
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
    if (!confirm('¿Eliminar este contenido?')) return
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' })
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
        <h1 className="text-3xl font-bold">Contenido (Realidades)</h1>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo artículo
        </Button>
      </div>

      <p className="text-muted-foreground mb-6">
        Crea y edita historias reales, artículos, noticias y preguntas incómodas. Las enfermeras
        pueden subir textos e imagen (URL) y publicar.
      </p>

      <div className="space-y-4">
        {articles.map((a) => (
          <Card key={a.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{a.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      a.isPublished ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {a.isPublished ? 'Publicado' : 'Borrador'}
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-secondary">
                    {ARTICLE_TYPE_LABELS[a.articleType] ?? a.articleType}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {a.excerpt && (
                <p className="text-sm text-muted-foreground mb-4">{a.excerpt}</p>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {a.category && <span>Categoría: {a.category.name}</span>}
                <span>Vistas: {a.viewCount}</span>
                <Link
                  href={`/realities/${a.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Ver en web
                </Link>
              </div>
              {isAdmin && (
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => openEdit(a)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(a.id)}
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

      {articles.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No hay artículos. Crea uno nuevo para comenzar.
          </CardContent>
        </Card>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar contenido' : 'Nuevo artículo'}</DialogTitle>
            <DialogDescription>
              Textos e imagen (URL). Puedes usar HTML en el contenido si lo necesitas.
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
                disabled={!isAdmin}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug (URL)</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className={inputClass}
                placeholder="ej. mi-historia-real"
                disabled={!isAdmin}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Opcional. Si está vacío se genera del título.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select
                value={form.articleType}
                onChange={(e) => setForm({ ...form, articleType: e.target.value })}
                className={inputClass}
                disabled={!isAdmin}
              >
                {articleTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Categoría</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className={inputClass}
                disabled={!isAdmin}
              >
                <option value="">— Sin categoría —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Imagen</label>
              <ImageUpload
                value={form.imageUrl || ''}
                onChange={(url) => setForm({ ...form, imageUrl: url })}
                disabled={!isAdmin}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Sube una imagen o pega una URL. La imagen aparecerá en la tarjeta de Realidades y en la página del artículo.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Extracto</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                rows={2}
                className={inputClass}
                disabled={!isAdmin}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contenido *</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={12}
                className={inputClass}
                required
                disabled={!isAdmin}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Puedes usar HTML: &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;&lt;li&gt;, &lt;h4&gt;, etc.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pub"
                checked={form.isPublished}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                className="rounded border"
                disabled={!isAdmin}
              />
              <label htmlFor="pub" className="text-sm">
                Publicado (visible en Realidades)
              </label>
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
            {!isAdmin && (
              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Solo los administradores pueden editar contenido.
                </p>
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="mt-4">
                  Cerrar
                </Button>
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
