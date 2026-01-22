import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function ArticlePage({
  params,
}: {
  params: { slug: string }
}) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      tags: true,
    },
  })

  if (!article || !article.isPublished) {
    notFound()
  }

  // Increment view count
  await prisma.article.update({
    where: { id: article.id },
    data: { viewCount: { increment: 1 } },
  })

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
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        
        <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
          {article.publishedAt && (
            <span>{formatDate(article.publishedAt)}</span>
          )}
          {article.category && (
            <Link
              href={`/realities?category=${article.category.slug}`}
              className="hover:text-primary"
            >
              {article.category.name}
            </Link>
          )}
        </div>

        {article.excerpt && (
          <p className="text-xl text-muted-foreground mb-8">{article.excerpt}</p>
        )}

        <div
          className="prose max-w-none"
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

