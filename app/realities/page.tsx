import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, ARTICLE_TYPE_LABELS } from '@/lib/utils'

const REALIDADES_SLUGS = [
  'porno-sexualidad',
  'presion-social-expectativas-cuerpo',
  'sustancias-chemsex-decisiones',
  'relaciones-consentimiento-limites',
] as const

export default async function RealitiesPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  let categories: Array<{
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
  }> = []

  try {
    const cats = await prisma.category.findMany({
      where: { slug: { in: [...REALIDADES_SLUGS] } },
      orderBy: { order: 'asc' },
      include: {
        articles: {
          where: { isPublished: true },
          orderBy: { publishedAt: 'desc' },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            articleType: true,
            publishedAt: true,
          },
        },
      },
    })
    categories = cats
  } catch (e) {
    console.error('Database connection error:', e)
  }

  const activeCategory = searchParams.category

  return (
    <div className="container py-8 max-w-5xl">
      <h1 className="text-4xl font-bold mb-2">Realidades</h1>
      <p className="text-lg text-muted-foreground mb-12">
        Revista digital y espacio exploratorio. Historias reales, artículos, noticias y preguntas
        incómodas.
      </p>

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
                            {formatDate(a.publishedAt)}
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
