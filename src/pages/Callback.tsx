import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Spinner } from '../components/ui/Spinner'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export default function Callback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'cancel'>('loading')

  useEffect(() => {
    const checkout = searchParams.get('checkout')

    if (checkout === 'success') {
      setStatus('success')
      return
    }

    if (checkout === 'cancel') {
      setStatus('cancel')
      return
    }

    // OAuth callback — Supabase handles the hash automatically
    const timer = setTimeout(() => {
      navigate('/dashboard', { replace: true })
    }, 1000)

    return () => clearTimeout(timer)
  }, [searchParams, navigate])

  if (status === 'success') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="max-w-md text-center">
          <div className="text-4xl">🎉</div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Welcome to Pro!</h2>
          <p className="mt-2 text-gray-600">
            Your subscription is active. Enjoy unlimited conversions.
          </p>
          <Button className="mt-6" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </Card>
      </div>
    )
  }

  if (status === 'cancel') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-900">Checkout Cancelled</h2>
          <p className="mt-2 text-gray-600">
            No worries! You can upgrade anytime from the pricing page.
          </p>
          <Button className="mt-6" variant="outline" onClick={() => navigate('/pricing')}>
            Back to Pricing
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <Spinner className="mx-auto h-10 w-10" />
        <p className="mt-4 text-gray-600">Signing you in...</p>
      </div>
    </div>
  )
}
