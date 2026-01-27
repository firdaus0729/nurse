import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRole = (session.user as any)?.role
    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only admins can update sections' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, content, order } = body

    const updateData: any = {}
    if (title !== undefined) updateData.title = title || null
    if (content !== undefined) updateData.content = content
    if (order !== undefined) updateData.order = order

    const section = await prisma.section.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({ section })
  } catch (error) {
    console.error('Error updating section:', error)
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRole = (session.user as any)?.role
    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only admins can delete sections' },
        { status: 403 }
      )
    }

    await prisma.section.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting section:', error)
    return NextResponse.json({ error: 'Failed to delete section' }, { status: 500 })
  }
}

