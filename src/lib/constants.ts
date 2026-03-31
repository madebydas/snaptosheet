export const PLANS = {
  free: { name: 'Free', price: 0, conversionsPerMonth: 5 },
  pro: { name: 'Pro', price: 9, conversionsPerMonth: Infinity },
} as const

export const STRIPE_PRICE_ID = import.meta.env.VITE_STRIPE_PRICE_ID_PRO as string
