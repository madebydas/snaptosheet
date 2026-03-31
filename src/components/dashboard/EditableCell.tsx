import { useState, useRef, useEffect } from 'react'

interface EditableCellProps {
  value: string
  onChange: (value: string) => void
}

export function EditableCell({ value, onChange }: EditableCellProps) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setText(value)
  }, [value])

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const commit = () => {
    setEditing(false)
    if (text !== value) {
      onChange(text)
    }
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        className="w-full border-0 bg-brand-50 px-2 py-1 text-sm outline-none ring-2 ring-brand-500 rounded"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') {
            setText(value)
            setEditing(false)
          }
        }}
      />
    )
  }

  return (
    <div
      className="cursor-pointer px-2 py-1 text-sm hover:bg-gray-50 rounded min-h-[28px]"
      onDoubleClick={() => setEditing(true)}
      title="Double-click to edit"
    >
      {value || '\u00A0'}
    </div>
  )
}
