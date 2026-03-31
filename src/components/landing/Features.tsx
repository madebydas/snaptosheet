import { Card } from '../ui/Card'

const features = [
  {
    title: 'AI-Powered Extraction',
    description: 'GPT-4o vision reads your images and extracts structured table data with high accuracy.',
    icon: '🤖',
  },
  {
    title: 'Inline Editing',
    description: 'Review and edit extracted data directly in the browser before downloading.',
    icon: '✏️',
  },
  {
    title: 'CSV & Excel Export',
    description: 'Download your cleaned data as CSV or XLSX files ready for any spreadsheet app.',
    icon: '📊',
  },
  {
    title: 'Any Table Format',
    description: 'Menus, receipts, schedules, invoices, handwritten tables — we handle them all.',
    icon: '📷',
  },
  {
    title: 'Secure & Private',
    description: 'Your images and data are encrypted and never shared. Delete anytime.',
    icon: '🔒',
  },
  {
    title: 'Conversion History',
    description: 'Access all your past conversions from your dashboard anytime.',
    icon: '📁',
  },
]

export function Features() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Everything you need to digitize tables
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="text-center">
              <div className="text-4xl">{f.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{f.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
