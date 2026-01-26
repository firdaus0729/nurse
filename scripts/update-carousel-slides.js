/**
 * Script to update carousel slides with the new content
 * Run with: node scripts/update-carousel-slides.js
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Updating carousel slides...')

  // Delete old sample slides (if they exist)
  await prisma.carouselSlide.deleteMany({
    where: {
      id: {
        in: ['sample-1', 'sample-2']
      }
    }
  })

  // Deactivate all existing slides first
  await prisma.carouselSlide.updateMany({
    data: { isActive: false }
  })

  // Create/update Slide 1: Chat anónimo
  await prisma.carouselSlide.upsert({
    where: { id: 'slide-1' },
    update: {
      title: '¿Tienes una duda y no sabes a quién preguntar?',
      subtitle: null,
      imageUrl: null,
      ctaText: 'Habla ahora (Chat anónimo)',
      ctaLink: '/chat',
      order: 0,
      isActive: true,
    },
    create: {
      id: 'slide-1',
      title: '¿Tienes una duda y no sabes a quién preguntar?',
      subtitle: null,
      imageUrl: null,
      ctaText: 'Habla ahora (Chat anónimo)',
      ctaLink: '/chat',
      order: 0,
      isActive: true,
    },
  })

  // Create/update Slide 2: Realidades
  await prisma.carouselSlide.upsert({
    where: { id: 'slide-2' },
    update: {
      title: 'El sexo real no funciona como en los vídeos',
      subtitle: null,
      imageUrl: null,
      ctaText: 'Descúbrelo aquí',
      ctaLink: '/realities',
      order: 1,
      isActive: true,
    },
    create: {
      id: 'slide-2',
      title: 'El sexo real no funciona como en los vídeos',
      subtitle: null,
      imageUrl: null,
      ctaText: 'Descúbrelo aquí',
      ctaLink: '/realities',
      order: 1,
      isActive: true,
    },
  })

  // Create/update Slide 3: Cuídate
  await prisma.carouselSlide.upsert({
    where: { id: 'slide-3' },
    update: {
      title: 'Tu salud sexual también es cosa tuya',
      subtitle: null,
      imageUrl: null,
      ctaText: 'Cuídate',
      ctaLink: '/take-care',
      order: 2,
      isActive: true,
    },
    create: {
      id: 'slide-3',
      title: 'Tu salud sexual también es cosa tuya',
      subtitle: null,
      imageUrl: null,
      ctaText: 'Cuídate',
      ctaLink: '/take-care',
      order: 2,
      isActive: true,
    },
  })

  console.log('✅ Carousel slides updated successfully!')
  console.log('\n📋 Slides configured:')
  console.log('   Slide 1: Chat anónimo → /chat')
  console.log('   Slide 2: Realidades → /realities')
  console.log('   Slide 3: Cuídate → /take-care')
}

main()
  .catch((e) => {
    console.error('❌ Error updating slides:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

