import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'

const tiers = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    description: '1 conversion per day. Export in CSV or Excel. No credit card needed.',
    cta: 'Get started',
    ctaLink: '/auth',
    highlighted: false,
    badge: null,
    planType: null,
    priceEnvKey: null,
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
    planType: 'monthly',
    priceEnvKey: 'VITE_STRIPE_PRICE_ID_MONTHLY',
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
    planType: 'yearly',
    priceEnvKey: 'VITE_STRIPE_PRICE_ID_YEARLY',
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
    planType: 'lifetime',
    priceEnvKey: 'VITE_STRIPE_PRICE_ID_LIFETIME',
  },
]

export function PricingSection() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loadingTier, setLoadingTier] = useState<string | null>(null)

  async function handleUpgrade(planType: string, priceEnvKey: string) {
    if (!user) {
      navigate('/auth')
      return
    }

    const priceId = import.meta.env[priceEnvKey]
    if (!priceId) {
      alert('Payment system is being set up. Please try again later.')
      return
    }

    setLoadingTier(planType)
    try {
      const { data: { session } } = await supabase.auth.getSession()

      const res = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ priceId, planType }),
      })

      const { url, error } = await res.json()

      if (error) {
        alert(error)
        return
      }

      if (url) {
        window.location.href = url
      }
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoadingTier(null)
    }
  }

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
                  <span className="text-[10px] font-medium px-1.5 py-0.5 text-accent border border-accent/30">
                    {tier.badge}
                  </span>
                )}
              </div>
              <p className="mt-2">
                <span className="font-serif text-3xl">{tier.price}</span>
                {tier.period && <span className="text-sm text-gray-400">{tier.period}</span>}
              </p>
              <p className="mt-3 text-sm text-gray-500 leading-relaxed">{tier.description}</p>

              {tier.planType && tier.priceEnvKey ? (
                <button
                  onClick={() => handleUpgrade(tier.planType!, tier.priceEnvKey!)}
                  disabled={loadingTier === tier.planType}
                  className={`mt-6 block w-full text-center py-2.5 text-sm font-medium transition-colors disabled:opacity-50 ${
                    tier.highlighted
                      ? 'bg-accent text-white hover:bg-accent-hover'
                      : 'border border-gray-300 text-black hover:border-gray-500'
                  }`}
                >
                  {loadingTier === tier.planType ? 'Loading...' : tier.cta}
                </button>
              ) : (
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
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
