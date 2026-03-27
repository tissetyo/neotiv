import { Room, GuestSession } from '@neotiv/types'
import { User, ShieldAlert, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface RoomCardProps {
  room: Room
  session?: GuestSession
}

export function RoomCard({ room, session }: RoomCardProps) {
  const isAvailable = room.status === 'available'
  const isOccupied = room.status === 'occupied'
  const isMaintenance = room.status === 'maintenance'

  return (
    <Link href={`/dashboard/rooms/${room.id}`} className="block h-full">
      <div className="card-hover h-full flex flex-col items-start p-5 min-h-[140px]">
        <div className="w-full flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-text-primary">
              {room.number}
            </span>
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md font-medium">
              Fl {room.floor}
            </span>
          </div>

          {isAvailable && (
            <div className="badge-available">
              <Sparkles className="w-3.5 h-3.5" />
              Available
            </div>
          )}
          {isOccupied && (
            <div className="badge-occupied">
              <User className="w-3.5 h-3.5" />
              Occupied
            </div>
          )}
          {isMaintenance && (
            <div className="badge-maintenance">
              <ShieldAlert className="w-3.5 h-3.5" />
              Maintenance
            </div>
          )}
        </div>

        <div className="text-sm font-medium text-text-secondary mb-3">
          {room.roomType?.name}
        </div>

        <div className="mt-auto pt-4 border-t border-border-light w-full">
          {isOccupied && session ? (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-6 h-6 rounded-full bg-primary-50 text-primary flex items-center justify-center font-bold text-xs uppercase">
                {session.guestName.charAt(0)}
              </div>
              <span className="font-medium text-text-primary truncate">
                {session.guestName}
              </span>
            </div>
          ) : isAvailable ? (
            <span className="text-sm text-text-muted">Ready for check-in</span>
          ) : (
            <span className="text-sm text-warning font-medium">Out of order</span>
          )}
        </div>
      </div>
    </Link>
  )
}
