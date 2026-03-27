'use client'

import { X, UtensilsCrossed, Car, Sparkles, Shirt, Phone, HelpCircle, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { HotelService } from '@neotiv/types'

type ServicesModalProps = {
  isOpen: boolean
  onClose: () => void
  services: HotelService[]
}

const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; label: string; gradient: string }> = {
  food: { icon: <UtensilsCrossed className="w-7 h-7" />, label: 'Food & Dining', gradient: 'from-orange-500/20 to-orange-600/5' },
  transport: { icon: <Car className="w-7 h-7" />, label: 'Transportation', gradient: 'from-blue-500/20 to-blue-600/5' },
  spa: { icon: <Sparkles className="w-7 h-7" />, label: 'Spa & Wellness', gradient: 'from-purple-500/20 to-purple-600/5' },
  laundry: { icon: <Shirt className="w-7 h-7" />, label: 'Laundry', gradient: 'from-cyan-500/20 to-cyan-600/5' },
  other: { icon: <Phone className="w-7 h-7" />, label: 'Other Services', gradient: 'from-gray-500/20 to-gray-600/5' },
}

export default function ServicesModal({ isOpen, onClose, services }: ServicesModalProps): React.ReactElement {
  const grouped = services.reduce<Record<string, HotelService[]>>((acc, svc) => {
    if (!acc[svc.category]) acc[svc.category] = []
    acc[svc.category].push(svc)
    return acc
  }, {})

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass-card w-[700px] max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Hotel Services</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(grouped).map(([category, svcs]) => {
                const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.other
                return (
                  <div
                    key={category}
                    className={`p-4 rounded-xl bg-gradient-to-br ${config.gradient} border border-white/5`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-white/80">{config.icon}</div>
                      <h3 className="text-lg font-semibold text-white">{config.label}</h3>
                    </div>
                    <div className="space-y-2">
                      {svcs.map((svc) => (
                        <button
                          key={svc.id}
                          className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-primary"
                          tabIndex={0}
                        >
                          <div>
                            <p className="text-sm font-medium text-white">{svc.name}</p>
                            {svc.description && (
                              <p className="text-xs text-white/40 mt-0.5">{svc.description}</p>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-white/30 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
