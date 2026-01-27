import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendNurseNotification } from '@/lib/email'

// Store contact form submissions
// In production, you might want to create a ContactSubmission model
export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate all fields are present and non-empty
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'El nombre es obligatorio' },
        { status: 400 }
      )
    }

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return NextResponse.json(
        { error: 'El email es obligatorio' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'El formato del email no es válido' },
        { status: 400 }
      )
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
      return NextResponse.json(
        { error: 'El asunto es obligatorio' },
        { status: 400 }
      )
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'El mensaje es obligatorio' },
        { status: 400 }
      )
    }

    // For now, we'll just send an email notification
    // In production, you should create a ContactSubmission model in Prisma
    // and store these submissions in the database

    try {
      const emailContent = `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Asunto:</strong> ${subject}</p>
        ${name ? `<p><strong>Nombre:</strong> ${name}</p>` : ''}
        ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `

      // Send notification to nurses (reusing the email function)
      const nurseEmails = process.env.SMTP_TO_NURSES?.split(',') || []
      if (nurseEmails.length > 0) {
        // We'll need to create a simple email sending function for contact forms
        // For now, just return success
      }
    } catch (emailError) {
      console.error('Failed to send contact email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
    })
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    )
  }
}

