import { mockDeals } from '@/data/mock-data'
import { Megaphone, Plus, Trash2, Edit2, Calendar } from 'lucide-react'
import { format } from 'date-fns'

export default function DealsPage() {
  return (
    <>
      <header className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Deals Manager</h1>
          <p className="page-subtitle">Manage promotional offers shown on in-room TVs</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Add New Deal
        </button>
      </header>

      <div className="page-body">
        {mockDeals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon bg-orange-50 text-warning">
              <Megaphone className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">No Active Deals</h2>
            <p className="text-text-secondary max-w-sm mx-auto mb-6">
              Create your first promotional offer to display on the TV dashboard carousel.
            </p>
            <button className="btn-primary"><Plus className="w-4 h-4" /> Create Deal</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockDeals.map((deal) => {
              const isValid = deal.validUntil ? new Date(deal.validUntil) > new Date() : true

              return (
                <div key={deal.id} className="card p-0 overflow-hidden flex flex-col hover:border-primary-light transition-colors group">
                  <div className="relative aspect-video">
                    <img 
                      src={deal.posterUrl} 
                      alt={deal.title} 
                      className="w-full h-full object-cover"
                    />
                    {!isValid && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                        <span className="bg-white text-black px-3 py-1 text-sm font-bold uppercase tracking-wider rounded">Expired</span>
                      </div>
                    )}
                    
                    {/* Hover actions overlay */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 rounded-lg bg-white/90 text-text-primary hover:text-primary hover:bg-white flex items-center justify-center shadow-sm backdrop-blur">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-white/90 text-notification-red hover:bg-white flex items-center justify-center shadow-sm backdrop-blur">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-text-primary mb-2 leading-tight">
                      {deal.title}
                    </h3>
                    <p className="text-sm text-text-secondary line-clamp-3 mb-4 flex-1">
                      {deal.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border-light text-sm">
                      <span className={`badge ${isValid ? 'bg-emerald-50 text-success' : 'bg-gray-100 text-gray-500'}`}>
                        {isValid ? 'Active' : 'Expired'}
                      </span>
                      
                      {deal.validUntil && (
                        <div className="flex items-center gap-1.5 text-text-muted font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          Until {format(new Date(deal.validUntil), 'MMM d, yyyy')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
