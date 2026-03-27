'use client'

import { MapPin } from 'lucide-react'

type MapPreviewProps = {
  hotelAddress: string
}

export default function MapPreview({ hotelAddress }: MapPreviewProps): React.ReactElement {
  return (
    <div className="glass-card-hover h-full flex flex-col" tabIndex={0} role="button" aria-label="Open map">
      <span className="widget-title">Location</span>
      <div className="flex-1 rounded-xl overflow-hidden relative bg-gradient-to-br from-primary/20 to-primary-light/10 min-h-[100px]">
        {/* Static map preview — replace with Google Maps embed when API key is available */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="p-3 rounded-full bg-primary/30 mb-2">
            <MapPin className="w-6 h-6 text-primary-light" />
          </div>
          <p className="text-xs text-white/60 text-center px-3 leading-relaxed">
            {hotelAddress}
          </p>
        </div>
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
      </div>
    </div>
  )
}
