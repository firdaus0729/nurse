'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

type Msg = { id: string; content: string; isFromUser: boolean; createdAt: string }
type Conv = {
  id: string
  uuid: string
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED'
  createdAt: string
  updatedAt: string
  messages: Msg[]
}

export default function AdminChatPage() {
  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState<Conv[]>([])
  const [replyForConversationId, setReplyForConversationId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)
  const pollRef = useRef<number | null>(null)

  const load = async () => {
    try {
      const res = await fetch('/api/admin/chat-feed?limit=50&messagesPerConversation=50', {
        cache: 'no-store',
      })
      if (!res.ok) return
      const data = await res.json()
      setConversations(data.conversations || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    pollRef.current = window.setInterval(load, 5000)
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current)
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-yellow-100 text-yellow-800'
      case 'IN_PROGRESS':
        return 'bg-primary/20 text-primary'
      case 'CLOSED':
        return 'bg-muted text-muted-foreground'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const statusLabels: Record<string, string> = useMemo(
    () => ({
      OPEN: 'Abierta',
      IN_PROGRESS: 'En progreso',
      CLOSED: 'Cerrada',
    }),
    []
  )

  const sendReply = async (conversationId: string) => {
    if (!replyText.trim() || sending) return
    setSending(true)
    try {
      const res = await fetch(`/api/admin/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyText.trim() }),
      })
      if (!res.ok) throw new Error('Failed to send reply')
      setReplyText('')
      setReplyForConversationId(null)
      await load()
    } catch (e) {
      console.error(e)
      alert('Error al enviar la respuesta.')
    } finally {
      setSending(false)
    }
  }

  if (loading) return <div>Cargando...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Chat (todas las conversaciones)</h1>
        <Link href="/admin/chat" className="text-sm text-muted-foreground hover:underline">
          Actualiza automáticamente cada 5s
        </Link>
      </div>

      <div className="space-y-6">
        {conversations.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-lg">
                    Conversación {c.uuid.substring(0, 8)}...
                  </CardTitle>
                  <div className="text-xs text-muted-foreground mt-1">
                    Inicio: {formatDate(new Date(c.createdAt))} · Última actividad:{' '}
                    {formatDate(new Date(c.updatedAt))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(c.status)}>{statusLabels[c.status]}</Badge>
                  <Link
                    href={`/admin/chat/${c.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    Ver detalle
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {c.messages.map((m) => (
                  <div key={m.id} className="flex items-start justify-between gap-3">
                    <div
                      className={`flex-1 rounded-lg border p-3 ${
                        m.isFromUser ? 'bg-primary/5 border-primary/20' : 'bg-secondary/40'
                      }`}
                    >
                      <div className="text-xs text-muted-foreground mb-1">
                        {m.isFromUser ? 'Usuario' : 'Admin'} ·{' '}
                        {new Date(m.createdAt).toLocaleString('es-ES')}
                      </div>
                      <div className="text-sm whitespace-pre-wrap">{m.content}</div>
                    </div>
                    {c.status !== 'CLOSED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setReplyForConversationId(c.id)
                          setReplyText('')
                        }}
                      >
                        Reply
                      </Button>
                    )}
                  </div>
                ))}

                {replyForConversationId === c.id && c.status !== 'CLOSED' && (
                  <div className="mt-4 rounded-lg border p-3">
                    <div className="text-sm font-medium mb-2">Responder ahora</div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Escribe tu respuesta..."
                        className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={sending}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') sendReply(c.id)
                        }}
                      />
                      <Button onClick={() => sendReply(c.id)} disabled={sending || !replyText.trim()}>
                        Enviar
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setReplyForConversationId(null)
                          setReplyText('')
                        }}
                        disabled={sending}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {conversations.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No hay conversaciones aún.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

