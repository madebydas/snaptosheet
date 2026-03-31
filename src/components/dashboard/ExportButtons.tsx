import { Button } from '../ui/Button'
import type { TableData } from '../../types'
import * as XLSX from 'xlsx'

interface ExportButtonsProps {
  data: TableData
  filename?: string
}

function escapeCsvCell(cell: string): string {
  if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
    return `"${cell.replace(/"/g, '""')}"`
  }
  return cell
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function ExportButtons({ data, filename = 'snaptosheet-export' }: ExportButtonsProps) {
  const exportCsv = () => {
    const headerLine = data.headers.map(escapeCsvCell).join(',')
    const rowLines = data.rows.map((row) => row.map(escapeCsvCell).join(','))
    const csv = [headerLine, ...rowLines].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    downloadBlob(blob, `${filename}.csv`)
  }

  const exportXlsx = () => {
    const ws = XLSX.utils.aoa_to_sheet([data.headers, ...data.rows])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    downloadBlob(blob, `${filename}.xlsx`)
  }

  return (
    <div className="flex gap-2">
      <Button variant="secondary" size="sm" onClick={exportCsv}>
        Download CSV
      </Button>
      <Button variant="secondary" size="sm" onClick={exportXlsx}>
        Download Excel
      </Button>
    </div>
  )
}
