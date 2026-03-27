import { Navbar } from '@/components/Navbar'
import { HotelCard } from '@/components/HotelCard'
import { mockHotels } from '@/data/mock-data'
import { Plus, Search, Filter } from 'lucide-react'
import Link from 'next/link'

export default function HotelsPage() {
  return (
    <>
      <Navbar />
      
      <main className="admin-container pt-24 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="page-title">Properties overview</h1>
            <p className="page-subtitle">Manage all hotels, resorts, and properties within your organization.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search properties..." 
                className="input pl-9 w-[250px]"
              />
            </div>
            <button className="btn-secondary">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <Link href="/hotels/new" className="btn-primary">
              <Plus className="w-4 h-4" />
              New Property
            </Link>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card py-4">
             <p className="text-sm font-semibold text-text-secondary mb-1">Total Properties</p>
             <p className="text-3xl font-bold text-text-primary">{mockHotels.length}</p>
          </div>
          <div className="card py-4">
             <p className="text-sm font-semibold text-text-secondary mb-1">Active Rooms</p>
             <p className="text-3xl font-bold text-text-primary">
               {mockHotels.reduce((acc, h) => acc + h.totalRooms, 0)}
             </p>
          </div>
          <div className="card py-4">
             <p className="text-sm font-semibold text-text-secondary mb-1">Total Staff</p>
             <p className="text-3xl font-bold text-text-primary">
               {mockHotels.reduce((acc, h) => acc + h.activeStaff, 0)}
             </p>
          </div>
          <div className="card py-4 bg-accent/5 border-accent/20">
             <p className="text-sm font-semibold text-accent mb-1">Organization Status</p>
             <p className="text-lg font-bold text-text-primary flex items-center gap-2 mt-2">
                <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
                Operational
             </p>
          </div>
        </div>

        {/* Property Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
          {mockHotels.map(hotel => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </main>
    </>
  )
}
