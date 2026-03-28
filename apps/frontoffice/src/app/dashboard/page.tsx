import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardRedirect() {
  const supabase = createClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user
  if (!user) {
    redirect('/login')
  }

  // Fetch the user's profile to find their assigned hotel
  const { data: profile } = await supabase
    .from('users')
    .select('hotel_id')
    .eq('auth_id', user.id)
    .maybeSingle()

  if (!profile || !profile.hotel_id) {
    // If they have no profile or no hotel assignment, this is an error state for Front Office
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
        <h1 className="text-xl font-bold text-gray-900 mb-2">No Property Assigned</h1>
        <p className="text-gray-500 max-w-sm">Your account has not been assigned to a specific hotel. Please contact your manager.</p>
      </div>
    )
  }

  // Fetch the hotel slug
  const { data: hotel } = await supabase
    .from('hotels')
    .select('slug')
    .eq('id', profile.hotel_id)
    .single()

  if (!hotel || !hotel.slug) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Hotel Configuration Error</h1>
          <p className="text-gray-500 max-w-sm">The property you are assigned to is missing its custom URL. Please contact support.</p>
        </div>
      )
  }

  // Redirect to their custom dashboard URL
  redirect(`/${hotel.slug}/dashboard`)
}
