import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const ARTICLE_TYPE_LABELS: Record<string, string> = {
  HISTORIA_REAL: 'Historia real',
  ARTICULO: 'Artículo',
  NOTICIA: 'Noticia',
  PREGUNTA_INCOMODA: 'Pregunta incómoda',
}
