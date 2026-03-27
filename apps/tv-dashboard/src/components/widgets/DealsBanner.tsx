'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react'
import type { Deal } from '@neotiv/types'

type DealsBannerProps = {
  deals: Deal[]
  onViewDeal?: (deal: Deal) => void
}

export default function DealsBanner({ deals, onViewDeal }: DealsBannerProps): React.ReactElement {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (deals.length <= 1) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % deals.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [deals.length])

  if (deals.length === 0) {
    return (
      <div className="glass-card h-full flex items-center justify-center">
        <div className="text-center text-white/30">
          <Tag className="w-6 h-6 mx-auto mb-2" />
          <p className="text-xs">No deals available</p>
        </div>
      </div>
    )
  }

  const deal = deals[current]

  return (
    <div
      className="glass-card-hover h-full flex flex-col"
      tabIndex={0}
      onClick={() => onViewDeal?.(deal)}
      onKeyDown={(e) => e.key === 'Enter' && onViewDeal?.(deal)}
      role="button"
      aria-label={`View deal: ${deal.title}`}
    >
      <span className="widget-title">Hot Deals</span>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 rounded-xl bg-gradient-to-br from-primary/30 to-primary-light/10 p-3 flex flex-col justify-end relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-2 right-2 p-1.5 rounded-full bg-notification-red/90">
            <Tag className="w-3 h-3 text-white" />
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary-light/20 to-transparent rounded-bl-full" />
          
          <h3 className="text-sm font-bold text-white leading-tight">{deal.title}</h3>
          <p className="text-xs text-white/50 mt-1 line-clamp-2">{deal.description}</p>
        </div>

        {/* Pagination dots */}
        {deals.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {deals.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === current ? 'bg-primary-light w-4' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
