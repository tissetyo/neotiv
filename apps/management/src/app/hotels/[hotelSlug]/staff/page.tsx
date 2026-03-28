import { createClient } from '@/lib/supabase/server'
import { LayoutDashboard, Users, DoorOpen, Settings as SettingsIcon, Plus, Mail, Settings } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { format } from 'date-fns'

export default async function StaffManagementPage({ params }: { params: { hotelSlug: string } }) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user
  
  if (!user) {
    redirect('/login')
  }

  // Fetch hotel details
  const { data: hotel } = await supabase
    .from('hotels')
    .select('*')
    .eq('slug', params.hotelSlug)
    .single()

  if (!hotel) return notFound()

  // Fetch staff associated with this hotel
  const { data: hotelStaff } = await supabase
    .from('users')
    .select('*')
    .or(`hotel_id.eq.${hotel.id},role.eq.super_admin`)
    .order('created_at', { ascending: false })

  return (
    <>
      <div className="bg-white border-b border-border-light pt-4 pb-4">
        <div className="admin-container">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
               {hotel.logo_url ? (
                 <img src={hotel.logo_url} alt="" className="w-full h-full object-cover" />
               ) : (
                 <Building2 className="w-4 h-4 text-text-muted" />
               )}
            </div>
            <h1 className="text-xl font-bold text-text-primary">{hotel.name}</h1>
          </div>
          
          <div className="flex items-center gap-1">
            <Link href={`/hotels/${hotel.slug}`} className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" /> Overview
            </Link>
            <Link href={`/hotels/${hotel.slug}/rooms`} className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
              <DoorOpen className="w-4 h-4" /> Rooms
            </Link>
            <Link href={`/hotels/${hotel.slug}/services`} className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
              <Settings className="w-4 h-4" /> Services
            </Link>
            <Link href={`/hotels/${hotel.slug}/staff`} className="px-4 py-2 text-sm font-bold bg-accent/10 text-accent rounded-lg flex items-center gap-2">
              <Users className="w-4 h-4" /> Staff Access
            </Link>
          </div>
        </div>
      </div>

      <main className="admin-container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title mb-1">Staff Roster</h2>
            <p className="text-sm text-text-secondary">Manage access to the Front Office panel for this property.</p>
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
              {hotelStaff?.map(staff => {
                const isSuper = staff.role === 'super_admin'
                return (
                  <tr key={staff.id} className={isSuper ? 'bg-gray-50/50' : ''}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex flex-col items-center justify-center font-bold text-xs uppercase">
                          {staff.email[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-text-primary">
                            {staff.email.split('@')[0]}
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
                        {staff.role.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </span>
                    </td>
                    <td>{format(new Date(staff.created_at), 'MMM d, yyyy')}</td>
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
              {(!hotelStaff || hotelStaff.length === 0) && (
                <tr><td colSpan={4} className="text-center py-12 text-text-muted">No staff assigned to this property.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  )
}

import { Building2 } from 'lucide-react'

