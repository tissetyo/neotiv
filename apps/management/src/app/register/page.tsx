'use client'

import { useState } from 'react'
import { Building2, Loader2, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react'
import { registerAction, checkSlugAction } from './actions'
import Link from 'next/link'

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Step 1: Account
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  // Step 2: Org
  const [orgName, setOrgName] = useState('')

  // Step 3: Hotel
  const [hotelName, setHotelName] = useState('')
  const [hotelSlug, setHotelSlug] = useState('')
  const [hotelAddress, setHotelAddress] = useState('')
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')

  // Auto-generate slug from hotel name
  const handleHotelNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setHotelName(val)
    if (slugStatus === 'idle' || slugStatus === 'available') {
      setHotelSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
      setSlugStatus('idle')
    }
  }

  const handleSlugBlur = async () => {
    if (!hotelSlug) return
    setSlugStatus('checking')
    const { available } = await checkSlugAction(hotelSlug)
    setSlugStatus(available ? 'available' : 'taken')
  }

  const handleNext = () => setStep(s => s + 1)
  const handleBack = () => setStep(s => s - 1)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step !== 3) return
    
    if (slugStatus === 'taken') {
      setError('Please choose a different Dashboard URL.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)
      formData.append('firstName', firstName)
      formData.append('lastName', lastName)
      formData.append('orgName', orgName)
      formData.append('hotelName', hotelName)
      formData.append('hotelSlug', hotelSlug)
      formData.append('hotelAddress', hotelAddress)
      
      const result = await registerAction(formData)

      if (result?.error) {
        throw new Error(result.error)
      }
      
      if (result?.success) {
        if (result.requiresEmailConfirmation) {
          setError('Success! Please check your email to confirm your account.')
          setLoading(false)
        } else {
          window.location.href = `/hotels/${result.hotelSlug}`
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to register account')
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
          Create an Account
        </h2>
        <p className="mt-2 text-center text-sm text-text-secondary">
          Get started with Neotiv Management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-border-light relative overflow-hidden">
          
          {/* Progress Tracker */}
          <div className="flex items-center justify-center mb-8 gap-2">
            {[1, 2, 3].map(num => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors
                  ${step >= num ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {num}
                </div>
                {num < 3 && (
                  <div className={`w-8 h-1 mx-2 rounded-full transition-colors ${step > num ? 'bg-primary' : 'bg-gray-100'}`} />
                )}
              </div>
            ))}
          </div>

          <form className="space-y-6" onSubmit={handleRegister}>
            {error && !error.includes('Success') && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-600 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            {error?.includes('Success') && (
              <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex gap-3 text-green-700 text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* STEP 1: ACCOUNT */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-semibold mb-4">Your Profile</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="label">First Name</label>
                    <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className="input mt-1" />
                  </div>
                  <div>
                    <label className="label">Last Name</label>
                    <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className="input mt-1" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="label">Work Email</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input mt-1" />
                </div>
                <div className="mb-6">
                  <label className="label">Password</label>
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 characters" minLength={8} className="input mt-1 font-mono" />
                </div>
                <button type="button" onClick={handleNext} disabled={!email || !password || !firstName || !lastName} className="btn-primary w-full py-3 justify-center">
                  Continue Organization Setup <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            )}

            {/* STEP 2: ORG */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-semibold mb-4">Your Organization</h3>
                <p className="text-sm text-text-secondary mb-4">An organization owns multiple hotels. You can add more hotels later.</p>
                <div className="mb-6">
                  <label className="label">Organization Name</label>
                  <input type="text" required value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="e.g. Merah Putih Group" className="input mt-1" />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={handleBack} className="btn-secondary py-3 px-4">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={handleNext} disabled={!orgName} className="btn-primary flex-1 py-3 justify-center">
                    Continue to Hotel Setup <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: HOTEL */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-semibold mb-4">First Property</h3>
                <div className="mb-4">
                  <label className="label">Hotel Name</label>
                  <input type="text" required value={hotelName} onChange={handleHotelNameChange} className="input mt-1" />
                </div>
                <div className="mb-4">
                  <label className="label flex justify-between">
                    Dashboard URL
                    {slugStatus === 'checking' && <span className="text-text-muted text-xs animate-pulse">Checking...</span>}
                    {slugStatus === 'available' && <span className="text-success text-xs font-medium flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Available!</span>}
                    {slugStatus === 'taken' && <span className="text-notification-red text-xs font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Taken</span>}
                  </label>
                  <div className="mt-1 flex rounded-lg shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-border-light bg-gray-50 text-text-muted sm:text-sm">
                      neotiv.com/h/
                    </span>
                    <input 
                      type="text" 
                      required 
                      value={hotelSlug} 
                      onChange={e => { setHotelSlug(e.target.value); setSlugStatus('idle') }} 
                      onBlur={handleSlugBlur}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-lg sm:text-sm border border-border-light focus:ring-2 focus:ring-accent focus:border-accent outline-none" 
                    />
                  </div>
                  <p className="text-xs text-text-muted mt-1">This will be your custom link for staff to log in.</p>
                </div>
                <div className="mb-6">
                  <label className="label">Address (Optional)</label>
                  <input type="text" value={hotelAddress} onChange={e => setHotelAddress(e.target.value)} className="input mt-1" />
                </div>
                
                <div className="flex gap-3">
                  <button type="button" onClick={handleBack} disabled={loading} className="btn-secondary py-3 px-4 disabled:opacity-50">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button type="submit" disabled={loading || slugStatus === 'taken'} className="btn-primary flex-1 py-3 justify-center disabled:opacity-50">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Complete Registration'}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-muted">
              Already have an account? <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
