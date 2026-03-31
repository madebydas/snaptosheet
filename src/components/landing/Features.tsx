const features = [
  {
    label: 'AI vision extraction',
    description: 'Powered by AI vision, not OCR. Reads your image the way a human would.',
  },
  {
    label: 'Edit before you download',
    description: 'Review and fix the extracted table in your browser. Then export.',
  },
  {
    label: 'Any table, anywhere',
    description: 'Menus, reports, receipts, price lists, handwritten tables. If it has rows and columns, it works.',
  },
]

export function Features() {
  return (
    <section className="py-24 pb-12">
      <div className="mx-auto max-w-3xl px-6">
        <div className="space-y-0">
          {features.map((f) => (
            <div key={f.label} className="border-b border-gray-200 py-6">
              <p className="font-sans text-base font-medium text-black">{f.label}</p>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
