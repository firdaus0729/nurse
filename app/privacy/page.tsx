import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function PrivacyPage() {
  let page = null
  try {
    page = await prisma.page.findUnique({
      where: { slug: 'privacy' },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    })
  } catch {
    // Table may not exist yet (e.g. before first migration); use fallback content
  }

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Política de privacidad</h1>
      
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
          <h2 className="text-2xl font-semibold mb-4">Anonimato y privacidad</h2>
          <p className="text-muted-foreground mb-6">
            En BE NURSE, tu privacidad es nuestra prioridad. Todas las conversaciones
            son completamente anónimas. No recopilamos información personal identificable
            como nombres, direcciones de correo electrónico, números de teléfono o direcciones IP.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Datos que no guardamos</h2>
          <ul className="list-disc list-inside text-muted-foreground mb-6">
            <li>Direcciones IP</li>
            <li>Información de navegador o dispositivo</li>
            <li>Ubicación geográfica</li>
            <li>Cualquier dato personal identificable</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">Datos que guardamos</h2>
          <p className="text-muted-foreground mb-6">
            Únicamente guardamos los mensajes de las conversaciones de forma anónima,
            asociados a un identificador único (UUID) que no puede ser vinculado a tu identidad.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Uso de la información</h2>
          <p className="text-muted-foreground mb-6">
            La información proporcionada en las conversaciones se utiliza exclusivamente
            para proporcionar apoyo educativo y responder a tus consultas. No compartimos
            esta información con terceros.
          </p>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Contacto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Si tienes preguntas sobre nuestra política de privacidad, puedes contactarnos
                a través de la plataforma.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

