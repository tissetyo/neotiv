import { mockStaff } from '@/data/mock-data'
import { Building2 } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-bg-body flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary-50 to-bg-body -z-10" />

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Neotiv Front Office</h1>
          <p className="text-text-secondary mt-1">Sign in to manage your hotel</p>
        </div>

        <form className="card p-8">
          <div className="space-y-5 mb-8">
            <div>
              <label className="label" htmlFor="email">Email address</label>
              <input 
                id="email" 
                type="email" 
                defaultValue={mockStaff.email}
                className="input" 
                required 
              />
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <input 
                id="password" 
                type="password" 
                defaultValue="password123"
                className="input" 
                required 
              />
            </div>
          </div>

          {/* Simple Link for demo purposes since we don't have real auth yet */}
          <Link href="/dashboard" className="btn-primary w-full shadow-lg shadow-primary/10 py-3">
            Sign In
          </Link>
          
          <p className="text-center text-xs text-text-muted mt-6">
            Internal hotel staff use only
          </p>
        </form>
      </div>
    </div>
  )
}
