export function Callout() {
  return (
    <section className="pt-12 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="bg-surface px-8 py-12 sm:px-12">
          <h2 className="font-serif text-3xl sm:text-4xl leading-tight">
            Microsoft built this.<br />We made it work.
          </h2>
          <p className="mt-4 text-base text-gray-600 leading-relaxed max-w-lg">
            Excel's "Data from Picture" is greyed out on most versions, fails on
            currency symbols, and requires Microsoft 365. imgtosheet works on any
            browser, any device, in 10 seconds.
          </p>
        </div>
      </div>
    </section>
  )
}

export function HowItWorks() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="space-y-20">
          {/* Step 1 */}
          <div className="flex gap-8 items-start">
            <span className="font-serif text-[80px] sm:text-[96px] leading-none text-accent/20 select-none shrink-0">
              1
            </span>
            <div className="pt-4">
              <h3 className="font-serif text-2xl sm:text-3xl">Upload any image</h3>
              <p className="mt-3 text-base text-gray-500 leading-relaxed max-w-md">
                Drag and drop a screenshot, photo, or scan of any table.
                PNG, JPG, WEBP — all work. Up to 10MB.
              </p>
            </div>
          </div>

          {/* Step 2 — with product mockup */}
          <div className="flex gap-8 items-start">
            <span className="font-serif text-[80px] sm:text-[96px] leading-none text-accent/20 select-none shrink-0">
              2
            </span>
            <div className="pt-4 flex-1">
              <h3 className="font-serif text-2xl sm:text-3xl">AI extracts the data</h3>
              <p className="mt-3 text-base text-gray-500 leading-relaxed max-w-md">
                Our AI reads your image like a human would — understanding
                headers, rows, columns, currencies, and formatting.
              </p>

              {/* Product UI mockup */}
              <div className="mt-8 border border-gray-200 bg-white overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent/60" />
                    <span className="text-[10px] font-sans font-medium text-gray-400 uppercase tracking-widest">Table Preview</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-[10px] text-gray-400 underline">Download CSV</span>
                    <span className="text-[10px] text-gray-400 underline">Download Excel</span>
                  </div>
                </div>
                {/* Table */}
                <div>
                  <div className="grid grid-cols-4 border-b-2 border-accent">
                    {['Product', 'Q1 Sales', 'Q2 Sales', 'Growth'].map((h) => (
                      <span key={h} className="px-3 py-2 font-mono text-[10px] font-medium text-black uppercase tracking-wider">{h}</span>
                    ))}
                  </div>
                  {[
                    ['Widget Pro', '$42,100', '$48,300', '+14.7%'],
                    ['Basic Plan', '$18,900', '$22,100', '+16.9%'],
                    ['Enterprise', '$96,400', '$91,200', '-5.4%'],
                    ['Add-ons', '$7,600', '$11,400', '+50.0%'],
                  ].map((row, i) => (
                    <div key={i} className={`grid grid-cols-4 border-b border-gray-100 ${i % 2 === 1 ? 'bg-gray-50/60' : ''}`}>
                      {row.map((cell, ci) => (
                        <span key={ci} className={`px-3 py-2 font-mono text-[11px] text-gray-900 ${
                          ci === 3 && cell.startsWith('+') ? 'text-accent' : ''
                        } ${ci === 3 && cell.startsWith('-') ? 'text-red-500' : ''}`}>
                          {cell}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
                {/* Bottom bar */}
                <div className="px-4 py-2 border-t border-gray-100 flex items-center gap-4">
                  <span className="text-[10px] text-gray-400">+ row</span>
                  <span className="text-[10px] text-gray-400">+ column</span>
                  <span className="text-[10px] text-gray-300 ml-auto">Double-click any cell to edit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-8 items-start">
            <span className="font-serif text-[80px] sm:text-[96px] leading-none text-accent/20 select-none shrink-0">
              3
            </span>
            <div className="pt-4">
              <h3 className="font-serif text-2xl sm:text-3xl">Edit & download</h3>
              <p className="mt-3 text-base text-gray-500 leading-relaxed max-w-md">
                Review the table, fix any cells, then export as CSV or Excel.
                Your data, clean and ready in seconds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
