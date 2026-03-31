const features = [
  { label: 'AI vision extraction', color: '#3B82F6' },
  { label: 'Edit before you download', color: '#F59E0B' },
  { label: 'CSV & Excel output', color: '#10B981' },
  { label: 'Conversion history', color: '#8B5CF6' },
  { label: 'Batch upload', color: '#EF4444' },
  { label: 'Chrome extension', color: '#F97316' },
]

export function SocialProof() {
  return (
    <section className="bg-[#F0FDF4] border-t border-b border-[#D1FAE5] py-8 sm:py-10">
      <div className="mx-auto max-w-4xl px-6">
        {/* Stats row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0 text-sm text-[#374151]">
          <span>
            <span className="font-serif text-base text-accent">10,000+</span> tables extracted
          </span>
          <span className="hidden sm:inline mx-6 text-[#D1FAE5]">|</span>
          <span>
            Works on <span className="font-serif text-base text-accent">any browser</span>, any device
          </span>
          <span className="hidden sm:inline mx-6 text-[#D1FAE5]">|</span>
          <span>
            <span className="font-serif text-base text-accent">1</span> free conversion per day — no signup needed
          </span>
        </div>

        {/* Feature bullets */}
        <div className="mt-8 grid sm:grid-cols-2 gap-0 max-w-xl mx-auto">
          {features.map((f, i) => (
            <div key={f.label} className="relative">
              <div className="flex items-center gap-4 py-4 border-b border-[#D1FAE5]">
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
