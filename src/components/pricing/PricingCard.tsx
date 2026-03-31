import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'

interface PricingCardProps {
  name: string
  price: number
  features: string[]
  cta: string
  highlighted?: boolean
  onSelect: () => void
}

export function PricingCard({ name, price, features, cta, highlighted, onSelect }: PricingCardProps) {
  return (
    <Card
      className={cn(
        'flex flex-col text-center',
        highlighted && 'border-brand-600 ring-2 ring-brand-600',
      )}
    >
      <h3 className="text-xl font-bold text-gray-900">{name}</h3>
      <div className="mt-4">
        <span className="text-4xl font-extrabold text-gray-900">
          ${price}
        </span>
        {price > 0 && <span className="text-gray-500">/month</span>}
      </div>
      <ul className="mt-6 flex-1 space-y-3 text-sm text-gray-600">
        {features.map((f) => (
          <li key={f} className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <Button
        className="mt-8 w-full"
        variant={highlighted ? 'primary' : 'outline'}
        onClick={onSelect}
      >
        {cta}
      </Button>
    </Card>
  )
}
