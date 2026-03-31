import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import { PLANS, type PlanType } from '../lib/constants'

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

  const plan: PlanType = (profile?.plan as PlanType) ?? 'free'
  const limit = PLANS[plan]?.conversionsPerMonth ?? 5
  const canConvert = used < limit

  return { used, limit, canConvert, loading, plan }
}
