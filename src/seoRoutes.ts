interface SeoRouteConfig {
  path: string
  title: string
  metaDescription: string
  h1: string
  description: string
  faqs: { q: string; a: string }[]
  relatedSlugs: string[]
}

export const seoRoutes: SeoRouteConfig[] = [
  {
    path: '/screenshot-to-excel',
    title: 'Screenshot to Excel — imgtosheet',
    metaDescription: 'Convert any screenshot of a table to Excel in seconds. AI vision extraction. Works on any browser without Microsoft 365. Free to try.',
    h1: 'Screenshot to Excel',
    description: 'Upload any screenshot of a table and download a clean Excel file in seconds. No retyping. No Microsoft 365 required. AI vision reads your image the way a human would.',
    faqs: [
      { q: 'How do I convert a screenshot to Excel?', a: 'Upload your screenshot to imgtosheet, wait a few seconds while AI extracts the table, review the preview, then click Download Excel. The whole process takes about 10 seconds.' },
      { q: 'Does this work without Microsoft 365?', a: 'Yes. imgtosheet works on any browser — Chrome, Safari, Firefox, Edge — on Mac, Windows, or Linux. No Microsoft subscription required.' },
      { q: 'What kind of screenshots work best?', a: 'Clear screenshots from any screen work perfectly. Phone photos of printed tables also work well.' },
      { q: 'Is Excel output free?', a: 'The first conversion each day is free including Excel output. Starter plan ($9/mo) gives you 50 conversions per month.' },
      { q: 'Can it handle screenshots with merged cells?', a: 'Yes. The AI understands table structure, not just pixels. Merged cells, rotated headers, and complex layouts are handled correctly.' },
    ],
    relatedSlugs: ['image-to-csv', 'jpg-to-excel', 'extract-table-from-image'],
  },
  {
    path: '/image-to-csv',
    title: 'Image to CSV — imgtosheet',
    metaDescription: 'Convert any image of a table to a CSV file instantly. AI-powered extraction from screenshots, photos, and scans. Free to try, no signup needed.',
    h1: 'Image to CSV',
    description: 'Upload any image containing a table and download a clean CSV file in seconds. Compatible with Excel, Google Sheets, Numbers, and any spreadsheet app. No account required for your first conversion.',
    faqs: [
      { q: 'What image formats can I convert to CSV?', a: 'JPG, PNG, WebP, and most common image formats. Screenshots from any device, phone photos of printed tables, and scanned documents all work.' },
      { q: 'Will the CSV work in Google Sheets?', a: 'Yes. CSV files open directly in Google Sheets, Excel, Numbers, and any spreadsheet application.' },
      { q: 'How accurate is the extraction?', a: 'Very accurate for clear screenshots and photos. The AI shows a confidence score and highlights any uncertain cells before you download.' },
      { q: 'Is there a file size limit?', a: 'Up to 4MB per image.' },
      { q: 'Can I convert multiple images at once?', a: 'Batch upload is available on paid plans.' },
    ],
    relatedSlugs: ['screenshot-to-excel', 'image-to-google-sheets', 'jpg-to-excel', 'convert-table-image-to-excel'],
  },
  {
    path: '/jpg-to-excel',
    title: 'JPG to Excel — imgtosheet',
    metaDescription: 'Convert a JPG image of a table to Excel in seconds. AI vision reads your image and outputs a clean XLSX file. Free, no signup required.',
    h1: 'JPG to Excel',
    description: 'Upload a JPG containing any table or grid and download a clean Excel spreadsheet. Works on photos of printed documents, scanned pages, and screenshots saved as JPG.',
    faqs: [
      { q: 'How do I convert a JPG to Excel?', a: 'Drag your JPG onto the upload zone, wait for AI extraction, then click Download Excel. Takes about 10 seconds.' },
      { q: 'Does it work on low-quality JPGs?', a: 'It works best on clear images. Blurry or heavily compressed JPGs may have lower accuracy — we show a confidence score so you know before downloading.' },
      { q: 'Can it read handwritten tables in a JPG?', a: 'Best-effort on handwritten tables. Clear printed text converts with high accuracy.' },
      { q: 'What Excel version does it output?', a: 'Standard .xlsx format compatible with Excel 2007 and later, Google Sheets, and all modern spreadsheet apps.' },
      { q: 'Is there a limit on how many rows?', a: 'No row limit. Tables of any size are supported.' },
    ],
    relatedSlugs: ['screenshot-to-excel', 'image-to-csv', 'png-to-spreadsheet', 'photo-to-excel'],
  },
  {
    path: '/png-to-spreadsheet',
    title: 'PNG to Spreadsheet — imgtosheet',
    metaDescription: 'Convert a PNG image of a table to a spreadsheet instantly. Download as CSV or Excel. AI-powered, works on any browser.',
    h1: 'PNG to Spreadsheet',
    description: 'Upload any PNG containing a data table and get a clean, editable spreadsheet file in seconds. Download as CSV or Excel. No account needed for your first conversion.',
    faqs: [
      { q: 'How do I convert a PNG to a spreadsheet?', a: 'Upload your PNG, review the extracted table in the browser, make any corrections, then download as CSV or Excel.' },
      { q: 'Does it work on PNG screenshots from Mac?', a: 'Yes. Mac screenshots (Command+Shift+4) save as PNG by default. Upload them directly — they convert perfectly.' },
      { q: 'Can I edit the table before downloading?', a: 'Yes. Every extraction shows a live editable preview. Click any cell to correct it before downloading.' },
      { q: 'What spreadsheet apps can open the output?', a: 'Excel, Google Sheets, Apple Numbers, LibreOffice Calc, and any app that opens CSV or XLSX files.' },
      { q: 'How is this different from OCR?', a: "Standard OCR reads text character by character. imgtosheet uses AI vision that understands table structure — rows, columns, headers, and data types — producing a properly formatted spreadsheet rather than raw text." },
    ],
    relatedSlugs: ['jpg-to-excel', 'image-to-csv', 'screenshot-to-excel', 'extract-table-from-image'],
  },
  {
    path: '/photo-to-excel',
    title: 'Photo to Excel — imgtosheet',
    metaDescription: 'Take a photo of any table and convert it to Excel. Works on printed documents, menus, receipts, and handwritten tables. AI-powered, free to try.',
    h1: 'Photo to Excel',
    description: 'Take a photo of any printed table — reports, menus, receipts, inventory lists — and convert it to a clean Excel spreadsheet. The AI handles rotation, lighting, and imperfect angles.',
    faqs: [
      { q: 'Can I use a phone photo of a printed table?', a: 'Yes. Phone photos work well. Hold the camera parallel to the page for best results. The AI corrects slight angles automatically.' },
      { q: 'Does it work on restaurant menus?', a: 'Yes. Menus are one of the most common use cases — item names and prices extract cleanly into two columns.' },
      { q: 'What about receipts?', a: 'Receipts with itemized lists convert well. Complex receipt layouts with multiple tax lines may need minor manual cleanup.' },
      { q: 'Does it handle photos taken in low light?', a: 'Reasonable lighting is needed. Very dark or blurry photos produce lower accuracy — the confidence score will flag uncertain cells.' },
      { q: 'Can I use this on a mobile browser?', a: 'Yes. imgtosheet works on mobile browsers. You can upload a photo directly from your camera roll.' },
    ],
    relatedSlugs: ['jpg-to-excel', 'screenshot-to-excel', 'image-to-csv', 'extract-table-from-image'],
  },
  {
    path: '/extract-table-from-image',
    title: 'Extract Table from Image — imgtosheet',
    metaDescription: 'Extract structured table data from any image. AI vision converts rows and columns into a downloadable CSV or Excel file. Free, no signup needed.',
    h1: 'Extract Table from Image',
    description: 'Upload any image containing a table and extract the structured data as a clean CSV or Excel file. Works on screenshots, photos, scans, and any image with rows and columns.',
    faqs: [
      { q: 'What types of tables can be extracted?', a: 'Any image with rows and columns: financial tables, data grids, schedules, menus, price lists, inventory sheets, research data, and more.' },
      { q: 'How does AI extraction differ from copy-paste?', a: "AI vision understands the entire table structure at once — headers, data types, merged cells, and multi-column layouts. Copy-paste from images isn't possible; manual retyping is the only alternative without a tool like this." },
      { q: 'What happens to my image after extraction?', a: 'Your image is processed in memory and deleted immediately. It is never stored on our servers.' },
      { q: 'Can I extract data from a chart or graph?', a: 'imgtosheet works on tabular data (rows and columns). Charts and graphs are not supported — it needs to be a structured table.' },
    ],
    relatedSlugs: ['screenshot-to-excel', 'image-to-csv', 'photo-to-excel', 'convert-table-image-to-excel'],
  },
  {
    path: '/excel-data-from-picture-not-working',
    title: "Excel Data from Picture Not Working? Here's the Fix — imgtosheet",
    metaDescription: "Excel's Data from Picture greyed out or not working? Here's why — and the fastest alternative that works on any browser without Microsoft 365.",
    h1: 'Excel Data from Picture Not Working?',
    description: "Excel's 'Data from Picture' feature is one of the most commonly broken features in Microsoft 365. Here's why it fails — and a faster alternative that works everywhere.",
    faqs: [
      { q: 'Why is Data from Picture greyed out in Excel?', a: "It's only available on specific Microsoft 365 subscription tiers on Windows desktop. It's not available on Mac, Excel 2019/2021 perpetual licenses, semi-annual enterprise channel builds, or Excel Online. It also requires cloud Smart Features to be enabled." },
      { q: 'Does Data from Picture work on Mac?', a: "No. As of 2026, Data from Picture is not available on Excel for Mac. It's Windows-only for Microsoft 365 subscribers." },
      { q: 'Why does Data from Picture fail on currency symbols?', a: "The OCR engine in Excel's Data from Picture frequently misreads currency symbols ($, €, £) and formatted numbers with commas. imgtosheet uses AI vision which correctly identifies number formatting and data types." },
      { q: "What's the fastest alternative to Data from Picture?", a: 'imgtosheet — upload your screenshot at imgtosheet.com, get a clean CSV or Excel file in about 10 seconds. Works on any browser, any OS, no subscription required.' },
      { q: 'Is there a free alternative to Excel Data from Picture?', a: 'Yes. imgtosheet gives you 1 free conversion per day with no account required. CSV and Excel output both included.' },
    ],
    relatedSlugs: ['screenshot-to-excel', 'microsoft-excel-data-from-picture-alternative', 'image-to-csv', 'extract-table-from-image'],
  },
  {
    path: '/microsoft-excel-data-from-picture-alternative',
    title: 'Microsoft Excel Data from Picture Alternative — imgtosheet',
    metaDescription: "The best alternative to Excel's Data from Picture. Works on Mac, any browser, without Microsoft 365. AI-powered table extraction in 10 seconds.",
    h1: 'Microsoft Excel Data from Picture Alternative',
    description: "Excel's Data from Picture only works on some Windows versions, fails on currency, and isn't available on Mac. imgtosheet is the alternative that works everywhere — any browser, any OS, no subscription.",
    faqs: [
      { q: 'Why do people look for a Data from Picture alternative?', a: "The feature is unavailable on Mac, greyed out on many Windows installs, fails on currency symbols, requires Microsoft 365, and needs cloud Smart Features enabled. Most users can't reliably access it." },
      { q: 'Does imgtosheet work on Mac?', a: 'Yes. imgtosheet runs entirely in the browser — Chrome, Safari, Firefox on Mac, Windows, Linux, iPad, or any device.' },
      { q: "Is imgtosheet more accurate than Excel Data from Picture?", a: "In most cases, yes. imgtosheet uses AI vision which correctly handles currency symbols, formatted numbers, merged cells, and low-quality images where Excel's OCR fails." },
      { q: 'Do I need to install anything?', a: 'No. imgtosheet is a web app. No install, no plugin, no subscription.' },
      { q: 'How much does it cost compared to Microsoft 365?', a: "imgtosheet starts free (1 conversion/day). Starter plan is $9/month — a fraction of Microsoft 365. Microsoft 365 doesn't guarantee Data from Picture even works on your version." },
    ],
    relatedSlugs: ['excel-data-from-picture-not-working', 'screenshot-to-excel', 'image-to-csv', 'extract-table-from-image'],
  },
  {
    path: '/image-to-google-sheets',
    title: 'Image to Google Sheets — imgtosheet',
    metaDescription: 'Convert any image of a table directly to Google Sheets. Upload a screenshot, get clean structured data, push directly to your spreadsheet.',
    h1: 'Image to Google Sheets',
    description: 'Upload any screenshot or photo of a table and get clean structured data ready for Google Sheets. Download as CSV and open in Sheets, or use a paid plan for direct push.',
    faqs: [
      { q: 'Can I send the extracted data directly to Google Sheets?', a: 'Direct Google Sheets push is on the roadmap. Currently, download the CSV and open it in Google Sheets via File → Import — takes about 3 clicks.' },
      { q: 'Does Google Sheets have a built-in image-to-table feature?', a: 'Google Sheets has a limited image-to-table feature on mobile only. On desktop it requires a multi-step workaround. imgtosheet skips all of that.' },
      { q: 'Will the CSV open correctly in Google Sheets?', a: 'Yes. Import the CSV into Google Sheets via File → Import. Column structure is preserved automatically.' },
      { q: 'What if my table has special characters?', a: 'imgtosheet outputs UTF-8 encoded CSV files which Google Sheets handles correctly including accented characters and symbols.' },
    ],
    relatedSlugs: ['screenshot-to-excel', 'image-to-csv', 'extract-table-from-image', 'convert-table-image-to-excel'],
  },
  {
    path: '/convert-table-image-to-excel',
    title: 'Convert Table Image to Excel — imgtosheet',
    metaDescription: 'Convert any table image to Excel instantly. AI reads the structure and outputs a clean XLSX file. Free to try, works on any browser.',
    h1: 'Convert Table Image to Excel',
    description: 'Upload any image containing a data table and convert it to a clean, properly formatted Excel spreadsheet. AI vision reads the entire table structure — no manual cleanup needed.',
    faqs: [
      { q: 'What image types can I convert to Excel?', a: 'JPG, PNG, WebP — screenshots, phone photos, scanned documents, all work.' },
      { q: 'Does it preserve column headers?', a: 'Yes. The AI detects header rows and formats them as column headers in the Excel output.' },
      { q: 'Can it handle tables with many columns?', a: 'Yes. Wide tables with many columns are supported. On very wide tables, review the preview before downloading to ensure all columns extracted correctly.' },
      { q: 'Is the Excel output compatible with older versions of Excel?', a: 'Yes. Output is standard .xlsx format compatible with Excel 2007 and later.' },
      { q: 'What if the table spans multiple pages?', a: 'Upload one page at a time. Multi-page batch upload is available on paid plans.' },
    ],
    relatedSlugs: ['screenshot-to-excel', 'jpg-to-excel', 'image-to-csv', 'extract-table-from-image'],
  },
]

// Map slug to display title for related links
const slugToTitle: Record<string, string> = {
  'screenshot-to-excel': 'Screenshot to Excel',
  'image-to-csv': 'Image to CSV',
  'jpg-to-excel': 'JPG to Excel',
  'png-to-spreadsheet': 'PNG to Spreadsheet',
  'photo-to-excel': 'Photo to Excel',
  'extract-table-from-image': 'Extract Table from Image',
  'excel-data-from-picture-not-working': 'Excel Data from Picture Not Working?',
  'microsoft-excel-data-from-picture-alternative': 'Excel Data from Picture Alternative',
  'image-to-google-sheets': 'Image to Google Sheets',
  'convert-table-image-to-excel': 'Convert Table Image to Excel',
}

export function getRelatedPages(slugs: string[]) {
  return slugs.map((slug) => ({
    title: slugToTitle[slug] ?? slug,
    href: `/${slug}`,
  }))
}
