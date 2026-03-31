import { cn } from '../../lib/utils'

interface AlertProps {
  type: 'success' | 'error' | 'info'
  message: string
  className?: string
}

export function Alert({ type, message, className }: AlertProps) {
  return (
    <div
      className={cn(
        'rounded-lg px-4 py-3 text-sm',
        type === 'success' && 'bg-green-50 text-green-800 border border-green-200',
        type === 'error' && 'bg-red-50 text-red-800 border border-red-200',
        type === 'info' && 'bg-blue-50 text-blue-800 border border-blue-200',
        className,
      )}
    >
      {message}
    </div>
  )
}
