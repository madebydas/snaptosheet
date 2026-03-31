import { Link } from 'react-router-dom'

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: '5 conversions per month. Export in CSV or Excel. No credit card needed.',
    cta: 'Get started',
    ctaLink: '/auth',
    highlighted: false,
  },
  {
    name: 'Yearly',
    price: '$59/yr',
    description: '50 conversions per month. Booster credits available when you need more.',
    cta: 'Start plan',
    ctaLink: '/auth',
    highlighted: false,
  },
  {
    name: 'Lifetime',
    price: '$199',
    badge: 'one-time',
    description: 'Pay once, convert forever. 50 conversions/month for life. No renewals, no surprises.',
    cta: 'Get lifetime access',
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
              } ${tier.name === 'Free' ? 'sm:border-r-0' : ''} ${tier.name === 'Lifetime' ? 'sm:border-l-0' : ''}`}
            >
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-500">{tier.name}</p>
                {tier.badge && (
                  <span className="text-[10px] font-medium text-accent border border-accent/30 px-1.5 py-0.5">
                    {tier.badge}
                  </span>
                )}
              </div>
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
