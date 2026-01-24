import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const REALIDADES_SLUGS = [
  'porno-sexualidad',
  'presion-social-expectativas-cuerpo',
  'sustancias-chemsex-decisiones',
  'relaciones-consentimiento-limites',
]

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const categories = await prisma.category.findMany({
      where: { slug: { in: REALIDADES_SLUGS } },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({ categories })
  } catch (e) {
    console.error('Error fetching categories:', e)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
