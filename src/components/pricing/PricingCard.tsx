import { Link } from 'react-router-dom'

const tiers = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    description: '5 conversions per month. Export in CSV or Excel. No credit card needed.',
    cta: 'Get started',
    ctaLink: '/auth',
    highlighted: false,
    badge: null,
  },
  {
    name: 'Monthly',
    price: '$9',
    period: '/mo',
    description: '50 conversions per month. Cancel anytime. Booster credits available.',
    cta: 'Start plan',
    ctaLink: '/auth',
    highlighted: false,
    badge: null,
  },
  {
    name: 'Yearly',
    price: '$59',
    period: '/yr',
    description: '50 conversions per month. Same features, 45% less.',
    cta: 'Start plan',
    ctaLink: '/auth',
    highlighted: false,
    badge: 'save 45%',
  },
  {
    name: 'Lifetime',
    price: '$199',
    period: '',
    description: 'Pay once, convert forever. 50 conversions/month for life. No renewals, no surprises.',
    cta: 'Get lifetime access',
    ctaLink: '/auth',
    highlighted: true,
    badge: 'one-time',
  },
]

export function PricingSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="font-serif text-4xl text-center sm:text-5xl">Simple pricing</h2>

        <div className="mt-16 grid gap-0 sm:grid-cols-4">
          {tiers.map((tier, i) => (
            <div
              key={tier.name}
              className={`border border-gray-200 px-5 py-8 ${
                tier.highlighted ? 'border-accent' : ''
              } ${i > 0 ? 'sm:border-l-0' : ''}`}
            >
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-500">{tier.name}</p>
                {tier.badge && (
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 ${
                    tier.badge === 'save 45%'
                      ? 'text-accent border border-accent/30'
                      : 'text-accent border border-accent/30'
                  }`}>
                    {tier.badge}
                  </span>
                )}
              </div>
              <p className="mt-2">
                <span className="font-serif text-3xl">{tier.price}</span>
                {tier.period && <span className="text-sm text-gray-400">{tier.period}</span>}
              </p>
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
