import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AccordionSection } from '@/components/AccordionSection'
import { StiCardGrid, type StiItem } from '@/components/StiCardGrid'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default async function LearnPage() {
  const page = await prisma.page.findUnique({
    where: { slug: 'learn' },
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
        slug: 'informacion'
      }
    },
    take: 6,
    orderBy: { publishedAt: 'desc' },
  })

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Infórmate</h1>
      
      {/* Quick navigation cards */}
      {page?.sections?.length ? (
        <div className="mb-10">
          <p className="text-muted-foreground mb-4">
            La sección Infórmate se organiza en bloques navegables. Elige uno para ir directamente:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {page.sections.map((section) => {
              const title = section.title?.trim()
              if (!title) return null
              const id = slugify(title)
              return (
                <a key={section.id} href={`#${id}`} className="group">
                  <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-0.5">
                    <CardHeader>
                      <CardTitle className="text-lg group-hover:text-primary">
                        {title}
                      </CardTitle>
                      <CardDescription>Ver bloque</CardDescription>
                    </CardHeader>
                  </Card>
                </a>
              )
            })}
          </div>
        </div>
      ) : null}

      {page && (
        <div className="prose max-w-none mb-12">
          {page.sections.map((section) => {
            const sectionTitle = section.title?.trim()
            const anchorId = sectionTitle ? slugify(sectionTitle) : undefined

            // Card grid sections (e.g., ITS más comunes)
            if (section.type === 'CARD_GRID') {
              let items: StiItem[] = []
              if (section.metadata) {
                try {
                  const metadata = typeof section.metadata === 'string'
                    ? JSON.parse(section.metadata)
                    : section.metadata
                  if (Array.isArray(metadata.items)) {
                    items = metadata.items as StiItem[]
                  }
                } catch (e) {
                  // ignore parsing errors
                }
              }

              return (
                <section key={section.id} className="mb-10 scroll-mt-24">
                  {sectionTitle && (
                    <h2 id={anchorId} className="text-2xl font-semibold mb-4">
                      {sectionTitle}
                    </h2>
                  )}
                  {items.length > 0 ? (
                    <StiCardGrid items={items} />
                  ) : section.content?.trim() ? (
                    <div
                      className="text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No hay elementos configurados para esta sección.
                    </p>
                  )}
                </section>
              )
            }

            // Check if section is FAQ/Accordion type
            if (section.type === 'FAQ' || section.type === 'ACCORDION') {
              let faqItems: Array<{ question: string; answer: string }> = []
              
              // Try to parse metadata if it contains FAQ items
              if (section.metadata) {
                try {
                  const metadata = typeof section.metadata === 'string' 
                    ? JSON.parse(section.metadata) 
                    : section.metadata
                  
                  if (Array.isArray(metadata.items)) {
                    faqItems = metadata.items
                  } else if (Array.isArray(metadata)) {
                    faqItems = metadata
                  }
                } catch (e) {
                  // If metadata is not valid JSON, treat content as regular content
                }
              }

              return (
                <section key={section.id} className="mb-10 scroll-mt-24">
                  {sectionTitle && (
                    <h2 id={anchorId} className="text-2xl font-semibold mb-4">
                      {sectionTitle}
                    </h2>
                  )}
                  {faqItems.length > 0 ? (
                    <AccordionSection items={faqItems} type={section.type === 'FAQ' ? 'single' : 'multiple'} />
                  ) : (
                    <div 
                      className="text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  )}
                </section>
              )
            }

            // Regular content section
            return (
              <section key={section.id} className="mb-10 scroll-mt-24">
                {sectionTitle && (
                  <h2 id={anchorId} className="text-2xl font-semibold mb-4">
                    {sectionTitle}
                  </h2>
                )}
                <div 
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </section>
            )
          })}
        </div>
      )}

      {articles.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Artículos relacionados</h2>
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

