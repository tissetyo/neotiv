import { RoomCard } from '@/components/RoomCard'
import { BedDouble, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Room, GuestSession, RoomType } from '@neotiv/types'

export default async function DashboardPage() {
  const supabase = createClient()
  
  // 1. Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 2. Get user profile for hotel_id
  const { data: profile } = await supabase
    .from('users')
    .select('hotel_id')
    .eq('auth_id', user.id)
    .single()

  if (!profile?.hotel_id) {
    // If no hotel assigned, might be a super admin or error
    return <div className="p-8 text-center bg-white rounded-2xl border border-gray-100">No hotel assigned to your account.</div>
  }

  // 3. Fetch rooms with room types and active sessions
  const [{ data: rawRooms }, { data: rawSessions }] = await Promise.all([
    supabase
      .from('rooms')
      .select('*, room_types(*)')
      .eq('hotel_id', profile.hotel_id)
      .order('number'),
    supabase
      .from('guest_sessions')
      .select('*')
      .eq('is_active', true)
  ])

  // Map to our camelCase types
  const rooms: Room[] = (rawRooms || []).map((r: any) => ({
    id: r.id,
    hotelId: r.hotel_id,
    roomTypeId: r.room_type_id,
    number: r.number,
    floor: r.floor,
    status: r.status,
    deletedAt: r.deleted_at,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    roomType: r.room_types ? {
      id: r.room_types.id,
      hotelId: r.room_types.hotel_id,
      name: r.room_types.name,
      description: r.room_types.description,
      basePrice: r.room_types.base_price,
      capacity: r.room_types.capacity,
      deletedAt: r.room_types.deleted_at || null,
      createdAt: r.room_types.created_at,
      updatedAt: r.room_types.updated_at
    } : undefined
  }))

  const sessions: Record<string, GuestSession> = (rawSessions || []).reduce((acc: any, s: any) => {
    acc[s.id] = {
      id: s.id,
      roomId: s.room_id,
      sessionToken: s.session_token,
      guestName: s.guest_name,
      checkIn: s.check_in,
      checkOut: s.check_out,
      isActive: s.is_active,
      backgroundUrl: s.tv_background_url,
      guestPhotoUrl: null,
      defaultBackground: null,
      createdAt: s.created_at,
      updatedAt: s.created_at
    }
    return acc
  }, {})

  const availableCount = rooms.filter(r => r.status === 'available').length
  const occupiedCount = rooms.filter(r => r.status === 'occupied').length
  const maintenanceCount = rooms.filter(r => r.status === 'maintenance').length

  return (
    <>
      <header className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Room Overview</h1>
          <p className="page-subtitle">Real-time status of all hotel rooms</p>
        </div>
        
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            placeholder="Search room or guest..." 
            className="input w-64"
          />
          <button className="btn-secondary">Filters</button>
        </div>
      </header>

      <div className="page-body">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <div className="stat-icon bg-gray-100 text-gray-700">
              <BedDouble className="w-6 h-6" />
            </div>
            <div>
              <div className="stat-value">{rooms.length}</div>
              <div className="stat-label">Total Rooms</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-emerald-50 text-success">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="stat-value">{availableCount}</div>
              <div className="stat-label">Available</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-red-50 text-notification-red">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="stat-value">{occupiedCount}</div>
              <div className="stat-label">Occupied</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-orange-50 text-warning">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="stat-value">{maintenanceCount}</div>
              <div className="stat-label">Maintenance</div>
            </div>
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map(room => (
            <RoomCard 
              key={room.id} 
              room={room} 
              session={Object.values(sessions).find(s => s.roomId === room.id)} 
            />
          ))}
        </div>
      </div>
    </>
  )
}

