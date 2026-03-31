import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import type { TableData } from '../../types'
import { ImageUploader } from '../dashboard/ImageUploader'
import { TablePreview } from '../dashboard/TablePreview'
import { ExportButtons } from '../dashboard/ExportButtons'

const TRIAL_KEY = 'snaptosheet_trial_used'

const mockBefore = [
  ['Product', 'Q1', 'Q2', 'Q3'],
  ['Widget A', '$12,400', '$14,200', '$13,800'],
  ['Widget B', '$8,900', '$9,100', '$11,200'],
  ['Widget C', '$22,000', '$19,500', '$24,100'],
]

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

  if (tableData) {
    return (
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-3xl">Your spreadsheet</h2>
            <ExportButtons data={tableData} />
          </div>
          <TablePreview data={tableData} onDataChange={setTableData} />

          <div className="mt-8 flex items-center gap-4">
            {(user || !trialUsed) && (
              <button
                onClick={() => setTableData(null)}
                className="text-sm text-gray-500 underline underline-offset-4 hover:text-black"
              >
                Convert another image
              </button>
            )}
            {!user && trialUsed && (
              <p className="text-sm text-gray-500">
                Want more?{' '}
                <Link to="/auth" className="text-accent font-medium underline underline-offset-4">
                  Sign up free
                </Link>{' '}
                for 5 conversions/month.
              </p>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-16 lg:grid-cols-[55%_45%] lg:items-center">
          {/* Left column */}
          <div>
            <h1 className="font-serif text-6xl leading-[1.05] tracking-tight sm:text-7xl lg:text-[88px]">
              Any image.<br />
              <em className="text-accent">Clean data.</em>
            </h1>
            <p className="mt-6 max-w-md text-lg text-gray-600 leading-relaxed">
              Upload a screenshot of any table and get a clean CSV or Excel file
              in seconds. No retyping. No broken Excel features.
            </p>

            {error && (
              <p className="mt-4 text-sm text-red-600">{error}</p>
            )}

            {!user && trialUsed ? (
              <div className="mt-8">
                <Link
                  to="/auth"
                  className="inline-flex items-center bg-accent text-white px-8 py-3.5 text-sm font-medium hover:bg-accent-hover transition-colors"
                >
                  Sign up to continue &rarr;
                </Link>
                <p className="mt-3 text-xs text-gray-400">
                  5 free conversions/month with an account
                </p>
              </div>
            ) : (
              <div className="mt-8">
                <ImageUploader onUpload={handleUpload} disabled={converting || !canUpload} />
                {converting ? (
                  <p className="mt-3 text-xs text-gray-400">
                    Extracting table data...
                  </p>
                ) : (
                  <p className="mt-3 text-xs text-gray-400">
                    5 free conversions &middot; No account required
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right column — before/after visual */}
          <div className="hidden lg:block">
            <div className="flex gap-0 overflow-hidden">
              {/* Before: blurry image */}
              <div className="flex-1 bg-white border border-gray-200 p-4 -rotate-1 opacity-80 blur-[0.5px]">
                <div className="space-y-0">
                  {mockBefore.map((row, ri) => (
                    <div key={ri} className={`grid grid-cols-4 ${ri === 0 ? 'border-b border-gray-300' : ''}`}>
                      {row.map((cell, ci) => (
                        <div
                          key={ci}
                          className={`px-3 py-2 text-xs ${
                            ri === 0
                              ? 'font-medium text-gray-500 font-sans'
                              : 'font-mono text-gray-700'
                          } ${ri > 0 && ri % 2 === 0 ? 'bg-gray-50' : ''}`}
                        >
                          {cell}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="flex flex-col items-center justify-center px-4">
                <div className="w-px h-full bg-gray-300" />
                <span className="my-2 text-gray-400 text-lg">&rarr;</span>
                <div className="w-px h-full bg-gray-300" />
              </div>

              {/* After: clean spreadsheet */}
              <div className="flex-1 bg-white border border-gray-200 p-4 rotate-0">
                <div className="space-y-0">
                  {mockBefore.map((row, ri) => (
                    <div key={ri} className={`grid grid-cols-4 ${ri === 0 ? 'border-b-2 border-accent' : 'border-b border-gray-100'}`}>
                      {row.map((cell, ci) => (
                        <div
                          key={ci}
                          className={`px-3 py-2 text-xs ${
                            ri === 0
                              ? 'font-medium text-black font-mono uppercase tracking-wider text-[10px]'
                              : 'font-mono text-gray-900'
                          } ${ri > 0 && ri % 2 === 0 ? 'bg-gray-50/50' : ''}`}
                        >
                          {cell}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
