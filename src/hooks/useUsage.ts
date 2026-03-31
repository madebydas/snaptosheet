import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import { PLANS } from '../lib/constants'

export function useUsage() {
  const { user, profile } = useAuth()
  const [used, setUsed] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsage() {
      if (!user) {
        setLoading(false)
        return
      }
      const { data } = await supabase.rpc('conversions_this_month', { uid: user.id })
      setUsed(data ?? 0)
      setLoading(false)
    }
    fetchUsage()
  }, [user])

  const plan = profile?.plan ?? 'free'
  const limit = PLANS[plan].conversionsPerMonth
  const canConvert = plan === 'pro' || used < limit

  return { used, limit, canConvert, loading, plan }
}
