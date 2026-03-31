import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export default function Auth() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, loading, navigate])

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md px-4">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">
          Welcome to SnapToSheet
        </h1>
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563eb',
                    brandAccent: '#1d4ed8',
                  },
                },
              },
            }}
            providers={['google']}
            redirectTo={`${window.location.origin}/callback`}
          />
        </div>
      </div>
    </div>
  )
}
