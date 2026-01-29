import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatDate, ARTICLE_TYPE_LABELS } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function ArticlePage({
  params,
}: {
  params: { slug: string }
}) {
  const session = await getServerSession(authOptions)
  const userRole = (session?.user as any)?.role
  const isAdmin = userRole === 'ADMIN'

  let article: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    content: string
    imageUrl: string | null
    articleType: string
    category: { id: string; name: string; slug: string } | null
    tags: Array<{ id: string; name: string; slug: string }>
    publishedAt: Date | null
    isPublished: boolean
  } | null = null

  try {
    article = await prisma.article.findUnique({
      where: { slug: params.slug },
      include: {
        category: true,
        tags: true,
      },
    })
  } catch (e) {
    console.error('Database connection error:', e)
  }

  // Only published articles are public. Admins can preview drafts.
  if (!article || (!article.isPublished && !isAdmin)) {
    notFound()
  }

  // Only count views for public (published) reads
  if (article.isPublished) {
    try {
      await prisma.article.update({
        where: { id: article.id },
        data: { viewCount: { increment: 1 } },
      })
    } catch {
      // ignore view-count errors
    }
  }

  const typeLabel = ARTICLE_TYPE_LABELS[article.articleType] ?? article.articleType

  return (
    <div className="container py-8 max-w-4xl">
      <Link href="/realities" className="text-primary hover:underline mb-4 inline-block">
        ← Volver a Realidades
      </Link>

      {article.imageUrl && (
        <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      <article>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="secondary">{typeLabel}</Badge>
          {!article.isPublished && isAdmin && <Badge variant="outline">Borrador</Badge>}
          {article.publishedAt && (
            <span className="text-sm text-muted-foreground">{formatDate(article.publishedAt)}</span>
          )}
          {article.category && (
            <Link
              href={`/realities?category=${article.category.slug}`}
              className="text-sm text-primary hover:underline"
            >
              {article.category.name}
            </Link>
          )}
        </div>

        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

        {article.excerpt && (
          <p className="text-xl text-muted-foreground mb-8">{article.excerpt}</p>
        )}

        <div
          className="prose max-w-none prose-p:leading-relaxed prose-ul:my-4 prose-li:my-1"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {article.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-sm font-semibold mb-2">Etiquetas:</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/realities?tag=${tag.slug}`}
                  className="px-3 py-1 bg-secondary rounded-md text-sm hover:bg-secondary/80"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
