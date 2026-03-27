'use client'

import { useEffect, useState } from 'react'
import { init } from '@noriginmedia/norigin-spatial-navigation'

// Initialize spatial navigation only once on the client side
let initialized = false

export function SpatialNavigationProvider({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement | null {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (!initialized) {
      init({
        debug: false,
        visualDebug: false,
        distanceCalculationMethod: 'center',
      })
      initialized = true
    }
  }, [])

  // To prevent hydration mismatch, you could optionally return null until client loaded.
  // But for SEO/SSR, we usually just return children and let init happen in useEffect.
  // Since this is a TV dashboard, SEO isn't critical, but preventing flashes is.
  return <>{children}</>
}
