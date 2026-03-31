import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ImageUploader } from '../components/dashboard/ImageUploader'
import { TablePreview } from '../components/dashboard/TablePreview'
import { ExportButtons } from '../components/dashboard/ExportButtons'
import { ConversionHistory } from '../components/dashboard/ConversionHistory'
import { useConversions } from '../hooks/useConversions'
import { useUsage } from '../hooks/useUsage'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import type { TableData } from '../types'

const TRIAL_KEY = 'imgtosheet_trial_used'

export default function Dashboard() {
  const { user } = useAuth()
  const { conversions, refetch } = useConversions()
  const { canConvert, used, limit, plan } = useUsage()
  const [tableData, setTableData] = useState<TableData | null>(null)
  const [converting, setConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [trialUsed, setTrialUsed] = useState(() => {
    return !user && localStorage.getItem(TRIAL_KEY) === 'true'
  })

  const canUpload = user ? canConvert : !trialUsed
  const limitReached = user && !canConvert

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

      // Include auth token if logged in
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (user) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`
        }
      }

      const res = await fetch('/.netlify/functions/convert', {
        method: 'POST',
        headers,
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
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-4xl">Dashboard</h1>
        {user && (
          <span className="text-sm text-gray-500">
            {`${used}/${limit} conversions`} this month
          </span>
        )}
      </div>

      {error && <p className="mb-6 text-sm text-red-600">{error}</p>}

      <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
        <div className="space-y-8">
          {/* Anonymous trial exhausted */}
          {!user && trialUsed && !tableData ? (
            <div className="border border-gray-200 px-8 py-12 text-center">
              <h2 className="font-serif text-2xl">Create an account to continue</h2>
              <p className="mt-3 text-sm text-gray-500">
                Sign up to get 5 free conversions per month.
              </p>
              <div className="mt-6 flex items-center justify-center gap-4">
                <Link
                  to="/auth"
                  className="bg-accent text-white px-8 py-2.5 text-sm font-medium hover:bg-accent-hover transition-colors"
                >
                  Sign up free
                </Link>
                <Link to="/pricing" className="text-sm text-gray-500 underline underline-offset-4 hover:text-black">
                  View pricing
                </Link>
              </div>
            </div>
          ) : limitReached && !tableData ? (
            /* Logged-in user hit their plan limit */
            <div className="border border-gray-200 px-8 py-12 text-center">
              <h2 className="font-serif text-2xl">You've hit your monthly limit</h2>
              <p className="mt-3 text-sm text-gray-500">
                You've used all {limit} conversions this month on the {plan} plan.
                Upgrade to get more.
              </p>
              <div className="mt-6 flex items-center justify-center gap-4">
                <Link
                  to="/pricing"
                  className="bg-accent text-white px-8 py-2.5 text-sm font-medium hover:bg-accent-hover transition-colors"
                >
                  Upgrade plan
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-3 text-sm text-gray-500">Upload an image</p>
              <ImageUploader onUpload={handleUpload} disabled={converting || !canUpload} />
              {converting && (
                <p className="mt-3 text-xs text-gray-400">Extracting table data...</p>
              )}
            </div>
          )}

          {tableData && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-2xl">Result</h2>
                <ExportButtons data={tableData} />
              </div>
              <TablePreview data={tableData} onDataChange={setTableData} />

              {!user && trialUsed && (
                <p className="mt-6 text-sm text-gray-500">
                  Want more?{' '}
                  <Link to="/auth" className="text-accent font-medium underline underline-offset-4">
                    Sign up free
                  </Link>
                </p>
              )}
            </div>
          )}
        </div>

        {user && (
          <div>
            <p className="mb-4 text-sm text-gray-500">History</p>
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
