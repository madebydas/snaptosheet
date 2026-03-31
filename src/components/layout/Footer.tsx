import { Link } from 'react-router-dom'
import { Wordmark } from '../ui/Logo'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 py-8">
      <div className="mx-auto max-w-6xl px-6 flex items-center justify-between">
        <Wordmark size={16} />
        <div className="flex items-center gap-6">
          <Link to="/pricing" className="text-xs text-gray-400 hover:text-black transition-colors">
            Pricing
          </Link>
          <Link to="/auth" className="text-xs text-gray-400 hover:text-black transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </footer>
  )
}
