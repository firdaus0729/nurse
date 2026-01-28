'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ARTICLE_TYPE_LABELS } from '@/lib/utils'

type Category = {
  id: string
  name: string
  slug: string
  order: number
}

type Article = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  imageUrl: string | null
  articleType: string
  isPublished: boolean
  publishedAt: string | null
  categoryId: string | null
}

export default function AdminRealitiesPage() {
  const { data: session } = useSession()
  const userRole = (session?.user as any)?.role
  const isAdmin = userRole === 'ADMIN'

  const [categories, setCategories] = useState<Category[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [catsRes, articlesRes] = await Promise.all([
          fetch('/api/admin/categories'),
          fetch('/api/admin/articles'),
        ])

        if (catsRes.ok) {
          const data = await catsRes.json()
          setCategories((data.categories || []).sort((a: any, b: any) => a.order - b.order))
        }
        if (articlesRes.ok) {
          const data = await articlesRes.json()
          setArticles(data.articles || [])
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const byCategory = useMemo(() => {
    const map = new Map<string, Article[]>()
    for (const a of articles) {
      const key = a.categoryId || 'uncategorized'
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(a)
    }
    Array.from(map.values()).forEach((list) => {
      list
        .sort((a, b) => (a.publishedAt || '').localeCompare(b.publishedAt || ''))
        .reverse()
    })
    return map
  }, [articles])

  if (loading) return <div className="container py-8">Cargando…</div>

  return (
    <div className="container py-8">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Realidades (gestión)</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona lo que aparece en la página pública <code>/realities</code>. Los usuarios solo ven contenido{' '}
            <strong>Publicado</strong>.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/realities" target="_blank" rel="noopener noreferrer">
              Ver Realidades (web)
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/content">Abrir editor de contenidos</Link>
          </Button>
        </div>
      </div>

      {!isAdmin && (
        <Card className="mb-6">
          <CardContent className="py-6 text-sm text-muted-foreground">
            Solo los administradores pueden editar. Puedes visualizar el estado del contenido.
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {categories.map((cat) => {
          const list = byCategory.get(cat.id) || []
          const publishedCount = list.filter((a) => a.isPublished).length
          const draftCount = list.length - publishedCount

          return (
            <Card key={cat.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">{cat.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Publicados: {publishedCount} · Borradores: {draftCount}
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin/content">Gestionar artículos</Link>
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                {list.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sin artículos en esta categoría.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {list.slice(0, 9).map((a) => (
                      <Link key={a.id} href="/admin/content" className="block">
                        <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                          <div className="relative h-32 w-full bg-muted">
                            <Image
                              src={a.imageUrl || '/logo.png'}
                              alt={a.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            />
                          </div>
                          <CardHeader className="pb-2">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <Badge variant="secondary" className="text-xs">
                                {ARTICLE_TYPE_LABELS[a.articleType] ?? a.articleType}
                              </Badge>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  a.isPublished
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                {a.isPublished ? 'Publicado' : 'Borrador'}
                              </span>
                            </div>
                            <CardTitle className="text-base line-clamp-2">{a.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            {a.excerpt ? (
                              <p className="text-sm text-muted-foreground line-clamp-2">{a.excerpt}</p>
                            ) : null}
                            <div className="mt-3 text-xs flex items-center gap-3">
                              <Link
                                href={`/realities/${a.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                Ver (web)
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}

                {list.length > 9 && (
                  <p className="text-xs text-muted-foreground mt-3">
                    Mostrando 9 de {list.length}. Para ver/editar todos: “Abrir editor de contenidos”.
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

