const stats = [
  { number: '10 sec', label: 'Average conversion time', context: 'From upload to downloaded file' },
  { number: '$0', label: 'To get started', context: '5 free conversions, no card required' },
  { number: '0', label: 'Broken Excel features', context: 'Works on every browser and device' },
]

export function ValueStrip() {
  return (
    <section className="bg-[#111111] py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          {stats.map((s, i) => (
            <div key={s.label} className={`${i > 0 ? 'sm:border-l sm:border-white/10 sm:pl-10' : ''} ${i > 0 ? 'border-t sm:border-t-0 border-white/10 pt-8 sm:pt-0' : ''}`}>
              <p className="font-serif italic text-[48px] leading-none text-[#4ADE80]">{s.number}</p>
              <p className="mt-3 text-base font-medium text-white">{s.label}</p>
              <p className="mt-1 text-sm text-[#9CA3AF]">{s.context}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
