import type { Conversion, TableData } from '../../types'
import { Card } from '../ui/Card'
import { formatDate } from '../../lib/utils'

interface ConversionHistoryProps {
  conversions: Conversion[]
  onSelect: (data: TableData) => void
}

export function ConversionHistory({ conversions, onSelect }: ConversionHistoryProps) {
  if (conversions.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No conversions yet. Upload an image to get started!
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {conversions.map((c) => (
        <Card
          key={c.id}
          className={`flex items-center gap-4 p-4 ${
            c.status === 'completed' ? 'cursor-pointer hover:border-brand-300' : ''
          }`}
          onClick={() => {
            if (c.status === 'completed' && c.extracted_data) {
              onSelect(c.extracted_data)
            }
          }}
        >
          {c.image_url && (
            <img
              src={c.image_url}
              alt=""
              className="h-12 w-12 rounded-lg object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              Conversion {c.id.slice(0, 8)}
            </p>
            <p className="text-xs text-gray-500">{formatDate(c.created_at)}</p>
          </div>
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
              c.status === 'completed'
                ? 'bg-green-50 text-green-700'
                : c.status === 'failed'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-yellow-50 text-yellow-700'
            }`}
          >
            {c.status}
          </span>
        </Card>
      ))}
    </div>
  )
}
