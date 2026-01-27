import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Get all quick access cards (public for reading)
export async function GET() {
  try {
    const cards = await prisma.quickAccessCard.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ cards })
  } catch (error) {
    console.error('Error fetching quick access cards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quick access cards' },
      { status: 500 }
    )
  }
}

// Create quick access card
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only ADMIN can create cards
    const userRole = (session.user as any)?.role
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Only admins can create cards' }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      description,
      icon,
      link,
      order,
      isActive,
      isCampaign,
      campaignEnd,
    } = body

    const card = await prisma.quickAccessCard.create({
      data: {
        title,
        description,
        icon,
        link,
        order: order ?? 0,
        isActive: isActive ?? true,
        isCampaign: isCampaign ?? false,
        campaignEnd: campaignEnd ? new Date(campaignEnd) : null,
      },
    })

    return NextResponse.json({ card })
  } catch (error) {
    console.error('Error creating quick access card:', error)
    return NextResponse.json(
      { error: 'Failed to create quick access card' },
      { status: 500 }
    )
  }
}

