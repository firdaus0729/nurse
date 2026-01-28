import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const PAGE_SLUG = 'home'

type WelcomePayload = {
  title: string
  text: string
}

function safeParseWelcome(content: string): WelcomePayload | null {
  try {
    const parsed = JSON.parse(content)
    if (
      parsed &&
      typeof parsed === 'object' &&
      typeof parsed.title === 'string' &&
      typeof parsed.text === 'string'
    ) {
      return { title: parsed.title, text: parsed.text }
    }
    return null
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: PAGE_SLUG },
    })

    const fallback: WelcomePayload = {
      title: 'Bienvenido/a a BE NURSE',
      text:
        'Un espacio seguro para informarte y cuidarte. Aquí puedes resolver tus dudas sobre salud sexual, acceder a información clara y hablar de forma anónima con profesionales de enfermería.',
    }

    if (!page) {
      return NextResponse.json({ welcome: fallback })
    }

    const welcome = safeParseWelcome(page.content) ?? fallback
    return NextResponse.json({ welcome })
  } catch (error) {
    console.error('Error fetching home welcome:', error)
    return NextResponse.json({ error: 'Failed to fetch welcome' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRole = (session.user as any)?.role
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const title = typeof body?.title === 'string' ? body.title.trim() : ''
    const text = typeof body?.text === 'string' ? body.text.trim() : ''

    if (!title || !text) {
      return NextResponse.json(
        { error: 'title and text are required' },
        { status: 400 }
      )
    }

    const payload: WelcomePayload = { title, text }

    const page = await prisma.page.upsert({
      where: { slug: PAGE_SLUG },
      update: {
        title: 'Inicio',
        content: JSON.stringify(payload),
        isPublished: true,
      },
      create: {
        slug: PAGE_SLUG,
        title: 'Inicio',
        content: JSON.stringify(payload),
        isPublished: true,
      },
    })

    return NextResponse.json({ success: true, welcome: payload, pageId: page.id })
  } catch (error) {
    console.error('Error updating home welcome:', error)
    return NextResponse.json({ error: 'Failed to update welcome' }, { status: 500 })
  }
}

