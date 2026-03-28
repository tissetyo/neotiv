'use client'

import { useState } from 'react'
import { Building2, Loader2, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type DebugStep = { label: string; status: 'ok' | 'error' | 'info'; detail?: string }

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugSteps, setDebugSteps] = useState<DebugStep[]>([])
  const [loginDone, setLoginDone] = useState(false)
  const supabase = createClient()

  const addStep = (step: DebugStep) => {
    setDebugSteps(prev => [...prev, step])
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setDebugSteps([])
    setLoginDone(false)

    try {
      // Step 1: sign in
      addStep({ label: 'Calling supabase.auth.signInWithPassword…', status: 'info' })
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

      if (authError) {
        addStep({ label: 'Auth error', status: 'error', detail: authError.message })
        throw authError
      }

      addStep({
        label: 'Sign-in succeeded',
        status: 'ok',
        detail: `user_id: ${data.user?.id} | expires_at: ${data.session?.expires_at}`
      })

      // Step 2: verify session is readable back
      addStep({ label: 'Re-reading session from client…', status: 'info' })
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        addStep({ label: 'getSession() returned null — cookie may not be set', status: 'error' })
      } else {
        addStep({
          label: 'Session confirmed on client',
          status: 'ok',
          detail: `access_token prefix: ${session.access_token.slice(0, 20)}…`
        })
      }

      setLoginDone(true)
      setLoading(false)

    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-body flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg mb-6">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-text-primary">
          Neotiv Management
        </h2>
        <p className="mt-2 text-center text-sm text-text-secondary">
          Sign in to manage your organization
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-border-light">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-600 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="label">Email address</label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@neotiv.com"
                  className="input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input font-mono"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || loginDone}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
              </button>
            </div>
          </form>

          {/* ─── Debug Output ─── */}
          {debugSteps.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs font-mono space-y-2">
              <p className="text-gray-500 font-sans font-semibold text-[11px] uppercase tracking-wider mb-3">Auth Debug Log</p>
              {debugSteps.map((step, i) => (
                <div key={i} className={`flex gap-2 ${step.status === 'error' ? 'text-red-600' : step.status === 'ok' ? 'text-green-700' : 'text-gray-500'}`}>
                  <span>{step.status === 'ok' ? '✓' : step.status === 'error' ? '✗' : '→'}</span>
                  <div>
                    <span>{step.label}</span>
                    {step.detail && <div className="text-gray-400 break-all mt-0.5">{step.detail}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ─── Post-login manual navigation ─── */}
          {loginDone && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-2 text-green-700 font-semibold text-sm mb-3">
                <CheckCircle2 className="w-5 h-5" />
                Login successful! Navigate manually:
              </div>
              <div className="flex flex-col gap-2">
                <a
                  href="/hotels"
                  className="flex items-center justify-between w-full px-4 py-2.5 bg-white border border-green-200 rounded-lg text-sm font-medium text-green-800 hover:bg-green-50 transition-colors"
                >
                  Go to /hotels <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => { window.location.href = '/hotels' }}
                  className="w-full px-4 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-light transition-colors"
                >
                  window.location.href = '/hotels'
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-text-muted">For authorized administrators only</p>
          </div>
        </div>
      </div>
    </div>
  )
}
