export const PLANS = {
  free: { name: 'Free', price: 0, conversionsPerDay: 1, conversionsPerMonth: null },
  monthly: { name: 'Monthly', price: 9, conversionsPerDay: null, conversionsPerMonth: 50 },
  yearly: { name: 'Yearly', price: 59, conversionsPerDay: null, conversionsPerMonth: 50 },
  lifetime: { name: 'Lifetime', price: 199, conversionsPerDay: null, conversionsPerMonth: 50 },
} as const

export type PlanType = keyof typeof PLANS
