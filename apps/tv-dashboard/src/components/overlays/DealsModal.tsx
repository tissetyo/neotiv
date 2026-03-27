'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Tag, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Deal } from '@neotiv/types'
import { format } from 'date-fns'

type DealsModalProps = {
  isOpen: boolean
  onClose: () => void
  deals: Deal[]
  initialDeal?: Deal
}

export default function DealsModal({ isOpen, onClose, deals, initialDeal }: DealsModalProps): React.ReactElement {
  const [currentIndex, setCurrentIndex] = useState(
    initialDeal ? deals.findIndex((d) => d.id === initialDeal.id) : 0,
  )

  const deal = deals[currentIndex]
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < deals.length - 1

  return (
    <AnimatePresence>
      {isOpen && deal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass-card w-[600px] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Poster placeholder */}
            <div className="h-48 rounded-xl bg-gradient-to-br from-primary/30 via-primary-light/10 to-primary/20 flex items-center justify-center mb-4 relative overflow-hidden">
              <div className="absolute top-3 right-3 p-1.5 rounded-full bg-notification-red/90 flex items-center gap-1 px-3">
                <Tag className="w-3 h-3 text-white" />
                <span className="text-xs font-bold text-white">DEAL</span>
              </div>
              <div className="text-center">
                <Tag className="w-12 h-12 text-primary-light/50 mx-auto mb-2" />
                <p className="text-sm text-white/40">Promotional Poster</p>
              </div>
            </div>

            {/* Content */}
            <h2 className="text-2xl font-bold text-white mb-2">{deal.title}</h2>
            <p className="text-sm text-white/60 leading-relaxed mb-4">{deal.description}</p>

            {deal.validUntil && (
              <div className="flex items-center gap-2 text-xs text-white/40 mb-4">
                <Calendar className="w-3.5 h-3.5" />
                <span>Valid until {format(new Date(deal.validUntil), 'MMMM d, yyyy')}</span>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => hasPrev && setCurrentIndex((i) => i - 1)}
                disabled={!hasPrev}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">Previous</span>
              </button>

              <span className="text-xs text-white/30">
                {currentIndex + 1} of {deals.length}
              </span>

              <button
                onClick={() => hasNext && setCurrentIndex((i) => i + 1)}
                disabled={!hasNext}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <span className="text-sm">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
