import { createClient } from '@/lib/supabase/server'
import { Building2, LayoutDashboard, Users, DoorOpen, Settings as SettingsIcon, ArrowLeft, Settings } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

export default async function HotelDashboardPage({ params }: { params: { hotelId: string } }) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user
  
  if (!user) {
    redirect('/login')
  }

  // Fetch hotel details with counts
  const { data: hotelData } = await supabase
    .from('hotels')
    .select('*, rooms(count), users(count)')
    .eq('id', params.hotelId)
    .single()

  if (!hotelData) return notFound()

  const hotel = {
    ...hotelData,
    totalRooms: hotelData.rooms?.[0]?.count || 0,
    activeStaff: hotelData.users?.[0]?.count || 0
  }

  return (
    <>
      {/* Property Header Banner */}
      <div className="w-full bg-primary pt-8 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {hotel.logo_url && <img src={hotel.logo_url} alt="" className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm" />
        </div>
        
        <div className="admin-container relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <Link href="/hotels" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white font-medium mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Properties
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white shadow-lg overflow-hidden shrink-0 border-2 border-white/10 p-1 flex items-center justify-center">
                 {hotel.logo_url ? (
                   <img src={hotel.logo_url} alt="" className="w-full h-full object-cover rounded-lg" />
                 ) : (
                   <Building2 className="w-8 h-8 text-primary/20" />
                 )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">{hotel.name}</h1>
                <p className="text-white/80 font-medium">{hotel.address || 'No address provided'}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${hotel.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
               {hotel.status === 'active' ? 'Operational' : 'Setup Required'}
            </span>
          </div>
        </div>
      </div>

      <main className="admin-container py-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-border-light pb-px">
          <Link href={`/hotels/${hotel.id}`} className="px-4 py-2.5 text-sm font-bold text-accent border-b-2 border-accent flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" /> Overview
          </Link>
          <Link href={`/hotels/${hotel.id}/rooms`} className="px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-gray-50 rounded-t-lg transition-colors flex items-center gap-2">
            <DoorOpen className="w-4 h-4" /> Rooms
          </Link>
          <Link href={`/hotels/${hotel.id}/services`} className="px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-gray-50 rounded-t-lg transition-colors flex items-center gap-2">
            <Settings className="w-4 h-4" /> Services
          </Link>
          <Link href={`/hotels/${hotel.id}/staff`} className="px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-gray-50 rounded-t-lg transition-colors flex items-center gap-2">
            <Users className="w-4 h-4" /> Staff Access
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column Stats */}
          <div className="lg:col-span-2 space-y-8">
             <div className="grid sm:grid-cols-2 gap-4">
               <div className="card bg-gradient-to-br from-white to-gray-50 border-border-dark py-8 px-6 flex items-center gap-6">
                 <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <DoorOpen className="w-7 h-7" />
                 </div>
                 <div>
                   <p className="text-text-secondary font-semibold text-sm mb-1 uppercase tracking-wider">Total Rooms</p>
                   <p className="text-4xl font-bold text-text-primary">{hotel.totalRooms}</p>
                 </div>
               </div>
               
               <div className="card bg-gradient-to-br from-white to-gray-50 border-border-dark py-8 px-6 flex items-center gap-6">
                 <div className="w-14 h-14 rounded-full bg-emerald-50 text-success flex items-center justify-center shrink-0">
                    <Users className="w-7 h-7" />
                 </div>
                 <div>
                   <p className="text-text-secondary font-semibold text-sm mb-1 uppercase tracking-wider">Active Staff</p>
                   <p className="text-4xl font-bold text-text-primary">{hotel.activeStaff}</p>
                 </div>
               </div>
             </div>
             
             <div className="card shadow-sm">
                <h3 className="section-title">Quick Actions</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Link href={`/hotels/${hotel.id}/rooms`} className="p-4 border border-border-light rounded-lg hover:border-accent hover:bg-accent/5 transition-colors group">
                    <Building2 className="w-6 h-6 text-text-muted group-hover:text-accent mb-3 transition-colors" />
                    <h4 className="font-bold text-text-primary text-sm mb-1">Manage Rooms</h4>
                    <p className="text-xs text-text-secondary">Add or configure physical rooms</p>
                  </Link>
                  <Link href={`/hotels/${hotel.id}/staff`} className="p-4 border border-border-light rounded-lg hover:border-accent hover:bg-accent/5 transition-colors group">
                    <Users className="w-6 h-6 text-text-muted group-hover:text-accent mb-3 transition-colors" />
                    <h4 className="font-bold text-text-primary text-sm mb-1">Invite Staff</h4>
                    <p className="text-xs text-text-secondary">Grant access to new managers</p>
                  </Link>
                  <button className="text-left p-4 border border-border-light rounded-lg hover:border-accent hover:bg-accent/5 transition-colors group">
                    <SettingsIcon className="w-6 h-6 text-text-muted group-hover:text-accent mb-3 transition-colors" />
                    <h4 className="font-bold text-text-primary text-sm mb-1">Property Settings</h4>
                    <p className="text-xs text-text-secondary">Edit address, timezone, branding</p>
                  </button>
                </div>
             </div>
          </div>
          
          {/* Right Column Info */}
          <div className="space-y-6">
            <div className="card bg-gray-50 border-transparent shadow-inner">
               <h3 className="section-title text-sm uppercase tracking-wider text-text-secondary mb-4">Property Details</h3>
               <dl className="space-y-4 text-sm">
                 <div>
                   <dt className="text-text-muted font-medium mb-1">Internal ID</dt>
                   <dd className="font-mono bg-white px-2 py-1 rounded border border-border-light text-text-primary inline-flex">{hotel.id}</dd>
                 </div>
                 <div>
                   <dt className="text-text-muted font-medium mb-1">Timezone</dt>
                   <dd className="font-semibold text-text-primary">{hotel.timezone}</dd>
                 </div>
                 <div>
                   <dt className="text-text-muted font-medium mb-1">Subscription Tier</dt>
                   <dd className="inline-flex px-2 py-0.5 rounded-full bg-accent/10 text-accent font-bold text-xs uppercase tracking-wide">Enterprise</dd>
                 </div>
               </dl>
            </div>
            
            <div className="card shadow-sm border-danger/20">
              <h3 className="text-sm font-bold text-danger mb-2">Danger Zone</h3>
              <p className="text-xs text-text-secondary mb-4 leading-relaxed">Permanently delete this property and all associated data, rooms, and sessions from the platform.</p>
              <button className="btn-danger w-full text-sm">Delete Property...</button>
            </div>
          </div>
          
        </div>
      </main>
    </>
  )
}

