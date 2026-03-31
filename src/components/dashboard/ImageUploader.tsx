import { useCallback, useState, type DragEvent } from 'react'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'

interface ImageUploaderProps {
  onUpload: (file: File) => void
  disabled?: boolean
}

export function ImageUploader({ onUpload, disabled }: ImageUploaderProps) {
  const [dragOver, setDragOver] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    if (file.size > 10 * 1024 * 1024) {
      alert('File must be under 10MB')
      return
    }
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile)
      setSelectedFile(null)
      setPreview(null)
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          'flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors',
          dragOver ? 'border-brand-500 bg-brand-50' : 'border-gray-300 bg-white hover:border-brand-400',
          disabled && 'cursor-not-allowed opacity-50',
        )}
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={disabled ? undefined : handleDrop}
        onClick={() => {
          if (disabled) return
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = 'image/png,image/jpeg,image/jpg,image/webp'
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) handleFile(file)
          }
          input.click()
        }}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="max-h-48 rounded-lg object-contain" />
        ) : (
          <>
            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop an image, or click to browse
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB</p>
          </>
        )}
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2">
          <span className="text-sm text-gray-700">{selectedFile.name}</span>
          <Button size="sm" onClick={handleSubmit} disabled={disabled}>
            Extract Table
          </Button>
        </div>
      )}
    </div>
  )
}
