import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const PAGE_SLUG = 'learn'
const PAGE_TITLE = 'Infórmate'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const page = await prisma.page.findUnique({
      where: { slug: PAGE_SLUG },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!page) {
      const newPage = await prisma.page.create({
        data: {
          slug: PAGE_SLUG,
          title: PAGE_TITLE,
          content: '',
          isPublished: true,
        },
        include: {
          sections: true,
        },
      })
      return NextResponse.json({ sections: newPage.sections })
    }

    return NextResponse.json({ sections: page.sections })
  } catch (error) {
    console.error('Error fetching sections:', error)
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRole = (session.user as any)?.role
    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only admins can create sections' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, content, order, type, metadata } = body

    // For CONTENT sections, content is required. For others, allow empty content.
    if ((!type || type === 'CONTENT') && !content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    let page = await prisma.page.findUnique({
      where: { slug: PAGE_SLUG },
    })

    if (!page) {
      page = await prisma.page.create({
        data: {
          slug: PAGE_SLUG,
          title: PAGE_TITLE,
          content: '',
          isPublished: true,
        },
      })
    }

    const section = await prisma.section.create({
      data: {
        pageId: page.id,
        title: title || null,
        content: content || '',
        type: type || 'CONTENT',
        order: order ?? 0,
        metadata: metadata ?? undefined,
      },
    })

    return NextResponse.json({ section })
  } catch (error) {
    console.error('Error creating section:', error)
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 })
  }
}

