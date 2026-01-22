import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container py-16 text-center">
      <div className="flex justify-center mb-6">
        <Image
          src="/logo.jpg"
          alt="BE NURSE Logo"
          width={100}
          height={100}
          className="h-25 w-25 object-contain"
        />
      </div>
      <h1 className="text-4xl font-bold mb-4">404 - Página no encontrada</h1>
      <p className="text-muted-foreground mb-8">
        La página que buscas no existe.
      </p>
      <Link href="/">
        <Button>Volver al inicio</Button>
      </Link>
    </div>
  )
}

