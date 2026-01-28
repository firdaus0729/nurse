'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { HeroCarousel } from '@/components/HeroCarousel'
import { QuickAccessCards } from '@/components/QuickAccessCards'
import { AdminEditButton } from '@/components/AdminEditButton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ImageUpload } from '@/components/ImageUpload'
import { Button } from '@/components/ui/button'
import type { CarouselSlide, QuickAccessCard } from '@prisma/client'

type HomeCarouselSlide = Pick<
  CarouselSlide,
  'id' | 'title' | 'subtitle' | 'imageUrl' | 'ctaText' | 'ctaLink' | 'isActive' | 'order'
>

type HomeQuickAccessCard = Pick<
  QuickAccessCard,
  'id' | 'title' | 'description' | 'icon' | 'link' | 'order' | 'isActive' | 'isCampaign' | 'campaignEnd'
>

export function EditableHomePage() {
  const { data: session } = useSession()
  const userRole = (session?.user as any)?.role
  const isAdmin = userRole === 'ADMIN'

  const [carouselSlides, setCarouselSlides] = useState<HomeCarouselSlide[]>([])
  const [quickAccessCards, setQuickAccessCards] = useState<HomeQuickAccessCard[]>([])
  const [welcomeTitle, setWelcomeTitle] = useState('Bienvenido/a a BE NURSE')
  const [welcomeText, setWelcomeText] = useState(
    'Un espacio seguro para informarte y cuidarte. Aquí puedes resolver tus dudas sobre salud sexual, acceder a información clara y hablar de forma anónima con profesionales de enfermería.'
  )
  const [loading, setLoading] = useState(true)
  const [editCarouselOpen, setEditCarouselOpen] = useState(false)
  const [editQuickAccessOpen, setEditQuickAccessOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [slidesRes, cardsRes, welcomeRes] = await Promise.all([
        fetch('/api/admin/carousel'),
        fetch('/api/admin/quick-access'),
        fetch('/api/admin/home/welcome'),
      ])

      if (slidesRes.ok) {
        const { slides } = await slidesRes.json()
        const activeSlides = slides
          .filter((s: any) => s.isActive)
          .sort((a: any, b: any) => a.order - b.order)
        setCarouselSlides(activeSlides)
      }

      if (cardsRes.ok) {
        const { cards } = await cardsRes.json()
        const activeCards = cards
          .filter((c: any) => {
            if (!c.isActive) return false
            if (!c.isCampaign) return true
            if (c.campaignEnd) {
              return new Date(c.campaignEnd) >= new Date()
            }
            return true
          })
          .sort((a: any, b: any) => a.order - b.order)
        setQuickAccessCards(activeCards)
      }

      if (welcomeRes.ok) {
        const data = await welcomeRes.json()
        if (data?.welcome?.title) setWelcomeTitle(data.welcome.title)
        if (data?.welcome?.text) setWelcomeText(data.welcome.text)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  return (
    <div>
      {isAdmin && (
        <div className="container py-4 border-b bg-yellow-50 dark:bg-yellow-950/20">
          <div className="flex items-center justify-between">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Modo administrador:</strong> Puedes editar el contenido directamente
            </p>
            <div className="flex gap-2">
              <AdminEditButton onClick={() => setEditCarouselOpen(true)} />
              <AdminEditButton onClick={() => setEditQuickAccessOpen(true)} />
            </div>
          </div>
        </div>
      )}

      <HeroCarousel slides={carouselSlides} />
      <QuickAccessCards cards={quickAccessCards} />
      <div className="container py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="BE NURSE Logo"
              width={120}
              height={120}
              className="h-30 w-30 object-contain"
              priority
            />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            {welcomeTitle}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {welcomeText}
          </p>
        </div>
      </div>

      {/* Edit Carousel Dialog */}
      <Dialog open={editCarouselOpen} onOpenChange={setEditCarouselOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Carrusel</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Ve a <a href="/admin/carousel" className="text-primary underline">Panel de administración → Carrusel</a> para editar los slides.
            </p>
            <Button onClick={() => window.open('/admin/carousel', '_blank')}>
              Abrir panel de carrusel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Quick Access Dialog */}
      <Dialog open={editQuickAccessOpen} onOpenChange={setEditQuickAccessOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Accesos Rápidos</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Ve a <a href="/admin/quick-access" className="text-primary underline">Panel de administración → Accesos rápidos</a> para editar las tarjetas.
            </p>
            <Button onClick={() => window.open('/admin/quick-access', '_blank')}>
              Abrir panel de accesos rápidos
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
