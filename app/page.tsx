import Image from 'next/image'
import { HeroCarousel } from '@/components/HeroCarousel'
import { QuickAccessCards } from '@/components/QuickAccessCards'
import { prisma } from '@/lib/prisma'

export default async function HomePage() {
  const carouselSlides = await prisma.carouselSlide.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  })

  const quickAccessCards = await prisma.quickAccessCard.findMany({
    where: { 
      isActive: true,
      OR: [
        { isCampaign: false },
        { 
          isCampaign: true,
          campaignEnd: { gte: new Date() }
        }
      ]
    },
    orderBy: { order: 'asc' },
  })

  return (
    <div>
      <HeroCarousel slides={carouselSlides} />
      <QuickAccessCards cards={quickAccessCards} />
      
      <div className="container py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.jpg"
              alt="BE NURSE Logo"
              width={120}
              height={120}
              className="h-30 w-30 object-contain"
              priority
            />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Bienvenido a BE NURSE
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Una plataforma educativa y de apoyo comunitario sobre salud sexual.
            Aquí encontrarás información confiable, recursos útiles y la posibilidad
            de hablar de forma anónima con profesionales de enfermería.
          </p>
        </div>
      </div>
    </div>
  )
}

