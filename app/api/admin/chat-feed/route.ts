import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Admin chat feed: all conversations + messages (latest N)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10) || 50, 200)
    const messagesPerConversation = Math.min(
      parseInt(searchParams.get('messagesPerConversation') || '30', 10) || 30,
      200
    )

    const conversations = await prisma.conversation.findMany({
      orderBy: { updatedAt: 'desc' },
      take: limit,
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: messagesPerConversation,
        },
      },
    })

    return NextResponse.json({ conversations })
  } catch (e) {
    console.error('Error fetching chat feed:', e)
    return NextResponse.json({ error: 'Failed to fetch chat feed' }, { status: 500 })
  }
}

