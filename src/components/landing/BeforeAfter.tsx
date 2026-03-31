const rows = [
  ['USB-C Cable', '342', '$4.99'],
  ['HDMI Adapter', '87', '$12.50'],
  ['Webcam HD', '156', '$34.00'],
]

export function BeforeAfter() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="font-serif text-3xl sm:text-4xl text-center">
          This is what happens when you upload.
        </h2>

        <div className="mt-14 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0 max-w-[800px] mx-auto">
          {/* Before panel */}
          <div className="flex-1 w-full">
            <p className="text-xs text-gray-400 font-sans mb-2">Before</p>
            <div
              className="bg-[#F9F7F4] p-5 shadow-[3px_4px_14px_rgba(0,0,0,0.1)]"
              style={{ transform: 'rotate(-2deg)' }}
            >
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left font-mono text-[11px] text-gray-500 py-1.5 font-normal">Item</th>
                    <th className="text-left font-mono text-[11px] text-gray-500 py-1.5 font-normal">Qty</th>
                    <th className="text-right font-mono text-[11px] text-gray-500 py-1.5 font-normal">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i}>
                      <td className="font-mono text-[12px] text-gray-700 py-1.5">{row[0]}</td>
                      <td className="font-mono text-[12px] text-gray-700 py-1.5">{row[1]}</td>
                      <td className="font-mono text-[12px] text-gray-700 py-1.5 text-right">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center justify-center px-6 py-4 md:py-0 shrink-0">
            <span className="text-accent text-[32px] leading-none rotate-90 md:rotate-0">&rarr;</span>
            <span className="text-[10px] text-gray-400 font-sans mt-1">imgtosheet</span>
          </div>

          {/* After panel */}
          <div className="flex-1 w-full">
            <p className="text-xs text-accent font-sans mb-2">After</p>
            <div className="bg-white border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F3F4F6]">
                    <th className="text-left font-sans text-[12px] font-semibold text-gray-900 px-3 py-2">Item</th>
                    <th className="text-left font-sans text-[12px] font-semibold text-gray-900 px-3 py-2">Qty</th>
                    <th className="text-right font-sans text-[12px] font-semibold text-gray-900 px-3 py-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-[#F9FAFB]' : ''}`}>
                      <td className="font-mono text-[12px] text-gray-900 px-3 py-2">{row[0]}</td>
                      <td className="font-mono text-[12px] text-gray-900 px-3 py-2">{row[1]}</td>
                      <td className="font-mono text-[12px] text-gray-900 px-3 py-2 text-right">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex gap-2 px-3 py-2 border-t border-gray-100">
                <span className="text-[11px] font-sans font-medium text-accent border border-accent/30 px-2.5 py-1 rounded-full">Download CSV</span>
                <span className="text-[11px] font-sans font-medium text-accent border border-accent/30 px-2.5 py-1 rounded-full">Download Excel</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
