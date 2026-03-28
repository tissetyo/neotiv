import { createClient } from '@/lib/supabase/server'
import { Building2, LayoutDashboard, Users, DoorOpen, Settings as SettingsIcon, Plus, MoreVertical, Edit2, Trash2, Settings } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

export default async function RoomManagementPage({ params }: { params: { hotelId: string } }) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user
  
  if (!user) {
    redirect('/login')
  }

  // Fetch hotel details
  const { data: hotel } = await supabase
    .from('hotels')
    .select('*')
    .eq('id', params.hotelId)
    .single()

  if (!hotel) return notFound()

  // Fetch data for this hotel
  const [{ data: roomTypes }, { data: rooms }] = await Promise.all([
    supabase
      .from('room_types')
      .select('*')
      .eq('hotel_id', params.hotelId)
      .order('name'),
    supabase
      .from('rooms')
      .select('*, room_types(name)')
      .eq('hotel_id', params.hotelId)
      .order('number')
  ])

  return (
    <>
      {/* Mini Header */}
      <div className="bg-white border-b border-border-light pt-4 pb-4">
        <div className="admin-container">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
               {hotel.logo_url ? (
                 <img src={hotel.logo_url} alt="" className="w-full h-full object-cover" />
               ) : (
                 <Building2 className="w-4 h-4 text-text-muted" />
               )}
            </div>
            <h1 className="text-xl font-bold text-text-primary">{hotel.name}</h1>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1">
            <Link href={`/hotels/${hotel.id}`} className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" /> Overview
            </Link>
            <Link href={`/hotels/${hotel.id}/rooms`} className="px-4 py-2 text-sm font-bold bg-accent/10 text-accent rounded-lg flex items-center gap-2">
              <DoorOpen className="w-4 h-4" /> Rooms
            </Link>
            <Link href={`/hotels/${hotel.id}/services`} className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
              <Settings className="w-4 h-4" /> Services
            </Link>
            <Link href={`/hotels/${hotel.id}/staff`} className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
              <Users className="w-4 h-4" /> Staff Access
            </Link>
          </div>
        </div>
      </div>

      <main className="admin-container py-8 flex flex-col gap-8">
        
        {/* Room Types Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title mb-0">Room Categories (Types)</h2>
            <button className="btn-secondary text-sm"><Plus className="w-4 h-4" /> Add Category</button>
          </div>
          
          <div className="card p-0 overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Base Price</th>
                  <th>Capacity</th>
                  <th className="w-16"></th>
                </tr>
              </thead>
              <tbody>
                {roomTypes?.map(rt => (
                  <tr key={rt.id}>
                    <td>
                      <div className="font-semibold">{rt.name}</div>
                      <div className="text-xs text-text-secondary mt-0.5">{rt.description}</div>
                    </td>
                    <td className="font-mono">${rt.base_price}/nt</td>
                    <td>{rt.capacity} Guests</td>
                    <td>
                      <button className="p-1.5 text-text-muted hover:text-text-primary rounded-md hover:bg-gray-100 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {(!roomTypes || roomTypes.length === 0) && (
                  <tr><td colSpan={4} className="text-center py-12 text-text-muted">No room types configured.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Individual Rooms Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title mb-0">Physical Rooms (Inventory)</h2>
            <button className="btn-primary text-sm shadow-sm shadow-accent/20"><Plus className="w-4 h-4" /> Add Rooms in Bulk</button>
          </div>
          
          <div className="card p-0 overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Room Number</th>
                  <th>Floor</th>
                  <th>Category</th>
                  <th className="w-16"></th>
                </tr>
              </thead>
              <tbody>
                {rooms?.map((room: any) => (
                  <tr key={room.id}>
                    <td className="font-bold text-accent">{room.number}</td>
                    <td>Floor {room.floor}</td>
                    <td>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {room.room_types?.name}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <button className="p-1.5 text-text-muted hover:text-accent rounded-md hover:bg-accent/10 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-text-muted hover:text-danger rounded-md hover:bg-danger/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!rooms || rooms.length === 0) && (
                  <tr><td colSpan={4} className="text-center py-12 text-text-muted">No rooms configured.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </>
  )
}

