import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ImageUploader } from '../dashboard/ImageUploader'
import { TablePreview } from '../dashboard/TablePreview'
import { ExportButtons } from '../dashboard/ExportButtons'
import { Spinner } from '../ui/Spinner'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { useAuth } from '../../hooks/useAuth'
import type { TableData } from '../../types'

const TRIAL_KEY = 'snaptosheet_trial_used'

export function Hero() {
  const { user } = useAuth()
  const [tableData, setTableData] = useState<TableData | null>(null)
  const [converting, setConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [trialUsed, setTrialUsed] = useState(() => {
    return !user && localStorage.getItem(TRIAL_KEY) === 'true'
  })

  const canUpload = user ? true : !trialUsed

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

      const res = await fetch('/.netlify/functions/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, fileName: file.name }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Conversion failed')
      }

      setTableData(result.data)

      if (!user) {
        localStorage.setItem(TRIAL_KEY, 'true')
        setTrialUsed(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setConverting(false)
    }
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
            Turn Photos Into{' '}
            <span className="text-brand-600">Spreadsheets</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Snap a picture of any table, menu, receipt, or schedule and instantly
            convert it into an editable spreadsheet. Download as CSV or Excel in
            seconds.
          </p>
        </div>

        <div className="mt-10 space-y-6">
          {error && <Alert type="error" message={error} />}

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
          ) : !tableData ? (
            <div>
              <p className="mb-3 text-center text-sm font-medium text-gray-500">
                {user ? 'Upload an image to get started' : 'Try it free — no account required'}
              </p>
              <ImageUploader onUpload={handleUpload} disabled={converting || !canUpload} />
            </div>
          ) : null}

          {converting && (
            <div className="flex items-center justify-center gap-3 rounded-lg bg-blue-50 px-4 py-3">
              <Spinner className="h-5 w-5" />
              <span className="text-sm text-blue-700">Extracting table data...</span>
            </div>
          )}

          {tableData && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Your Spreadsheet</h2>
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

              {(user || !trialUsed) && (
                <div className="mt-4 text-center">
                  <Button variant="outline" onClick={() => setTableData(null)}>
                    Convert Another Image
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
