export function FounderNote() {
  return (
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="font-serif text-3xl sm:text-4xl">Why I built this</h2>
        <p className="mt-6 text-base text-gray-600 leading-relaxed max-w-xl">
          I built imgtosheet because I kept running into the same wall: data
          trapped in a screenshot, and no fast way out. Microsoft's version is
          broken. Google's is mobile-only. So I built the one I wanted to use.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center bg-gray-300 text-sm font-medium text-gray-600">
            A
          </div>
          <div>
            <p className="text-sm font-medium text-black">Amlan</p>
            <p className="text-xs text-gray-400">Maker of imgtosheet</p>
          </div>
        </div>
      </div>
    </section>
  )
}
