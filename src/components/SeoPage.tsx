import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ImageUploader } from './dashboard/ImageUploader'
import { TablePreview } from './dashboard/TablePreview'
import { ExportButtons } from './dashboard/ExportButtons'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { Features } from './landing/Features'
import { PricingSection } from '../components/pricing/PricingCard'
import type { TableData } from '../types'

const TRIAL_KEY = 'imgtosheet_trial_used'

interface SeoFaq {
  q: string
  a: string
}

interface RelatedPage {
  title: string
  href: string
}

interface SeoPageProps {
  title: string
  metaDescription: string
  h1: string
  description: string
  faqs: SeoFaq[]
  relatedPages: RelatedPage[]
  canonicalUrl: string
}

function SeoFaqItem({ q, a }: SeoFaq) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-200">
      <button className="w-full flex items-center justify-between py-5 text-left" onClick={() => setOpen(!open)}>
        <span className="text-base font-sans font-medium text-black pr-4">{q}</span>
        <span className={`text-accent text-xl leading-none shrink-0 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && <p className="pb-5 text-sm text-gray-500 leading-relaxed max-w-2xl">{a}</p>}
    </div>
  )
}

export default function SeoPage({ title, metaDescription, h1, description, faqs, relatedPages, canonicalUrl }: SeoPageProps) {
  const { user } = useAuth()
  const [tableData, setTableData] = useState<TableData | null>(null)
  const [converting, setConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [trialUsed, setTrialUsed] = useState(() => !user && localStorage.getItem(TRIAL_KEY) === 'true')

  const canUpload = user ? true : !trialUsed

  async function handleUpload(file: File) {
    setError(null)
    setConverting(true)
    try {
      const buffer = await file.arrayBuffer()
      const bytes = new Uint8Array(buffer)
      let binary = ''
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
      const imageBase64 = btoa(binary)

      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (user) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const res = await fetch('/.netlify/functions/convert', { method: 'POST', headers, body: JSON.stringify({ imageBase64, fileName: file.name }) })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Conversion failed')

      setTableData(result.data)
      if (!user) { localStorage.setItem(TRIAL_KEY, 'true'); setTrialUsed(true) }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setConverting(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
      </Helmet>

      {/* Hero */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-[72px]">{h1}</h1>
          <p className="mt-6 max-w-[600px] text-lg text-[#6B7280] leading-relaxed">{description}</p>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <div className="mt-10 space-y-6">
            {!user && trialUsed && !tableData ? (
              <div className="border border-gray-200 px-8 py-12 text-center">
                <h2 className="font-serif text-2xl">Sign up to continue</h2>
                <p className="mt-3 text-sm text-gray-500">1 free conversion per day with an account.</p>
                <div className="mt-6 flex items-center justify-center gap-4">
                  <Link to="/auth" className="bg-accent text-white px-8 py-2.5 text-sm font-medium hover:bg-accent-hover transition-colors">Sign up free</Link>
                  <Link to="/pricing" className="text-sm text-gray-500 underline underline-offset-4 hover:text-black">View pricing</Link>
                </div>
              </div>
            ) : (
              <div>
                <ImageUploader onUpload={handleUpload} disabled={converting || !canUpload} />
                {converting ? (
                  <p className="mt-3 text-xs text-gray-400">Extracting table data...</p>
                ) : (
                  <p className="mt-3 text-xs text-gray-400">1 free conversion per day &middot; No account required</p>
                )}
              </div>
            )}

            {tableData && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-2xl">Your spreadsheet</h2>
                  <ExportButtons data={tableData} />
                </div>
                <TablePreview data={tableData} onDataChange={setTableData} />
                {!user && trialUsed && (
                  <p className="mt-6 text-sm text-gray-500">
                    Want more? <Link to="/auth" className="text-accent font-medium underline underline-offset-4">Sign up free</Link> for 1 free conversion per day.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="font-serif text-3xl sm:text-4xl">Common questions</h2>
            <div className="mt-10">
              {faqs.map((faq) => <SeoFaqItem key={faq.q} q={faq.q} a={faq.a} />)}
            </div>
          </div>
        </section>
      )}

      {/* Related pages */}
      {relatedPages.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="font-serif text-3xl sm:text-4xl">Related tools</h2>
            <div className="mt-8">
              {relatedPages.map((page) => (
                <div key={page.href} className="border-b border-gray-200 py-4">
                  <Link to={page.href} className="text-[15px] text-accent font-sans hover:underline underline-offset-4">{page.title}</Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Features />
      <PricingSection />
    </>
  )
}
