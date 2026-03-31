import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import type { Subscription } from '../types'

export function useSubscription() {
  const { user, profile } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSubscription() {
      if (!user) return
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()
      setSubscription(data as Subscription | null)
      setLoading(false)
    }
    fetchSubscription()
  }, [user])

  const plan = profile?.plan ?? 'free'
  const isProUser = plan === 'pro'

  return { subscription, plan, isProUser, loading }
}
