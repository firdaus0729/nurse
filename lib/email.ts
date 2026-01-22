import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendNurseNotification(
  conversationId: string,
  messagePreview: string
) {
  const nurseEmails = process.env.SMTP_TO_NURSES?.split(',') || []
  
  if (nurseEmails.length === 0) {
    console.warn('No nurse emails configured')
    return
  }

  const chatUrl = `${process.env.NEXTAUTH_URL}/admin/chat/${conversationId}`

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: nurseEmails.join(','),
    subject: 'Nuevo mensaje en BE NURSE',
    html: `
      <h2>Nuevo mensaje recibido</h2>
      <p>Se ha recibido un nuevo mensaje en la plataforma BE NURSE.</p>
      <p><strong>Vista previa:</strong> ${messagePreview.substring(0, 200)}...</p>
      <p><a href="${chatUrl}">Responder en el panel de administración</a></p>
      <p><em>Recuerda: NO respondas por email. Todas las respuestas deben hacerse desde el panel.</em></p>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Error sending email notification:', error)
    throw error
  }
}

