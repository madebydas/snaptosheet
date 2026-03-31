const cases = [
  { label: 'FINANCIAL REPORTS', description: 'Screenshot a table from a PDF annual report or earnings release. Get clean rows instantly.', tint: '#F0F9FF', border: '#DBEAFE' },
  { label: 'RESTAURANT MENUS', description: 'Photograph a printed menu or screenshot a digital one. Output a clean item/price CSV.', tint: '#F0FDF4', border: '#D1FAE5' },
  { label: 'RESEARCH & ACADEMIC', description: 'Extract data tables from journal articles, textbooks, or lecture slides.', tint: '#FEFCE8', border: '#FEF08A' },
  { label: 'COMPETITOR PRICING', description: 'Screenshot any pricing table on any website. Get it into a spreadsheet in seconds.', tint: '#FFF7ED', border: '#FED7AA' },
  { label: 'INVENTORY & STOCK', description: 'Photograph a printed stock sheet or whiteboard inventory list. No retyping.', tint: '#F5F3FF', border: '#DDD6FE' },
  { label: 'SCHEDULES & ROSTERS', description: 'Convert any weekly schedule, shift roster, or class timetable into editable rows.', tint: '#FFF1F2', border: '#FECDD3' },
]

export function UseCaseGrid() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="font-serif text-3xl sm:text-4xl">
          Whatever you're looking at.<br />Whatever app you're in.
        </h2>
        <p className="mt-4 text-base text-gray-500 max-w-lg">
          If it has rows and columns, upload it. We'll handle the rest.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {cases.map((c) => (
            <div
              key={c.label}
              className="rounded-lg border px-6 py-5"
              style={{ backgroundColor: c.tint, borderColor: c.border }}
            >
              <p className="font-mono text-[11px] font-medium tracking-widest text-gray-500">
                {c.label}
              </p>
              <p className="mt-2 text-[15px] text-gray-700 leading-relaxed">
                {c.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
