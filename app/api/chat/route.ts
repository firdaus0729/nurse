import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendNurseNotification } from '@/lib/email'

// Create a new conversation
export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Create conversation
    const conversation = await prisma.conversation.create({
      data: {
        status: 'OPEN',
        messages: {
          create: {
            content: message.trim(),
            isFromUser: true,
          },
        },
      },
      include: {
        messages: true,
      },
    })

    // Send email notification to nurses
    try {
      await sendNurseNotification(conversation.id, message.trim())
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      conversationId: conversation.uuid,
      message: 'Conversation created successfully',
    })
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
}

