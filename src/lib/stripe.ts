import { loadStripe, type Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null> | null = null

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}

export async function redirectToCheckout(sessionId: string) {
  const stripe = await getStripe()
  if (stripe) {
    await stripe.redirectToCheckout({ sessionId })
  }
}
