import Image from 'next/image'
import { HeroCarousel } from '@/components/HeroCarousel'
import { QuickAccessCards } from '@/components/QuickAccessCards'
import { prisma } from '@/lib/prisma'
import type { CarouselSlide, QuickAccessCard } from '@prisma/client'

type HomeCarouselSlide = Pick<
  CarouselSlide,
  'id' | 'title' | 'subtitle' | 'imageUrl' | 'ctaText' | 'ctaLink' | 'isActive' | 'order'
>

type HomeQuickAccessCard = Pick<
  QuickAccessCard,
  'id' | 'title' | 'description' | 'icon' | 'link' | 'order' | 'isActive' | 'isCampaign' | 'campaignEnd'
>

export default async function HomePage() {
  let carouselSlides: HomeCarouselSlide[] = []
  let quickAccessCards: HomeQuickAccessCard[] = []

  try {
    const dbSlides = await prisma.carouselSlide.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      take: 3, // Only get first 3 slides
    })

    carouselSlides = dbSlides

    const dbQuickAccess = await prisma.quickAccessCard.findMany({
      where: {
        isActive: true,
        OR: [
          { isCampaign: false },
          {
            isCampaign: true,
            campaignEnd: { gte: new Date() },
          },
        ],
      },
      orderBy: { order: 'asc' },
    })

    quickAccessCards = dbQuickAccess
  } catch (error) {
    console.error('Database connection error:', error)
    // Use fallback data if database is unavailable
    carouselSlides = [
      {
        id: 'fallback-1',
        title: '¿Tienes una duda y no sabes a quién preguntar?',
        subtitle: null,
        imageUrl: '/slide1.jpg',
        ctaText: 'Habla ahora (Chat anónimo)',
        ctaLink: '/chat',
        isActive: true,
        order: 0,
      },
      {
        id: 'fallback-2',
        title: 'El sexo real no funciona como en los vídeos',
        subtitle: null,
        imageUrl: '/slide2.jpg',
        ctaText: 'Descúbrelo aquí',
        ctaLink: '/realities',
        isActive: true,
        order: 1,
      },
      {
        id: 'fallback-3',
        title: 'Tu salud sexual también es cosa tuya',
        subtitle: null,
        imageUrl: '/slide3.jpg',
        ctaText: 'Cuídate',
        ctaLink: '/take-care',
        isActive: true,
        order: 2,
      },
    ]
  }

  return (
    <div>
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
            Bienvenido/a a BE NURSE
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Un espacio seguro para informarte y cuidarte. Aquí puedes resolver tus dudas sobre salud sexual,
            acceder a información clara y hablar de forma anónima con profesionales de enfermería.
          </p>
        </div>
      </div>
    </div>
  )
}

