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
import { ImageUpload } from '@/components/ImageUpload'
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react'

const inputClass =
  'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'

export default function AdminInicioPage() {
  const { data: session } = useSession()
  const userRole = (session?.user as any)?.role
  const isAdmin = userRole === 'ADMIN'

  const [carouselSlides, setCarouselSlides] = useState<any[]>([])
  const [quickAccessCards, setQuickAccessCards] = useState<any[]>([])
  const [welcomeTitle, setWelcomeTitle] = useState('')
  const [welcomeText, setWelcomeText] = useState('')
  const [loading, setLoading] = useState(true)
  const [carouselModalOpen, setCarouselModalOpen] = useState(false)
  const [quickAccessModalOpen, setQuickAccessModalOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<any | null>(null)
  const [editingCard, setEditingCard] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const [slideForm, setSlideForm] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    ctaText: '',
    ctaLink: '',
    order: 0,
    isActive: true,
  })
  const [cardForm, setCardForm] = useState({
    title: '',
    description: '',
    icon: '',
    link: '',
    order: 0,
    isActive: true,
    isCampaign: false,
    campaignEnd: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [slidesRes, cardsRes] = await Promise.all([
        fetch('/api/admin/carousel'),
        fetch('/api/admin/quick-access'),
      ])

      if (slidesRes.ok) {
        const { slides } = await slidesRes.json()
        setCarouselSlides(slides.sort((a: any, b: any) => a.order - b.order))
      }

      if (cardsRes.ok) {
        const { cards } = await cardsRes.json()
        setQuickAccessCards(cards.sort((a: any, b: any) => a.order - b.order))
      }

      // Load welcome text from a page or use defaults
      setWelcomeTitle('Bienvenido/a a BE NURSE')
      setWelcomeText(
        'Un espacio seguro para informarte y cuidarte. Aquí puedes resolver tus dudas sobre salud sexual, acceder a información clara y hablar de forma anónima con profesionales de enfermería.'
      )
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const openSlideEdit = (slide?: any) => {
    if (slide) {
      setEditingSlide(slide)
      setSlideForm({
        title: slide.title || '',
        subtitle: slide.subtitle || '',
        imageUrl: slide.imageUrl || '',
        ctaText: slide.ctaText || '',
        ctaLink: slide.ctaLink || '',
        order: slide.order || 0,
        isActive: slide.isActive ?? true,
      })
    } else {
      setEditingSlide(null)
      setSlideForm({
        title: '',
        subtitle: '',
        imageUrl: '',
        ctaText: '',
        ctaLink: '',
        order: carouselSlides.length,
        isActive: true,
      })
    }
    setCarouselModalOpen(true)
  }

  const openCardEdit = (card?: any) => {
    if (card) {
      setEditingCard(card)
      setCardForm({
        title: card.title || '',
        description: card.description || '',
        icon: card.icon || '',
        link: card.link || '',
        order: card.order || 0,
        isActive: card.isActive ?? true,
        isCampaign: card.isCampaign ?? false,
        campaignEnd: card.campaignEnd ? new Date(card.campaignEnd).toISOString().split('T')[0] : '',
      })
    } else {
      setEditingCard(null)
      setCardForm({
        title: '',
        description: '',
        icon: '',
        link: '',
        order: quickAccessCards.length,
        isActive: true,
        isCampaign: false,
        campaignEnd: '',
      })
    }
    setQuickAccessModalOpen(true)
  }

  const handleSlideSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const url = editingSlide ? `/api/admin/carousel/${editingSlide.id}` : '/api/admin/carousel'
      const method = editingSlide ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slideForm),
      })
      if (!res.ok) throw new Error('Error al guardar')
      setCarouselModalOpen(false)
      loadData()
    } catch (err) {
      console.error(err)
      alert('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const url = editingCard ? `/api/admin/quick-access/${editingCard.id}` : '/api/admin/quick-access'
      const method = editingCard ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cardForm,
          campaignEnd: cardForm.campaignEnd ? new Date(cardForm.campaignEnd).toISOString() : null,
        }),
      })
      if (!res.ok) throw new Error('Error al guardar')
      setQuickAccessModalOpen(false)
      loadData()
    } catch (err) {
      console.error(err)
      alert('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSlide = async (id: string) => {
    if (!confirm('¿Eliminar este slide?')) return
    try {
      const res = await fetch(`/api/admin/carousel/${id}`, { method: 'DELETE' })
      if (res.ok) loadData()
      else alert('Error al eliminar')
    } catch (err) {
      console.error(err)
      alert('Error al eliminar')
    }
  }

  const handleDeleteCard = async (id: string) => {
    if (!confirm('¿Eliminar esta tarjeta?')) return
    try {
      const res = await fetch(`/api/admin/quick-access/${id}`, { method: 'DELETE' })
      if (res.ok) loadData()
      else alert('Error al eliminar')
    } catch (err) {
      console.error(err)
      alert('Error al eliminar')
    }
  }

  const moveSlide = async (id: string, direction: 'up' | 'down') => {
    const index = carouselSlides.findIndex((s) => s.id === id)
    if (index === -1) return
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= carouselSlides.length) return

    const slides = [...carouselSlides]
    const temp = slides[index].order
    slides[index].order = slides[newIndex].order
    slides[newIndex].order = temp

    try {
      await Promise.all([
        fetch(`/api/admin/carousel/${slides[index].id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: slides[index].order }),
        }),
        fetch(`/api/admin/carousel/${slides[newIndex].id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: slides[newIndex].order }),
        }),
      ])
      loadData()
    } catch (err) {
      console.error(err)
      alert('Error al reordenar')
    }
  }

  if (loading) return <div className="container py-8">Cargando...</div>

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Editar Página de Inicio</h1>

      {/* Carousel Section */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Carrusel (Slides)</CardTitle>
            {isAdmin && (
              <Button onClick={() => openSlideEdit()}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo slide
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {carouselSlides.map((slide, index) => (
              <div key={slide.id} className="flex items-center gap-4 p-4 border rounded">
                <div className="flex-1">
                  <div className="font-medium">{slide.title}</div>
                  {slide.imageUrl && (
                    <img src={slide.imageUrl} alt={slide.title} className="h-16 w-32 object-cover mt-2 rounded" />
                  )}
                  <div className="text-sm text-muted-foreground mt-1">
                    Orden: {slide.order} | {slide.isActive ? 'Activo' : 'Inactivo'}
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => moveSlide(slide.id, 'up')} disabled={index === 0}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => moveSlide(slide.id, 'down')} disabled={index === carouselSlides.length - 1}>
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openSlideEdit(slide)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteSlide(slide.id)} className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Access Cards Section */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tarjetas de Acceso Rápido</CardTitle>
            {isAdmin && (
              <Button onClick={() => openCardEdit()}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva tarjeta
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickAccessCards.map((card) => (
              <Card key={card.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {card.description && <p className="text-sm text-muted-foreground mb-2">{card.description}</p>}
                  <p className="text-xs text-muted-foreground mb-4">Enlace: {card.link}</p>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openCardEdit(card)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteCard(card.id)} className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Welcome Text Section */}
      <Card>
        <CardHeader>
          <CardTitle>Texto de Bienvenida</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Título</label>
              <input
                type="text"
                value={welcomeTitle}
                onChange={(e) => setWelcomeTitle(e.target.value)}
                className={inputClass}
                disabled={!isAdmin}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Texto</label>
              <textarea
                value={welcomeText}
                onChange={(e) => setWelcomeText(e.target.value)}
                rows={4}
                className={inputClass}
                disabled={!isAdmin}
              />
            </div>
            {isAdmin && (
              <Button onClick={() => alert('Funcionalidad de guardado de texto de bienvenida próximamente')}>
                Guardar texto de bienvenida
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Carousel Modal */}
      <Dialog open={carouselModalOpen} onOpenChange={setCarouselModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSlide ? 'Editar slide' : 'Nuevo slide'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSlideSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Título *</label>
              <input
                type="text"
                value={slideForm.title}
                onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                className={inputClass}
                required
                disabled={!isAdmin}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subtítulo</label>
              <input
                type="text"
                value={slideForm.subtitle}
                onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                className={inputClass}
                disabled={!isAdmin}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Imagen *</label>
              <ImageUpload
                value={slideForm.imageUrl}
                onChange={(url) => setSlideForm({ ...slideForm, imageUrl: url })}
                disabled={!isAdmin}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Texto del botón (CTA)</label>
              <input
                type="text"
                value={slideForm.ctaText}
                onChange={(e) => setSlideForm({ ...slideForm, ctaText: e.target.value })}
                className={inputClass}
                disabled={!isAdmin}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Enlace del botón</label>
              <input
                type="text"
                value={slideForm.ctaLink}
                onChange={(e) => setSlideForm({ ...slideForm, ctaLink: e.target.value })}
                className={inputClass}
                placeholder="/chat, /realities, /take-care"
                disabled={!isAdmin}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Orden</label>
              <input
                type="number"
                value={slideForm.order}
                onChange={(e) => setSlideForm({ ...slideForm, order: parseInt(e.target.value, 10) || 0 })}
                className={inputClass}
                disabled={!isAdmin}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="slideActive"
                checked={slideForm.isActive}
                onChange={(e) => setSlideForm({ ...slideForm, isActive: e.target.checked })}
                className="rounded border"
                disabled={!isAdmin}
              />
              <label htmlFor="slideActive" className="text-sm">
                Activo
              </label>
            </div>
            {isAdmin && (
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Guardando…' : 'Guardar'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setCarouselModalOpen(false)}>
                  Cancelar
                </Button>
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>

      {/* Quick Access Modal */}
      <Dialog open={quickAccessModalOpen} onOpenChange={setQuickAccessModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCard ? 'Editar tarjeta' : 'Nueva tarjeta'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCardSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Título *</label>
              <input
                type="text"
                value={cardForm.title}
                onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })}
                className={inputClass}
                required
                disabled={!isAdmin}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                value={cardForm.description}
                onChange={(e) => setCardForm({ ...cardForm, description: e.target.value })}
                rows={2}
                className={inputClass}
                disabled={!isAdmin}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Enlace *</label>
              <input
                type="text"
                value={cardForm.link}
                onChange={(e) => setCardForm({ ...cardForm, link: e.target.value })}
                className={inputClass}
                placeholder="/learn, /take-care, /realities, /chat..."
                required
                disabled={!isAdmin}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Icono (nombre)</label>
              <input
                type="text"
                value={cardForm.icon}
                onChange={(e) => setCardForm({ ...cardForm, icon: e.target.value })}
                className={inputClass}
                placeholder="BookOpen, Heart, MessageCircle..."
                disabled={!isAdmin}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Orden</label>
              <input
                type="number"
                value={cardForm.order}
                onChange={(e) => setCardForm({ ...cardForm, order: parseInt(e.target.value, 10) || 0 })}
                className={inputClass}
                disabled={!isAdmin}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="cardActive"
                checked={cardForm.isActive}
                onChange={(e) => setCardForm({ ...cardForm, isActive: e.target.checked })}
                className="rounded border"
                disabled={!isAdmin}
              />
              <label htmlFor="cardActive" className="text-sm">
                Activo
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="cardCampaign"
                checked={cardForm.isCampaign}
                onChange={(e) => setCardForm({ ...cardForm, isCampaign: e.target.checked })}
                className="rounded border"
                disabled={!isAdmin}
              />
              <label htmlFor="cardCampaign" className="text-sm">
                Campaña
              </label>
            </div>
            {cardForm.isCampaign && (
              <div>
                <label className="block text-sm font-medium mb-1">Fin de campaña</label>
                <input
                  type="date"
                  value={cardForm.campaignEnd}
                  onChange={(e) => setCardForm({ ...cardForm, campaignEnd: e.target.value })}
                  className={inputClass}
                  disabled={!isAdmin}
                />
              </div>
            )}
            {isAdmin && (
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Guardando…' : 'Guardar'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setQuickAccessModalOpen(false)}>
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
