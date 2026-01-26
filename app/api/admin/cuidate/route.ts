import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Get Cuídate section with cards
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const page = await prisma.page.findUnique({
      where: { slug: 'take-care' },
      include: {
        sections: {
          where: { type: 'CARD_GRID' },
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!page || page.sections.length === 0) {
      return NextResponse.json({ section: null, cards: [] })
    }

    const section = page.sections[0]
    const cards = (section.metadata as any)?.items || []

    return NextResponse.json({ section, cards })
  } catch (error) {
    console.error('Error fetching Cuídate cards:', error)
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 })
  }
}

// Update Cuídate cards
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { cards } = body

    if (!Array.isArray(cards)) {
      return NextResponse.json({ error: 'Cards must be an array' }, { status: 400 })
    }

    const page = await prisma.page.findUnique({
      where: { slug: 'take-care' },
      include: {
        sections: {
          where: { type: 'CARD_GRID' },
        },
      },
    })

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    let section = page.sections[0]

    if (!section) {
      // Create section if it doesn't exist
      section = await prisma.section.create({
        data: {
          pageId: page.id,
          title: 'Métodos de cuidado y prevención',
          type: 'CARD_GRID',
          content: '',
          order: 0,
          metadata: { items: cards },
        },
      })
    } else {
      // Update existing section
      section = await prisma.section.update({
        where: { id: section.id },
        data: {
          metadata: { items: cards },
        },
      })
    }

    return NextResponse.json({ section, cards })
  } catch (error) {
    console.error('Error updating Cuídate cards:', error)
    return NextResponse.json({ error: 'Failed to update cards' }, { status: 500 })
  }
}
