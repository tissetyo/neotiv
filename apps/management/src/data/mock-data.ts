import { Room, RoomType, GuestSession, User } from '@neotiv/types'

const NOW = new Date().toISOString()

// Mock Hotels
export const mockHotels = [
  {
    id: 'h-grand-sapphire',
    name: 'Grand Sapphire Resort',
    address: '123 Ocean Drive, Miami, FL 33139',
    timezone: 'America/New_York',
    logoUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    totalRooms: 120,
    activeStaff: 15,
    status: 'active'
  },
  {
    id: 'h-urban-retreat',
    name: 'The Urban Retreat',
    address: '456 Tech Boulevard, Austin, TX 78701',
    timezone: 'America/Chicago',
    logoUrl: 'https://images.unsplash.com/photo-1551882547-ff40c0d5b5df?w=800&q=80',
    totalRooms: 85,
    activeStaff: 8,
    status: 'active'
  },
  {
    id: 'h-alpine-lodge',
    name: 'Alpine Vista Lodge',
    address: '789 Mountain Way, Aspen, CO 81611',
    timezone: 'America/Denver',
    logoUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    totalRooms: 40,
    activeStaff: 0,
    status: 'setup_pending'
  }
]

// Mock Room Types (Grand Sapphire)
export const mockRoomTypes: Record<string, RoomType> = {
  'rt-std': {
    id: 'rt-std',
    hotelId: 'h-grand-sapphire',
    name: 'Standard Room',
    description: 'Comfortable room with essential amenities.',
    basePrice: 150,
    capacity: 2,
    createdAt: NOW,
    updatedAt: NOW,
  },
  'rt-dlx': {
    id: 'rt-dlx',
    hotelId: 'h-grand-sapphire',
    name: 'Deluxe Ocean View',
    description: 'Spacious room featuring a balcony with panoramic ocean views.',
    basePrice: 280,
    capacity: 3,
    createdAt: NOW,
    updatedAt: NOW,
  },
  'rt-ste': {
    id: 'rt-ste',
    hotelId: 'h-grand-sapphire',
    name: 'Presidential Suite',
    description: 'Luxury suite with separate living area, premium bar, and jacuzzi.',
    basePrice: 850,
    capacity: 4,
    createdAt: NOW,
    updatedAt: NOW,
  }
}

// Mock Rooms (Grand Sapphire)
export const mockRooms: Room[] = [
  { id: 'rm-101', hotelId: 'h-grand-sapphire', number: '101', floor: 1, roomTypeId: 'rt-std', status: 'available', deletedAt: null, roomType: mockRoomTypes['rt-std'], createdAt: NOW, updatedAt: NOW },
  { id: 'rm-102', hotelId: 'h-grand-sapphire', number: '102', floor: 1, roomTypeId: 'rt-std', status: 'occupied',  deletedAt: null, roomType: mockRoomTypes['rt-std'], createdAt: NOW, updatedAt: NOW },
  { id: 'rm-103', hotelId: 'h-grand-sapphire', number: '103', floor: 1, roomTypeId: 'rt-std', status: 'maintenance', deletedAt: null, roomType: mockRoomTypes['rt-std'], createdAt: NOW, updatedAt: NOW },
  { id: 'rm-201', hotelId: 'h-grand-sapphire', number: '201', floor: 2, roomTypeId: 'rt-dlx', status: 'occupied',  deletedAt: null, roomType: mockRoomTypes['rt-dlx'], createdAt: NOW, updatedAt: NOW },
  { id: 'rm-202', hotelId: 'h-grand-sapphire', number: '202', floor: 2, roomTypeId: 'rt-dlx', status: 'available', deletedAt: null, roomType: mockRoomTypes['rt-dlx'], createdAt: NOW, updatedAt: NOW },
  { id: 'rm-301', hotelId: 'h-grand-sapphire', number: '301', floor: 3, roomTypeId: 'rt-ste', status: 'occupied',  deletedAt: null, roomType: mockRoomTypes['rt-ste'], createdAt: NOW, updatedAt: NOW },
]

// Mock Staff
export const mockStaff: User[] = [
  {
    id: 'usr-admin-1',
    email: 'admin@neotiv.com',
    role: 'super_admin',
    hotelId: null,
    firstName: 'System',
    lastName: 'Admin',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'usr-gm-1',
    email: 'gm@grandsapphire.com',
    role: 'hotel_manager',
    hotelId: 'h-grand-sapphire',
    firstName: 'Marcus',
    lastName: 'Chen',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'usr-fo-1',
    email: 'j.doe@grandsapphire.com',
    role: 'front_office',
    hotelId: 'h-grand-sapphire',
    firstName: 'Jane',
    lastName: 'Doe',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'usr-fo-2',
    email: 'm.smith@grandsapphire.com',
    role: 'front_office',
    hotelId: 'h-grand-sapphire',
    firstName: 'Michael',
    lastName: 'Smith',
    createdAt: NOW,
    updatedAt: NOW,
  }
]
