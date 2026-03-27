import type { DashboardData, GuestSession, Hotel, Room, RoomType, Deal, HotelService, Notification, Alarm, ChatMessage, User } from '@neotiv/types'

// ─── Staff ──────────────────────────────────────────

export const mockStaff: User = {
  id: 'usr-001',
  email: 'frontdesk@grandsapphire.com',
  role: 'front_office',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}

// ─── Hotel & Setup ──────────────────────────────────

export const mockHotel: Hotel = {
  id: 'hotel-001',
  organizationId: 'org-001',
  name: 'Grand Sapphire Resort',
  address: 'Jl. Pantai Kuta No. 88, Bali, Indonesia',
  timezone: 'Asia/Makassar',
  logoUrl: null,
  deletedAt: null,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}

const mockRoomTypes: Record<string, RoomType> = {
  standard: {
    id: 'rt-std',
    hotelId: 'hotel-001',
    name: 'Standard Room',
    description: 'Comfortable room with city view',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  deluxe: {
    id: 'rt-dlx',
    hotelId: 'hotel-001',
    name: 'Deluxe Ocean View',
    description: 'Spacious room with balcony facing the ocean',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  suite: {
    id: 'rt-ste',
    hotelId: 'hotel-001',
    name: 'Presidential Suite',
    description: 'Luxury suite with private pool and butler',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
}

// ─── Rooms & Sessions ───────────────────────────────

export const mockRooms: Room[] = [
  // Floor 1 - Standard
  { id: 'rm-101', hotelId: 'hotel-001', roomTypeId: 'rt-std', number: '101', floor: 1, status: 'available', deletedAt: null, roomType: mockRoomTypes.standard, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'rm-102', hotelId: 'hotel-001', roomTypeId: 'rt-std', number: '102', floor: 1, status: 'occupied', deletedAt: null, roomType: mockRoomTypes.standard, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'rm-103', hotelId: 'hotel-001', roomTypeId: 'rt-std', number: '103', floor: 1, status: 'maintenance', deletedAt: null, roomType: mockRoomTypes.standard, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'rm-104', hotelId: 'hotel-001', roomTypeId: 'rt-std', number: '104', floor: 1, status: 'available', deletedAt: null, roomType: mockRoomTypes.standard, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  
  // Floor 2 - Deluxe
  { id: 'rm-201', hotelId: 'hotel-001', roomTypeId: 'rt-dlx', number: '201', floor: 2, status: 'occupied', deletedAt: null, roomType: mockRoomTypes.deluxe, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'rm-202', hotelId: 'hotel-001', roomTypeId: 'rt-dlx', number: '202', floor: 2, status: 'available', deletedAt: null, roomType: mockRoomTypes.deluxe, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'rm-203', hotelId: 'hotel-001', roomTypeId: 'rt-dlx', number: '203', floor: 2, status: 'occupied', deletedAt: null, roomType: mockRoomTypes.deluxe, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'rm-204', hotelId: 'hotel-001', roomTypeId: 'rt-dlx', number: '204', floor: 2, status: 'available', deletedAt: null, roomType: mockRoomTypes.deluxe, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  
  // Floor 3 - Suites
  { id: 'rm-301', hotelId: 'hotel-001', roomTypeId: 'rt-ste', number: '301', floor: 3, status: 'occupied', deletedAt: null, roomType: mockRoomTypes.suite, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'rm-302', hotelId: 'hotel-001', roomTypeId: 'rt-ste', number: '302', floor: 3, status: 'available', deletedAt: null, roomType: mockRoomTypes.suite, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
]

export const mockSessions: Record<string, GuestSession> = {
  'rm-102': {
    id: 'sess-102', roomId: 'rm-102', guestName: 'Sarah Jenkins', guestPhotoUrl: null, backgroundUrl: null, defaultBackground: null,
    checkIn: '2026-03-26T14:30:00Z', checkOut: '2026-03-29T11:00:00Z', sessionToken: 'tok_1', isActive: true, room: mockRooms[1], createdAt: '', updatedAt: ''
  },
  'rm-201': {
    id: 'sess-201', roomId: 'rm-201', guestName: 'Alexander Mitchell', guestPhotoUrl: null, backgroundUrl: null, defaultBackground: null,
    checkIn: '2026-03-25T15:15:00Z', checkOut: '2026-03-30T12:00:00Z', sessionToken: 'tok_2', isActive: true, room: mockRooms[4], createdAt: '', updatedAt: ''
  },
  'rm-203': {
    id: 'sess-203', roomId: 'rm-203', guestName: 'The Patel Family', guestPhotoUrl: null, backgroundUrl: null, defaultBackground: null,
    checkIn: '2026-03-27T10:00:00Z', checkOut: '2026-04-02T10:00:00Z', sessionToken: 'tok_3', isActive: true, room: mockRooms[6], createdAt: '', updatedAt: ''
  },
  'rm-301': {
    id: 'sess-301', roomId: 'rm-301', guestName: 'VIP - Emma Watson', guestPhotoUrl: null, backgroundUrl: null, defaultBackground: null,
    checkIn: '2026-03-24T18:45:00Z', checkOut: '2026-03-28T12:00:00Z', sessionToken: 'tok_4', isActive: true, room: mockRooms[8], createdAt: '', updatedAt: ''
  },
}

// ─── Interaction Data ───────────────────────────────

export const mockAlarms: Record<string, Alarm[]> = {
  'sess-201': [
    { id: 'al-1', sessionId: 'sess-201', scheduledAt: '2026-03-28T06:30:00Z', note: 'Airport transfer', acknowledged: false, createdAt: '2026-03-27T20:00:00Z', updatedAt: '2026-03-27T20:00:00Z' }
  ],
  'sess-301': [
    { id: 'al-2', sessionId: 'sess-301', scheduledAt: '2026-03-28T08:00:00Z', note: 'Breakfast in bed', acknowledged: true, createdAt: '2026-03-26T11:00:00Z', updatedAt: '2026-03-26T11:05:00Z' }
  ]
}

export const mockChatMessages: Record<string, ChatMessage[]> = {
  'sess-201': [
    { id: 'msg-1', sessionId: 'sess-201', senderRole: 'guest', content: 'Hi, can I get extra towels?', readAt: '2026-03-27T09:05:00Z', createdAt: '2026-03-27T09:00:00Z' },
    { id: 'msg-2', sessionId: 'sess-201', senderRole: 'front_office', content: 'Of course! Housekeeping is on the way.', readAt: '2026-03-27T09:06:00Z', createdAt: '2026-03-27T09:05:00Z' },
  ],
  'sess-102': [
    { id: 'msg-3', sessionId: 'sess-102', senderRole: 'guest', content: 'What time does the pool close?', readAt: null, createdAt: new Date().toISOString() },
  ]
}

export const mockNotifications: Record<string, Notification[]> = {
  'sess-201': [
    { id: 'not-1', sessionId: 'sess-201', title: 'Welcome Gift', body: 'Please enjoy the complimentary fruit basket.', readAt: '2026-03-25T16:00:00Z', createdAt: '2026-03-25T15:30:00Z' }
  ]
}

// ─── Content ────────────────────────────────────────

export const mockDeals: Deal[] = [
  {
    id: 'deal-001', hotelId: 'hotel-001', title: 'Sunset Dinner Special', description: 'Enjoy a romantic 5-course dinner at our rooftop restaurant. Includes a complimentary glass of champagne.',
    posterUrl: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=1200', validUntil: '2026-04-30', createdAt: '2026-03-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z'
  },
  {
    id: 'deal-002', hotelId: 'hotel-001', title: 'Spa & Wellness Package', description: 'Relax and rejuvenate with our premium spa package. 90-minute full body massage + aromatherapy. 30% off for guests.',
    posterUrl: 'https://images.unsplash.com/photo-1540555700888-91228bfbc7dc?auto=format&fit=crop&q=80&w=1200', validUntil: '2026-05-15', createdAt: '2026-03-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z'
  },
]
