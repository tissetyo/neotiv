import { Navbar } from '@/components/Navbar'
import { mockHotels, mockStaff } from '@/data/mock-data'
import { LayoutDashboard, Users, DoorOpen, Settings as SettingsIcon, Plus, Mail } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'

export default function StaffManagementPage({ params }: { params: { hotelId: string } }) {
  const hotel = mockHotels.find(h => h.id === params.hotelId)
  if (!hotel) return notFound()

  // Filter staff associated with this hotel
  const hotelStaff = mockStaff.filter(s => s.hotelId === hotel.id || s.role === 'super_admin')

  return (
    <>
      <Navbar />
      
      {/* Mini Header */}
      <div className="bg-white border-b border-border-light pt-20 pb-4">
        <div className="admin-container">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0">
               <img src={hotel.logoUrl} alt="" className="w-full h-full object-cover rounded" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">{hotel.name}</h1>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1">
            <Link href={`/hotels/${hotel.id}`} className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" /> Overview
            </Link>
            <Link href={`/hotels/${hotel.id}/rooms`} className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
              <DoorOpen className="w-4 h-4" /> Rooms & Types
            </Link>
            <Link href={`/hotels/${hotel.id}/staff`} className="px-4 py-2 text-sm font-bold bg-accent/10 text-accent rounded-lg flex items-center gap-2">
              <Users className="w-4 h-4" /> Staff Access
            </Link>
            <Link href={`#`} className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2 ml-auto">
              <SettingsIcon className="w-4 h-4" /> Settings
            </Link>
          </div>
        </div>
      </div>

      <main className="admin-container py-8">
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title mb-1">Staff Roster</h2>
            <p className="text-sm text-text-secondary">Manage access to the Front Office panel and Hotel Dashboard.</p>
          </div>
          <button className="btn-primary shadow-sm shadow-accent/20">
            <Plus className="w-4 h-4" /> Invite Staff
          </button>
        </div>
        
        <div className="card p-0 overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Joined</th>
                <th className="w-24 text-right">Access</th>
              </tr>
            </thead>
            <tbody>
              {hotelStaff.map(staff => {
                const isSuper = staff.role === 'super_admin'
                return (
                  <tr key={staff.id} className={isSuper ? 'bg-gray-50/50' : ''}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex flex-col items-center justify-center font-bold text-xs uppercase">
                          {staff.firstName[0]}{staff.lastName[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-text-primary">
                            {staff.firstName} {staff.lastName}
                            {isSuper && <span className="ml-2 badge bg-primary text-white border-transparent text-[10px] py-0">Global</span>}
                          </div>
                          <div className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" /> {staff.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        staff.role === 'hotel_manager' ? 'badge-active' :
                        isSuper ? 'bg-primary-100 text-primary border-primary-200' :
                        'badge-inactive'
                      }`}>
                        {staff.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                    <td>{format(new Date(staff.createdAt), 'MMM d, yyyy')}</td>
                    <td className="text-right">
                      {isSuper ? (
                        <span className="text-xs text-text-muted italic">Inherited</span>
                      ) : (
                        <button className="text-xs font-semibold text-danger hover:underline">Revoke</button>
                      )}
                    </td>
                  </tr>
                )
              })}
              {hotelStaff.length === 0 && (
                <tr><td colSpan={4} className="text-center py-6 text-text-muted">No staff assigned to this property.</td></tr>
              )}
            </tbody>
          </table>
        </div>

      </main>
    </>
  )
}
