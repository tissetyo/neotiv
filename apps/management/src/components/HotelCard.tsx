import Link from 'next/link'
import { Building2, Users, ArrowRight, Settings, MapPin } from 'lucide-react'

interface HotelCardProps {
  id: string
  name: string
  address: string
  logoUrl: string
  totalRooms: number
  activeStaff: number
  status: string
}

export function HotelCard({ hotel }: { hotel: HotelCardProps }) {
  const isActive = hotel.status === 'active'

  return (
    <div className="card p-0 overflow-hidden flex flex-col hover:border-accent/40 transition-colors group h-full">
      <div className="h-32 w-full relative">
        <img 
          src={hotel.logoUrl} 
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-accent-light transition-colors">{hotel.name}</h3>
          <p className="text-sm text-gray-300 flex items-center gap-1.5 line-clamp-1">
             <MapPin className="w-3.5 h-3.5" />
             {hotel.address}
          </p>
        </div>
        <div className="absolute top-4 right-4">
          <span className={`badge ${isActive ? 'bg-emerald-500/20 text-emerald-100 border-none backdrop-blur-sm' : 'bg-amber-500/20 text-amber-100 border-none backdrop-blur-sm'}`}>
            {isActive ? 'Active' : 'Setup Pending'}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Rooms</span>
            <span className="text-xl font-bold text-text-primary">{hotel.totalRooms}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Staff</span>
            <span className="text-xl font-bold text-text-primary">{hotel.activeStaff}</span>
          </div>
        </div>
        
        <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-border-light">
          <Link href={`/hotels/${hotel.id}`} className="btn-secondary w-full justify-center text-sm">
             <Settings className="w-4 h-4" />
             Manage
          </Link>
          <Link href={`/hotels/${hotel.id}/rooms`} className={`btn-primary w-full justify-center text-sm ${!isActive ? 'opacity-50 pointer-events-none' : ''}`}>
             Dashboard
             <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}
