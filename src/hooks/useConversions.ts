import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import type { Conversion } from '../types'

export function useConversions() {
  const { user } = useAuth()
  const [conversions, setConversions] = useState<Conversion[]>([])
  const [loading, setLoading] = useState(true)

  const fetchConversions = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }
    setLoading(true)
    const { data } = await supabase
      .from('conversions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setConversions((data as Conversion[]) ?? [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchConversions()
  }, [fetchConversions])

  return { conversions, loading, refetch: fetchConversions }
}
