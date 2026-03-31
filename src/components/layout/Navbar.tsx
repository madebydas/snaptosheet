import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { LogoLockup } from '../ui/Logo'

export function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <nav className="border-b border-gray-200">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="hidden sm:inline-flex">
          <LogoLockup iconSize={28} wordmarkSize={18} />
        </Link>
        <Link to="/" className="inline-flex sm:hidden">
          <LogoLockup iconSize={24} wordmarkSize={16} />
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/pricing" className="text-sm text-gray-500 hover:text-black transition-colors">
            Pricing
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" className="text-sm text-gray-500 hover:text-black transition-colors">
                Dashboard
              </Link>
              <button
                onClick={signOut}
                className="text-sm text-gray-500 hover:text-black transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link to="/auth" className="text-sm text-gray-500 hover:text-black transition-colors">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
