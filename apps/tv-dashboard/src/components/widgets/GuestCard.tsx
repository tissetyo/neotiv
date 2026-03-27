'use client'

import { User } from 'lucide-react'
import type { GuestSession, Room } from '@neotiv/types'

type GuestCardProps = {
  session: GuestSession
  room: Room
}

export default function GuestCard({ session, room }: GuestCardProps): React.ReactElement {
  const initials = session.guestName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="glass-card">
      <span className="widget-title">Guest</span>
      <div className="flex items-center gap-4">
        {session.guestPhotoUrl ? (
          <img
            src={session.guestPhotoUrl}
            alt={session.guestName}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-primary"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center ring-2 ring-primary/50">
            <span className="text-xl font-bold text-white">{initials}</span>
          </div>
        )}
        <div>
          <h3 className="text-lg font-bold text-white leading-tight">{session.guestName}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/20 text-primary-light border border-primary/30">
              Room {room.number}
            </span>
          </div>
          {room.roomType && (
            <p className="text-xs text-white/40 mt-1">{room.roomType.name}</p>
          )}
        </div>
      </div>
    </div>
  )
}
