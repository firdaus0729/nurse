'use client'

import { useState, useId } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X } from 'lucide-react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputId = useId()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al subir la imagen')
      }

      const data = await res.json()
      onChange(data.url)
    } catch (err: any) {
      setError(err.message || 'Error al subir la imagen')
    } finally {
      setUploading(false)
      // Reset input
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={disabled || uploading}
          className="hidden"
          id={inputId}
        />
        <label
          htmlFor={inputId}
          className={disabled || uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        >
          <span className="inline-block">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || uploading}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {uploading ? 'Subiendo...' : 'Subir imagen'}
            </Button>
          </span>
        </label>
        {value && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange('')}
            disabled={disabled}
            className="flex items-center gap-2 text-destructive"
          >
            <X className="h-4 w-4" />
            Eliminar
          </Button>
        )}
      </div>
      {value && (
        <div className="relative w-full h-32 border rounded overflow-hidden">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <input
        type="url"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="O ingresa una URL de imagen"
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
      />
      <p className="text-xs text-muted-foreground">
        Sube una imagen o ingresa una URL. Formatos: JPG, PNG, WEBP, GIF (máx. 5MB)
      </p>
    </div>
  )
}
