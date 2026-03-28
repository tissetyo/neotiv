import { mockRooms, mockSessions, mockChatMessages, mockAlarms, mockNotifications } from '@/data/mock-data'
import { ChatPanel } from '@/components/ChatPanel'
import { AlarmQueue } from '@/components/AlarmQueue'
import { ChevronLeft, LogOut, User, BedDouble, Calendar, Clock, Bell } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default function RoomDetailPage({ params }: { params: { roomId: string } }) {
  const room = mockRooms.find(r => r.id === params.roomId)
  const session = mockSessions[params.roomId]

  if (!room) return <div className="p-8">Room not found</div>

  const messages = session ? mockChatMessages[session.id] || [] : []
  const alarms = session ? mockAlarms[session.id] || [] : []
  const notifications = session ? mockNotifications[session.id] || [] : []

  return (
    <>
      <header className="page-header flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="w-10 h-10 rounded-lg border border-border-light flex items-center justify-center text-text-secondary hover:bg-gray-50 hover:text-primary transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="page-title">Room {room.number}</h1>
              {room.status === 'occupied' && <span className="badge-occupied">Occupied</span>}
              {room.status === 'available' && <span className="badge-available">Available</span>}
              {room.status === 'maintenance' && <span className="badge-maintenance">Maintenance</span>}
            </div>
            <p className="page-subtitle">{room.roomType?.name} • Floor {room.floor}</p>
          </div>
        </div>

        {session && (
          <button className="btn-secondary text-notification-red hover:text-notification-red hover:bg-red-50 hover:border-red-200">
            <LogOut className="w-4 h-4" />
            Check Out Guest
          </button>
        )}
      </header>

      <div className="page-body">
        {session ? (
          <div className="grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_450px] gap-8">
            {/* Left Column Controls */}
            <div className="space-y-6">
              {/* Guest Profile Card */}
              <div className="card">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-primary-50 text-primary border-2 border-primary-100 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold uppercase">{session.guestName.charAt(0)}</span>
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-text-primary mb-1">{session.guestName}</h2>
                    <p className="text-sm text-primary font-medium mb-4">Session Token: <code className="bg-primary-50 px-2 py-0.5 rounded">{session.sessionToken}</code></p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-text-secondary">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-text-muted">Check-in</p>
                          <p className="font-semibold text-text-primary">{format(new Date(session.checkIn), 'MMM d, yyyy')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-text-secondary">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-text-muted">Expected Check-out</p>
                          <p className="font-semibold text-text-primary">{session.checkOut ? format(new Date(session.checkOut), 'MMM d, yyyy') : 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Layout for Alarms & Notifications */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <AlarmQueue alarms={alarms} />
                </div>
                
                {/* Recent Notifications */}
                <div className="card h-[400px] flex flex-col p-0">
                  <div className="px-5 py-4 border-b border-border-light bg-bg-body flex items-center justify-between">
                     <h3 className="font-semibold text-text-primary">Sent Notifications</h3>
                     <Link href="/notifications" className="text-sm font-semibold text-primary hover:underline">
                       Send New
                     </Link>
                  </div>
                  <div className="p-5 flex-1 overflow-y-auto space-y-4">
                    {notifications.length === 0 ? (
                      <div className="text-center py-8 text-text-secondary text-sm">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        No notifications sent yet
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-4 rounded-xl border border-border-light bg-gray-50">
                           <div className="flex items-center justify-between mb-1.5">
                             <h4 className="font-semibold text-sm text-text-primary">{n.title}</h4>
                             <span className="text-[10px] text-text-secondary">{format(new Date(n.createdAt), 'MMM d, HH:mm')}</span>
                           </div>
                           <p className="text-xs text-text-secondary leading-relaxed">{n.body}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Chat */}
            <div className="h-full">
              <ChatPanel messages={messages} guestName={session.guestName} />
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon bg-gray-100 text-gray-400">
              <BedDouble className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">Room is Vacant</h2>
            <p className="text-text-secondary max-w-md mx-auto mb-6">
              This room is currently available. You can assign a new guest session from the check-in panel.
            </p>
            <Link href={`/check-in/new?room=${room.id}`} className="btn-primary">
              <User className="w-4 h-4" />
              Check In Guest
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
