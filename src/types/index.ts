export interface TableData {
  headers: string[]
  rows: string[][]
}

export interface Conversion {
  id: string
  user_id: string
  image_url: string
  extracted_data: TableData | null
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error_message: string | null
  created_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  stripe_customer_id: string | null
  plan: 'free' | 'pro'
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id: string
  stripe_price_id: string
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete'
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}
