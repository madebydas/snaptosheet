import type { TableData } from '../../types'
import { EditableCell } from './EditableCell'

interface TablePreviewProps {
  data: TableData
  onDataChange: (data: TableData) => void
}

export function TablePreview({ data, onDataChange }: TablePreviewProps) {
  const updateHeader = (colIndex: number, value: string) => {
    const newHeaders = [...data.headers]
    newHeaders[colIndex] = value
    onDataChange({ ...data, headers: newHeaders })
  }

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = data.rows.map((row, ri) =>
      ri === rowIndex ? row.map((cell, ci) => (ci === colIndex ? value : cell)) : row,
    )
    onDataChange({ ...data, rows: newRows })
  }

  const addRow = () => {
    const newRow = new Array(data.headers.length).fill('')
    onDataChange({ ...data, rows: [...data.rows, newRow] })
  }

  const removeRow = (rowIndex: number) => {
    onDataChange({ ...data, rows: data.rows.filter((_, i) => i !== rowIndex) })
  }

  const addColumn = () => {
    onDataChange({
      headers: [...data.headers, `Col ${data.headers.length + 1}`],
      rows: data.rows.map((row) => [...row, '']),
    })
  }

  const removeColumn = (colIndex: number) => {
    onDataChange({
      headers: data.headers.filter((_, i) => i !== colIndex),
      rows: data.rows.map((row) => row.filter((_, i) => i !== colIndex)),
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        <button onClick={addRow} className="text-xs text-gray-400 hover:text-black transition-colors">
          + row
        </button>
        <button onClick={addColumn} className="text-xs text-gray-400 hover:text-black transition-colors">
          + column
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-200">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-accent">
              {data.headers.map((header, ci) => (
                <th key={ci} className="px-1 py-1">
                  <div className="flex items-center gap-1">
                    <EditableCell value={header} onChange={(v) => updateHeader(ci, v)} />
                    {data.headers.length > 1 && (
                      <button
                        onClick={() => removeColumn(ci)}
                        className="text-xs text-gray-300 hover:text-red-500 transition-colors"
                      >
                        x
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className="w-6" />
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, ri) => (
              <tr key={ri} className={`border-b border-gray-100 ${ri % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                {row.map((cell, ci) => (
                  <td key={ci} className="px-1 py-0.5">
                    <EditableCell value={cell} onChange={(v) => updateCell(ri, ci, v)} />
                  </td>
                ))}
                <td className="px-1">
                  <button
                    onClick={() => removeRow(ri)}
                    className="text-xs text-gray-300 hover:text-red-500 transition-colors"
                  >
                    x
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
