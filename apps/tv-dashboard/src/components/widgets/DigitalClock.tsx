'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudDrizzle } from 'lucide-react'

function WeatherIcon({ condition }: { condition: string }): React.ReactElement {
  const iconClass = 'w-7 h-7 text-yellow-300'
  switch (condition) {
    case 'sunny': return <Sun className={iconClass} />
    case 'rain': return <CloudRain className="w-7 h-7 text-blue-300" />
    case 'snow': return <CloudSnow className="w-7 h-7 text-blue-200" />
    case 'storm': return <CloudLightning className="w-7 h-7 text-yellow-400" />
    case 'drizzle': return <CloudDrizzle className="w-7 h-7 text-blue-300" />
    default: return <Cloud className="w-7 h-7 text-gray-300" />
  }
}

export default function DigitalClock(): React.ReactElement {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const hours = now ? format(now, 'HH') : '--'
  const minutes = now ? format(now, 'mm') : '--'
  const seconds = now ? format(now, 'ss') : '--'
  const dateStr = now ? format(now, 'EEEE, MMMM d, yyyy') : ''

  return (
    <div className="glass-card">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-6xl font-bold font-mono tracking-tight text-white">
              {hours}
            </span>
            <span className="text-6xl font-bold font-mono text-primary-light animate-pulse">
              :
            </span>
            <span className="text-6xl font-bold font-mono tracking-tight text-white">
              {minutes}
            </span>
            <span className="text-2xl font-mono text-white/40 ml-1">
              {seconds}
            </span>
          </div>
          <p className="text-sm text-white/50 mt-1 tracking-wide">{dateStr}</p>
        </div>
        <div className="flex flex-col items-center gap-1 ml-4">
          <WeatherIcon condition="sunny" />
          <span className="text-lg font-semibold text-white">28°C</span>
          <span className="text-[10px] text-white/40 uppercase tracking-wider">Sunny</span>
        </div>
      </div>
    </div>
  )
}
