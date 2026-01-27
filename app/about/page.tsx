import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactForm } from '@/components/ContactForm'

export default async function AboutPage() {
  const page = await prisma.page.findUnique({
    where: { slug: 'about' },
    include: {
      sections: {
        orderBy: { order: 'asc' },
      },
    },
  })

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Contacto</h1>
      
      {page ? (
        <div className="prose max-w-none">
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
      ) : (
        <div className="prose max-w-none">
          <p className="text-lg text-muted-foreground mb-6">
            BE NURSE es una plataforma educativa y de apoyo comunitario sobre salud sexual,
            diseñada especialmente para adolescentes y jóvenes.
          </p>
          <h2 className="text-2xl font-semibold mb-4">Nuestra misión</h2>
          <p className="text-muted-foreground mb-6">
            Proporcionar información confiable, recursos útiles y apoyo profesional
            de forma anónima y accesible.
          </p>
          <h2 className="text-2xl font-semibold mb-4">Contacto</h2>
          <p className="text-muted-foreground mb-6">
            Puedes contactarnos a través del chat, el formulario de contacto o escribirnos a través de la plataforma.
          </p>
        </div>
      )}

      <div className="mt-12 mb-12">
        <ContactForm />
      </div>

      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Información importante</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              <strong>Este servicio NO es una emergencia.</strong> Si tienes una emergencia médica,
              contacta inmediatamente con los servicios de emergencia (112 en España).
            </p>
            <p className="text-sm text-muted-foreground">
              Todas las conversaciones son completamente anónimas. No guardamos información
              personal identificable y respetamos tu privacidad en todo momento.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

