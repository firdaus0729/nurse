import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Update carousel slide
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only ADMIN can update slides
    const userRole = (session.user as any)?.role
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Only admins can update slides' }, { status: 403 })
    }

    const body = await request.json()
    const { title, subtitle, imageUrl, ctaText, ctaLink, order, isActive } = body

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (subtitle !== undefined) updateData.subtitle = subtitle
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl
    if (ctaText !== undefined) updateData.ctaText = ctaText
    if (ctaLink !== undefined) updateData.ctaLink = ctaLink
    if (order !== undefined) updateData.order = order
    if (isActive !== undefined) updateData.isActive = isActive

    const slide = await prisma.carouselSlide.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({ slide })
  } catch (error) {
    console.error('Error updating carousel slide:', error)
    return NextResponse.json(
      { error: 'Failed to update carousel slide' },
      { status: 500 }
    )
  }
}

// Delete carousel slide
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only ADMIN can delete slides
    const userRole = (session.user as any)?.role
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Only admins can delete slides' }, { status: 403 })
    }

    await prisma.carouselSlide.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting carousel slide:', error)
    return NextResponse.json(
      { error: 'Failed to delete carousel slide' },
      { status: 500 }
    )
  }
}

