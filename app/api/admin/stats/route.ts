import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Get basic statistics
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [conversationsCount, messagesCount, openConversations, closedConversations] =
      await Promise.all([
        prisma.conversation.count(),
        prisma.message.count(),
        prisma.conversation.count({ where: { status: 'OPEN' } }),
        prisma.conversation.count({ where: { status: 'CLOSED' } }),
      ])

    return NextResponse.json({
      conversations: {
        total: conversationsCount,
        open: openConversations,
        closed: closedConversations,
      },
      messages: {
        total: messagesCount,
      },
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

