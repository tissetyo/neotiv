'use client'

import { useEffect, useRef, useState } from 'react'
import { TIMEZONE_CONFIG } from '@/data/mock-data'

function getTimeInTimezone(timezone: string): Date {
  const now = new Date()
  const str = now.toLocaleString('en-US', { timeZone: timezone })
  return new Date(str)
}

function ClockFace({ timezone, label }: { timezone: string; label: string }): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [time, setTime] = useState<Date | null>(null)

  useEffect(() => {
    setTime(getTimeInTimezone(timezone))
    let raf: number
    const tick = (): void => {
      setTime(getTimeInTimezone(timezone))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [timezone])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !time) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = canvas.width
    const center = size / 2
    const radius = center * 0.85

    ctx.clearRect(0, 0, size, size)

    // Clock face background
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius)
    gradient.addColorStop(0, 'rgba(20, 30, 40, 0.9)')
    gradient.addColorStop(1, 'rgba(10, 15, 20, 0.95)')
    ctx.beginPath()
    ctx.arc(center, center, radius, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()

    // Clock border with glow
    ctx.beginPath()
    ctx.arc(center, center, radius, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(20, 189, 172, 0.4)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Hour markers
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6 - Math.PI / 2
      const isMain = i % 3 === 0
      const outerR = radius * 0.9
      const innerR = isMain ? radius * 0.72 : radius * 0.8

      ctx.beginPath()
      ctx.moveTo(center + outerR * Math.cos(angle), center + outerR * Math.sin(angle))
      ctx.lineTo(center + innerR * Math.cos(angle), center + innerR * Math.sin(angle))
      ctx.strokeStyle = isMain ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)'
      ctx.lineWidth = isMain ? 2.5 : 1
      ctx.stroke()
    }

    // Minute dots
    for (let i = 0; i < 60; i++) {
      if (i % 5 === 0) continue
      const angle = (i * Math.PI) / 30 - Math.PI / 2
      const dotR = radius * 0.88
      ctx.beginPath()
      ctx.arc(center + dotR * Math.cos(angle), center + dotR * Math.sin(angle), 0.8, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.15)'
      ctx.fill()
    }

    const hours = time.getHours()
    const minutes = time.getMinutes()
    const seconds = time.getSeconds()

    // Hour hand
    const hourAngle = ((hours % 12) + minutes / 60) * (Math.PI / 6) - Math.PI / 2
    ctx.beginPath()
    ctx.moveTo(center, center)
    ctx.lineTo(center + radius * 0.5 * Math.cos(hourAngle), center + radius * 0.5 * Math.sin(hourAngle))
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.stroke()

    // Minute hand
    const minAngle = (minutes + seconds / 60) * (Math.PI / 30) - Math.PI / 2
    ctx.beginPath()
    ctx.moveTo(center, center)
    ctx.lineTo(center + radius * 0.7 * Math.cos(minAngle), center + radius * 0.7 * Math.sin(minAngle))
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.stroke()

    // Second hand
    const secAngle = seconds * (Math.PI / 30) - Math.PI / 2
    ctx.beginPath()
    ctx.moveTo(center - radius * 0.15 * Math.cos(secAngle), center - radius * 0.15 * Math.sin(secAngle))
    ctx.lineTo(center + radius * 0.75 * Math.cos(secAngle), center + radius * 0.75 * Math.sin(secAngle))
    ctx.strokeStyle = '#14BDAC'
    ctx.lineWidth = 1.2
    ctx.lineCap = 'round'
    ctx.stroke()

    // Center dot
    ctx.beginPath()
    ctx.arc(center, center, 4, 0, Math.PI * 2)
    ctx.fillStyle = '#14BDAC'
    ctx.fill()
    ctx.beginPath()
    ctx.arc(center, center, 2, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
  }, [time])

  return (
    <div className="flex flex-col items-center gap-1">
      <canvas
        ref={canvasRef}
        width={120}
        height={120}
        className="rounded-full"
      />
      <span className="text-[10px] font-medium uppercase tracking-wider text-white/50">
        {label}
      </span>
    </div>
  )
}

export default function AnalogClocks(): React.ReactElement {
  return (
    <div className="glass-card">
      <span className="widget-title">World Clock</span>
      <div className="flex items-center justify-center gap-4">
        {TIMEZONE_CONFIG.map((tz) => (
          <ClockFace key={tz.key} timezone={tz.timezone} label={tz.label} />
        ))}
      </div>
    </div>
  )
}
