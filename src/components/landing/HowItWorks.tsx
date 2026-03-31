const steps = [
  {
    step: '1',
    title: 'Upload a Photo',
    description: 'Drag and drop or select an image of any table or structured data.',
  },
  {
    step: '2',
    title: 'AI Extracts the Data',
    description: 'GPT-4o vision analyzes the image and extracts all rows and columns.',
  },
  {
    step: '3',
    title: 'Edit & Download',
    description: 'Review the data in an editable table, make corrections, then export.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          How it works
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.step} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-xl font-bold text-white">
                {s.step}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{s.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
