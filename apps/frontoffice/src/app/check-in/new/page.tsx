import { CalendarCheck, Image as ImageIcon, Upload, User } from 'lucide-react'
import { mockRooms } from '@/data/mock-data'
import Link from 'next/link'

export default function CheckInPage({ searchParams }: { searchParams: { room?: string } }) {
  const selectedRoomId = searchParams.room || mockRooms.find(r => r.status === 'available')?.id

  // 4 sample high-quality backgrounds from Unsplash for TV
  const bgOptions = [
    { id: 'bg1', url: 'https://images.unsplash.com/photo-1498092651296-641e88c3b057?w=800&q=80', label: 'Ocean Resort' },
    { id: 'bg2', url: 'https://images.unsplash.com/photo-1542314831-c6a4d14efa82?w=800&q=80', label: 'City Skyline' },
    { id: 'bg3', url: 'https://images.unsplash.com/photo-1518557984649-7b161c230cfa?w=800&q=80', label: 'Tropical Pool' },
    { id: 'bg4', url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80', label: 'Minimalist Sand' }
  ]

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Check-in Guest</h1>
        <p className="page-subtitle">Create a new session to activate the TV in the room.</p>
      </header>

      <div className="page-body max-w-3xl">
        <form className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-primary" />
              Guest Details
            </h3>
            
            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="label">Full Name</label>
                <input type="text" className="input" placeholder="e.g. John Doe" required />
              </div>
              
              <div>
                <label className="label">Assign Room</label>
                <select className="input cursor-pointer" defaultValue={selectedRoomId}>
                  <option value="" disabled>Select an available room</option>
                  {mockRooms.filter(r => r.status === 'available').map(r => (
                    <option key={r.id} value={r.id}>Room {r.number} ({r.roomType?.name})</option>
                  ))}
                  <optgroup label="Unavailable">
                    {mockRooms.filter(r => r.status !== 'available').map(r => (
                      <option key={r.id} value={r.id} disabled>Room {r.number} - {r.status}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="label">Check-in Date</label>
                <input type="date" className="input" defaultValue={new Date().toISOString().split('T')[0]} required />
              </div>
              <div>
                <label className="label">Expected Check-out</label>
                <input type="date" className="input" />
              </div>
            </div>
          </div>

          {/* Photo & Avatar (Optional) */}
          <div className="card">
            <h3 className="text-lg font-bold text-text-primary mb-1 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              TV Personalization
            </h3>
            <p className="text-sm text-text-secondary mb-5">Optional customizations for the guest's in-room display.</p>
            
            <div className="mb-6">
              <label className="label mb-2">Guest Photo (for Welcome Screen)</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                  <User className="w-6 h-6" />
                </div>
                <button type="button" className="btn-secondary">
                  <Upload className="w-4 h-4" />
                  Upload Photo
                </button>
                <span className="text-xs text-text-muted">JPG, PNG up to 2MB.</span>
              </div>
            </div>

            <div>
              <label className="label mb-3">Room Background Style</label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {bgOptions.map((bg, idx) => (
                  <label key={bg.id} className="cursor-pointer group relative">
                    <input type="radio" name="tv_bg" className="peer sr-only" defaultChecked={idx === 0} />
                    <div className="aspect-video rounded-lg overflow-hidden border-2 border-transparent peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary/20 transition-all">
                      <img src={bg.url} alt={bg.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent text-white text-xs font-medium translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 peer-checked:translate-y-0 peer-checked:opacity-100 transition-all">
                      {bg.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-light">
            <Link href="/dashboard" className="btn-secondary">Cancel</Link>
            <Link href="/dashboard" className="btn-primary shadow-lg shadow-primary/20">
              <CalendarCheck className="w-4 h-4" />
              Complete Check-in
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}
