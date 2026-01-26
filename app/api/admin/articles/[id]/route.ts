import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const article = await prisma.article.findUnique({
      where: { id: params.id },
      include: { category: true, tags: true },
    })
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }
    return NextResponse.json(article)
  } catch (e) {
    console.error('Error fetching article:', e)
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only ADMIN can update articles
    const userRole = (session.user as any)?.role
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Only admins can update articles' }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      imageUrl,
      articleType,
      categoryId,
      isPublished,
      isFeatured,
    } = body

    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title
    if (slug !== undefined) updateData.slug = String(slug).trim() || undefined
    if (excerpt !== undefined) updateData.excerpt = excerpt || null
    if (content !== undefined) updateData.content = content
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl || null
    if (articleType !== undefined) updateData.articleType = articleType
    if (categoryId !== undefined) updateData.categoryId = categoryId || null
    if (isPublished !== undefined) {
      updateData.isPublished = isPublished
      if (isPublished) {
        updateData.publishedAt = new Date()
      }
    }
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured

    const article = await prisma.article.update({
      where: { id: params.id },
      data: updateData,
      include: { category: true, tags: true },
    })
    return NextResponse.json(article)
  } catch (e) {
    console.error('Error updating article:', e)
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
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

    // Only ADMIN can delete articles
    const userRole = (session.user as any)?.role
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Only admins can delete articles' }, { status: 403 })
    }

    await prisma.article.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Error deleting article:', e)
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
  }
}
