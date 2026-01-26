'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, ARTICLE_TYPE_LABELS } from '@/lib/utils'

const REALIDADES_SLUGS = [
  'porno-sexualidad',
  'presion-social-expectativas-cuerpo',
  'sustancias-chemsex-decisiones',
  'relaciones-consentimiento-limites',
] as const

export function EditableRealitiesPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const { data: session } = useSession()
  const userRole = (session?.user as any)?.role
  const isAdmin = userRole === 'ADMIN'

  const [categories, setCategories] = useState<Array<{
    id: string
    name: string
    slug: string
    order: number
    articles: Array<{
      id: string
      title: string
      slug: string
      excerpt: string | null
      articleType: string
      publishedAt: Date | null
    }>
  }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories')
      if (res.ok) {
        const { categories: cats } = await res.json()
        const realidadesCats = cats.filter((c: any) => REALIDADES_SLUGS.includes(c.slug as any))
        
        // Load articles for each category
        const catsWithArticles = await Promise.all(
          realidadesCats.map(async (cat: any) => {
            const articlesRes = await fetch(`/api/admin/articles?categoryId=${cat.id}`)
            if (articlesRes.ok) {
              const { articles } = await articlesRes.json()
              return {
                ...cat,
                articles: articles.filter((a: any) => a.isPublished).map((a: any) => ({
                  id: a.id,
                  title: a.title,
                  slug: a.slug,
                  excerpt: a.excerpt,
                  articleType: a.articleType,
                  publishedAt: a.publishedAt,
                })),
              }
            }
            return { ...cat, articles: [] }
          })
        )
        setCategories(catsWithArticles.sort((a, b) => a.order - b.order))
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const activeCategory = searchParams.category

  if (loading) {
    return <div className="container py-8 max-w-5xl">Cargando...</div>
  }

  return (
    <div className="container py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Realidades</h1>
          <p className="text-lg text-muted-foreground">
            Revista digital y espacio exploratorio. Historias reales, artículos, noticias y preguntas
            incómodas.
          </p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => window.open('/admin/content', '_blank')}
              className="flex items-center gap-2"
            >
              Editar contenido
            </Button>
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20 p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Modo administrador:</strong> Haz clic en "Editar contenido" para crear y modificar artículos, historias reales, noticias y preguntas incómodas.
          </p>
        </div>
      )}

      <nav className="mb-10 flex flex-wrap gap-2">
        <Link
          href="/realities"
          className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
            !activeCategory ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'
          }`}
        >
          Todas
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={activeCategory === cat.slug ? '/realities' : `/realities?category=${cat.slug}`}
            className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat.slug ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </nav>

      {categories.map((cat) => {
        const articles = activeCategory ? (activeCategory === cat.slug ? cat.articles : []) : cat.articles
        if (activeCategory && activeCategory !== cat.slug) return null

        return (
          <section key={cat.id} id={cat.slug} className="mb-14 scroll-mt-6">
            <h2 className="text-2xl font-semibold mb-6">{cat.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map((a) => (
                <Link key={a.id} href={`/realities/${a.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs font-medium">
                          {ARTICLE_TYPE_LABELS[a.articleType] ?? a.articleType}
                        </Badge>
                        {a.publishedAt && (
                          <span className="text-xs text-muted-foreground">
                            {formatDate(new Date(a.publishedAt))}
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-lg">{a.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {a.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-3">{a.excerpt}</p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            {articles.length === 0 && (
              <p className="text-muted-foreground text-sm">Aún no hay contenido en esta categoría.</p>
            )}
          </section>
        )
      })}

      {categories.length === 0 && (
        <p className="text-muted-foreground text-center py-12">
          No hay categorías disponibles. Comprueba la conexión a la base de datos y ejecuta{' '}
          <code className="rounded bg-muted px-1">npm run db:seed</code>.
        </p>
      )}
    </div>
  )
}
