import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function TakeCarePage() {
  const page = await prisma.page.findUnique({
    where: { slug: 'take-care' },
    include: {
      sections: {
        orderBy: { order: 'asc' },
      },
    },
  })

  const articles = await prisma.article.findMany({
    where: { 
      isPublished: true,
      category: {
        slug: 'prevencion'
      }
    },
    take: 6,
    orderBy: { publishedAt: 'desc' },
  })

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Cuídate</h1>
      
      {page && (
        <div className="prose max-w-none mb-12">
          {page.sections.map((section) => (
            <div key={section.id} className="mb-8">
              {section.title && (
                <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
              )}
              <div 
                className="text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </div>
          ))}
        </div>
      )}

      {articles.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Recursos de prevención</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link key={article.id} href={`/realities/${article.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{article.title}</CardTitle>
                    {article.excerpt && (
                      <CardDescription>{article.excerpt}</CardDescription>
                    )}
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

