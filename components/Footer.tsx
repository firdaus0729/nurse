import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-b from-background to-secondary/30 mt-16">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-3 mb-4 hover:opacity-80 transition-opacity">
              <Image
                src="/logo.png"
                alt="BE NURSE Logo"
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
              <h3 className="font-bold text-lg">BE NURSE</h3>
            </Link>
            <p className="text-sm text-muted-foreground">
              Plataforma educativa y de apoyo comunitario sobre salud sexual.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/learn" className="text-muted-foreground hover:text-primary">
                  Infórmate
                </Link>
              </li>
              <li>
                <Link href="/take-care" className="text-muted-foreground hover:text-primary">
                  Cuídate
                </Link>
              </li>
              <li>
                <Link href="/realities" className="text-muted-foreground hover:text-primary">
                  Realidades
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  Sobre nosotros
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/legal" className="text-muted-foreground hover:text-primary">
                  Aviso legal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Importante</h4>
            <p className="text-sm text-muted-foreground">
              Este servicio <strong>NO es una emergencia</strong>. Para emergencias médicas,
              contacta con el <strong>112</strong>.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} BE NURSE. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

