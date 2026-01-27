import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MessageCircle, Users, FileText } from 'lucide-react'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  const [conversationsCount, messagesCount, openConversations, articlesCount] =
    await Promise.all([
      prisma.conversation.count(),
      prisma.message.count(),
      prisma.conversation.count({ where: { status: 'OPEN' } }),
      prisma.article.count({ where: { isPublished: true } }),
    ])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Conversaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{conversationsCount}</div>
            <p className="text-sm text-muted-foreground mt-2">
              {openConversations} abiertas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Mensajes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{messagesCount}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Total de mensajes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Artículos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{articlesCount}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Publicados
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Acciones rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/chat">
              <Button variant="outline" className="w-full justify-start">
                Ver conversaciones
              </Button>
            </Link>
            <Link href="/admin/carousel">
              <Button variant="outline" className="w-full justify-start">
                Gestionar carrusel
              </Button>
            </Link>
            <Link href="/admin/quick-access">
              <Button variant="outline" className="w-full justify-start">
                Gestionar accesos rápidos
              </Button>
            </Link>
            <Link href="/admin/content">
              <Button variant="outline" className="w-full justify-start">
                Gestionar contenido
              </Button>
            </Link>
            <Link href="/admin/learn">
              <Button variant="outline" className="w-full justify-start">
                Editar Infórmate
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

