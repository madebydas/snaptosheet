import { Link } from 'react-router-dom'

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: '5 conversions per month. No credit card.',
    cta: 'Get started',
    ctaLink: '/auth',
    highlighted: false,
  },
  {
    name: 'Starter',
    price: '$9/mo',
    description: '50 conversions per month. Priority processing.',
    cta: 'Start plan',
    ctaLink: '/auth',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$19/mo',
    description: 'Unlimited conversions. Bulk upload. API access.',
    cta: 'Start plan',
    ctaLink: '/auth',
    highlighted: true,
  },
]

export function PricingSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="font-serif text-4xl text-center sm:text-5xl">Simple pricing</h2>

        <div className="mt-16 grid gap-0 sm:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`border border-gray-200 px-6 py-8 ${
                tier.highlighted ? 'border-accent' : ''
              } ${tier.name === 'Free' ? 'sm:border-r-0' : ''} ${tier.name === 'Pro' ? 'sm:border-l-0' : ''}`}
            >
              <p className="text-sm font-medium text-gray-500">{tier.name}</p>
              <p className="mt-2 font-serif text-3xl">{tier.price}</p>
              <p className="mt-3 text-sm text-gray-500 leading-relaxed">{tier.description}</p>
              <Link
                to={tier.ctaLink}
                className={`mt-6 block text-center py-2.5 text-sm font-medium transition-colors ${
                  tier.highlighted
                    ? 'bg-accent text-white hover:bg-accent-hover'
                    : 'border border-gray-300 text-black hover:border-gray-500'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
