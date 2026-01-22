import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export default async function AdminChatPage() {
  const session = await getServerSession(authOptions)

  const conversations = await prisma.conversation.findMany({
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
        take: 1,
      },
      _count: {
        select: { messages: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Conversaciones</h1>

      <div className="space-y-4">
        {conversations.map((conversation) => {
          const firstMessage = conversation.messages[0]
          const statusLabels: Record<string, string> = {
            OPEN: 'Abierta',
            IN_PROGRESS: 'En progreso',
            CLOSED: 'Cerrada',
          }

          return (
            <Link key={conversation.id} href={`/admin/chat/${conversation.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Conversación {conversation.uuid.substring(0, 8)}...
                    </CardTitle>
                    <Badge className={getStatusColor(conversation.status)}>
                      {statusLabels[conversation.status]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {firstMessage && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {firstMessage.content}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{conversation._count.messages} mensajes</span>
                    <span>{formatDate(conversation.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}

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

