import { useEffect, useState } from 'react'

export function StickyHeader() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollToUpload() {
    const el = document.getElementById('upload-zone')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E5E7EB] h-14 transition-transform duration-300 ease-in-out hidden md:block ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="mx-auto max-w-6xl h-full flex items-center justify-between px-6">
        <span className="font-sans text-sm font-medium text-black">imgtosheet</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            5 free conversions &middot; No signup required
          </span>
          <button
            onClick={scrollToUpload}
            className="bg-accent text-white px-4 py-2 text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            Convert an image &rarr;
          </button>
        </div>
      </div>
    </div>
  )
}
