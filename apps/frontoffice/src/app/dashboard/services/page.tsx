import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Settings2, Utensils, Sprout, Car, Shirt, Sparkles, AlertCircle } from 'lucide-react'
import type { HotelService } from '@neotiv/types'
import ServiceToggle from '@/components/ServiceToggle'

const iconMap: Record<string, any> = {
  food: Utensils,
  spa: Sprout,
  transport: Car,
  laundry: Shirt,
  other: Sparkles
}

export default async function ServicesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('users')
    .select('hotel_id')
    .eq('auth_id', user.id)
    .single()

  if (!profile?.hotel_id) {
    return <div className="p-8 text-center">No hotel assigned.</div>
  }

  // Fetch services
  const { data: rawServices } = await supabase
    .from('hotel_services')
    .select('*')
    .eq('hotel_id', profile.hotel_id)
    .order('category')

  const services = (rawServices || []).map((s: any) => ({
    id: s.id,
    hotelId: s.hotel_id,
    category: s.category as any,
    name: s.name,
    description: s.description,
    iconUrl: s.icon_url,
    isAvailable: s.is_available ?? true,
    createdAt: s.created_at,
    updatedAt: s.created_at
  })) as (HotelService & { isAvailable: boolean })[]

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Hotel Services</h1>
          <p className="page-subtitle">Manage availability and details of guest services</p>
        </div>
      </header>

      <div className="page-body">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length === 0 ? (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-text-muted bg-white rounded-2xl border border-dashed border-gray-200">
               <Settings2 className="w-12 h-12 mb-4 opacity-20" />
               <p>No services configured for this hotel.</p>
               <p className="text-sm">Add them in the Management panel.</p>
            </div>
          ) : (
            services.map((service) => {
              const Icon = iconMap[service.category] || iconMap.other
              return (
                <div key={service.id} className="card p-6 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <ServiceToggle id={service.id} initialAvailable={service.isAvailable} />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-1">{service.name}</h3>
                  <p className="text-sm text-text-secondary flex-1 mb-6">
                    {service.description || 'No description provided.'}
                  </p>
                  <div className="pt-4 border-t border-border-light flex justify-between items-center text-xs text-text-muted">
                    <span className="capitalize">{service.category}</span>
                    <button className="text-primary font-semibold hover:underline">Edit Details</button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-primary-50 border border-primary-100 rounded-xl flex gap-3 text-primary text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-semibold">Staff Note</p>
            <p className="opacity-80">Toggling a service off will immediately hide it from all in-room TVs. Use this for temporary closures (e.g. Pool Maintenance).</p>
          </div>
        </div>
      </div>
    </>
  )
}

