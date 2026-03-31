import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import { PLANS, type PlanType } from '../lib/constants'

export function useUsage() {
  const { user, profile } = useAuth()
  const [used, setUsed] = useState(0)
  const [loading, setLoading] = useState(true)

  const plan: PlanType = (profile?.plan as PlanType) ?? 'free'
  const isFree = plan === 'free'

  useEffect(() => {
    async function fetchUsage() {
      if (!user) {
        setLoading(false)
        return
      }

      if (isFree) {
        // Free users: count today's conversions
        const { data } = await supabase.rpc('conversions_today', { uid: user.id })
        setUsed(data ?? 0)
      } else {
        // Paid users: count this month's conversions
        const { data } = await supabase.rpc('conversions_this_month', { uid: user.id })
        setUsed(data ?? 0)
      }
      setLoading(false)
    }
    fetchUsage()
  }, [user, isFree])

  const limit = isFree
    ? (PLANS.free.conversionsPerDay ?? 1)
    : (PLANS[plan]?.conversionsPerMonth ?? 50)
  const canConvert = used < limit

  return { used, limit, canConvert, loading, plan, isFree }
}
