export function Marquee() {
  const items = [
    'Bank statements',
    'Menus',
    'Price lists',
    'Schedules',
    'Invoices',
    'Research tables',
    'Receipts',
    'Reports',
    'Spreadsheet screenshots',
    'Any table',
  ]

  const content = items.map((item) => `${item} · `).join('')

  return (
    <section className="bg-[#111111] py-3 overflow-hidden group">
      <div className="flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]">
        <span className="text-sm text-white/80 font-sans tracking-wide">
          {content}{content}{content}{content}
        </span>
      </div>
    </section>
  )
}
