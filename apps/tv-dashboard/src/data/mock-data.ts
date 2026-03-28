import type { DashboardData, GuestSession, Hotel, Room, RoomType, Deal, HotelService, Notification, Alarm, ChatMessage } from '@neotiv/types'

// ─── Mock Hotel ─────────────────────────────────────

const mockHotel: Hotel = {
  id: 'hotel-001',
  organizationId: 'org-001',
  name: 'Grand Sapphire Resort',
  address: 'Jl. Pantai Kuta No. 88, Bali, Indonesia',
  timezone: 'Asia/Makassar',
  logoUrl: null,
  status: 'active',
  deletedAt: null,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}

const mockRoomType: RoomType = {
  id: 'rt-001',
  hotelId: 'hotel-001',
  name: 'Ocean Suite',
  description: 'Luxury ocean-view suite with private balcony',
  basePrice: 500,
  capacity: 4,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}

const mockRoom: Room = {
  id: 'room-001',
  hotelId: 'hotel-001',
  roomTypeId: 'rt-001',
  number: '417',
  floor: 4,
  status: 'occupied',
  deletedAt: null,
  roomType: mockRoomType,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}

// ─── Mock Guest Session ─────────────────────────────

const mockSession: GuestSession = {
  id: 'session-001',
  roomId: 'room-001',
  guestName: 'Alexander Mitchell',
  guestPhotoUrl: null,
  backgroundUrl: null,
  defaultBackground: null,
  checkIn: '2026-03-25T14:00:00Z',
  checkOut: '2026-03-28T12:00:00Z',
  sessionToken: 'tok_abc123xyz',
  isActive: true,
  room: mockRoom,
  createdAt: '2026-03-25T14:00:00Z',
  updatedAt: '2026-03-25T14:00:00Z',
}

// ─── Mock Notifications ─────────────────────────────

const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    sessionId: 'session-001',
    title: 'Breakfast is Ready',
    body: 'Complimentary breakfast is served at the Coral Restaurant, Level 2. Open until 10:30 AM.',
    readAt: null,
    createdAt: '2026-03-27T06:30:00Z',
  },
  {
    id: 'notif-002',
    sessionId: 'session-001',
    title: 'Pool Maintenance Notice',
    body: 'The infinity pool will be closed for maintenance from 2:00 PM to 4:00 PM today.',
    readAt: '2026-03-27T08:00:00Z',
    createdAt: '2026-03-27T05:00:00Z',
  },
  {
    id: 'notif-003',
    sessionId: 'session-001',
    title: 'Welcome Gift',
    body: 'Your welcome amenity has been placed in your room. Enjoy the local delicacies!',
    readAt: '2026-03-25T15:00:00Z',
    createdAt: '2026-03-25T14:30:00Z',
  },
]

// ─── Mock Chat ──────────────────────────────────────

const mockChatMessages: ChatMessage[] = [
  {
    id: 'chat-001',
    sessionId: 'session-001',
    senderRole: 'guest',
    content: 'Hi, can I get extra towels please?',
    readAt: '2026-03-27T09:05:00Z',
    createdAt: '2026-03-27T09:00:00Z',
  },
  {
    id: 'chat-002',
    sessionId: 'session-001',
    senderRole: 'front_office',
    content: 'Of course, Mr. Mitchell! We\'ll send them right away. Is there anything else you need?',
    readAt: '2026-03-27T09:06:00Z',
    createdAt: '2026-03-27T09:05:00Z',
  },
  {
    id: 'chat-003',
    sessionId: 'session-001',
    senderRole: 'guest',
    content: 'That\'s all, thank you!',
    readAt: null,
    createdAt: '2026-03-27T09:06:30Z',
  },
]

// ─── Mock Alarms ────────────────────────────────────

const mockAlarms: Alarm[] = [
  {
    id: 'alarm-001',
    sessionId: 'session-001',
    scheduledAt: '2026-03-28T06:30:00Z',
    note: 'Wake up call for airport transfer',
    acknowledged: false,
    createdAt: '2026-03-27T21:00:00Z',
    updatedAt: '2026-03-27T21:00:00Z',
  },
]

// ─── Mock Deals ─────────────────────────────────────

const mockDeals: Deal[] = [
  {
    id: 'deal-001',
    hotelId: 'hotel-001',
    title: 'Sunset Dinner Special',
    description: 'Enjoy a romantic 5-course dinner at our rooftop restaurant with a breathtaking ocean sunset view. Includes a complimentary glass of champagne.',
    posterUrl: '/deals/sunset-dinner.jpg',
    validUntil: '2026-04-30',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'deal-002',
    hotelId: 'hotel-001',
    title: 'Spa & Wellness Package',
    description: 'Relax and rejuvenate with our premium spa package. 90-minute full body massage + aromatherapy session. 30% off for hotel guests.',
    posterUrl: '/deals/spa-package.jpg',
    validUntil: '2026-05-15',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'deal-003',
    hotelId: 'hotel-001',
    title: 'Island Hopping Tour',
    description: 'Discover hidden beaches and crystal clear waters. Full day island hopping tour with snorkeling gear included. Lunch on a private beach.',
    posterUrl: '/deals/island-tour.jpg',
    validUntil: '2026-06-30',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
]

// ─── Mock Services ──────────────────────────────────

const mockServices: HotelService[] = [
  {
    id: 'svc-001',
    hotelId: 'hotel-001',
    category: 'food',
    name: 'Room Service',
    description: 'Order from our full menu, delivered to your room 24/7',
    iconUrl: null,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'svc-002',
    hotelId: 'hotel-001',
    category: 'spa',
    name: 'Spa & Massage',
    description: 'Book in-room or visit our wellness center',
    iconUrl: null,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'svc-003',
    hotelId: 'hotel-001',
    category: 'transport',
    name: 'Airport Transfer',
    description: 'Private car service to/from the airport',
    iconUrl: null,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'svc-004',
    hotelId: 'hotel-001',
    category: 'laundry',
    name: 'Laundry & Dry Clean',
    description: 'Express laundry service, 4-hour turnaround',
    iconUrl: null,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'svc-005',
    hotelId: 'hotel-001',
    category: 'food',
    name: 'Restaurant Reservation',
    description: 'Reserve a table at any of our 3 restaurants',
    iconUrl: null,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'svc-006',
    hotelId: 'hotel-001',
    category: 'other',
    name: 'Concierge',
    description: 'Tour bookings, tickets, and local recommendations',
    iconUrl: null,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
]

// ─── Full Dashboard Data ────────────────────────────

export const mockDashboardData: DashboardData = {
  session: mockSession,
  hotel: mockHotel,
  room: mockRoom,
  notifications: mockNotifications,
  chatMessages: mockChatMessages,
  alarms: mockAlarms,
  deals: mockDeals,
  services: mockServices,
  wifiSSID: 'GrandSapphire_Guest',
  wifiPassword: 'Welcome2026!',
}

export const TIMEZONE_CONFIG = [
  { key: 'newYork', label: 'New York', timezone: 'America/New_York' },
  { key: 'paris', label: 'Paris', timezone: 'Europe/Paris' },
  { key: 'tokyo', label: 'Tokyo', timezone: 'Asia/Tokyo' },
] as const
