import { Link } from 'react-router-dom'

const tools = [
  { title: 'Screenshot to Excel', href: '/screenshot-to-excel' },
  { title: 'JPG to Excel', href: '/jpg-to-excel' },
  { title: 'Image to CSV', href: '/image-to-csv' },
  { title: 'Photo to Excel', href: '/photo-to-excel' },
  { title: 'Extract Table from Image', href: '/extract-table-from-image' },
  { title: 'Excel Data from Picture Not Working?', href: '/excel-data-from-picture-not-working' },
  { title: 'Image to Google Sheets', href: '/image-to-google-sheets' },
  { title: 'PNG to Spreadsheet', href: '/png-to-spreadsheet' },
]

export function MoreTools() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-6">
        <p className="text-base font-sans font-medium text-[#9CA3AF] mb-6">More ways to convert</p>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-0">
          {tools.map((tool, i) => (
            <div key={tool.href} className={`sm:flex sm:items-center ${i > 0 ? 'sm:border-l sm:border-gray-200 sm:pl-4 sm:ml-4' : ''} py-2 sm:py-0`}>
              <Link
                to={tool.href}
                className="text-sm text-accent font-sans hover:underline underline-offset-4"
              >
                {tool.title}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
