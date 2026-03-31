import { useCallback, useState, type DragEvent } from 'react'

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
    <div className="space-y-3">
      <div
        className={`flex min-h-[160px] cursor-pointer flex-col items-center justify-center border-2 border-dashed transition-colors ${
          dragOver ? 'border-accent bg-accent/5' : 'border-gray-300 hover:border-accent'
        } ${disabled ? 'cursor-not-allowed opacity-40' : ''}`}
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
          <img src={preview} alt="Preview" className="max-h-32 object-contain" />
        ) : (
          <>
            <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">
              Drop an image or click to upload
            </p>
          </>
        )}
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-gray-600 truncate">{selectedFile.name}</span>
          <button
            onClick={handleSubmit}
            disabled={disabled}
            className="bg-accent text-white px-6 py-2 text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-40"
          >
            Convert free &rarr;
          </button>
        </div>
      )}
    </div>
  )
}
