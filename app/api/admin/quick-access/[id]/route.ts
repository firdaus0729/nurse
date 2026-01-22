import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Update quick access card
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (icon !== undefined) updateData.icon = icon
    if (link !== undefined) updateData.link = link
    if (order !== undefined) updateData.order = order
    if (isActive !== undefined) updateData.isActive = isActive
    if (isCampaign !== undefined) updateData.isCampaign = isCampaign
    if (campaignEnd !== undefined) {
      updateData.campaignEnd = campaignEnd ? new Date(campaignEnd) : null
    }

    const card = await prisma.quickAccessCard.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({ card })
  } catch (error) {
    console.error('Error updating quick access card:', error)
    return NextResponse.json(
      { error: 'Failed to update quick access card' },
      { status: 500 }
    )
  }
}

// Delete quick access card
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.quickAccessCard.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting quick access card:', error)
    return NextResponse.json(
      { error: 'Failed to delete quick access card' },
      { status: 500 }
    )
  }
}

