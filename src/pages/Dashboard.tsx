import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ImageUploader } from '../components/dashboard/ImageUploader'
import { TablePreview } from '../components/dashboard/TablePreview'
import { ExportButtons } from '../components/dashboard/ExportButtons'
import { ConversionHistory } from '../components/dashboard/ConversionHistory'
import { UsageBadge } from '../components/dashboard/UsageBadge'
import { Spinner } from '../components/ui/Spinner'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useConversions } from '../hooks/useConversions'
import { useUsage } from '../hooks/useUsage'
import { useAuth } from '../hooks/useAuth'
import type { TableData } from '../types'

const TRIAL_KEY = 'snaptosheet_trial_used'

export default function Dashboard() {
  const { user } = useAuth()
  const { conversions, refetch } = useConversions()
  const { canConvert } = useUsage()
  const [tableData, setTableData] = useState<TableData | null>(null)
  const [converting, setConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [trialUsed, setTrialUsed] = useState(() => {
    return !user && localStorage.getItem(TRIAL_KEY) === 'true'
  })

  const canUpload = user ? canConvert : !trialUsed

  async function handleUpload(file: File) {
    setError(null)
    setConverting(true)

    try {
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

      if (!user) {
        localStorage.setItem(TRIAL_KEY, 'true')
        setTrialUsed(true)
      }

      if (user) {
        await refetch()
      }
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
        {user && <UsageBadge />}
        {!user && !trialUsed && (
          <span className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800">
            1 free trial conversion
          </span>
        )}
      </div>

      {error && <Alert type="error" message={error} className="mb-6" />}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {!user && trialUsed && !tableData ? (
            <Card className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900">Create an account to continue</h2>
              <p className="mt-3 text-gray-600">
                You've used your free trial conversion. Sign up to get 5 free conversions per month, or upgrade to Pro for unlimited.
              </p>
              <div className="mt-6 flex items-center justify-center gap-4">
                <Link to="/auth">
                  <Button size="lg">Sign Up Free</Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" size="lg">View Pricing</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">Upload Image</h2>
              <ImageUploader onUpload={handleUpload} disabled={converting || !canUpload} />
            </div>
          )}

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

              {!user && trialUsed && (
                <div className="mt-6 rounded-lg bg-brand-50 border border-brand-200 p-4 text-center">
                  <p className="text-sm text-brand-800 font-medium">
                    Want to convert more images?{' '}
                    <Link to="/auth" className="underline font-bold">Sign up free</Link>
                    {' '}for 5 conversions/month.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {user && (
          <div>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">History</h2>
            <ConversionHistory
              conversions={conversions}
              onSelect={(data) => setTableData(data)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
