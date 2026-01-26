import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')

    const where: any = {}
    if (categoryId) {
      where.categoryId = categoryId
    }

    const articles = await prisma.article.findMany({
      where,
      include: { category: true, tags: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ articles })
  } catch (e) {
    console.error('Error fetching articles:', e)
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only ADMIN can create articles
    const userRole = (session.user as any)?.role
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Only admins can create articles' }, { status: 403 })
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

    if (!title || !content) {
      return NextResponse.json(
        { error: 'title and content are required' },
        { status: 400 }
      )
    }

    const raw = (slug && String(slug).trim()) || title
    const finalSlug = raw
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'articulo'

    const article = await prisma.article.create({
      data: {
        title,
        slug: finalSlug,
        excerpt: excerpt || null,
        content,
        imageUrl: imageUrl || null,
        articleType: articleType || 'ARTICULO',
        categoryId: categoryId || null,
        isPublished: isPublished ?? false,
        isFeatured: isFeatured ?? false,
        publishedAt: isPublished ? new Date() : null,
      },
      include: { category: true, tags: true },
    })
    return NextResponse.json({ article })
  } catch (e) {
    console.error('Error creating article:', e)
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
  }
}
