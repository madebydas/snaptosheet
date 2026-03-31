export function ComparisonSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-[900px] px-6">
        <div className="flex flex-col md:flex-row">
          {/* Left column — the tedious way */}
          <div className="flex-1 md:pr-10 pb-10 md:pb-0">
            <p className="font-mono text-[10px] font-medium uppercase tracking-widest text-[#9CA3AF] mb-6">
              The chat window way
            </p>
            <ol className="space-y-2 list-decimal list-inside text-[14px] leading-snug text-[#6B7280]">
              <li>Open a new chat</li>
              <li>Upload your image</li>
              <li>Type out what you want</li>
              <li>Wait for the response</li>
              <li>Check if the columns are right</li>
              <li>Copy the output</li>
              <li>Open Excel</li>
              <li>Paste and reformat</li>
              <li>Fix the merged cells</li>
              <li>Try again</li>
            </ol>
            <p className="mt-6 text-sm italic text-[#9CA3AF]">
              ~4 minutes. Every time.
            </p>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px bg-[#E5E7EB] shrink-0" />
          <div className="md:hidden h-px bg-[#E5E7EB] my-8" />

          {/* Right column — the imgtosheet way */}
          <div className="flex-1 md:pl-10">
            <p className="font-mono text-[10px] font-medium uppercase tracking-widest text-accent mb-6">
              The imgtosheet way
            </p>
            <ol className="space-y-3 list-decimal list-inside text-[18px] leading-relaxed text-black font-medium">
              <li>Drag your image in</li>
              <li>Download your file</li>
            </ol>
            <p className="mt-6 text-base italic text-accent">
              ~10 seconds. Every time.
            </p>
            <p className="mt-4 text-sm text-[#9CA3AF]">
              Right-click any image in Chrome. Coming soon.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
