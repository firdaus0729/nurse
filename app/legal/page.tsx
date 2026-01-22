import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function LegalPage() {
  const page = await prisma.page.findUnique({
    where: { slug: 'legal' },
    include: {
      sections: {
        orderBy: { order: 'asc' },
      },
    },
  })

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Aviso legal</h1>
      
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
          <h2 className="text-2xl font-semibold mb-4">Información general</h2>
          <p className="text-muted-foreground mb-6">
            BE NURSE es una plataforma educativa sobre salud sexual. La información
            proporcionada tiene carácter educativo y no sustituye una consulta médica presencial.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Limitación de responsabilidad</h2>
          <p className="text-muted-foreground mb-6">
            BE NURSE no se hace responsable de las decisiones tomadas basándose en la
            información proporcionada en la plataforma. Para situaciones de emergencia,
            siempre contacta con los servicios de emergencia (112).
          </p>

          <h2 className="text-2xl font-semibold mb-4">Servicio de emergencia</h2>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Importante</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Este servicio NO es un servicio de emergencia. Si tienes una emergencia médica,
                contacta inmediatamente con el 112 o acude al servicio de urgencias más cercano.
              </p>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-semibold mb-4">Propiedad intelectual</h2>
          <p className="text-muted-foreground mb-6">
            Todo el contenido de BE NURSE está protegido por derechos de autor. No está
            permitida la reproducción sin autorización previa.
          </p>
        </div>
      )}
    </div>
  )
}

