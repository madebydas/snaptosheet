import { useUsage } from '../../hooks/useUsage'

export function UsageBadge() {
  const { used, limit, plan, loading } = useUsage()

  if (loading) return null

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm">
      <span className="font-medium text-gray-900">
        {plan === 'pro' ? 'Pro' : 'Free'}
      </span>
      <span className="text-gray-500">
        {plan === 'pro'
          ? `${used} conversions this month`
          : `${used}/${limit} conversions this month`}
      </span>
      {plan !== 'pro' && used >= limit && (
        <span className="text-xs text-red-600 font-medium">Limit reached</span>
      )}
    </div>
  )
}
