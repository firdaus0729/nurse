import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendNurseNotification } from '@/lib/email'

// Send a message to an existing conversation
export async function POST(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Find conversation by UUID
    const conversation = await prisma.conversation.findUnique({
      where: { uuid: params.conversationId },
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    if (conversation.status === 'CLOSED') {
      return NextResponse.json(
        { error: 'Conversation is closed' },
        { status: 400 }
      )
    }

    // Create message
    const newMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        content: message.trim(),
        isFromUser: true,
      },
    })

    // Update conversation status if needed
    if (conversation.status === 'OPEN') {
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { status: 'IN_PROGRESS' },
      })
    }

    // Send email notification to nurses
    try {
      await sendNurseNotification(conversation.id, message.trim())
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      message: newMessage,
      success: true,
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

