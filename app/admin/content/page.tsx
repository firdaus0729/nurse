import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FileText, Plus } from 'lucide-react'

export default async function AdminContentPage() {
  const session = await getServerSession(authOptions)

  const articles = await prisma.article.findMany({
    include: {
      category: true,
      tags: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Contenido</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo artículo
        </Button>
      </div>

      <div className="space-y-4">
        {articles.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{article.title}</CardTitle>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    article.isPublished
                      ? 'bg-green-100 text-green-800'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {article.isPublished ? 'Publicado' : 'Borrador'}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {article.excerpt && (
                <p className="text-sm text-muted-foreground mb-4">
                  {article.excerpt}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {article.category && (
                  <span>Categoría: {article.category.name}</span>
                )}
                <span>Vistas: {article.viewCount}</span>
                {article.isFeatured && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                    Destacado
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {articles.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No hay artículos. Crea uno nuevo para comenzar.
          </CardContent>
        </Card>
      )}
    </div>
  )
}

