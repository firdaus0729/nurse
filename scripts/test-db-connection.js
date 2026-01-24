/**
 * Test database connection (Neon PostgreSQL).
 * Run: npm run db:test
 * Requires .env with DATABASE_URL.
 */
const fs = require('fs')
const path = require('path')
const envPath = path.join(process.cwd(), '.env')
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .forEach((line) => {
      const m = line.match(/^([^#=]+)=(.*)$/)
      if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
    })
}
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Testing database connection...')
  console.log('DATABASE_URL (hidden):', process.env.DATABASE_URL ? '✓ set' : '✗ missing')
  if (!process.env.DATABASE_URL) {
    console.error('\n❌ DATABASE_URL is not set in .env')
    process.exit(1)
  }

  try {
    await prisma.$connect()
    console.log('✅ Connection successful! Database is reachable.\n')
    const count = await prisma.carouselSlide.count()
    console.log(`  Carousel slides: ${count}`)
    await prisma.$disconnect()
    process.exit(0)
  } catch (e) {
    console.error('\n❌ Connection failed:', e.message)
    const isUnreachable = e.message && e.message.includes("Can't reach database server")
    const isTls = e.message && (e.message.includes('TLS') || e.message.includes('credentials'))
    if (isUnreachable || isTls) {
      console.log('\n📌 Fix steps (see README "Solución de problemas: base de datos (Neon)"):\n')
      console.log('  1. Reactivate Neon: https://console.neon.tech → project → Resume\n')
      console.log('  2. Update .env: DATABASE_URL="postgresql://...?sslmode=require"\n')
      console.log('  3. Run: npm run db:test   then   npm run db:seed   then   npm run dev\n')
    }
    await prisma.$disconnect().catch(() => {})
    process.exit(1)
  }
}

main()
