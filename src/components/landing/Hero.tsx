import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import type { TableData } from '../../types'
import { ImageUploader } from '../dashboard/ImageUploader'
import { TablePreview } from '../dashboard/TablePreview'
import { ExportButtons } from '../dashboard/ExportButtons'

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

          {/* Right column — scattered real-world image collage */}
          <div className="hidden lg:block">
            <div className="relative h-[420px]">
              {/* Schedule — top left, yellowish paper */}
              <div className="absolute top-0 left-0 w-[260px] -rotate-3 bg-[#FFFDE7] border border-[#E8E4D0] p-4 shadow-[2px_3px_12px_rgba(0,0,0,0.08)]">
                <p className="text-[10px] font-sans font-medium text-gray-400 uppercase tracking-widest mb-3">Schedule</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-sans text-gray-800">Mon 9:00</span>
                    <span className="font-sans text-gray-500">Team standup</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="font-sans text-gray-800">Mon 11:30</span>
                    <span className="font-sans text-gray-500">Design review</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="font-sans text-gray-800">Tue 10:00</span>
                    <span className="font-sans text-gray-500">Sprint planning</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="font-sans text-gray-800">Wed 14:00</span>
                    <span className="font-sans text-gray-500">Client call</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="font-sans text-gray-800">Thu 9:00</span>
                    <span className="font-sans text-gray-500">Retro</span>
                  </div>
                </div>
              </div>

              {/* Inventory — middle right, blue-ish screenshot feel */}
              <div className="absolute top-[80px] right-0 w-[240px] rotate-2 bg-[#F0F4FF] border border-[#D0D8E8] p-4 shadow-[2px_3px_12px_rgba(0,0,0,0.08)]">
                <p className="text-[10px] font-sans font-medium text-gray-400 uppercase tracking-widest mb-3">Inventory</p>
                <div className="space-y-1">
                  <div className="grid grid-cols-3 text-[10px] font-sans text-gray-400 border-b border-[#C8D0E0] pb-1">
                    <span>Item</span><span className="text-right">Qty</span><span className="text-right">Price</span>
                  </div>
                  <div className="grid grid-cols-3 text-[11px] font-sans text-gray-700">
                    <span>USB-C Cable</span><span className="text-right">342</span><span className="text-right">$4.99</span>
                  </div>
                  <div className="grid grid-cols-3 text-[11px] font-sans text-gray-700">
                    <span>HDMI Adapter</span><span className="text-right">87</span><span className="text-right">$12.50</span>
                  </div>
                  <div className="grid grid-cols-3 text-[11px] font-sans text-gray-700">
                    <span>Webcam HD</span><span className="text-right">156</span><span className="text-right">$34.00</span>
                  </div>
                  <div className="grid grid-cols-3 text-[11px] font-sans text-gray-700">
                    <span>Mouse Pad XL</span><span className="text-right">520</span><span className="text-right">$8.75</span>
                  </div>
                </div>
              </div>

              {/* Menu — bottom left, white with slight tilt */}
              <div className="absolute bottom-0 left-[40px] w-[220px] -rotate-1 bg-white border border-gray-200 p-4 shadow-[2px_3px_12px_rgba(0,0,0,0.08)]">
                <p className="text-[10px] font-sans font-medium text-gray-400 uppercase tracking-widest mb-3">Menu</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-sans">
                    <span className="text-gray-800">Margherita</span>
                    <span className="text-gray-500">$14</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-sans">
                    <span className="text-gray-800">Caesar Salad</span>
                    <span className="text-gray-500">$11</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-sans">
                    <span className="text-gray-800">Grilled Salmon</span>
                    <span className="text-gray-500">$24</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-sans">
                    <span className="text-gray-800">Tiramisu</span>
                    <span className="text-gray-500">$9</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
