import { useState } from 'react'
import { ImageUploader } from '../components/dashboard/ImageUploader'
import { TablePreview } from '../components/dashboard/TablePreview'
import { ExportButtons } from '../components/dashboard/ExportButtons'
import { ConversionHistory } from '../components/dashboard/ConversionHistory'
import { UsageBadge } from '../components/dashboard/UsageBadge'
import { Spinner } from '../components/ui/Spinner'
import { Alert } from '../components/ui/Alert'
import { useConversions } from '../hooks/useConversions'
import { useUsage } from '../hooks/useUsage'
import { useAuth } from '../hooks/useAuth'
import type { TableData } from '../types'

export default function Dashboard() {
  const { user } = useAuth()
  const { conversions, refetch } = useConversions()
  const { canConvert } = useUsage()
  const [tableData, setTableData] = useState<TableData | null>(null)
  const [converting, setConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUpload(file: File) {
    if (!user) return
    setError(null)
    setConverting(true)

    try {
      // Convert file to base64
      const buffer = await file.arrayBuffer()
      const bytes = new Uint8Array(buffer)
      let binary = ''
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      const imageBase64 = btoa(binary)

      const res = await fetch(
        '/.netlify/functions/convert',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageBase64, fileName: file.name }),
        },
      )

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Conversion failed')
      }

      setTableData(result.data)
      await refetch()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setConverting(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <UsageBadge />
      </div>

      {error && <Alert type="error" message={error} className="mb-6" />}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">Upload Image</h2>
            <ImageUploader onUpload={handleUpload} disabled={converting || !canConvert} />
          </div>

          {converting && (
            <div className="flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3">
              <Spinner className="h-5 w-5" />
              <span className="text-sm text-blue-700">Extracting table data...</span>
            </div>
          )}

          {tableData && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Table Preview</h2>
                <ExportButtons data={tableData} />
              </div>
              <TablePreview data={tableData} onDataChange={setTableData} />
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">History</h2>
          <ConversionHistory
            conversions={conversions}
            onSelect={(data) => setTableData(data)}
          />
        </div>
      </div>
    </div>
  )
}
