'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, X } from 'lucide-react'

export default function AdminChatDetailPage() {
  const params = useParams()
  const router = useRouter()
  const conversationId = params.id as string
  const [conversation, setConversation] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    loadConversation()
    // Poll for new messages every 5 seconds
    const interval = setInterval(loadConversation, 5000)
    return () => clearInterval(interval)
  }, [conversationId])

  const loadConversation = async () => {
    try {
      const response = await fetch(`/api/admin/conversations/${conversationId}`)
      if (response.ok) {
        const data = await response.json()
        setConversation(data.conversation)
        setMessages(data.conversation.messages || [])
        setStatus(data.conversation.status)
      }
    } catch (error) {
      console.error('Error loading conversation:', error)
    }
  }

  const handleSendReply = async () => {
    if (!input.trim() || isLoading) return

    const messageText = input.trim()
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch(
        `/api/admin/conversations/${conversationId}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: messageText }),
        }
      )

      if (response.ok) {
        await loadConversation()
      } else {
        throw new Error('Failed to send reply')
      }
    } catch (error) {
      console.error('Error sending reply:', error)
      alert('Error al enviar la respuesta. Por favor, intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseConversation = async () => {
    if (!confirm('¿Estás seguro de que quieres cerrar esta conversación?')) {
      return
    }

    try {
      const response = await fetch(
        `/api/admin/conversations/${conversationId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'CLOSED' }),
        }
      )

      if (response.ok) {
        router.push('/admin/chat')
      } else {
        throw new Error('Failed to close conversation')
      }
    } catch (error) {
      console.error('Error closing conversation:', error)
      alert('Error al cerrar la conversación.')
    }
  }

  if (!conversation) {
    return (
      <div className="text-center py-12">
        <p>Cargando conversación...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Conversación</h1>
          <p className="text-sm text-muted-foreground mt-1">
            ID: {conversation.uuid}
          </p>
        </div>
        <div className="flex gap-2">
          {status !== 'CLOSED' && (
            <Button variant="outline" onClick={handleCloseConversation}>
              <X className="h-4 w-4 mr-2" />
              Cerrar conversación
            </Button>
          )}
          <Button variant="outline" onClick={() => router.push('/admin/chat')}>
            Volver
          </Button>
        </div>
      </div>

      <Card className="h-[600px] flex flex-col mb-4">
        <CardHeader className="border-b">
          <CardTitle className="text-lg">
            Estado: {status === 'OPEN' ? 'Abierta' : status === 'IN_PROGRESS' ? 'En progreso' : 'Cerrada'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.isFromUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.createdAt).toLocaleString('es-ES')}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
        {status !== 'CLOSED' && (
          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                placeholder="Escribe tu respuesta..."
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              />
              <Button onClick={handleSendReply} disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

