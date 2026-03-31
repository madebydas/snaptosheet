export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          stripe_customer_id: string | null
          plan: 'free' | 'pro'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          stripe_customer_id?: string | null
          plan?: 'free' | 'pro'
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      conversions: {
        Row: {
          id: string
          user_id: string
          image_url: string
          extracted_data: Json | null
          status: 'pending' | 'processing' | 'completed' | 'failed'
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          image_url: string
          extracted_data?: Json | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          error_message?: string | null
        }
        Update: Partial<Database['public']['Tables']['conversions']['Insert']>
      }
      subscriptions: {
        Row: {
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
        Insert: {
          id?: string
          user_id: string
          stripe_subscription_id: string
          stripe_price_id: string
          status?: string
          current_period_start: string
          current_period_end: string
          cancel_at_period_end?: boolean
        }
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>
      }
    }
  }
}
