import { useUsage } from '../../hooks/useUsage'

export function UsageBadge() {
  const { used, limit, plan, loading } = useUsage()

  if (loading) return null

  const isPaid = plan !== 'free'

  return (
    <div className="inline-flex items-center gap-2 text-sm">
      <span className="font-medium text-gray-900 capitalize">
        {plan}
      </span>
      <span className="text-gray-500">
        {`${used}/${limit} conversions this month`}
      </span>
      {!isPaid && used >= limit && (
        <span className="text-xs text-red-600 font-medium">Limit reached</span>
      )}
    </div>
  )
}
