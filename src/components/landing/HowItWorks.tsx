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
