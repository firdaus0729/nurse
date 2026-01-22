import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default async function RealitiesPage({
  searchParams,
}: {
  searchParams: { category?: string; tag?: string }
}) {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  const where: any = {
    isPublished: true,
  }

  if (searchParams.category) {
    where.category = { slug: searchParams.category }
  }

  if (searchParams.tag) {
    where.tags = {
      some: { slug: searchParams.tag }
    }
  }

  const articles = await prisma.article.findMany({
    where,
    include: {
      category: true,
      tags: true,
    },
    orderBy: { publishedAt: 'desc' },
  })

  const featuredArticles = articles.filter(a => a.isFeatured).slice(0, 3)
  const regularArticles = articles.filter(a => !a.isFeatured)

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Realidades</h1>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/realities"
          className={`px-4 py-2 rounded-md border ${
            !searchParams.category && !searchParams.tag
              ? 'bg-primary text-primary-foreground'
              : 'bg-background hover:bg-accent'
          }`}
        >
          Todas
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/realities?category=${category.slug}`}
            className={`px-4 py-2 rounded-md border ${
              searchParams.category === category.slug
                ? 'bg-primary text-primary-foreground'
                : 'bg-background hover:bg-accent'
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <Link key={article.id} href={`/realities/${article.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  {article.imageUrl && (
                    <div className="relative h-48 w-full">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="object-cover w-full h-full rounded-t-lg"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{article.title}</CardTitle>
                    {article.excerpt && (
                      <CardDescription>{article.excerpt}</CardDescription>
                    )}
                    {article.publishedAt && (
                      <p className="text-sm text-muted-foreground">
                        {formatDate(article.publishedAt)}
                      </p>
                    )}
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Regular Articles */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Todos los artículos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularArticles.map((article) => (
            <Link key={article.id} href={`/realities/${article.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{article.title}</CardTitle>
                  {article.excerpt && (
                    <CardDescription>{article.excerpt}</CardDescription>
                  )}
                  {article.publishedAt && (
                    <p className="text-sm text-muted-foreground">
                      {formatDate(article.publishedAt)}
                    </p>
                  )}
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {articles.length === 0 && (
        <p className="text-muted-foreground text-center py-12">
          No hay artículos disponibles en este momento.
        </p>
      )}
    </div>
  )
}

