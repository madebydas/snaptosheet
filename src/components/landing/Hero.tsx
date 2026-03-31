import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import type { TableData } from '../../types'
import { ImageUploader } from '../dashboard/ImageUploader'
import { TablePreview } from '../dashboard/TablePreview'
import { ExportButtons } from '../dashboard/ExportButtons'

const TRIAL_KEY = 'imgtosheet_trial_used'

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
                for 1 free conversion per day.
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
            <h1 className="font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-[72px]">
              Your data is trapped in an image. <em className="text-accent">We get it out.</em>
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
                  1 free conversion per day with an account
                </p>
              </div>
            ) : (
              <div className="mt-8" id="upload-zone">
                <ImageUploader onUpload={handleUpload} disabled={converting || !canUpload} />
                {converting ? (
                  <p className="mt-3 text-xs text-gray-400">
                    Extracting table data...
                  </p>
                ) : (
                  <p className="mt-3 text-xs text-gray-400">
                    1 free conversion per day &middot; No account required
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right column — before/after transformation collage */}
          <div className="hidden lg:block">
            <div className="relative h-[460px]">
              {/* Schedule — top left, tilted */}
              <div className="absolute top-0 left-0 w-[180px] -rotate-3 bg-[#FFFDE7] border border-[#E8E4D0] p-3 shadow-[2px_3px_12px_rgba(0,0,0,0.06)] opacity-60">
                <p className="text-[9px] font-sans font-medium text-gray-400 uppercase tracking-widest mb-2">Schedule</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="font-sans text-gray-700">Mon 9:00</span>
                    <span className="font-sans text-gray-400">Standup</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="font-sans text-gray-700">Tue 10:00</span>
                    <span className="font-sans text-gray-400">Sprint plan</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="font-sans text-gray-700">Wed 14:00</span>
                    <span className="font-sans text-gray-400">Client call</span>
                  </div>
                </div>
              </div>

              {/* Receipt — top right area, pink tint */}
              <div className="absolute top-[10px] left-[140px] w-[150px] rotate-1 bg-[#FFF5F5] border border-[#FECDD3] p-3 shadow-[2px_3px_12px_rgba(0,0,0,0.06)] opacity-60">
                <p className="text-[9px] font-sans font-medium text-gray-400 uppercase tracking-widest mb-2">Receipt</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-sans">
                    <span className="text-gray-700">Latte</span>
                    <span className="text-gray-400">$5.50</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-sans">
                    <span className="text-gray-700">Croissant</span>
                    <span className="text-gray-400">$3.25</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-sans font-medium border-t border-[#FECDD3] pt-1 mt-1">
                    <span className="text-gray-700">Total</span>
                    <span className="text-gray-500">$8.75</span>
                  </div>
                </div>
              </div>

              {/* BEFORE: Inventory — center, blue tint, tilted */}
              <div className="absolute top-[110px] left-[30px] w-[200px] -rotate-2 bg-[#F0F4FF] border border-[#D0D8E8] p-3 shadow-[2px_3px_12px_rgba(0,0,0,0.08)] z-10">
                <p className="text-[9px] font-sans font-medium text-gray-400 uppercase tracking-widest mb-2">Screenshot</p>
                <div className="space-y-0.5">
                  <div className="grid grid-cols-3 text-[9px] font-sans text-gray-400 border-b border-[#C8D0E0] pb-0.5">
                    <span>Item</span><span className="text-right">Qty</span><span className="text-right">Price</span>
                  </div>
                  <div className="grid grid-cols-3 text-[10px] font-sans text-gray-600">
                    <span>USB-C Cable</span><span className="text-right">342</span><span className="text-right">$4.99</span>
                  </div>
                  <div className="grid grid-cols-3 text-[10px] font-sans text-gray-600">
                    <span>HDMI Adapt.</span><span className="text-right">87</span><span className="text-right">$12.50</span>
                  </div>
                  <div className="grid grid-cols-3 text-[10px] font-sans text-gray-600">
                    <span>Webcam HD</span><span className="text-right">156</span><span className="text-right">$34.00</span>
                  </div>
                  <div className="grid grid-cols-3 text-[10px] font-sans text-gray-600">
                    <span>Mouse Pad</span><span className="text-right">520</span><span className="text-right">$8.75</span>
                  </div>
                </div>
              </div>

              {/* Arrow — positioned cleanly between before and after */}
              <div className="absolute top-[185px] left-[248px] z-20 flex flex-col items-center">
                <svg width="40" height="20" viewBox="0 0 40 20" fill="none" className="text-accent">
                  <path d="M0 10H34M34 10L26 3M34 10L26 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* AFTER: Clean spreadsheet — right side, no tilt */}
              <div className="absolute top-[110px] right-0 w-[210px] bg-white border border-gray-200 p-0 shadow-[2px_3px_12px_rgba(0,0,0,0.08)] z-10">
                <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-accent/60" />
                  <span className="text-[9px] font-sans font-medium text-gray-400 uppercase tracking-widest">Clean data</span>
                </div>
                <div>
                  <div className="grid grid-cols-3 border-b-2 border-accent">
                    <span className="px-2.5 py-1.5 font-mono text-[9px] font-medium text-black uppercase tracking-wider">Item</span>
                    <span className="px-2.5 py-1.5 font-mono text-[9px] font-medium text-black uppercase tracking-wider text-right">Qty</span>
                    <span className="px-2.5 py-1.5 font-mono text-[9px] font-medium text-black uppercase tracking-wider text-right">Price</span>
                  </div>
                  {[
                    ['USB-C Cable', '342', '$4.99'],
                    ['HDMI Adapter', '87', '$12.50'],
                    ['Webcam HD', '156', '$34.00'],
                    ['Mouse Pad XL', '520', '$8.75'],
                  ].map((row, i) => (
                    <div key={i} className={`grid grid-cols-3 border-b border-gray-100 ${i % 2 === 1 ? 'bg-gray-50/60' : ''}`}>
                      <span className="px-2.5 py-1.5 font-mono text-[10px] text-gray-900">{row[0]}</span>
                      <span className="px-2.5 py-1.5 font-mono text-[10px] text-gray-900 text-right">{row[1]}</span>
                      <span className="px-2.5 py-1.5 font-mono text-[10px] text-gray-900 text-right">{row[2]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Menu — bottom left, tilted */}
              <div className="absolute bottom-[40px] left-[0px] w-[170px] rotate-2 bg-white border border-gray-200 p-3 shadow-[2px_3px_12px_rgba(0,0,0,0.06)] opacity-60">
                <p className="text-[9px] font-sans font-medium text-gray-400 uppercase tracking-widest mb-2">Menu</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-sans">
                    <span className="text-gray-700">Margherita</span>
                    <span className="text-gray-400">$14</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-sans">
                    <span className="text-gray-700">Grilled Salmon</span>
                    <span className="text-gray-400">$24</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-sans">
                    <span className="text-gray-700">Tiramisu</span>
                    <span className="text-gray-400">$9</span>
                  </div>
                </div>
              </div>

              {/* Price list — bottom right, purple tint */}
              <div className="absolute bottom-[20px] left-[150px] w-[160px] -rotate-1 bg-[#F5F3FF] border border-[#DDD6FE] p-3 shadow-[2px_3px_12px_rgba(0,0,0,0.06)] opacity-60">
                <p className="text-[9px] font-sans font-medium text-gray-400 uppercase tracking-widest mb-2">Price List</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-sans">
                    <span className="text-gray-700">Basic</span>
                    <span className="text-gray-400">$29/mo</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-sans">
                    <span className="text-gray-700">Pro</span>
                    <span className="text-gray-400">$79/mo</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-sans">
                    <span className="text-gray-700">Enterprise</span>
                    <span className="text-gray-400">Custom</span>
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
