import { RoomCard } from '@/components/RoomCard'
import { mockRooms, mockSessions } from '@/data/mock-data'
import { BedDouble, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react'

export default function DashboardPage() {
  const rooms = mockRooms
  const availableCount = rooms.filter(r => r.status === 'available').length
  const occupiedCount = rooms.filter(r => r.status === 'occupied').length
  const maintenanceCount = rooms.filter(r => r.status === 'maintenance').length

  return (
    <>
      <header className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Room Overview</h1>
          <p className="page-subtitle">Real-time status of all hotel rooms</p>
        </div>
        
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            placeholder="Search room or guest..." 
            className="input w-64"
          />
          <button className="btn-secondary">Filters</button>
        </div>
      </header>

      <div className="page-body">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <div className="stat-icon bg-gray-100 text-gray-700">
              <BedDouble className="w-6 h-6" />
            </div>
            <div>
              <div className="stat-value">{rooms.length}</div>
              <div className="stat-label">Total Rooms</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-emerald-50 text-success">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="stat-value">{availableCount}</div>
              <div className="stat-label">Available</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-red-50 text-notification-red">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="stat-value">{occupiedCount}</div>
              <div className="stat-label">Occupied</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-orange-50 text-warning">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="stat-value">{maintenanceCount}</div>
              <div className="stat-label">Maintenance</div>
            </div>
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map(room => (
            <RoomCard 
              key={room.id} 
              room={room} 
              session={Object.values(mockSessions).find(s => s.roomId === room.id)} 
            />
          ))}
        </div>
      </div>
    </>
  )
}
