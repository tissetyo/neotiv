import { createClient } from '@neotiv/supabase-config'
import DashboardClient from '@/components/DashboardClient'
import type { DashboardData, GuestSession, Hotel, Room, Notification, ChatMessage, Alarm, Deal, HotelService } from '@neotiv/types'
import { notFound } from 'next/navigation'

// Helper to map Supabase snake_case to our frontend camelCase types
const mapHotel = (d: any): Hotel => ({
  id: d.id,
  organizationId: d.organization_id,
  name: d.name,
  address: d.address,
  timezone: d.timezone,
  logoUrl: d.logo_url,
  status: d.status,
  deletedAt: d.deleted_at,
  createdAt: d.created_at,
  updatedAt: d.updated_at
})

const mapRoom = (d: any): Room => ({
  id: d.id,
  hotelId: d.hotel_id,
  roomTypeId: d.room_type_id,
  number: d.number,
  floor: d.floor,
  status: d.status,
  deletedAt: d.deleted_at,
  createdAt: d.created_at,
  updatedAt: d.updated_at,
  roomType: d.room_type ? {
    id: d.room_type.id,
    hotelId: d.room_type.hotel_id,
    name: d.room_type.name,
    description: d.room_type.description,
    basePrice: d.room_type.base_price,
    capacity: d.room_type.capacity,
    createdAt: d.room_type.created_at,
    updatedAt: d.room_type.updated_at
  } : undefined
})

const mapSession = (d: any): GuestSession => ({
  id: d.id,
  roomId: d.room_id,
  sessionToken: d.session_token,
  guestName: d.guest_name,
  checkIn: d.check_in,
  checkOut: d.check_out,
  isActive: d.is_active,
  guestPhotoUrl: null, // Note: not in db schema currently
  backgroundUrl: d.tv_background_url,
  defaultBackground: null,
  createdAt: d.created_at,
  updatedAt: d.created_at // fallback
})

export default async function RoomDashboard({ params }: { params: { hotelId: string, roomNumber: string } }) {
  const supabase = createClient()
  
  // 1. Fetch hotel data
  const { data: rawHotel } = await supabase.from('hotels').select('*').eq('id', params.hotelId).single()
  
  // 2. Fetch room data
  const { data: rawRoom } = await supabase.from('rooms').select('*, room_type:room_types(*)').eq('hotel_id', params.hotelId).eq('number', params.roomNumber).single()
  
  if (!rawHotel || !rawRoom) {
    return notFound()
  }

  const hotel = mapHotel(rawHotel)
  const room = mapRoom(rawRoom)

  // 3. Fetch active session
  const { data: rawSession } = await supabase.from('guest_sessions')
    .select('*')
    .eq('room_id', room.id)
    .eq('is_active', true)
    .single()

  if (!rawSession) {
    // Return an empty state TV screen
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-900 text-white flex-col gap-6">
        <h1 className="text-4xl font-bold">Welcome to {hotel.name}</h1>
        <p className="text-xl opacity-80">Room {room.number}</p>
        <div className="p-8 border border-white/20 bg-white/5 backdrop-blur-md rounded-2xl max-w-lg text-center mt-8">
          <p className="mt-2 text-xl italic font-light">Please check in at the Front Office to activate your room.</p>
        </div>
      </div>
    )
  }

  const session = mapSession(rawSession)

  // 4. Fetch additional data
  const [
    { data: rawNotifications },
    { data: rawChat },
    { data: rawAlarms },
    { data: rawDeals },
    { data: rawServices }
  ] = await Promise.all([
    supabase.from('notifications').select('*').or(`session_id.eq.${session.id},and(hotel_id.eq.${hotel.id},session_id.is.null)`).order('created_at', { ascending: false }),
    supabase.from('chat_messages').select('*').eq('session_id', session.id).order('created_at', { ascending: true }),
    supabase.from('alarms').select('*').eq('session_id', session.id).eq('is_active', true),
    supabase.from('deals').select('*').eq('hotel_id', hotel.id), // removing date filter for mvp testing ease
    supabase.from('hotel_services').select('*').eq('hotel_id', hotel.id).eq('is_available', true)
  ])

  // Simple mapping for the arrays
  const notifications: Notification[] = (rawNotifications || []).map((n: any) => ({
    id: n.id, sessionId: n.session_id, title: n.title, body: n.body, readAt: n.read_at, createdAt: n.created_at
  }))
  const chatMessages: ChatMessage[] = (rawChat || []).map((c: any) => ({
    id: c.id, sessionId: c.session_id, senderRole: c.sender_role, content: c.content, readAt: c.read_at, createdAt: c.created_at
  }))
  const alarms: Alarm[] = (rawAlarms || []).map((a: any) => ({
    id: a.id, sessionId: a.session_id, scheduledAt: a.scheduled_at, note: a.note, isActive: a.is_active, acknowledged: a.acknowledged, createdAt: a.created_at, updatedAt: a.created_at
  }))
  const deals: Deal[] = (rawDeals || []).map((d: any) => ({
    id: d.id, hotelId: d.hotel_id, title: d.title, description: d.description, posterUrl: d.poster_url, validUntil: d.valid_until, createdAt: d.created_at, updatedAt: d.created_at
  }))
  const services: HotelService[] = (rawServices || []).map((s: any) => ({
    id: s.id, hotelId: s.hotel_id, category: s.category as any, name: s.name, description: s.description, iconUrl: s.icon_url, createdAt: s.created_at, updatedAt: s.created_at
  }))

  const dashboardData: DashboardData = {
    session,
    hotel,
    room,
    notifications,
    chatMessages,
    alarms,
    deals,
    services,
    wifiSSID: `${hotel.name.split(' ')[0]}_Guest`,
    wifiPassword: 'Welcome2026!'
  }

  return <DashboardClient data={dashboardData} />
}
