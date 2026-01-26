'use client'

import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, X, Check, AlertCircle } from 'lucide-react'

export default function AdminUploadPage() {
  const { data: session } = useSession()
  const userRole = (session?.user as any)?.role
  const isAdmin = userRole === 'ADMIN'

  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ url: string; filename: string }>>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    setSuccess('')
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al subir la imagen')
      }

      setSuccess(`Imagen subida exitosamente: ${data.filename}`)
      setUploadedFiles((prev) => [{ url: data.url, filename: data.filename }, ...prev])
      
      // Clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err: any) {
      setError(err.message || 'Error al subir la imagen')
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess('URL copiada al portapapeles')
    setTimeout(() => setSuccess(''), 2000)
  }

  if (!isAdmin) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Solo los administradores pueden acceder a esta página.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Subir Imágenes</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Subir nueva imagen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
            />
            <Button
              onClick={handleButtonClick}
              disabled={uploading}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {uploading ? 'Subiendo...' : 'Seleccionar y subir imagen'}
            </Button>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
                <Check className="h-5 w-5" />
                <span>{success}</span>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              Formatos permitidos: JPG, PNG, WEBP, GIF. Tamaño máximo: 5MB.
            </p>
          </div>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Imágenes subidas recientemente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="relative w-full h-32 bg-gray-100 rounded overflow-hidden">
                    <img
                      src={file.url}
                      alt={file.filename}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{file.filename}</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={file.url}
                      readOnly
                      className="flex-1 text-xs px-2 py-1 border rounded bg-gray-50"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(file.url)}
                      className="text-xs"
                    >
                      Copiar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
