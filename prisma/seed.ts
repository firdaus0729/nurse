import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@benurse.com' },
    update: {},
    create: {
      email: 'admin@benurse.com',
      password: adminPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  })
  console.log('✅ Created admin user:', admin.email)

  // Create nurse user
  const nursePassword = await bcrypt.hash('nurse123', 10)
  const nurse = await prisma.user.upsert({
    where: { email: 'nurse@benurse.com' },
    update: {},
    create: {
      email: 'nurse@benurse.com',
      password: nursePassword,
      name: 'Enfermera',
      role: 'NURSE',
    },
  })
  console.log('✅ Created nurse user:', nurse.email)

  // Create categories
  const categoria1 = await prisma.category.upsert({
    where: { slug: 'informacion' },
    update: {},
    create: {
      name: 'Información',
      slug: 'informacion',
      description: 'Contenido educativo e informativo',
    },
  })

  const categoria2 = await prisma.category.upsert({
    where: { slug: 'prevencion' },
    update: {},
    create: {
      name: 'Prevención',
      slug: 'prevencion',
      description: 'Recursos de prevención y cuidado',
    },
  })

  console.log('✅ Created categories')

  // Create sample carousel slides
  await prisma.carouselSlide.upsert({
    where: { id: 'sample-1' },
    update: {},
    create: {
      id: 'sample-1',
      title: 'Bienvenido a BE NURSE',
      subtitle: 'Tu espacio seguro para aprender sobre salud sexual',
      ctaText: 'Comenzar',
      ctaLink: '/learn',
      order: 0,
      isActive: true,
    },
  })

  await prisma.carouselSlide.upsert({
    where: { id: 'sample-2' },
    update: {},
    create: {
      id: 'sample-2',
      title: 'Habla con un profesional',
      subtitle: 'Chatea de forma anónima con profesionales de enfermería',
      ctaText: 'Abrir chat',
      ctaLink: '/chat',
      order: 1,
      isActive: true,
    },
  })

  console.log('✅ Created carousel slides')

  // Create sample quick access cards
  await prisma.quickAccessCard.upsert({
    where: { id: 'card-1' },
    update: {},
    create: {
      id: 'card-1',
      title: 'Infórmate',
      description: 'Aprende sobre salud sexual',
      icon: 'book',
      link: '/learn',
      order: 0,
      isActive: true,
    },
  })

  await prisma.quickAccessCard.upsert({
    where: { id: 'card-2' },
    update: {},
    create: {
      id: 'card-2',
      title: 'Cuídate',
      description: 'Recursos de prevención',
      icon: 'heart',
      link: '/take-care',
      order: 1,
      isActive: true,
    },
  })

  await prisma.quickAccessCard.upsert({
    where: { id: 'card-3' },
    update: {},
    create: {
      id: 'card-3',
      title: 'Habla con BE NURSE',
      description: 'Chatea de forma anónima',
      icon: 'message',
      link: '/chat',
      order: 2,
      isActive: true,
    },
  })

  console.log('✅ Created quick access cards')

  // Create sample pages
  await prisma.page.upsert({
    where: { slug: 'about' },
    update: {},
    create: {
      slug: 'about',
      title: 'Sobre nosotros',
      content: '<p>BE NURSE es una plataforma educativa sobre salud sexual.</p>',
      isPublished: true,
      sections: {
        create: [
          {
            title: 'Nuestra misión',
            content: '<p>Proporcionar información confiable y apoyo profesional.</p>',
            order: 0,
          },
        ],
      },
    },
  })

  console.log('✅ Created sample pages')

  console.log('🎉 Seeding completed!')
  console.log('\n📝 Default credentials:')
  console.log('   Admin: admin@benurse.com / admin123')
  console.log('   Nurse: nurse@benurse.com / nurse123')
  console.log('\n⚠️  Remember to change these passwords in production!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

