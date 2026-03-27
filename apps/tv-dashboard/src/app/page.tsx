'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { mockDashboardData } from '@/data/mock-data'

export default function WelcomePage(): React.ReactElement {
  const [show, setShow] = useState(true)
  const { session, hotel, room } = mockDashboardData

  const initials = session.guestName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
    }, 8000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!show) {
      const redirectTimer = setTimeout(() => {
        window.location.href = '/dashboard'
      }, 1000)
      return () => clearTimeout(redirectTimer)
    }
  }, [show])

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* 
        Background is now handled globally, just add a subtle vignette here 
        to ensure the text is perfectly readable
      */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/10 to-transparent z-0" />

      {/* Floating particles - deterministic positions */}
      <div className="absolute inset-0 overflow-hidden opacity-50">
        {[5, 12, 23, 37, 45, 58, 67, 72, 83, 91, 8, 18, 33, 48, 62, 76, 85, 94, 15, 55].map((pos, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/20"
            style={{
              left: `${pos}%`,
              top: `${[20, 35, 55, 75, 10, 45, 65, 85, 30, 50, 15, 60, 80, 25, 70, 40, 90, 5, 42, 68][i]}%`,
              animation: `fadeIn ${2 + (i % 3)}s ease-in-out infinite alternate`,
              animationDelay: `${(i * 0.25) % 5}s`,
            }}
          />
        ))}
      </div>

      {/* Top Right: Room Number */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute top-10 right-12 text-right"
          >
            <p className="text-xl text-white/90">Room</p>
            <h2 className="text-4xl font-bold mt-1 shadow-black/50 drop-shadow-lg">{room.number}</h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Welcome Card */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ delay: 0.2, duration: 1.5, type: 'spring', damping: 25 }}
            className="absolute inset-0 flex items-center justify-center p-8"
          >
            <div className="relative glass-card w-full max-w-3xl px-12 pb-12 pt-16 rounded-3xl border border-white/20 shadow-2xl bg-white/10 backdrop-blur-md">
              
              {/* Overlapping Avatar */}
              <div className="absolute -top-12 left-12">
                {session.guestPhotoUrl ? (
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200"
                    alt={session.guestName}
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-white/20 shadow-xl"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center ring-4 ring-white/20 shadow-xl">
                    <span className="text-3xl font-bold text-white">{initials}</span>
                  </div>
                )}
              </div>

              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.8 }}
                className="mt-2"
              >
                <h2 className="text-3xl font-normal text-white mb-3">
                  Welcome in {hotel.name}, Bali!
                </h2>
                <h1 className="text-3xl font-bold text-white tracking-wide">
                  Mr. {session.guestName}
                </h1>
                
                <div className="w-full h-px bg-white/30 my-8" />
                
                <p className="text-xl text-white/90 font-light leading-relaxed max-w-2xl">
                  We hope you enjoy your Trip! We always ready whenever you want,
                  let us know what you needed.
                </p>
                <p className="text-xl text-white/90 font-light mt-6">
                  Your comfort is our priority!
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
