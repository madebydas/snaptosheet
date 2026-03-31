import { cn } from '../../lib/utils'
import type { HTMLAttributes } from 'react'

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-xl bg-white shadow-sm border border-gray-200 p-6', className)}
      {...props}
    >
      {children}
    </div>
  )
}
