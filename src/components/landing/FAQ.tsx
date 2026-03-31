import { useState } from 'react'

const faqs = [
  {
    q: 'Does it work without a Microsoft 365 subscription?',
    a: 'Yes — that\'s exactly why we built this. Excel\'s "Data from Picture" only works on certain Microsoft 365 desktop versions, is frequently greyed out, and fails on currency symbols. imgtosheet works on any browser, any device, with any image.',
  },
  {
    q: 'What types of images work best?',
    a: 'Clear screenshots work perfectly. Phone photos of printed tables work well. Blurry or very low-resolution images may produce lower accuracy — we\'ll show you a confidence score and highlight any uncertain cells before you download.',
  },
  {
    q: 'Can it handle tables with merged cells?',
    a: 'Yes. Our AI vision reads the table structure the way a human would, not as raw pixels. Merged cells, rotated headers, and unusual layouts are all handled. Pro users get auto-clean mode which normalizes merged cells automatically.',
  },
  {
    q: 'Is my image stored anywhere?',
    a: 'No. Images are processed in memory and deleted immediately after conversion. We never store your files.',
  },
  {
    q: 'What\'s the difference between CSV and Excel output?',
    a: 'CSV is a plain text format compatible with every spreadsheet app. Excel (.xlsx) preserves formatting — column widths, number types, and currency formatting. Both are included in Starter and Pro plans.',
  },
  {
    q: 'Can I use this for PDFs?',
    a: 'Not directly — imgtosheet works with images and screenshots. If your PDF has a table, take a screenshot and upload that. Full PDF support is on our roadmap.',
  },
  {
    q: 'What happens after my 5 free conversions?',
    a: 'Sign up for a free account to track usage, or upgrade to Starter ($9/mo) for 100 conversions per month with Excel output and conversion history.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex items-center justify-between py-5 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="text-base font-sans font-medium text-black pr-4">{q}</span>
        <span
          className={`text-accent text-xl leading-none shrink-0 transition-transform duration-200 ${
            open ? 'rotate-45' : ''
          }`}
        >
          +
        </span>
      </button>
      {open && (
        <p className="pb-5 text-sm text-gray-500 leading-relaxed max-w-2xl">
          {a}
        </p>
      )}
    </div>
  )
}

export function FAQ() {
  return (
    <section className="py-20" id="faq">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="font-serif text-3xl sm:text-4xl">Common questions</h2>

        <div className="mt-10">
          {faqs.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  )
}
