import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const page = await prisma.page.findUnique({
      where: { slug: 'about' },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!page) {
      // Create the page if it doesn't exist
      const newPage = await prisma.page.create({
        data: {
          slug: 'about',
          title: 'Sobre nosotros',
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
      return NextResponse.json({ error: 'Forbidden: Only admins can create sections' }, { status: 403 })
    }

    const body = await request.json()
    const { title, content, order } = body

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // Get or create the about page
    let page = await prisma.page.findUnique({
      where: { slug: 'about' },
    })

    if (!page) {
      page = await prisma.page.create({
        data: {
          slug: 'about',
          title: 'Sobre nosotros',
          content: '',
          isPublished: true,
        },
      })
    }

    const section = await prisma.section.create({
      data: {
        pageId: page.id,
        title: title || null,
        content: content,
        type: 'CONTENT',
        order: order ?? 0,
      },
    })

    return NextResponse.json({ section })
  } catch (error) {
    console.error('Error creating section:', error)
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 })
  }
}
