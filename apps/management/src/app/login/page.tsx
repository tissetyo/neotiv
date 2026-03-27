import Link from 'next/link'
import { Building2 } from 'lucide-react'

export default function LoginPage() {
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
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="label">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  defaultValue="admin@neotiv.com"
                  className="input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  defaultValue="password123"
                  className="input font-mono"
                />
              </div>
            </div>

            <div>
              <Link
                href="/hotels"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors"
              >
                Sign In
              </Link>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-text-muted">For authorized administrators only</p>
          </div>
        </div>
      </div>
    </div>
  )
}
