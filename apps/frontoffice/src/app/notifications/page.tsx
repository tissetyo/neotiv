import { Bell, Send, Users, ChevronDown } from 'lucide-react'
import { mockRooms, mockSessions, mockNotifications } from '@/data/mock-data'
import { format } from 'date-fns'

export default function NotificationsPage() {
  const activeSessions = Object.values(mockSessions).filter(s => s.isActive)
  const allNotifications = Object.values(mockNotifications).flat().sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Notifications</h1>
        <p className="page-subtitle">Send alerts and messages to guest TVs</p>
      </header>

      <div className="page-body grid lg:grid-cols-2 gap-8 items-start">
        {/* Composer Column */}
        <div className="card">
          <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 mb-6">
            <Send className="w-5 h-5 text-primary" />
            Compose Message
          </h3>
          
          <form className="space-y-5">
            <div>
              <label className="label">Recipients</label>
              <div className="relative">
                <select className="input appearance-none cursor-pointer pr-10" defaultValue="all">
                  <option value="all">Broadcast to All Active Rooms ({activeSessions.length})</option>
                  <optgroup label="Specific Room">
                    {activeSessions.map(session => (
                       <option key={session.id} value={session.id}>
                         Room {session.room?.number} - {session.guestName}
                       </option>
                    ))}
                  </optgroup>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                   <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div>
              <label className="label flex items-center justify-between">
                Message Title
                <span className="text-xs text-text-muted font-normal">Max 50 chars</span>
              </label>
              <input 
                type="text" 
                className="input" 
                placeholder="e.g. Breakfast is Served" 
                maxLength={50}
                required 
              />
            </div>

            <div>
              <label className="label flex items-center justify-between">
                Message Body
                <span className="text-xs text-text-muted font-normal">Max 200 chars</span>
              </label>
              <textarea 
                className="input min-h-[120px] resize-none" 
                placeholder="Type the notification details here..."
                maxLength={200}
                required
              />
            </div>

            <div className="pt-4 border-t border-border-light flex justify-end">
              <button type="submit" className="btn-primary shadow-lg shadow-primary/20 w-full sm:w-auto">
                <Bell className="w-4 h-4" />
                Send Notification
              </button>
            </div>
          </form>
        </div>

        {/* History Column */}
        <div className="card h-[600px] flex flex-col p-0">
          <div className="px-6 py-5 border-b border-border-light bg-bg-body">
            <h3 className="font-bold text-text-primary flex items-center gap-2">
              <Users className="w-5 h-5 text-text-secondary" />
              Recent History
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {allNotifications.length === 0 ? (
              <div className="empty-state">
                <Bell className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500">No notifications sent recently.</p>
              </div>
            ) : (
              <div className="divide-y divide-border-light">
                {allNotifications.map((notif) => {
                  const session = Object.values(mockSessions).find(s => s.id === notif.sessionId)
                  return (
                    <div key={notif.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold font-mono">
                            {session ? `RM ${session.room?.number}` : 'ALL'}
                          </span>
                          <h4 className="font-semibold text-text-primary text-sm">{notif.title}</h4>
                        </div>
                        <span className="text-[11px] text-text-secondary font-medium shrink-0 ml-2">
                          {format(new Date(notif.createdAt), 'MMM d, HH:mm')}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
                        {notif.body}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
