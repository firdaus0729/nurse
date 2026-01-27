import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Get all carousel slides (public for reading)
export async function GET() {
  try {
    const slides = await prisma.carouselSlide.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ slides })
  } catch (error) {
    console.error('Error fetching carousel slides:', error)
    return NextResponse.json(
      { error: 'Failed to fetch carousel slides' },
      { status: 500 }
    )
  }
}

// Create carousel slide
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only ADMIN can create slides
    const userRole = (session.user as any)?.role
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Only admins can create slides' }, { status: 403 })
    }

    const body = await request.json()
    const { title, subtitle, imageUrl, ctaText, ctaLink, order, isActive } = body

    const slide = await prisma.carouselSlide.create({
      data: {
        title,
        subtitle,
        imageUrl,
        ctaText,
        ctaLink,
        order: order ?? 0,
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json({ slide })
  } catch (error) {
    console.error('Error creating carousel slide:', error)
    return NextResponse.json(
      { error: 'Failed to create carousel slide' },
      { status: 500 }
    )
  }
}

