import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, ARTICLE_TYPE_LABELS } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function RealitiesPage({
  searchParams,
}: {
  searchParams: { category?: string; tag?: string }
}) {
  const session = await getServerSession(authOptions)
  const userRole = (session?.user as any)?.role
  const isAdmin = userRole === 'ADMIN'

  const activeCategorySlug = searchParams.category?.trim() || ''
  const activeTagSlug = searchParams.tag?.trim() || ''

  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
  })

  const articles = await prisma.article.findMany({
    where: {
      isPublished: true,
      ...(activeCategorySlug
        ? { category: { slug: activeCategorySlug } }
        : {}),
      ...(activeTagSlug ? { tags: { some: { slug: activeTagSlug } } } : {}),
    },
    include: {
      category: true,
      tags: true,
    },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
  })

  const categoriesWithArticles = categories
    .map((cat) => ({
      ...cat,
      articles: articles.filter((a) => a.categoryId === cat.id),
    }))
    .filter((cat) => cat.articles.length > 0 || activeCategorySlug === cat.slug)

  return (
    <div className="container py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Realidades</h1>
          <p className="text-lg text-muted-foreground">
            Revista digital y espacio exploratorio. Historias reales, artículos, noticias y preguntas incómodas.
          </p>
        </div>
        {isAdmin && (
          <Button variant="outline" asChild>
            <Link href="/admin/content" target="_blank" rel="noopener noreferrer">
              Editar contenido
            </Link>
          </Button>
        )}
      </div>

      {isAdmin && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20 p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Modo administrador:</strong> usa “Editar contenido” para crear y publicar artículos.
          </p>
        </div>
      )}

      <nav className="mb-10 flex flex-wrap gap-2">
        <Link
          href="/realities"
          className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
            !activeCategorySlug && !activeTagSlug
              ? 'bg-primary text-primary-foreground border-primary'
              : 'hover:bg-accent'
          }`}
        >
          Todas
        </Link>
        {categoriesWithArticles.map((cat) => (
          <Link
            key={cat.id}
            href={
              activeCategorySlug === cat.slug && !activeTagSlug
                ? '/realities'
                : `/realities?category=${encodeURIComponent(cat.slug)}`
            }
            className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
              activeCategorySlug === cat.slug && !activeTagSlug
                ? 'bg-primary text-primary-foreground border-primary'
                : 'hover:bg-accent'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </nav>

      {categoriesWithArticles.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          No hay contenido publicado todavía.
        </p>
      ) : (
        categoriesWithArticles.map((cat) => {
          if (activeCategorySlug && activeCategorySlug !== cat.slug) return null

          const catArticles = cat.articles
          return (
            <section key={cat.id} id={cat.slug} className="mb-14 scroll-mt-6">
              <h2 className="text-2xl font-semibold mb-6">{cat.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {catArticles.map((a) => (
                  <Link key={a.id} href={`/realities/${a.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                      <div className="relative h-44 w-full overflow-hidden bg-muted">
                        <Image
                          src={a.imageUrl || '/logo.png'}
                          alt={a.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
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
                        {a.excerpt ? (
                          <p className="text-sm text-muted-foreground line-clamp-3">{a.excerpt}</p>
                        ) : null}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              {catArticles.length === 0 && (
                <p className="text-muted-foreground text-sm">Aún no hay contenido en esta categoría.</p>
              )}
            </section>
          )
        })
      )}
    </div>
  )
}
