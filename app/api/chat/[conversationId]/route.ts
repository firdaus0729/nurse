import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Get conversation and messages by UUID
export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { uuid: params.conversationId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      conversation: {
        id: conversation.uuid,
        status: conversation.status,
        createdAt: conversation.createdAt,
      },
      messages: conversation.messages,
    })
  } catch (error) {
    console.error('Error fetching conversation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversation' },
      { status: 500 }
    )
  }
}

