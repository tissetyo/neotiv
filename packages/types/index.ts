// Shared TypeScript types for Neotiv platform
// All entity types from ERD

// ─── Enums ───────────────────────────────────────────

export type RoomStatus = 'available' | 'occupied' | 'maintenance'

export type UserRole = 'super_admin' | 'hotel_manager' | 'front_office'

export type SenderRole = 'guest' | 'front_office'

export type ServiceCategory = 'food' | 'transport' | 'spa' | 'laundry' | 'other'

// ─── Base ────────────────────────────────────────────

export type BaseEntity = {
  id: string
  createdAt: string
  updatedAt: string
}

// ─── Organizations & Hotels ─────────────────────────

export type Organization = BaseEntity & {
  name: string
  slug: string
}

export type Hotel = BaseEntity & {
  organizationId: string
  name: string
  address: string | null
  timezone: string
  logoUrl: string | null
  deletedAt: string | null
}

// ─── Room Types & Rooms ─────────────────────────────

export type RoomType = BaseEntity & {
  hotelId: string
  name: string
  description: string | null
  basePrice: number
  capacity: number
}

export type Room = BaseEntity & {
  hotelId: string
  roomTypeId: string
  number: string
  floor: number
  status: RoomStatus
  deletedAt: string | null
  roomType?: RoomType
}

// ─── Users ──────────────────────────────────────────

export type User = BaseEntity & {
  email: string
  role: UserRole
  hotelId: string | null
  firstName: string
  lastName: string
}

// ─── Guest Sessions ─────────────────────────────────

export type GuestSession = BaseEntity & {
  roomId: string
  guestName: string
  guestPhotoUrl: string | null
  backgroundUrl: string | null
  defaultBackground: string | null
  checkIn: string
  checkOut: string | null
  sessionToken: string
  isActive: boolean
  room?: Room
}

// ─── Chat & Notifications ───────────────────────────

export type ChatMessage = {
  id: string
  sessionId: string
  senderRole: SenderRole
  content: string
  readAt: string | null
  createdAt: string
}

export type Notification = {
  id: string
  sessionId: string
  title: string
  body: string
  readAt: string | null
  createdAt: string
}

// ─── Alarms ─────────────────────────────────────────

export type Alarm = BaseEntity & {
  sessionId: string
  scheduledAt: string
  note: string | null
  acknowledged: boolean
}

// ─── Deals & Services ───────────────────────────────

export type Deal = BaseEntity & {
  hotelId: string
  title: string
  description: string
  posterUrl: string
  validUntil: string | null
}

export type HotelService = BaseEntity & {
  hotelId: string
  category: ServiceCategory
  name: string
  description: string | null
  iconUrl: string | null
}

// ─── Dashboard Data (TV) ────────────────────────────

export type DashboardData = {
  session: GuestSession
  hotel: Hotel
  room: Room
  notifications: Notification[]
  chatMessages: ChatMessage[]
  alarms: Alarm[]
  deals: Deal[]
  services: HotelService[]
  wifiSSID: string
  wifiPassword: string
}

// ─── API Response Wrappers ──────────────────────────

export type ApiResponse<T> = {
  data: T
  meta?: {
    total: number
    limit: number
    offset: number
  }
}

export type ApiError = {
  error: {
    code: string
    message: string
    statusCode: number
  }
}
