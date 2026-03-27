'use client'

import { useFocusable } from '@noriginmedia/norigin-spatial-navigation'

type FocusableTileProps = {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  focusKey?: string
}

export default function FocusableTile({ children, onClick, className = '', focusKey }: FocusableTileProps): React.ReactElement {
  const { ref, focused } = useFocusable({ 
    onEnterPress: onClick,
    focusKey 
  })

  return (
    <div
      ref={ref}
      onClick={onClick}
      tabIndex={0}
      className={`focus-tv outline-none cursor-pointer transition-transform duration-300 ${focused ? 'ring-4 ring-white scale-105 z-50 shadow-2xl shadow-black/50' : ''} ${className}`}
      data-sn-focused={focused}
    >
      {children}
    </div>
  )
}
