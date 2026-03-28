import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Plus, Utensils, Sprout, Car, Shirt, Sparkles, Trash2, Edit3, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const iconMap: Record<string, any> = {
  food: Utensils,
  spa: Sprout,
  transport: Car,
  laundry: Shirt,
  other: Sparkles
}

export default async function HotelServicesPage({ params }: { params: { hotelId: string } }) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user
  
  if (!user) {
    redirect('/login')
  }

  // Fetch hotel details
  const { data: hotel } = await supabase
    .from('hotels')
    .select('name')
    .eq('id', params.hotelId)
    .single()

  if (!hotel) notFound()

  // Fetch services
  const { data: services } = await supabase
    .from('hotel_services')
    .select('*')
    .eq('hotel_id', params.hotelId)
    .order('category')

  return (
    <main className="admin-container py-8">
      <div className="mb-8 flex items-center gap-2 text-sm text-text-muted">
        <Link href="/hotels" className="hover:text-primary transition-colors">Properties</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href={`/hotels/${params.hotelId}`} className="hover:text-primary transition-colors">{hotel.name}</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-text-primary font-medium">Services</span>
      </div>

      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Hotel Services</h1>
          <p className="text-text-secondary">Configure available services for guests at {hotel.name}.</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {services && services.length > 0 ? (
          services.map((service) => {
            const Icon = iconMap[service.category as string] || iconMap.other
            return (
              <div key={service.id} className="card p-5 flex items-center justify-between hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary text-lg">{service.name}</h3>
                    <p className="text-sm text-text-secondary capitalize">{service.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                   <div className="hidden md:block max-w-sm">
                      <p className="text-sm text-text-muted truncate">{service.description}</p>
                   </div>
                   <div className="flex items-center gap-2 border-l border-border-light pl-6">
                      <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-text-secondary hover:text-danger hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-text-muted bg-white rounded-2xl border border-dashed border-gray-200">
             <Sparkles className="w-12 h-12 mb-4 opacity-20" />
             <p className="font-medium text-lg">No services yet</p>
             <p className="text-sm mb-6 text-center max-w-xs">Define what services guests can see and use on their room TV.</p>
             <button className="btn-secondary">Add your first service</button>
          </div>
        )}
      </div>
    </main>
  )
}
