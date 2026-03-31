import { useNavigate } from 'react-router-dom'
import { PricingCard } from '../components/pricing/PricingCard'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { redirectToCheckout } from '../lib/stripe'
import { useState } from 'react'
import { Alert } from '../components/ui/Alert'

export default function Pricing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  async function handleProSelect() {
    if (!user) {
      navigate('/auth')
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token}`,
          },
        },
      )
      const { sessionId } = await res.json()
      await redirectToCheckout(sessionId)
    } catch {
      setError('Failed to start checkout. Please try again.')
    }
  }

  return (
    <div className="py-20">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="text-center text-4xl font-bold text-gray-900">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-center text-lg text-gray-600">
          Start free, upgrade when you need more.
        </p>

        {error && <Alert type="error" message={error} className="mt-6" />}

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          <PricingCard
            name="Free"
            price={0}
            features={[
              '5 conversions per month',
              'CSV & Excel download',
              'Inline editing',
              'Conversion history',
            ]}
            cta="Get Started"
            onSelect={() => navigate('/auth')}
          />
          <PricingCard
            name="Pro"
            price={9}
            features={[
              'Unlimited conversions',
              'CSV & Excel download',
              'Inline editing',
              'Conversion history',
              'Priority support',
            ]}
            cta="Upgrade to Pro"
            highlighted
            onSelect={handleProSelect}
          />
        </div>
      </div>
    </div>
  )
}
