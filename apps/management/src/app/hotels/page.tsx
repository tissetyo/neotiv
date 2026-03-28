import { HotelCard } from '@/components/HotelCard'
import { Plus, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Hotel } from '@neotiv/types'

export default async function HotelsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch hotels for this organization (derived from user)
  const { data: profile } = await supabase
    .from('users')
    .select('organization_id')
    .eq('auth_id', user.id)
    .single()

  const { data: hotelsData } = await supabase
    .from('hotels')
    .select('*, rooms(count), users(count)')
    .eq('organization_id', profile?.organization_id)

  const hotels = (hotelsData || []).map((h: any) => ({
    id: h.id,
    organizationId: h.organization_id,
    name: h.name,
    address: h.address,
    timezone: h.timezone,
    logoUrl: h.logo_url,
    status: h.status,
    deletedAt: h.deleted_at,
    createdAt: h.created_at,
    updatedAt: h.updated_at,
    // Add virtual fields for the Card
    totalRooms: h.rooms?.[0]?.count || 0,
    activeStaff: h.users?.[0]?.count || 0
  }))

  return (
    <>
      <main className="admin-container pt-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="page-title">Properties overview</h1>
            <p className="page-subtitle">Manage all hotels, resorts, and properties within your organization.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search properties..." 
                className="input pl-9 w-[250px]"
              />
            </div>
            <button className="btn-secondary">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <Link href="/hotels/new" className="btn-primary">
              <Plus className="w-4 h-4" />
              New Property
            </Link>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card py-4">
             <p className="text-sm font-semibold text-text-secondary mb-1">Total Properties</p>
             <p className="text-3xl font-bold text-text-primary">{hotels.length}</p>
          </div>
          <div className="card py-4">
             <p className="text-sm font-semibold text-text-secondary mb-1">Active Rooms</p>
             <p className="text-3xl font-bold text-text-primary">
               {hotels.reduce((acc, h) => acc + (h.totalRooms || 0), 0)}
             </p>
          </div>
          <div className="card py-4">
             <p className="text-sm font-semibold text-text-secondary mb-1">Total Staff</p>
             <p className="text-3xl font-bold text-text-primary">
               {hotels.reduce((acc, h) => acc + (h.activeStaff || 0), 0)}
             </p>
          </div>
          <div className="card py-4 bg-accent/5 border-accent/20">
             <p className="text-sm font-semibold text-accent mb-1">Organization Status</p>
             <p className="text-lg font-bold text-text-primary flex items-center gap-2 mt-2">
                <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
                Operational
             </p>
          </div>
        </div>

        {/* Property Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
          {hotels.map(hotel => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </main>
    </>
  )
}

