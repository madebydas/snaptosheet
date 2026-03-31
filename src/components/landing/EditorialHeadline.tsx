const features = [
  { label: 'AI vision extraction', color: '#3B82F6' },
  { label: 'Edit before you download', color: '#F59E0B' },
  { label: 'CSV & Excel output', color: '#10B981' },
  { label: 'Conversion history', color: '#8B5CF6' },
  { label: 'Batch upload', color: '#EF4444' },
  { label: 'Chrome extension', color: '#F97316' },
]

export function EditorialHeadline() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-serif text-[44px] sm:text-[56px] lg:text-[72px] leading-[1.05] tracking-tight">
          Your data is trapped in an image.<br className="hidden sm:block" /> We get it out.
        </h2>

        <div className="mt-14 grid sm:grid-cols-2 gap-0 max-w-2xl">
          {features.map((f, i) => (
            <div key={f.label} className="relative">
              <div className="flex items-center gap-4 py-4 border-b border-gray-200">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: f.color + '18' }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: f.color }}
                  />
                </div>
                <span className="text-[15px] font-sans font-medium text-gray-900">{f.label}</span>
              </div>

              {/* Handwritten annotation on Chrome extension */}
              {i === features.length - 1 && (
                <div
                  className="absolute -bottom-8 left-14 sm:left-16"
                  style={{ transform: 'rotate(-5deg)' }}
                >
                  <span
                    className="text-[#6B7280] text-lg"
                    style={{ fontFamily: '"Caveat", cursive' }}
                  >
                    Coming soon &rarr;
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
