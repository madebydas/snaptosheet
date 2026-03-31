export const PLANS = {
  free: { name: 'Free', price: 0, conversionsPerMonth: 5 },
  monthly: { name: 'Monthly', price: 9, conversionsPerMonth: 50 },
  yearly: { name: 'Yearly', price: 59, conversionsPerMonth: 50 },
  lifetime: { name: 'Lifetime', price: 199, conversionsPerMonth: 50 },
} as const

export type PlanType = keyof typeof PLANS
