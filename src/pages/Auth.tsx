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
    <div className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm px-6">
        <h1 className="mb-8 font-serif text-3xl">Sign in</h1>
        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#16A34A',
                  brandAccent: '#15803D',
                },
                radii: {
                  borderRadiusButton: '0px',
                  buttonBorderRadius: '0px',
                  inputBorderRadius: '0px',
                },
              },
            },
          }}
          providers={['google']}
          redirectTo={`${window.location.origin}/callback`}
        />
      </div>
    </div>
  )
}
