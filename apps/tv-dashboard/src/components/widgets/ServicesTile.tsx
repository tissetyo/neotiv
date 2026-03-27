'use client'

import { UtensilsCrossed, Car, Sparkles, Shirt, Phone, HelpCircle } from 'lucide-react'
import type { HotelService } from '@neotiv/types'

type ServicesTileProps = {
  services: HotelService[]
  onOpenServices?: () => void
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  food: <UtensilsCrossed className="w-5 h-5" />,
  transport: <Car className="w-5 h-5" />,
  spa: <Sparkles className="w-5 h-5" />,
  laundry: <Shirt className="w-5 h-5" />,
  other: <Phone className="w-5 h-5" />,
}

const CATEGORY_COLORS: Record<string, string> = {
  food: 'from-orange-500/30 to-orange-600/10',
  transport: 'from-blue-500/30 to-blue-600/10',
  spa: 'from-purple-500/30 to-purple-600/10',
  laundry: 'from-cyan-500/30 to-cyan-600/10',
  other: 'from-gray-500/30 to-gray-600/10',
}

export default function ServicesTile({ services, onOpenServices }: ServicesTileProps): React.ReactElement {
  const categories = [...new Set(services.map((s) => s.category))]

  return (
    <div
      className="glass-card-hover h-full flex flex-col"
      tabIndex={0}
      onClick={onOpenServices}
      onKeyDown={(e) => e.key === 'Enter' && onOpenServices?.()}
      role="button"
      aria-label="Open hotel services"
    >
      <span className="widget-title">Services</span>
      <div className="flex-1 grid grid-cols-2 gap-2">
        {categories.slice(0, 4).map((cat) => (
          <div
            key={cat}
            className={`flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-br ${CATEGORY_COLORS[cat] || CATEGORY_COLORS.other}`}
          >
            <div className="text-white/80">
              {CATEGORY_ICONS[cat] || <HelpCircle className="w-5 h-5" />}
            </div>
            <span className="text-[10px] text-white/60 mt-1 capitalize">{cat}</span>
          </div>
        ))}
      </div>
      {services.length > 4 && (
        <p className="text-[10px] text-white/30 text-center mt-2">
          +{services.length - 4} more services
        </p>
      )}
    </div>
  )
}
