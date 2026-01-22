'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, AlertCircle, Info } from 'lucide-react'

export default function ChatPage() {
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasAcceptedRules, setHasAcceptedRules] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if there's an existing conversation in localStorage
    const storedConversationId = localStorage.getItem('chatConversationId')
    if (storedConversationId) {
      setConversationId(storedConversationId)
      loadMessages(storedConversationId)
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadMessages = async (convId: string) => {
    try {
      const response = await fetch(`/api/chat/${convId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const messageText = input.trim()
    setInput('')
    setIsLoading(true)

    try {
      let convId = conversationId

      // Create conversation if it doesn't exist
      if (!convId) {
        const createResponse = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: messageText }),
        })

        if (createResponse.ok) {
          const data = await createResponse.json()
          convId = data.conversationId
          setConversationId(convId)
          localStorage.setItem('chatConversationId', convId)
        } else {
          throw new Error('Failed to create conversation')
        }
      } else {
        // Send message to existing conversation
        const sendResponse = await fetch(`/api/chat/${convId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: messageText }),
        })

        if (!sendResponse.ok) {
          throw new Error('Failed to send message')
        }
      }

      // Reload messages
      await loadMessages(convId)
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Error al enviar el mensaje. Por favor, intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!hasAcceptedRules) {
    return (
      <div className="container py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Normas y condiciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Antes de comenzar:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Este servicio es completamente anónimo. No guardamos información personal.</li>
                <li>Las conversaciones son asíncronas. Un profesional de enfermería responderá cuando esté disponible.</li>
                <li>Este NO es un servicio de emergencia. Para emergencias, contacta con el 112.</li>
                <li>Respetamos tu privacidad y confidencialidad en todo momento.</li>
                <li>Las respuestas son de carácter educativo y no sustituyen una consulta médica presencial.</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">
                <strong>Importante:</strong> Si tienes una emergencia médica, contacta inmediatamente
                con los servicios de emergencia (112).
              </p>
            </div>

            <Button
              onClick={() => setHasAcceptedRules(true)}
              className="w-full"
            >
              Acepto y continúo
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Habla con BE NURSE</h1>
        <div className="space-y-4 text-muted-foreground">
          <p>
            <strong className="text-foreground">¿Qué es el chat anónimo?</strong> Es un espacio seguro donde puedes hacer preguntas 
            sobre salud sexual de forma completamente anónima. No necesitas registrarte ni proporcionar datos personales.
          </p>
          <p>
            <strong className="text-foreground">¿Para qué sirve?</strong> Para resolver dudas, recibir información fiable y obtener 
            acompañamiento profesional sobre temas de salud sexual, prevención de ITS y bienestar.
          </p>
          <p>
            <strong className="text-foreground">Confidencialidad:</strong> Todas las conversaciones son 100% anónimas. 
            No guardamos información personal identificable. Tu privacidad es nuestra prioridad.
          </p>
        </div>
      </div>

      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground mb-1">Este NO es un servicio de emergencia.</p>
              <p>
                Un profesional de enfermería responderá cuando esté disponible. Para emergencias médicas, 
                contacta inmediatamente con el <strong>112</strong>. Todas las conversaciones son anónimas y asíncronas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="h-[500px] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="text-lg">Conversación</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>Envía un mensaje para comenzar la conversación.</p>
              <p className="text-sm mt-2">Un profesional de enfermería responderá cuando esté disponible.</p>
            </div>
          ) : (
            messages.map((message) => (
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
                    {new Date(message.createdAt).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          {messages.length > 0 && messages[messages.length - 1]?.isFromUser && (
            <div className="flex justify-start">
              <div className="bg-secondary text-secondary-foreground rounded-lg p-3 max-w-[80%]">
                <p className="text-sm italic">Un profesional de enfermería responderá cuando esté disponible.</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe tu mensaje..."
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
            <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

