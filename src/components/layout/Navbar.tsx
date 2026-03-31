import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'

export function Navbar() {
  const { user, profile, signOut } = useAuth()

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-brand-600">
          <svg className="h-8 w-8" viewBox="0 0 100 100" fill="none">
            <rect x="10" y="10" width="80" height="80" rx="12" fill="#2563eb" />
            <rect x="22" y="28" width="56" height="8" rx="2" fill="#fff" />
            <rect x="22" y="42" width="56" height="8" rx="2" fill="#bfdbfe" />
            <rect x="22" y="56" width="56" height="8" rx="2" fill="#fff" />
            <rect x="22" y="70" width="56" height="8" rx="2" fill="#bfdbfe" />
          </svg>
          SnapToSheet
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
          <Link to="/pricing" className="text-sm text-gray-600 hover:text-gray-900">
            Pricing
          </Link>

          {user ? (
            <>
              <div className="flex items-center gap-3">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="h-8 w-8 rounded-full" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-medium text-brand-700">
                    {(profile?.email?.[0] ?? user.email?.[0] ?? '?').toUpperCase()}
                  </div>
                )}
                <Button variant="secondary" size="sm" onClick={signOut}>
                  Sign out
                </Button>
              </div>
            </>
          ) : (
            <Link to="/auth">
              <Button size="sm">Sign in</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
