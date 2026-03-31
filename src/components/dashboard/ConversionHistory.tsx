import type { Conversion, TableData } from '../../types'
import { formatDate } from '../../lib/utils'

interface ConversionHistoryProps {
  conversions: Conversion[]
  onSelect: (data: TableData) => void
}

export function ConversionHistory({ conversions, onSelect }: ConversionHistoryProps) {
  if (conversions.length === 0) {
    return (
      <p className="text-sm text-gray-400">
        No conversions yet.
      </p>
    )
  }

  return (
    <div className="space-y-0">
      {conversions.map((c) => (
        <div
          key={c.id}
          className={`border-b border-gray-100 py-3 ${
            c.status === 'completed' ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''
          }`}
          onClick={() => {
            if (c.status === 'completed' && c.extracted_data) {
              onSelect(c.extracted_data)
            }
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 font-mono truncate">
              {c.id.slice(0, 8)}
            </span>
            <span className={`text-xs ${
              c.status === 'completed' ? 'text-accent' : c.status === 'failed' ? 'text-red-500' : 'text-gray-400'
            }`}>
              {c.status}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{formatDate(c.created_at)}</p>
        </div>
      ))}
    </div>
  )
}
