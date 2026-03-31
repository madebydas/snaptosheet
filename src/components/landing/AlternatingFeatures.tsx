function ConfidenceMockup() {
  const rows = [
    { item: 'USB-C Cable', qty: '342', price: '$4.99', conf: 'high' },
    { item: 'HDMI Adapter', qty: '87', price: '$12.50', conf: 'high' },
    { item: 'Webcam HD', qty: '156', price: '$34.OO', conf: 'low' },
    { item: 'Mouse Pad XL', qty: '520', price: '$8.75', conf: 'high' },
  ]

  return (
    <div className="bg-white rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-accent/60" />
        <span className="text-[10px] font-sans font-medium text-gray-400 uppercase tracking-widest">Extraction Result</span>
        <span className="ml-auto text-[10px] text-accent font-sans font-medium">98% confidence</span>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/80">
            <th className="text-left font-mono text-[10px] font-medium text-gray-500 px-4 py-2 uppercase tracking-wider">Item</th>
            <th className="text-right font-mono text-[10px] font-medium text-gray-500 px-4 py-2 uppercase tracking-wider">Qty</th>
            <th className="text-right font-mono text-[10px] font-medium text-gray-500 px-4 py-2 uppercase tracking-wider">Price</th>
            <th className="w-8 px-2 py-2" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={`border-b border-gray-100 ${i % 2 === 1 ? 'bg-gray-50/40' : ''}`}>
              <td className="font-mono text-[11px] text-gray-900 px-4 py-2.5">{r.item}</td>
              <td className="font-mono text-[11px] text-gray-900 px-4 py-2.5 text-right">{r.qty}</td>
              <td className={`font-mono text-[11px] px-4 py-2.5 text-right relative ${r.conf === 'low' ? 'text-amber-600 bg-amber-50' : 'text-gray-900'}`}>
                {r.price}
                {r.conf === 'low' && (
                  <div className="absolute -top-7 right-2 bg-gray-800 text-white text-[9px] font-sans px-2 py-1 rounded whitespace-nowrap">
                    Low confidence — click to edit
                    <div className="absolute bottom-[-4px] right-4 w-2 h-2 bg-gray-800 rotate-45" />
                  </div>
                )}
              </td>
              <td className="px-2 py-2.5 text-center">
                {r.conf === 'high' ? (
                  <svg className="w-3.5 h-3.5 text-accent inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 text-amber-500 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01M12 3l9.66 16.59A1 1 0 0120.66 21H3.34a1 1 0 01-.86-1.41L12 3z" />
                  </svg>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EditMockup() {
  return (
    <div className="bg-white rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-accent/60" />
        <span className="text-[10px] font-sans font-medium text-gray-400 uppercase tracking-widest">Edit Mode</span>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-accent">
            <th className="text-left font-mono text-[10px] font-medium text-black px-4 py-2 uppercase tracking-wider">Product</th>
            <th className="text-right font-mono text-[10px] font-medium text-black px-4 py-2 uppercase tracking-wider">Q1</th>
            <th className="text-right font-mono text-[10px] font-medium text-black px-4 py-2 uppercase tracking-wider">Q2</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-100">
            <td className="font-mono text-[11px] text-gray-900 px-4 py-2.5">Widget Pro</td>
            <td className="font-mono text-[11px] text-gray-900 px-4 py-2.5 text-right">$42,100</td>
            <td className="font-mono text-[11px] text-gray-900 px-4 py-2.5 text-right">$48,300</td>
          </tr>
          <tr className="border-b border-gray-100 bg-gray-50/40">
            <td className="font-mono text-[11px] text-gray-900 px-4 py-2.5">Basic Plan</td>
            <td className="px-4 py-1">
              <div className="ring-2 ring-blue-500 bg-blue-50 px-2 py-1.5 font-mono text-[11px] text-gray-900 text-right">
                $18,900<span className="animate-pulse text-blue-500">|</span>
              </div>
            </td>
            <td className="font-mono text-[11px] text-gray-900 px-4 py-2.5 text-right">$22,100</td>
          </tr>
          <tr className="border-b border-gray-100">
            <td className="font-mono text-[11px] text-gray-900 px-4 py-2.5">Enterprise</td>
            <td className="font-mono text-[11px] text-gray-900 px-4 py-2.5 text-right">$96,400</td>
            <td className="font-mono text-[11px] text-gray-900 px-4 py-2.5 text-right">$91,200</td>
          </tr>
        </tbody>
      </table>
      <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
        <span className="text-[11px] font-sans font-medium text-accent border border-accent/30 px-3 py-1.5 rounded-full">Download CSV</span>
        <span className="text-[11px] font-sans font-medium text-accent border border-accent/30 px-3 py-1.5 rounded-full">Download Excel</span>
      </div>
    </div>
  )
}

function CompatibilityMockup() {
  const checks = [
    ['Chrome', 'Safari', 'Firefox', 'Edge'],
    ['Mac', 'Windows', 'Linux'],
    ['No Microsoft 365 required'],
    ['No install'],
  ]

  return (
    <div className="bg-white rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-accent/60" />
        <span className="text-[10px] font-sans font-medium text-gray-400 uppercase tracking-widest">Compatibility</span>
      </div>
      <div className="px-5 py-5 space-y-3">
        {checks.map((group, gi) => (
          <div key={gi} className="flex flex-wrap gap-x-5 gap-y-1.5">
            {group.map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[13px] font-sans text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function AlternatingFeatures() {
  return (
    <div>
      {/* Feature 1 — text LEFT, mockup RIGHT */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h3 className="font-serif text-[28px] sm:text-[32px] leading-tight">
                AI reads your image the way you would.
              </h3>
              <p className="mt-4 text-base text-gray-500 leading-relaxed max-w-md">
                Not OCR. AI vision understands table structure, handles merged cells,
                rotated headers, dark mode screenshots, and handwritten tables.
                If you can read it, we can extract it.
              </p>
            </div>
            <div>
              <ConfidenceMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2 — text RIGHT, mockup LEFT */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1">
              <EditMockup />
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="font-serif text-[28px] sm:text-[32px] leading-tight">
                Review and fix before you download.
              </h3>
              <p className="mt-4 text-base text-gray-500 leading-relaxed max-w-md">
                Every extraction shows you a live editable preview. Click any cell to
                correct it. Then export as CSV or Excel. You're always in control of
                what leaves the tool.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3 — text LEFT, mockup RIGHT */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h3 className="font-serif text-[28px] sm:text-[32px] leading-tight">
                Works where Microsoft doesn't.
              </h3>
              <p className="mt-4 text-base text-gray-500 leading-relaxed max-w-md">
                Excel's Data from Picture is greyed out on most versions, broken on
                Mac, and requires Microsoft 365. imgtosheet runs on any browser, any
                device, any OS. No subscription. No install.
              </p>
              <a href="#faq" className="mt-4 inline-block text-sm text-accent font-medium underline underline-offset-4 hover:text-accent-hover transition-colors">
                See how it compares &rarr;
              </a>
            </div>
            <div>
              <CompatibilityMockup />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
